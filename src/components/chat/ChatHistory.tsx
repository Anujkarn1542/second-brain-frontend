import { motion, AnimatePresence } from "framer-motion";
import type { ChatSession } from "@/hooks/useChatHistory";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onNewChat: () => void;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function ChatHistory({
  sessions,
  activeSessionId,
  onSelect,
  onDelete,
  onClear,
  onNewChat,
}: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          History
        </p>
        <div className="flex items-center gap-1">
          {sessions.length > 0 && (
            <button
              onClick={onClear}
              title="Clear all history"
              className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* New chat button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg
          border border-dashed border-gray-300 dark:border-gray-700
          text-sm text-gray-500 dark:text-gray-400
          hover:border-violet-400 dark:hover:border-violet-600
          hover:text-violet-600 dark:hover:text-violet-400
          transition-colors mb-2"
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
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New chat
      </button>

      {/* Session list */}
      {sessions.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-4 px-2">
          No conversations yet. Ask your first question!
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-1">
          <AnimatePresence>
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                  ${
                    activeSessionId === session.id
                      ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent"
                  }`}
                onClick={() => onSelect(session.id)}
              >
                {/* Chat icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 mt-0.5 ${
                    activeSessionId === session.id
                      ? "text-violet-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                {/* Title + time */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${
                      activeSessionId === session.id
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {session.title}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatDate(session.updatedAt)} · {session.messages.length}{" "}
                    msgs
                  </p>
                </div>

                {/* Delete button — visible on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                    text-gray-400 hover:text-red-500 flex-shrink-0 p-0.5"
                  aria-label="Delete session"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
