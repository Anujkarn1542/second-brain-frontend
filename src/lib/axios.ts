import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Human-readable error messages mapped from HTTP status codes
function getErrorMessage(status: number, detail?: string): string {
  if (detail) return detail;

  const messages: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "You are not authorized. Please log in.",
    403: "You do not have permission to do this.",
    404: "Resource not found.",
    408: "Request timed out. Please try again.",
    413: "File is too large. Maximum size is 10MB.",
    422: "Could not process this file. Is it a scanned PDF with no text?",
    429: "Too many requests. Please slow down.",
    500: "Server error. The backend may be down.",
    502: "Backend is unreachable. Please try again later.",
    503: "Service temporarily unavailable. Please try again.",
  };

  return messages[status] || `Unexpected error (${status})`;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const status = error.response?.status ?? 0;
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      undefined;

    if (!error.response) {
      return Promise.reject(
        new Error("Cannot reach the server. Is the backend running?"),
      );
    }

    const message = getErrorMessage(status, detail);
    return Promise.reject(new Error(message));
  },
);

export default api;
