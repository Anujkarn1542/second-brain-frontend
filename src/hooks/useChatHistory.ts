import { useState, useEffect } from "react";
import type { Message } from "@/types";

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "second-brain-chat-history";

function loadFromStorage(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Restore Date objects — JSON.parse gives strings
    return parsed.map((session: ChatSession) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((m: Message) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      })),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage full — ignore
  }
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadFromStorage);
  const [activeSesionId, setActiveSessionId] = useState<string | null>(null);

  // Persist to localStorage whenever sessions change
  useEffect(() => {
    saveToStorage(sessions);
  }, [sessions]);

  const createSession = (firstMessage: string): string => {
    const id = crypto.randomUUID();
    const newSession: ChatSession = {
      id,
      // Use first 40 chars of first message as title
      title:
        firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : ""),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    return id;
  };

  const updateSession = (sessionId: string, messages: Message[]) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages, updatedAt: new Date() } : s,
      ),
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSesionId === sessionId) setActiveSessionId(null);
  };

  const clearAllSessions = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  const getSession = (sessionId: string) =>
    sessions.find((s) => s.id === sessionId);

  return {
    sessions,
    activeSesionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    getSession,
  };
}
