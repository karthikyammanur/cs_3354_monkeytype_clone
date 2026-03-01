import { useAuth } from "../hooks/useAuth.ts";
import { useProfile } from "../hooks/useProfile.ts";
import { StatsGrid } from "../components/profile/StatsGrid.tsx";
import { TestHistory } from "../components/profile/TestHistory.tsx";
import { formatDate } from "../utils/formatDate.ts";

export function Profile() {
  const { user } = useAuth();
  const { stats, tests, pagination, isLoading, error, changePage } = useProfile();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-semibold text-gray-100"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {user?.username}
        </h1>
        <div className="flex gap-4 text-sm text-zinc-500">
          <span>{user?.email}</span>
          {user?.createdAt && <span>joined {formatDate(user.createdAt)}</span>}
        </div>
      </div>

      {stats && <StatsGrid stats={stats} />}

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
