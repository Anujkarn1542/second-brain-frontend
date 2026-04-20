import { motion } from "framer-motion";

export default function MessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-end gap-2 max-w-[80%]">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <span className="text-[9px] font-bold text-violet-600">AI</span>
        </div>

        {/* Bubble */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 min-w-[220px]">
          <p className="text-xs text-gray-400 mb-2">
            Searching documents...
          </p>

          <div className="flex gap-1">
            {[1,2,3].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}