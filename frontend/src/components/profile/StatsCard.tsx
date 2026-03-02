interface StatsCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatsCard({ label, value, sublabel }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-[#141414] border border-[#1a1a1a] px-6 py-5 transition-colors hover:border-[#2a2520]">
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
