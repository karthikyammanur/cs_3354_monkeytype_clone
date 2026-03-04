import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import { useTheme } from "../../hooks/useTheme.ts";
import { useSoundEnabled } from "../../hooks/useSound.ts";

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useSoundEnabled();
  const [soundOn, setSoundOn] = useState(soundEnabled);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      navigate("/", { replace: true, state: { restart: Date.now() } });
    }
  };

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-[var(--color-nav-bg)] backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="shrink-0 hover:opacity-80 transition-opacity flex items-baseline gap-0">
          <span className="text-xl font-semibold text-[var(--color-logo-type)]" style={{ fontFamily: "var(--font-mono)" }}>type</span>
          <span className="text-2xl font-bold text-[var(--color-logo-shi)]">シ</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleSoundToggle}
            className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors cursor-pointer p-1"
            title={soundOn ? "Mute sounds" : "Enable sounds"}
          >
            {soundOn ? "\u{1F50A}" : "\u{1F507}"}
          </button>
          <button
            onClick={toggleTheme}
            className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors cursor-pointer p-1"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "\u2600" : "\u263D"}
          </button>
          <Link
            to="/about"
            className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors"
          >
            about
          </Link>
          {isLoading ? (
            <span className="text-sm text-[var(--color-secondary-text)]">...</span>
          ) : isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors truncate max-w-[120px] sm:max-w-[200px]"
              >
                {user?.username ?? "Profile"}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors cursor-pointer min-h-[44px] px-1"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={register}
                className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors cursor-pointer min-h-[44px] px-1"
              >
                register
              </button>
              <button
                onClick={login}
                className="text-sm px-4 py-1.5 min-h-[44px] rounded bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)] transition-colors cursor-pointer"
              >
                login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
