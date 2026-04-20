import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DropZone from "@/components/upload/DropZone";
import DocumentList from "@/components/upload/DocumentList";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import ChatHistory from "@/components/chat/ChatHistory";
import { useDeleteDocument, useStreamQuery } from "@/hooks/useDocuments";
import { useChatHistory } from "@/hooks/useChatHistory";
import type { Document, Message, Source } from "@/types";
import { useRef } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { ChatInputRef } from "@/components/chat/ChatInput";
import { usePageTitle } from "@/hooks/usePageTitle";
import ChatSidebarSkeleton from "@/components/skeletons/ChatSidebarSkeleton";

type SidebarTab = "documents" | "history";

export default function ChatPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("documents");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  usePageTitle("Chat");

  const chatInputRef = useRef<ChatInputRef>(null);

  const { mutate: deleteDocument } = useDeleteDocument();
  const { mutate: streamQuery } = useStreamQuery();
  const {
    sessions,
    activeSesionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    clearAllSessions,
  } = useChatHistory();

  const handleUpload = (doc: Document) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const handleUploadComplete = (
    tempId: string,
    realId: string,
    pageCount: number,
    chunkCount: number,
  ) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === tempId
          ? {
              ...d,
              id: realId,
              status: pageCount > 0 ? "ready" : "error",
              pageCount,
              chunkCount,
            }
          : d,
      ),
    );
    if (pageCount > 0 && !activeDocId) setActiveDocId(realId);
  };

  const handleRemoveDocument = (id: string) => {
    deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDocId === id) {
      const remaining = documents.filter(
        (d) => d.id !== id && d.status === "ready",
      );
      setActiveDocId(remaining[0]?.id);
    }
  };

  // Load a past session into the chat window
  const handleSelectSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setMessages(session.messages);
        setActiveSessionId(sessionId);
      }
    },
    [sessions, setActiveSessionId],
  );

  // Start a fresh chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleSendMessage = (content: string) => {
    const readyDocs = documents.filter((d) => d.status === "ready");
    if (readyDocs.length === 0) {
      toast.error("Please upload a document first.");
      return;
    }

    // Create a new session on first message
    let sessionId = activeSesionId;
    if (!sessionId) {
      sessionId = createSession(content);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      sources: [],
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);

    // Keep a mutable ref to accumulate streamed content
    let streamedContent = "";

    streamQuery(
      {
        question: content,
        document_id: activeDocId,
        onChunk: (text: string) => {
          streamedContent += text;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: streamedContent } : m,
            ),
          );
        },
        onSources: (sources: Source[]) => {
          setMessages((prev) => {
            const finalMessages = prev.map((m) =>
              m.id === assistantId ? { ...m, sources } : m,
            );
            // Save to history with final sources
            if (sessionId) updateSession(sessionId, finalMessages);
            return finalMessages;
          });
        },
      },
      {
        onSettled: () => setIsStreaming(false),
        onError: () => {
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          setIsStreaming(false);
        },
      },
    );
  };

  const readyDocuments = documents.filter((d) => d.status === "ready");

  useKeyboardShortcuts({
    onFocusChat: () => chatInputRef.current?.focus(),
    onNewChat: handleNewChat,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-3.5rem)] flex gap-4"
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* LEFT SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-950 p-4
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

        sm:static sm:translate-x-0 sm:z-auto
        sm:w-72 sm:flex-shrink-0 sm:flex sm:flex-col sm:gap-3
        sm:bg-transparent sm:p-0 sm:overflow-hidden
      `}
      >
        {/* Close button mobile only */}
        <div className="flex items-center justify-between mb-3 sm:hidden">
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
            Documents
          </span>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        {/* Tab switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["documents", "history"] as SidebarTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSidebarTab(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors
                ${
                  sidebarTab === tab
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Documents tab */}
        {sidebarTab === "documents" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3 flex-1 overflow-hidden"
          >
            <DropZone
              onUpload={handleUpload}
              onUploadComplete={handleUploadComplete}
            />

            {readyDocuments.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
                  Search in
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setActiveDocId(undefined)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                      ${
                        activeDocId === undefined
                          ? "bg-violet-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    All docs
                  </button>
                  {readyDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setActiveDocId(doc.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors truncate max-w-[140px]
                        ${
                          activeDocId === doc.id
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                      {doc.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DocumentList
              documents={documents}
              onRemove={handleRemoveDocument}
            />
          </motion.div>
        )}

        {/* History tab */}
        {sidebarTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-hidden"
          >
            <ChatHistory
              sessions={sessions}
              activeSessionId={activeSesionId}
              onSelect={handleSelectSession}
              onDelete={deleteSession}
              onClear={clearAllSessions}
              onNewChat={handleNewChat}
            />
          </motion.div>
        )}
      </aside>

      {/* RIGHT — Chat */}
      <main className="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 min-w-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 sm:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Documents & History
          </button>
        </div>
        <ChatWindow
          messages={messages}
          isLoading={isStreaming}
          readyDocuments={readyDocuments}
          onSuggestedQuestion={handleSendMessage}
          onClearChat={() => setMessages([])}
        />
        <ChatInput
          ref={chatInputRef}
          onSend={handleSendMessage}
          isLoading={isStreaming}
        />
      </main>
    </motion.div>
  );
}
