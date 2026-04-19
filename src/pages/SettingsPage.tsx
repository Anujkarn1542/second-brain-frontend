import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Settings {
  chunkSize: number;
  topK: number;
  streamingEnabled: boolean;
  model: string;
}

const DEFAULT_SETTINGS: Settings = {
  chunkSize: 500,
  topK: 5,
  streamingEnabled: true,
  model: "gemini-1.5-flash",
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem("sb-settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);

  usePageTitle("Settings");

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("sb-settings", JSON.stringify(settings));
    setSaved(true);
    toast.success("Settings saved");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("sb-settings", JSON.stringify(DEFAULT_SETTINGS));
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize how your second brain works
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* AI Model */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            AI Model
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            The model used to generate answers from your documents
          </p>
          <select
            value={settings.model}
            onChange={(e) => update("model", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-violet-400 dark:focus:border-violet-600 transition-colors"
          >
            <option value="gemini-1.5-flash">
              Gemini 1.5 Flash — fast, free
            </option>
            <option value="gemini-1.5-pro">
              Gemini 1.5 Pro — smarter, slower
            </option>
            <option value="gpt-4o-mini">
              GPT-4o Mini — requires OpenAI key
            </option>
          </select>
        </motion.div>

        {/* Chunk size */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Chunk size
            </h2>
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              {settings.chunkSize} chars
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Smaller chunks = more precise. Larger chunks = more context per
            answer.
          </p>
          <input
            type="range"
            min={200}
            max={1500}
            step={50}
            value={settings.chunkSize}
            onChange={(e) => update("chunkSize", Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>200 — precise</span>
            <span>1500 — broad</span>
          </div>
        </motion.div>

        {/* Top K results */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Results retrieved
            </h2>
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              Top {settings.topK}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            How many chunks are retrieved from the vector store per query
          </p>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={settings.topK}
            onChange={(e) => update("topK", Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>1 — fastest</span>
            <span>10 — most thorough</span>
          </div>
        </motion.div>

        {/* Streaming toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Streaming responses
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Show answers word by word as they generate
              </p>
            </div>
            <button
              onClick={() =>
                update("streamingEnabled", !settings.streamingEnabled)
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                settings.streamingEnabled
                  ? "bg-violet-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  settings.streamingEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-xl border border-red-100 dark:border-red-900/40 bg-white dark:bg-gray-900"
        >
          <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Danger zone
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Reset all settings back to their default values
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Reset to defaults
          </button>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            {saved ? "Saved!" : "Save settings"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
