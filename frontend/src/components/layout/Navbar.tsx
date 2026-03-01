// Top navigation bar
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-[#1a1a2e]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gray-100 hover:text-white transition-colors">
          TypeShi
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-gray-500">...</span>
          ) : isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                {user?.username ?? "Profile"}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={register}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                register
              </button>
              <button
                onClick={login}
                className="text-sm px-4 py-1.5 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
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
