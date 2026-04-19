import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "@/lib/axios";
import { usePageTitle } from "@/hooks/usePageTitle";

interface StatsResponse {
  total_documents: number;
  total_chunks: number;
  total_queries: number;
  documents: { id: string; name: string; chunk_count: number }[];
}

const statCards = (data: StatsResponse) => [
  {
    label: "Documents",
    value: data.total_documents,
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
      </svg>
    ),
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    desc: "Total uploaded",
  },
  {
    label: "Chunks indexed",
    value: data.total_chunks,
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
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    desc: "Vectors stored",
  },
  {
    label: "Avg chunks/doc",
    value:
      data.total_documents > 0
        ? Math.round(data.total_chunks / data.total_documents)
        : 0,
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    desc: "Per document",
  },
];

// Custom tooltip for the bar chart
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-gray-800 dark:text-gray-200">
        {payload[0]?.payload?.name}
      </p>
      <p className="text-violet-600 dark:text-violet-400 mt-0.5">
        {payload[0]?.value} chunks
      </p>
    </div>
  );
}

const COLORS = ["#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#3b0764"];

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get("/ingest/stats");
      return res.data;
    },
    refetchInterval: 15000,
  });

  usePageTitle("Documents");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your knowledge base
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 mb-8">
          Could not load stats. Make sure the backend is running.
        </div>
      )}

      {data && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {statCards(data).map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                  {card.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chart + recent docs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Chunks per document
              </h2>
              {data.documents.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No documents yet
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={data.documents.map((d) => ({
                      name:
                        d.name.length > 16 ? d.name.slice(0, 16) + "…" : d.name,
                      chunks: d.chunk_count,
                    }))}
                    margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={
                        {
                          fontSize: 11,
                          fill: "var(--color-text-tertiary)",
                        } as any
                      }
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={
                        {
                          fontSize: 11,
                          fill: "var(--color-text-tertiary)",
                        } as any
                      }
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="chunks" radius={[4, 4, 0, 0]}>
                      {data.documents.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                          opacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Document list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Documents
                </h2>
                <Link
                  to="/documents"
                  className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                >
                  View all
                </Link>
              </div>

              {data.documents.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No documents yet
                  </p>
                  <Link
                    to="/chat"
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Upload your first document →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.documents.slice(0, 5).map((doc, i) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-500"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {doc.chunk_count} chunks
                        </p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
