interface StatsCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatsCard({ label, value, sublabel }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-6 py-5 transition-colors hover:border-zinc-700">
      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p
        className="text-3xl font-semibold text-gray-100"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-zinc-600 mt-1">{sublabel}</p>}
    </div>
  );
}
