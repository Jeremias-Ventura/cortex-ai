import { useRef, useEffect, memo } from "react";
import { RefreshCw } from "lucide-react";

// LOAD LOGOS AS COMPONENTS
import { ReactComponent as HallucinationIcon } from "../utils/hallucinationIcon.svg";
import { ReactComponent as WrongIcon } from "../utils/wrongIcon.svg";
import { ReactComponent as StepsIcon } from "../utils/stepsIcon.svg";
import { ReactComponent as AttachIcon } from "../utils/attachIcon.svg";
import { ReactComponent as SendIcon } from "../utils/sendIcon.svg";

// Tooltip component for the tool buttons
const ToolTooltip = memo(({ title, subtitle, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <div className="bg-zinc-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap border border-zinc-600">
        <div className="font-medium">{title}</div>
        <div className="text-zinc-400">{subtitle}</div>
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800"></div>
    </div>
  </div>
));

ToolTooltip.displayName = 'ToolTooltip';

// Attachment chip component
const AttachmentChip = memo(({ file, index, onRemove }) => (
  <div className="flex items-center gap-2 bg-zinc-700/60 px-2 py-1 rounded-lg text-sm">
    <span className="truncate max-w-[16rem]">{file.name}</span>
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="bg-zinc-500/70 hover:bg-zinc-500 px-2 rounded"
      title="Remove"
    >
      ✕
    </button>
  </div>
));

AttachmentChip.displayName = 'AttachmentChip';

const ChatInput = memo(({
  input,
  setInput,
  attachments,
  setAttachments,
  onSend,
  placeholder,
  isStreaming
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // File handling functions
  const handleAttachClick = () => fileInputRef.current?.click();

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const allowed = files.filter((f) =>
      /^(image\/(png|jpe?g|webp|gif))$/i.test(f.type)
    );
    setAttachments((prev) => [...prev, ...allowed]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = (input.trim() || attachments.length > 0) && !isStreaming;

  return (
    <div className="bg-side p-4 rounded-3xl shadow text-base sticky bottom-8 z-10">
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent p-3 rounded text-white focus:outline-none resize-none overflow-hidden min-h-[24px] max-h-40 mb-0"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isStreaming}
      />

      {/* Attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, i) => (
            <AttachmentChip
              key={`${file.name}-${i}`}
              file={file}
              index={i}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-end gap-2">
        {/* Tool buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {/* Attach button */}
            <button
              type="button"
              className="text-base px-1 py-1 rounded text-white"
              onClick={handleAttachClick}
              title="Attach image"
              disabled={isStreaming}
            >
              <AttachIcon className="w-4 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onPickFiles}
            />

            {/* Fact Check button */}
            <ToolTooltip title="Fact Check" subtitle="Coming Soon">
              <button className="text-base pr-1 py-1 rounded text-white hover:bg-zinc-700 transition-colors">
                <WrongIcon className="w-4 h-5" />
              </button>
            </ToolTooltip>

            {/* Hallucination Check button */}
            <ToolTooltip title="Hallucination Check" subtitle="Coming Soon">
              <button className="text-base pr-1 py-1 rounded text-white hover:bg-zinc-700 transition-colors">
                <HallucinationIcon className="w-4 h-5" />
              </button>
            </ToolTooltip>

            {/* Step-by-Step button */}
            <ToolTooltip title="Step-by-Step" subtitle="Coming Soon">
              <button className="text-base pr-1 py-1 rounded text-white hover:bg-zinc-700 transition-colors">
                <StepsIcon className="w-4 h-5" />
              </button>
            </ToolTooltip>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!canSend}
          className="bg-purple1 px-3 py-2 rounded-xl hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStreaming ? (
            <RefreshCw className="w-4 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-4 h-5" />
          )}
        </button>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;