import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

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
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Precision Target Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{
          border: `1.5px solid ${isHovered ? "var(--accent)" : "rgba(242, 169, 59, 0.6)"}`,
          backgroundColor: isHovered ? "rgba(242, 169, 59, 0.25)" : "rgba(242, 169, 59, 0.08)",
        }}
        animate={{
          x: pos.x - (isHovered ? 20 : 14),
          y: pos.y - (isHovered ? 20 : 14),
          width: isHovered ? 40 : 28,
          height: isHovered ? 40 : 28,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 0.3,
        }}
      />

      {/* Inner Precision Crosshair Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{
          backgroundColor: "var(--accent)",
        }}
        animate={{
          x: pos.x - (isHovered ? 4 : 3),
          y: pos.y - (isHovered ? 4 : 3),
          width: isHovered ? 8 : 6,
          height: isHovered ? 8 : 6,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 700,
          mass: 0.1,
        }}
      />
    </>
  );
}
