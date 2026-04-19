import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

    async function check() {
      try {
        const res = await fetch(`${API}/health`, {
          signal: AbortSignal.timeout(4000),
        });
        setIsOffline(!res.ok);
      } catch {
        setIsOffline(true);
      } finally {
        setChecked(true);
      }
    }

    check();
    // Re-check every 30 seconds
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!checked) return null;

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="bg-red-500 text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Backend is offline — uploads and queries will not work until it's
          back.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
