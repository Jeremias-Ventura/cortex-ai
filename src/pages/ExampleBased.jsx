import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../layouts/ChatLayout";
import { getApiUrl } from "../config/api";

const ExampleBased = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("example");
  const [sessionId, setSessionId] = useState(null);

  // Tab configuration for this specific chat mode
  const tabs = [
    { label: "Normal", value: "example", available: true },
    { label: "Math", value: "math", available: false },
    { label: "Science", value: "science", available: false },
  ];

  // Fallback response generator (used when streaming fails)
  const generateResponse = async (
    message,
    { images = [], mode: responseMode = "example" } = {}
  ) => {
    try {
      if (images.length > 0) {
        // Handle image messages
        const res = await fetch(getApiUrl("/chat/complete"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message, 
            images, 
            mode: responseMode 
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data.response || "Sorry, no response from AI.";
      } else {
        // Handle text-only messages
        const res = await fetch(getApiUrl("/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message, 
            mode: responseMode 
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data.response || "Sorry, no response from AI.";
      }
    } catch (err) {
      console.error("Error in generateResponse:", err);
      return "Something went wrong. Please try again.";
    }
  };

  // Handle session creation
  const handleSessionCreated = (newSessionId) => {
    setSessionId(newSessionId);
  };

  // Handle mode changes (including navigation to other chat modes)
  const handleModeChange = (newMode) => {
    // Special case: navigate to deep learning mode
    if (newMode === "deep") {
      navigate("/learn/deep");
      return;
    }

    // Handle other mode switches within this component
    if (newMode === "math" || newMode === "science") {
      // These aren't available yet, but you could:
      // - Show a "coming soon" toast
      // - Navigate to different routes when ready
      console.log(`${newMode} mode coming soon!`);
      return;
    }

    // Update local mode state
    setMode(newMode);
  };

  return (
    <ChatLayout
      mode={mode}
      onModeChange={handleModeChange}
      generateResponse={generateResponse}
      placeholder="Ask AI any topics or problems to learn step-by-step..."
      sessionId={sessionId}
      onSessionCreated={handleSessionCreated}
      tabs={tabs}
    />
  );
};

export default ExampleBased;