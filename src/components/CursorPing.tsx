import { useEffect, useReducer, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** One ping instance */
type Ping = { id: number; x: number; y: number };

let _nextId = 0;

/**
 * CursorPing — on every mouse click, fires an amber "radar ping":
 * a single ring that expands from 0 → 80px and fades out over 600ms.
 * Fits the control-plane aesthetic (sonar / network signal), not water ripple.
 * Fully disabled under prefers-reduced-motion.
 */
export function CursorPing() {
  const reduced = useReducedMotion();
  const [pings, dispatch] = useReducer(
    (state: Ping[], action: { type: "add"; ping: Ping } | { type: "remove"; id: number }) => {
      if (action.type === "add") return [...state, action.ping];
      return state.filter((p) => p.id !== action.id);
    },
    [],
  );

  const timerRefs = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      const id = _nextId++;
      const ping: Ping = { id, x: e.clientX, y: e.clientY };
      dispatch({ type: "add", ping });

      // Auto-remove after animation completes (650ms)
      const timer = window.setTimeout(() => {
        dispatch({ type: "remove", id });
        timerRefs.current.delete(id);
      }, 650);
      timerRefs.current.set(id, timer);
    };

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      timerRefs.current.forEach((t) => clearTimeout(t));
      timerRefs.current.clear();
    };
  }, [reduced]);

  if (reduced || pings.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 9999 }}>
      {pings.map((ping) => (
        <PingRing key={ping.id} x={ping.x} y={ping.y} />
      ))}
    </div>
  );
}

function PingRing({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="ping-ring"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
