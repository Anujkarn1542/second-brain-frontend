import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Upload anything",
    desc: "Drop in PDFs or plain text files. Your documents stay private.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
    title: "Semantic search",
    desc: "Vector embeddings find the most relevant context — not just keyword matches.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
    title: "Cited answers",
    desc: "Every response links back to the exact page it came from. No hallucinations.",
  },
];

const steps = [
  { number: "01", label: "Upload your PDF or text file" },
  { number: "02", label: "We chunk, embed and index it" },
  { number: "03", label: "Ask questions, get cited answers" },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 gap-8 relative overflow-hidden">
        {/* Background glow — subtle, not AI-gross */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5 max-w-3xl"
        >
          {/* Eyebrow label */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
              RAG · Embeddings · Vector Search
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white leading-tight">
            Your documents,{" "}
            <span className="text-violet-600 dark:text-violet-400">
              finally answerable
            </span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
            Upload a PDF. Ask a question. Get a precise answer with the exact
            source it came from — powered by embeddings and GPT.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2 px-6 rounded-xl"
              >
                Try it now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
                    0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755
                    -1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305
                    3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93
                    0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23
                    .96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23
                    3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22
                    0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
                    0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"
                  />
                </svg>
                Source code
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 dark:border-gray-800 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-semibold text-gray-900 dark:text-white">
              How it works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Three steps from upload to insight
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center p-8"
              >
                {/* Connector line between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-[2.85rem] left-[calc(50%+2rem)] right-0 h-px border-t border-dashed border-gray-200 dark:border-gray-700" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 flex items-center justify-center mb-4">
                  <span className="font-display text-sm font-semibold text-violet-600 dark:text-violet-400">
                    {step.number}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
                  {step.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 dark:border-gray-800 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-semibold text-gray-900 dark:text-white">
              Built differently
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Not just an API wrapper — a real retrieval pipeline
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SB</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Second Brain
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Built with React · FastAPI · LangChain · ChromaDB
          </p>
        </div>
      </footer>
    </div>
  );
}
