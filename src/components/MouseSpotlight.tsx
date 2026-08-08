import { useEffect, useRef, useState } from "react";

export function MouseSpotlight() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isIncident, setIsIncident] = useState(false);
  const smoothPos = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      smoothPos.current = { x: e.clientX, y: e.clientY };
      if (!pos) setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseLeave = () => {
      smoothPos.current = null;
      setPos(null);
    };

    const animate = () => {
      if (smoothPos.current) {
        setPos((prev) => {
          if (!prev) return smoothPos.current;
          return {
            x: prev.x + (smoothPos.current!.x - prev.x) * 0.12,
            y: prev.y + (smoothPos.current!.y - prev.y) * 0.12,
          };
        });
      }
      raf.current = requestAnimationFrame(animate);
    };

    const checkTheme = () => {
      setIsIncident(document.documentElement.classList.contains("theme-incident"));
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    checkTheme();

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, [pos]);

  if (!pos) return null;

  const color = isIncident ? "224, 85, 90" : "242, 169, 59";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1 }}
    >
      <div
        className="absolute"
        style={{
          left: pos.x,
          top: pos.y,
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          background: `
            radial-gradient(circle, rgba(${color}, 0.07) 0%, transparent 50%),
            radial-gradient(circle, rgba(${color}, 0.04) 25%, transparent 70%)
          `,
        }}
      />
      <div
        className="absolute"
        style={{
          left: pos.x,
          top: pos.y,
          width: 240,
          height: 240,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(${color}, 0.12) 0%, transparent 65%)`,
        }}
      />
    </div>
  );
}
