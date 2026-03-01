// Shell layout with navbar and content area
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.tsx";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
