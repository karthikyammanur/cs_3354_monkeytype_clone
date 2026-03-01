// 404 page
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-semibold text-gray-600">404</h1>
      <p className="text-gray-400 text-lg">Page not found</p>
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline">
        back to home
      </Link>
    </div>
  );
}
