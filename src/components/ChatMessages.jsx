import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

// Individual message component - memoized for performance
const MessageComponent = memo(({ msg, index }) => {
  const markdownComponents = {
    h1: (props) => (
      <h1
        className="text-2xl font-bold mt-6 mb-4 overflow-hidden"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-xl font-bold mt-5 mb-3 overflow-hidden"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-lg font-medium mt-4 mb-2 overflow-hidden"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="text-base font-thin leading-relaxed mb-3 overflow-hidden"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="list-disc list-inside mb-3 overflow-hidden"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal list-inside mb-3 overflow-hidden"
        {...props}
      />
    ),
    li: (props) => <li className="mb-1" {...props} />,
    code: ({ inline, children, className, ...props }) => {
      return inline ? (
        <code className="bg-gray-800 text-purple-300 px-1 py-0.5 rounded text-sm font-mono overflow-hidden">
          {children}
        </code>
      ) : (
        <div className="relative group">
          <button
            onClick={() =>
              navigator.clipboard.writeText(children)
            }
            className="absolute top-2 right-2 text-xs text-white bg-zinc-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            Copy
          </button>
          <pre className="bg-[#0f1117] text-white p-4 rounded-lg text-sm font-mono mb-4 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    strong: (props) => (
      <strong className="font-semibold" {...props} />
    ),
    hr: (props) => (
      <hr className="border-gray-600 my-4" {...props} />
    ),
  };

  return (
    <div
      className={`${
        msg.role === "user"
          ? "self-end bg-purple1 text-white px-3 pt-2 rounded-2xl max-w-2xl text-base"
          : "self-start text-lg leading-relaxed"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkBreaks]}
        rehypePlugins={[
          [rehypeKatex, { displayMode: false }],
          rehypeHighlight,
        ]}
        components={markdownComponents}
      >
        {msg.text}
      </ReactMarkdown>
      
      {/* Show typing indicator for streaming messages */}
      {msg.streaming && (
        <div className="flex items-center gap-1 mt-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      )}
    </div>
  );
});

// Set display name for debugging
MessageComponent.displayName = 'MessageComponent';

// Main ChatMessages component
const ChatMessages = memo(({ messages, messagesContainerRef, bottomRef }) => {
  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col space-y-12 overflow-y-auto pr-1 grow scrollbar-none"
    >
      {messages.map((msg, idx) => (
        <MessageComponent 
          key={`msg-${idx}-${msg.text.slice(0, 50)}`} // Better key for stability
          msg={msg}
          index={idx}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
});

// Set display name for debugging
ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;