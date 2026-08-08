import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function MouseSpotlight() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (reduced) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseLeave = () => setPos(null);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reduced]);

  if (reduced || !pos) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-500"
      style={{
        background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, rgba(242, 169, 59, 0.06), transparent 75%)`,
      }}
    />
  );
}
