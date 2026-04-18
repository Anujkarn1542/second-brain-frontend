import { motion, AnimatePresence } from "framer-motion";
import type { Document } from "@/types";

interface DocumentPreviewProps {
  document: Document | null;
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentPreview({
  document,
  onClose,
}: DocumentPreviewProps) {
  return (
    <AnimatePresence>
      {document && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
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
                  className="text-red-500"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {document.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
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
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
            {[
              { label: "Size", value: formatSize(document.size) },
              { label: "Pages", value: document.pageCount ?? "—" },
              { label: "Chunks", value: document.chunkCount ?? "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center py-2.5 gap-0.5"
              >
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {stat.value}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  document.status === "ready"
                    ? "bg-green-500"
                    : document.status === "error"
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">
                {document.status === "ready"
                  ? "Indexed and ready to query"
                  : document.status === "error"
                    ? "Failed to process"
                    : "Processing..."}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
