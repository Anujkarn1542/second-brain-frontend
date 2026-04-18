import { motion } from "framer-motion";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Avatar + bubble row */}
        <div
          className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* Avatar */}
          <div
            className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mb-1
            ${
              isUser
                ? "bg-violet-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>

          {/* Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
            ${
              isUser
                ? "bg-violet-600 text-white rounded-br-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
            }`}
          >
            {message.content}
          </div>
        </div>

        {/* Source citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-8">
            <p className="w-full text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">
              Sources
            </p>
            {message.sources.map((source, i) => (
              <div
                key={i}
                title={source.snippet}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                  bg-violet-50 dark:bg-violet-900/20
                  border border-violet-200 dark:border-violet-800
                  cursor-help group relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-violet-500 flex-shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-[10px] text-violet-700 dark:text-violet-300 font-medium">
                  {source.document_name} · p.{source.page_number}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 dark:text-gray-600 px-8">
          {message.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}
