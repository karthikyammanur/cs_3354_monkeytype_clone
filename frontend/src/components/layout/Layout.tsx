import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.tsx";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-20 pb-12">
        <Outlet />
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
          TypeShi — CS 3354.009 Group 09
        </p>
      </footer>
    </div>
  );
}
