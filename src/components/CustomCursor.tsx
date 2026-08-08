import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;

    // Check if device supports fine hover (mouse)
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasHover) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = Boolean(
        target.closest("a, button, input, textarea, [tabindex='0'], [role='button']")
      );
      setIsHovered(interactive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [reduced, isVisible]);

  if (reduced || !isVisible) return null;

  return (
    <>
      {/* Outer Precision Target Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{
          border: `1px solid ${isHovered ? "var(--accent)" : "var(--hairline)"}`,
          backgroundColor: isHovered ? "rgba(242, 169, 59, 0.08)" : "transparent",
        }}
        animate={{
          x: pos.x - (isHovered ? 18 : 12),
          y: pos.y - (isHovered ? 18 : 12),
          width: isHovered ? 36 : 24,
          height: isHovered ? 36 : 24,
        }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 350,
          mass: 0.4,
        }}
      />

      {/* Inner Precision Crosshair Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{
          backgroundColor: isHovered ? "var(--accent)" : "var(--fg)",
        }}
        animate={{
          x: pos.x - (isHovered ? 3 : 2),
          y: pos.y - (isHovered ? 3 : 2),
          width: isHovered ? 6 : 4,
          height: isHovered ? 6 : 4,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 600,
          mass: 0.1,
        }}
      />
    </>
  );
}
