import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";

export interface ChatInputRef {
  focus: () => void;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MAX_LENGTH = 2000;

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  ({ onSend, isLoading }, ref) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    const trimmed = value.trim();
    const isOverLimit = value.length > MAX_LENGTH;
    const canSend = trimmed.length >= 2 && !isLoading && !isOverLimit;

    const handleSend = () => {
      if (!canSend) return;
      onSend(trimmed);
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleInput = () => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    };

    return (
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div
          className={`flex items-end gap-2 bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 transition-colors
          ${
            isOverLimit
              ? "border-red-400 dark:border-red-600"
              : "border-gray-200 dark:border-gray-700 focus-within:border-violet-400 dark:focus-within:border-violet-600"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask something about your documents..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none disabled:opacity-50 leading-relaxed"
          />
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </Button>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          <p className="text-[10px] text-gray-400 dark:text-gray-600">
            Enter to send · Shift+Enter for new line
          </p>
          <div className="flex items-center gap-3">
            {/* Character counter */}
            {value.length > 0 && (
              <span
                className={`text-[10px] tabular-nums ${
                  isOverLimit
                    ? "text-red-500 font-medium"
                    : value.length > MAX_LENGTH * 0.8
                      ? "text-amber-500"
                      : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {value.length}/{MAX_LENGTH}
              </span>
            )}
            <p className="text-[10px] text-gray-400 dark:text-gray-600 hidden sm:block">
              ⌘K focus · ⌘⇧N new chat
            </p>
          </div>
        </div>

        {/* Over limit warning */}
        {isOverLimit && (
          <p className="text-[11px] text-red-500 mt-1 px-1">
            Message is too long. Please shorten it to under {MAX_LENGTH}{" "}
            characters.
          </p>
        )}
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";
export default ChatInput;
