import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  documentName: string;
  onSelect: (question: string) => void;
}

function generateSuggestions(name: string): string[] {
  // Strip extension for cleaner display
  const base = name.replace(/\.(pdf|txt)$/i, "").replace(/[-_]/g, " ");

  return [
    `What is the main topic of ${base}?`,
    `Summarize the key points from ${base}`,
    `What are the most important conclusions in ${base}?`,
  ];
}

export default function SuggestedQuestions({
  documentName,
  onSelect,
}: SuggestedQuestionsProps) {
  const suggestions = generateSuggestions(documentName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-3"
    >
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 px-1">
        Try asking
      </p>
      <div className="flex flex-col gap-1.5">
        {suggestions.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onSelect(q)}
            className="text-left text-xs px-3 py-2 rounded-lg border border-gray-200
              dark:border-gray-700 text-gray-600 dark:text-gray-400
              hover:border-violet-300 dark:hover:border-violet-700
              hover:text-violet-700 dark:hover:text-violet-300
              hover:bg-violet-50 dark:hover:bg-violet-900/10
              transition-all duration-150 group flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 dark:text-gray-600 group-hover:text-violet-400 flex-shrink-0 transition-colors"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {q}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
