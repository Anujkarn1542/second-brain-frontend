import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";

const steps = [
  {
    number: "01",
    title: "Upload your document",
    desc: "Drop in a PDF or text file. The file is saved to the server and its raw text is extracted page by page using PyPDF.",
    detail:
      "Supports PDFs and plain text. Max 10MB. Text is extracted per page so we always know which page each answer came from.",
    color: "violet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Text is chunked",
    desc: "The extracted text is split into overlapping 500-character chunks using LangChain's RecursiveCharacterTextSplitter.",
    detail:
      "Overlapping chunks (50 char overlap) ensure that context at page boundaries is never lost. Each chunk remembers which document and page it came from.",
    color: "teal",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Chunks are embedded",
    desc: "Each chunk is converted into a vector — a list of 768 numbers — using Google's embedding model. Semantically similar text gets similar vectors.",
    detail:
      'We use Google\'s embedding-001 model. These vectors capture meaning, not just keywords — so "car" and "automobile" are close in vector space.',
    color: "amber",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Stored in ChromaDB",
    desc: "The vectors plus their metadata (document name, page number) are stored in ChromaDB — a local vector database that persists to disk.",
    detail:
      "Each document gets its own ChromaDB collection. This lets you search a single document or all documents at once with one toggle.",
    color: "blue",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Your question is matched",
    desc: "When you ask a question, it's embedded into a vector too. ChromaDB finds the top 5 chunks whose vectors are closest — these are the most relevant pieces.",
    detail:
      "We use cosine similarity to measure vector closeness. A score of 1.0 = identical meaning. Typically relevant chunks score above 0.7.",
    color: "teal",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Gemini generates a cited answer",
    desc: "The top chunks are sent to Gemini as context. Gemini reads only those chunks and generates an answer — with source citations back to your document.",
    detail:
      "We use a strict system prompt that tells Gemini to only use the provided context and never make up information. Low temperature (0.2) keeps answers factual.",
    color: "violet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const colorMap: Record<string, string> = {
  violet:
    "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/40",
  teal: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/40",
  amber:
    "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
};

export default function HowItWorksPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  usePageTitle("How it works");
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          How it works
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
          A full RAG pipeline in 6 steps — from your PDF to a cited answer
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative flex flex-col gap-4">
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-12 bottom-12 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block" />

        {steps.map((step, i) => {
          const isOpen = expanded === i;
          const colors = colorMap[step.color];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full text-left flex items-start gap-4 p-5 rounded-xl border transition-all duration-200
                  ${
                    isOpen
                      ? `${colors} border`
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
              >
                {/* Icon circle */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isOpen ? "bg-white/60 dark:bg-black/20" : "bg-gray-50 dark:bg-gray-800"}`}
                >
                  <span
                    className={isOpen ? "" : "text-gray-500 dark:text-gray-400"}
                  >
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold tracking-wider
                      ${isOpen ? "" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {step.number}
                    </span>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs leading-relaxed mt-3 pt-3 border-t border-current/10">
                          {step.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chevron */}
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
                  className={`flex-shrink-0 mt-1 transition-transform duration-200
                    ${isOpen ? "rotate-180" : ""}
                    ${isOpen ? "" : "text-gray-400 dark:text-gray-500"}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Tech stack footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
      >
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Tech stack
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "React 18",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "FastAPI",
            "Python",
            "LangChain",
            "ChromaDB",
            "Gemini API",
            "TanStack Query",
            "Vite",
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
