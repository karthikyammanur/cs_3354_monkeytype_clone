import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-[#0d0d0d]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <img src="/typeshi_logo.jpg" alt="TypeShi" className="h-9 rounded-sm border border-[#2a2520]/40" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
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
