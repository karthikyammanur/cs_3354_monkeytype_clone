import { useAuth } from "../hooks/useAuth.ts";
import { useProfile } from "../hooks/useProfile.ts";
import { StatsGrid } from "../components/profile/StatsGrid.tsx";
import { TestHistory } from "../components/profile/TestHistory.tsx";
import { formatDate } from "../utils/formatDate.ts";

function StatsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-6 py-5">
          <div className="h-3 w-20 bg-zinc-800 rounded animate-skeleton mb-3" />
          <div className="h-8 w-16 bg-zinc-800 rounded animate-skeleton" />
        </div>
      ))}
    </div>
  );
}

export function Profile() {
  const { user } = useAuth();
  const { stats, tests, pagination, isLoading, error, changePage } = useProfile();

  if (error && !stats && tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400/80 text-sm" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-4 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-gray-100"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {user?.username}
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-zinc-500">
          <span>{user?.email}</span>
          {user?.createdAt && <span>joined {formatDate(user.createdAt)}</span>}
        </div>
      </div>

      {isLoading && !stats ? <StatsSkeletonGrid /> : stats && <StatsGrid stats={stats} />}

      <div>
        <h2 className="text-lg font-medium text-gray-200 mb-4" style={{ fontFamily: "var(--font-mono)" }}>
          test history
        </h2>
        <TestHistory
          tests={tests}
          pagination={pagination}
          onPageChange={changePage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
