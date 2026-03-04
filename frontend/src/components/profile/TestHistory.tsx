import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.ts";
import type { TestHistory as TestHistoryType } from "../../types/index.ts";

interface TestHistoryProps {
  tests: TestHistoryType[];
  pagination: { page: number; totalPages: number };
  onPageChange: (page: number) => void;
  onDelete: (testId: string) => Promise<void>;
  isLoading: boolean;
}

export function TestHistory({ tests, pagination, onPageChange, onDelete, isLoading }: TestHistoryProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  if (!isLoading && tests.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border border-[#1a1a1a] bg-[#141414]/50">
        <p className="text-zinc-400 text-lg mb-2" style={{ fontFamily: "var(--font-mono)" }}>no tests yet</p>
        <p className="text-zinc-600 text-sm mb-4">complete a typing test to start tracking your progress</p>
        <Link
          to="/"
          className="inline-block text-sm px-5 py-2 rounded bg-[#1a1a1a] text-zinc-300 hover:bg-[#252525] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          take a test
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          <thead>
            <tr className="text-xs uppercase tracking-wider text-zinc-500 border-b border-[#1a1a1a]">
              <th className="text-left py-3 font-medium">Date</th>
              <th className="text-right py-3 font-medium">Duration</th>
              <th className="text-right py-3 font-medium">WPM</th>
              <th className="text-right py-3 font-medium">Accuracy</th>
              <th className="text-right py-3 font-medium hidden md:table-cell">Characters</th>
              <th className="w-10 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]/50">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="py-3">
                      <div className="h-4 bg-[#1a1a1a] rounded animate-skeleton w-16 ml-auto first:ml-0" />
                    </td>
                  ))}
                  <td className="py-3 hidden md:table-cell">
                    <div className="h-4 bg-[#1a1a1a] rounded animate-skeleton w-16 ml-auto" />
                  </td>
                  <td className="py-3" />
                </tr>
              ))
            ) : (
              tests.map((test, i) => (
                <tr
                  key={test.id}
                  className={`border-b border-[#1a1a1a]/50 transition-colors hover:bg-[#1a1a1a]/40 ${i % 2 === 0 ? "bg-[#141414]/30" : ""}`}
                >
                  <td className="py-3 text-zinc-400 text-xs sm:text-sm">{formatDate(test.createdAt)}</td>
                  <td className="py-3 text-right text-zinc-400">{test.duration}s</td>
                  <td className="py-3 text-right text-gray-200">{Math.round(test.wpm)}</td>
                  <td className="py-3 text-right text-gray-200">{Math.round(test.accuracy * 10) / 10}%</td>
                  <td className="py-3 text-right text-zinc-400 hidden md:table-cell">{test.correctChars}/{test.totalChars}</td>
                  <td className="py-3 text-center">
                    {confirmId === test.id ? (
                      <span className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleDelete(test.id)}
                          disabled={deleting}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {deleting ? "..." : "yes"}
                        </button>
                        <span className="text-zinc-600">/</span>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                          no
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmId(test.id)}
                        className="text-zinc-700 hover:text-red-400 transition-colors cursor-pointer p-1"
                        title="Delete test"
                      >
                        &#x2715;
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="text-sm px-3 py-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]/50 disabled:text-zinc-700 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            previous
          </button>
          <span className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="text-sm px-3 py-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]/50 disabled:text-zinc-700 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}
