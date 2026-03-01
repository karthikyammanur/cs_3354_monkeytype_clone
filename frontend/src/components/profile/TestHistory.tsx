import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.ts";
import type { TestHistory as TestHistoryType } from "../../types/index.ts";

interface TestHistoryProps {
  tests: TestHistoryType[];
  pagination: { page: number; totalPages: number };
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function TestHistory({ tests, pagination, onPageChange, isLoading }: TestHistoryProps) {
  if (!isLoading && tests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 mb-2">No tests yet.</p>
        <Link to="/" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 text-sm transition-colors">
          Take a typing test to see your history here
        </Link>
      </div>
    );
  }

  return (
    <div>
      <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
        <thead>
          <tr className="text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
            <th className="text-left py-3 font-medium">Date</th>
            <th className="text-right py-3 font-medium">Duration</th>
            <th className="text-right py-3 font-medium">WPM</th>
            <th className="text-right py-3 font-medium">Accuracy</th>
            <th className="text-right py-3 font-medium">Characters</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-zinc-800/50">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="py-3">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-16 ml-auto first:ml-0" />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            tests.map((test, i) => (
              <tr
                key={test.id}
                className={`border-b border-zinc-800/50 ${i % 2 === 0 ? "bg-zinc-900/30" : ""}`}
              >
                <td className="py-3 text-zinc-400">{formatDate(test.createdAt)}</td>
                <td className="py-3 text-right text-zinc-400">{test.duration}s</td>
                <td className="py-3 text-right text-gray-200">{Math.round(test.wpm)}</td>
                <td className="py-3 text-right text-gray-200">{Math.round(test.accuracy * 10) / 10}%</td>
                <td className="py-3 text-right text-zinc-400">{test.correctChars}/{test.totalChars}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="text-sm px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
          >
            previous
          </button>
          <span className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="text-sm px-3 py-1 rounded text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}
