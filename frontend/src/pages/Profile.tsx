import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useProfile } from "../hooks/useProfile.ts";
import { StatsGrid } from "../components/profile/StatsGrid.tsx";
import { TestHistory } from "../components/profile/TestHistory.tsx";
import { formatDate } from "../utils/formatDate.ts";
import { env } from "../config/env.ts";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function StatsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] px-6 py-5">
          <div className="h-3 w-20 bg-[var(--color-skeleton)] rounded animate-skeleton mb-3" />
          <div className="h-8 w-16 bg-[var(--color-skeleton)] rounded animate-skeleton" />
        </div>
      ))}
    </div>
  );
}

function UsernameEditor({ current, onSave }: { current: string; onSave: (name: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!USERNAME_REGEX.test(trimmed)) {
      setError("3-20 characters, letters, numbers, underscores only");
      return;
    }
    if (trimmed === current) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(trimmed);
      setEditing(false);
    } catch (e) {
      setError((e as Error).message || "Username taken");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {current}
        </h1>
        <button
          onClick={() => { setValue(current); setEditing(true); setError(""); }}
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-secondary-text)] transition-colors cursor-pointer"
        >
          edit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          autoFocus
          maxLength={20}
          className="text-xl font-semibold text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-1 outline-none focus:border-[var(--color-primary)]/50 transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "..." : "save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-secondary-text)] transition-colors cursor-pointer"
        >
          cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Profile() {
  const { user } = useAuth();
  const { stats, tests, pagination, isLoading, error, changePage, deleteTest, updateUsername } = useProfile();
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetError("");
    try {
      const res = await fetch(`https://${env.AUTH0_DOMAIN}/dbconnections/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.AUTH0_CLIENT_ID,
          email: user.email,
          connection: "Username-Password-Authentication",
        }),
      });
      if (!res.ok) throw new Error("Failed to send reset email");
      setResetSent(true);
    } catch {
      setResetError("Failed to send reset email");
    }
  };

  if (error && !stats && tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400/80 text-sm" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-4 py-1.5 rounded bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
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
        {user?.username && (
          <UsernameEditor current={user.username} onSave={updateUsername} />
        )}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-[var(--color-secondary-text)]">
          <span>{user?.email}</span>
          {user?.createdAt && <span>joined {formatDate(user.createdAt)}</span>}
        </div>
      </div>

      {isLoading && !stats ? <StatsSkeletonGrid /> : stats && <StatsGrid stats={stats} />}

      <div className="rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] px-6 py-5">
        <h2 className="text-sm font-medium text-[var(--color-secondary-text)] mb-4" style={{ fontFamily: "var(--font-mono)" }}>
          security settings
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePasswordReset}
              disabled={resetSent}
              className="text-sm px-4 py-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {resetSent ? "reset email sent" : "change password"}
            </button>
            {resetError && <span className="text-xs text-red-400">{resetError}</span>}
            {resetSent && <span className="text-xs text-[var(--color-accent)]">check your email</span>}
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            email changes: contact support
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-4" style={{ fontFamily: "var(--font-mono)" }}>
          test history
        </h2>
        <TestHistory
          tests={tests}
          pagination={pagination}
          onPageChange={changePage}
          onDelete={deleteTest}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
