import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ModeSelector from "../components/ModeSelector";
import { getApiUrl } from "../config/api";

const ChatLayout = ({
  mode,
  onModeChange,
  generateResponse,
  placeholder,
  sessionId,
  onSessionCreated,
  tabs,
}) => {
  // State
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [localSessionId, setLocalSessionId] = useState(sessionId);
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Refs
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Sync sessionId prop changes
  useEffect(() => {
    if (sessionId) setLocalSessionId(sessionId);
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Load existing messages when session changes
  useEffect(() => {
    if (!sessionId) return;
    const loadMessages = async () => {
      try {
        const res = await fetch(getApiUrl(`/chat/${sessionId}`));
        const data = await res.json();
        const formatted = data.map((m) => ({ role: m.role, text: m.message }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, [sessionId]);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Helper function to convert files to data URLs
  const filesToDataUrls = async (files) => {
    const read = (f) =>
      new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(f);
      });
    return Promise.all(files.map(read));
  };

  // Main send handler with streaming logic
  const handleSend = async () => {
    // Validate input
    if (!input.trim() && attachments.length === 0) return;
    if (isStreaming) return; // Prevent sending while streaming

    let activeSessionId = localSessionId;

    // Step 1: Create session if none exists
    if (!activeSessionId) {
      try {
        const res = await fetch(getApiUrl("/chat/start"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode }),
        });
        const newSession = await res.json();
        activeSessionId = newSession.id;
        setLocalSessionId(activeSessionId);
        onSessionCreated?.(activeSessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
        return;
      }
    }

    // Add user message to UI immediately
    const userMsg = {
      role: "user",
      text: input || (attachments.length ? "(Sent image attachment)" : ""),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Store message data before clearing inputs
    const messageText = input;
    const messageAttachments = [...attachments];

    // Clear inputs for snappy UX
    setInput("");
    setAttachments([]);

    // Calculate AI message index after adding user message
    const aiMessageIndex = messages.length + 1; // +1 because we just added user message

    try {
      // Step 2: Save user message to database
      await fetch("http://localhost:3001/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSessionId,
          role: "user",
          message: messageText || "(image)",
          attachments: messageAttachments.map((f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
          })),
        }),
      });

      // Convert images to data URLs if needed
      const imageDataUrls = messageAttachments.length > 0 
        ? await filesToDataUrls(messageAttachments) 
        : [];

      // Step 3: Start streaming response
      setIsStreaming(true);
      
      // Add empty AI message for streaming
      setMessages((prev) => [...prev, { role: "ai", text: "", streaming: true }]);

      let fullResponse = "";

      if (imageDataUrls.length > 0) {
        // Handle image messages with POST streaming
                  const response = await fetch(getApiUrl("/chat/stream"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: activeSessionId,
            message: messageText || "",
            images: imageDataUrls,
            mode: mode,
          }),
        });

        if (!response.body) {
          throw new Error("No response body for streaming");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  
                  if (data.type === "chunk") {
                    fullResponse += data.content;
                    setMessages((prev) => 
                      prev.map((msg, idx) => 
                        idx === aiMessageIndex 
                          ? { ...msg, text: fullResponse }
                          : msg
                      )
                    );
                  } else if (data.type === "done") {
                    setMessages((prev) => 
                      prev.map((msg, idx) => 
                        idx === aiMessageIndex 
                          ? { ...msg, streaming: false }
                          : msg
                      )
                    );
                    setIsStreaming(false);
                    break;
                  }
                } catch (error) {
                  console.error("Error parsing streaming data:", error);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

      } else {
        // Handle text-only messages with EventSource
        const params = new URLSearchParams({
          session_id: activeSessionId,
          message: messageText || "",
          mode: mode,
        });

        const eventSource = new EventSource(
          getApiUrl(`/chat/stream?${params}`)
        );
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === "chunk") {
              fullResponse += data.content;
              setMessages((prev) => 
                prev.map((msg, idx) => 
                  idx === aiMessageIndex 
                    ? { ...msg, text: fullResponse }
                    : msg
                )
              );
            } else if (data.type === "done") {
              setMessages((prev) => 
                prev.map((msg, idx) => 
                  idx === aiMessageIndex 
                    ? { ...msg, streaming: false }
                    : msg
                )
              );
              setIsStreaming(false);
              eventSource.close();
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          setIsStreaming(false);
          eventSource.close();
          
          setMessages((prev) => 
            prev.map((msg, idx) => 
              idx === aiMessageIndex 
                ? { ...msg, text: fullResponse || "Error: Failed to generate response", streaming: false }
                : msg
            )
          );
        };
      }

              // Save AI response to database when complete
      setTimeout(async () => {
        if (fullResponse) {
          await fetch(getApiUrl("/chat/save"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: activeSessionId,
              role: "ai",
              message: fullResponse,
            }),
          });
        }
      }, 1000);

    } catch (error) {
      console.error("Error in handleSend:", error);
      setIsStreaming(false);
      
      // Fallback to non-streaming response
      try {
        const aiResponse = await generateResponse(messageText, { 
          images: messageAttachments.length > 0 ? await filesToDataUrls(messageAttachments) : [], 
          mode 
        });
        
        const resText = aiResponse instanceof Promise ? await aiResponse : aiResponse;
        
        setMessages((prev) => 
          prev.map((msg, idx) => 
            idx === aiMessageIndex 
              ? { ...msg, text: resText, streaming: false }
              : msg
          )
        );

        // Save fallback response
        await fetch(getApiUrl("/chat/save"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: activeSessionId,
            role: "ai",
            message: resText,
          }),
        });
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setMessages((prev) => 
          prev.map((msg, idx) => 
            idx === aiMessageIndex 
              ? { ...msg, text: "Sorry, something went wrong. Please try again.", streaming: false }
              : msg
          )
        );
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden text-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 pt-5 sticky top-0 bg-main z-10">
        <button className="bg-side p-3 rounded-lg hover:bg-zinc-800 transition">
          <MessageSquare size={14} />
        </button>
        
        <ModeSelector 
          mode={mode}
          tabs={tabs}
          onModeChange={onModeChange}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-col w-7/12 max-w-7xl mx-auto px-3 pb-1 flex-grow overflow-hidden">
        <ChatMessages 
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          bottomRef={bottomRef}
        />
        
        <ChatInput
          input={input}
          setInput={setInput}
          attachments={attachments}
          setAttachments={setAttachments}
          onSend={handleSend}
          placeholder={placeholder}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
};

export default ChatLayout;