import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface Stats {
  total_documents: number;
  total_chunks: number;
}

export default function StatsBar() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get("/ingest/stats");
      return res.data;
    },
    refetchInterval: 10000, // refresh every 10 seconds
  });

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <StatPill
        icon={
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
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
        label="Documents"
        value={stats.total_documents}
        color="violet"
      />
      <StatPill
        icon={
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
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        }
        label="Chunks indexed"
        value={stats.total_chunks}
        color="teal"
      />
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "violet" | "teal";
}) {
  const colors = {
    violet:
      "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20",
    teal: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors[color]}`}
    >
      {icon}
      <span className="text-[11px] font-medium">
        {value.toLocaleString()} {label}
      </span>
    </div>
  );
}
