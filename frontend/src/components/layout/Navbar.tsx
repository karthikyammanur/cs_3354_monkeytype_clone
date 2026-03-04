import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      navigate("/", { replace: true, state: { restart: Date.now() } });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-[#0d0d0d]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="shrink-0 hover:opacity-80 transition-opacity flex items-baseline gap-0">
          <span className="text-xl font-semibold text-[#e2e8f0]" style={{ fontFamily: "var(--font-mono)" }}>type</span>
          <span className="text-2xl font-bold text-[#ef4444]">シ</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/about"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            about
          </Link>
          {isLoading ? (
            <span className="text-sm text-gray-500">...</span>
          ) : isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
              >
                {user?.username ?? "Profile"}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer min-h-[44px] px-1"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={register}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer min-h-[44px] px-1"
              >
                register
              </button>
              <button
                onClick={login}
                className="text-sm px-4 py-1.5 min-h-[44px] rounded bg-[#1a1a1a] text-gray-200 hover:bg-[#252525] active:bg-[#2a2a2a] transition-colors cursor-pointer"
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
