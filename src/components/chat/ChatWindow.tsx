import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import StatsBar from "@/components/layout/StatsBar";
import type { Message, Document } from "@/types";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  readyDocuments: Document[];
  onSuggestedQuestion: (q: string) => void;
  onClearChat: () => void; // ← add this
}

export default function ChatWindow({
  messages,
  isLoading,
  readyDocuments,
  onSuggestedQuestion,
  onClearChat,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const showSuggestions = messages.length === 0 && readyDocuments.length > 0;

  // Add this function inside ChatWindow:
  const handleExport = () => {
    if (messages.length === 0) return;

    const lines = messages.map((m) => {
      const role = m.role === "user" ? "You" : "Second Brain";
      const time = m.createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sources = m.sources?.length
        ? `\nSources: ${m.sources.map((s) => `${s.document_name} p.${s.page_number}`).join(", ")}`
        : "";
      return `[${time}] ${role}:\n${m.content}${sources}`;
    });

    const content = lines.join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `second-brain-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <StatsBar />

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-600 dark:text-violet-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          {readyDocuments.length === 0 ? (
            <>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                No documents yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                Upload a PDF or TXT file using the panel on the left to get
                started.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Ready to answer questions
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {readyDocuments.length} document
                {readyDocuments.length > 1 ? "s" : ""} indexed
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {messages.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {messages.length} messages
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearChat}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export chat
                </button>
              </div>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto relative px-4 py-4 flex flex-col gap-4"
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isLoading && <MessageSkeleton />}

            {showScrollTop && (
              <button
                onClick={() =>
                  scrollContainerRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="absolute top-16 right-4 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:border-violet-400 transition-colors"
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
                  className="text-gray-500 dark:text-gray-400"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            )}

            <div ref={bottomRef} />
          </div>
        </>
      )}

      {/* Suggested questions sit above the input */}
      {showSuggestions && (
        <SuggestedQuestions
          documentName={readyDocuments[readyDocuments.length - 1].name}
          onSelect={onSuggestedQuestion}
        />
      )}
    </div>
  );
}
