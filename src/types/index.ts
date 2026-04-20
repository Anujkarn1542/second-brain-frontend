export interface Document {
  id: string; // this is document_id from backend
  name: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error";
  uploadedAt: Date;
  pageCount?: number;
  chunkCount?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  createdAt: Date;
}

export interface Source {
  document_name: string;
  page_number: number;
  snippet: string;
  score: number; // ← add this
}

export interface UploadResponse {
  document_id: string;
  name: string;
  page_count: number;
  chunk_count: number;
  message: string;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export interface ApiError {
  message: string;
  status: number;
}
