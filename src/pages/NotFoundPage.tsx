import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4"
    >
      <div className="text-center">
        <p className="text-7xl font-bold text-violet-100 dark:text-violet-900/40 mb-2">
          404
        </p>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </motion.div>
  );
}
