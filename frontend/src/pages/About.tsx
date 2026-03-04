export function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-100 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="text-[#e2e8f0]">about </span>
            <span className="text-[#e2e8f0]">type</span>
            <span className="text-[#ef4444] text-4xl font-bold">シ</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto" style={{ fontFamily: "var(--font-mono)" }}>
            TypeShi is a web-based typing performance application designed to help users improve their typing speed and accuracy.
            Built as a semester project for CS 3354.009 — Software Engineering at the University of Texas at Dallas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#141414] border border-[#1a1a1a] px-6 py-5">
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              frontend
            </h3>
            <ul className="flex flex-col gap-1.5 text-sm text-zinc-300" style={{ fontFamily: "var(--font-mono)" }}>
              <li>Daniel Yoo</li>
              <li>Phuc Trinh</li>
              <li>Adrian Trang</li>
            </ul>
          </div>
          <div className="rounded-lg bg-[#141414] border border-[#1a1a1a] px-6 py-5">
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              backend
            </h3>
            <ul className="flex flex-col gap-1.5 text-sm text-zinc-300" style={{ fontFamily: "var(--font-mono)" }}>
              <li>Ahmad Zahid</li>
              <li>Hunter Woodworth</li>
              <li>Karthik Yammanur</li>
            </ul>
          </div>
        </div>

        <div className="text-center flex flex-col gap-1 text-sm text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
          <span>Professor Priya Narayanasami</span>
          <span>Spring 2026</span>
        </div>
      </div>
    </div>
  );
}
