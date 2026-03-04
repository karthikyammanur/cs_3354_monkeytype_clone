interface StatsCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatsCard({ label, value, sublabel }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] px-6 py-5 transition-colors hover:border-[var(--color-border)]">
      <p className="text-xs uppercase tracking-wider text-[var(--color-secondary-text)] mb-1">{label}</p>
      <p
        className="text-3xl font-semibold text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-[var(--color-muted)] mt-1">{sublabel}</p>}
    </div>
  );
}
