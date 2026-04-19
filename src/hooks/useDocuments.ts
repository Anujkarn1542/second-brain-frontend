import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import type { UploadResponse, QueryResponse, Source } from "@/types";

export function useUploadDocument() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/ingest/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        `"${data.name}" ready — ${data.chunk_count} chunks indexed`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload failed.");
    },
  });
}

export function useDeleteDocument() {
  return useMutation({
    mutationFn: async (documentId: string) => {
      await api.delete(`/ingest/${documentId}`);
    },
    onSuccess: () => toast.success("Document removed"),
    onError: () => toast.error("Failed to remove document"),
  });
}

export function useQueryDocument() {
  return useMutation({
    mutationFn: async (payload: {
      question: string;
      document_id?: string;
    }): Promise<QueryResponse> => {
      const res = await api.post("/query/", payload);
      return res.data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Query failed.");
    },
  });
}

// Streaming hook — calls /query/stream and reads SSE
export function useStreamQuery() {
  return useMutation({
    mutationFn: async (payload: {
      question: string;
      document_id?: string;
      onChunk: (text: string) => void; // called for each word/chunk
      onSources: (sources: Source[]) => void; // called when sources arrive
    }): Promise<void> => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/query/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: payload.question,
          document_id: payload.document_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Streaming query failed.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      // Read SSE stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace("data: ", "").trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === "chunk") {
              payload.onChunk(event.content);
            } else if (event.type === "sources") {
              payload.onSources(event.sources);
            }
          } catch {
            // ignore malformed lines
          }
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Streaming failed.");
    },
  });
}
