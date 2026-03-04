import { useState, useEffect } from "react";

interface FocusOverlayProps {
  isActive: boolean;
}

export function FocusOverlay({ isActive }: FocusOverlayProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setHidden(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (!hidden) return;

    const dismiss = () => setHidden(false);
    window.addEventListener("click", dismiss);
    window.addEventListener("keydown", dismiss);
    return () => {
      window.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [hidden]);

  if (!hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <p
        className="text-xl text-white/80"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {isActive ? "test paused — " : ""}click or press any key to refocus
      </p>
    </div>
  );
}
