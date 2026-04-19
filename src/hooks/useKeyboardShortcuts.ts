import { useEffect } from "react";

interface Shortcuts {
  onFocusChat?: () => void;
  onNewChat?: () => void;
}

export function useKeyboardShortcuts({ onFocusChat, onNewChat }: Shortcuts) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K — focus chat input
      if (modifier && e.key === "k") {
        e.preventDefault();
        onFocusChat?.();
      }

      // Cmd/Ctrl + Shift + N — new chat
      if (modifier && e.shiftKey && e.key === "n") {
        e.preventDefault();
        onNewChat?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFocusChat, onNewChat]);
}
