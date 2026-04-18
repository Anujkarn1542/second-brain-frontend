import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import StatsBar from "@/components/layout/StatsBar";
import type { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Stats bar at top */}
      <StatsBar />

      {/* Messages */}
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
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Ask anything about your documents
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Upload a file on the left, then type your question below.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-1 px-4 py-3 w-fit rounded-xl bg-gray-100 dark:bg-gray-800">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
