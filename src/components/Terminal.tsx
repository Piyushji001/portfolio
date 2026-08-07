import { Suspense, lazy, useEffect, useState } from "react";

/** Lazy: the terminal only loads the first time it is opened. */
const TerminalPanel = lazy(() =>
  import("@/components/TerminalPanel").then((m) => ({ default: m.TerminalPanel })),
);

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "~" && !typing) {
        e.preventDefault();
        setMounted(true);
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <TerminalPanel open={open} onClose={() => setOpen(false)} />
    </Suspense>
  );
}
