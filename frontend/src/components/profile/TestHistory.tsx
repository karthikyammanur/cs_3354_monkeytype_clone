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
      <div className="text-center py-16 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-card)]/50">
        <p className="text-[var(--color-secondary-text)] text-lg mb-2" style={{ fontFamily: "var(--font-mono)" }}>no tests yet</p>
        <p className="text-[var(--color-muted)] text-sm mb-4">complete a typing test to start tracking your progress</p>
        <Link
          to="/"
          className="inline-block text-sm px-5 py-2 rounded bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
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
            <tr className="text-xs uppercase tracking-wider text-[var(--color-secondary-text)] border-b border-[var(--color-border-subtle)]">
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
                <tr key={i} className="border-b border-[var(--color-border-subtle)]/50">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="py-3">
                      <div className="h-4 bg-[var(--color-skeleton)] rounded animate-skeleton w-16 ml-auto first:ml-0" />
                    </td>
                  ))}
                  <td className="py-3 hidden md:table-cell">
                    <div className="h-4 bg-[var(--color-skeleton)] rounded animate-skeleton w-16 ml-auto" />
                  </td>
                  <td className="py-3" />
                </tr>
              ))
            ) : (
              tests.map((test, i) => (
                <tr
                  key={test.id}
                  className={`border-b border-[var(--color-border-subtle)]/50 transition-colors hover:bg-[var(--color-surface)]/40 ${i % 2 === 0 ? "bg-[var(--color-card)]/30" : ""}`}
                >
                  <td className="py-3 text-[var(--color-secondary-text)] text-xs sm:text-sm">{formatDate(test.createdAt)}</td>
                  <td className="py-3 text-right text-[var(--color-secondary-text)]">{test.duration}s</td>
                  <td className="py-3 text-right text-[var(--color-text)]">{Math.round(test.wpm)}</td>
                  <td className="py-3 text-right text-[var(--color-text)]">{Math.round(test.accuracy * 10) / 10}%</td>
                  <td className="py-3 text-right text-[var(--color-secondary-text)] hidden md:table-cell">{test.correctChars}/{test.totalChars}</td>
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
                        <span className="text-[var(--color-muted)]">/</span>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                        >
                          no
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmId(test.id)}
                        className="text-[var(--color-muted)] hover:text-red-400 transition-colors cursor-pointer p-1"
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
            className="text-sm px-3 py-1.5 rounded text-[var(--color-secondary-text)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50 disabled:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            previous
          </button>
          <span className="text-xs text-[var(--color-secondary-text)]" style={{ fontFamily: "var(--font-mono)" }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="text-sm px-3 py-1.5 rounded text-[var(--color-secondary-text)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50 disabled:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}
