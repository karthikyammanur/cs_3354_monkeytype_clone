import { StatsCard } from "./StatsCard.tsx";
import type { TestStats } from "../../types/index.ts";

interface StatsGridProps {
  stats: TestStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard label="Average WPM" value={Math.round(stats.avgWpm)} />
      <StatsCard label="Best WPM" value={Math.round(stats.bestWpm)} />
      <StatsCard label="Tests Taken" value={stats.totalTests} />
      <StatsCard label="Avg Accuracy" value={`${Math.round(stats.avgAccuracy * 10) / 10}%`} />
    </div>
  );
}
