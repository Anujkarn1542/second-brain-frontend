import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadDocument } from "@/hooks/useDocuments";
import type { Document } from "@/types";

interface DropZoneProps {
  onUpload: (doc: Document) => void;
  onUploadComplete: (
    tempId: string,
    realId: string,
    pageCount: number,
    chunkCount: number,
  ) => void;
}

export default function DropZone({
  onUpload,
  onUploadComplete,
}: DropZoneProps) {
  const { mutate: uploadDocument, isPending } = useUploadDocument();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // Show pending document in UI immediately
      const tempId = crypto.randomUUID();
      const pendingDoc: Document = {
        id: tempId,
        name: file.name,
        size: file.size,
        status: "uploading",
        uploadedAt: new Date(),
      };
      onUpload(pendingDoc);

      // Call real backend
      uploadDocument(file, {
        onSuccess: (data) => {
          onUploadComplete(
            tempId,
            data.document_id,
            data.page_count,
            data.chunk_count,
          );
        },
        onError: () => {
          onUploadComplete(tempId, tempId, 0, 0);
        },
      });
    },
    [onUpload, onUploadComplete, uploadDocument],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isPending,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-6 cursor-pointer
        flex flex-col items-center justify-center gap-2 text-center
        transition-colors duration-200 select-none
        ${
          isDragActive
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 bg-gray-50 dark:bg-gray-900"
        }
        ${isPending ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
              Processing...
            </p>
            <p className="text-xs text-gray-400">
              Chunking + embedding your document
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isDragActive ? "bg-violet-100 dark:bg-violet-800" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  isDragActive
                    ? "text-violet-600"
                    : "text-gray-500 dark:text-gray-400"
                }
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragActive ? "Drop it here!" : "Drag & drop a file"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              PDF or TXT · Max 10MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
