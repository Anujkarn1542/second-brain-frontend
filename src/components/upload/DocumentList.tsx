import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentPreview from "./DocumentPreview";
import type { Document } from "@/types";

interface DocumentListProps {
  documents: Document[];
  onRemove: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusConfig = {
  uploading: {
    label: "Uploading",
    class:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  processing: {
    label: "Processing",
    class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  ready: {
    label: "Ready",
    class:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  error: {
    label: "Error",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function DocumentList({
  documents,
  onRemove,
}: DocumentListProps) {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  if (documents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center px-4">
          No documents yet. Upload a PDF or TXT file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
        Documents ({documents.length})
      </p>

      {/* Preview panel */}
      <DocumentPreview
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <AnimatePresence>
        {documents.map((doc) => {
          const status = statusConfig[doc.status];
          const isSelected = previewDoc?.id === doc.id;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => setPreviewDoc(isSelected ? null : doc)}
              className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                transition-colors
                ${
                  isSelected
                    ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/10"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700"
                }`}
            >
              <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  className="text-red-500"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {formatSize(doc.size)}
                </p>
                <span
                  className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.class}`}
                >
                  {status.label}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(doc.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 flex-shrink-0"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
