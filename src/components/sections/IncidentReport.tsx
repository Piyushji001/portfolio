import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { incident } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";

/** Lazy: the chart only mounts once the section has been reached. */
const IncidentChart = lazy(() =>
  import("@/components/sections/IncidentChart").then((m) => ({ default: m.IncidentChart })),
);

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- theme flip ---------------- */

function useThemeFlip(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          document.documentElement.classList.toggle(
            "theme-incident",
            entry.isIntersecting,
          );
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("theme-incident");
    };
  }, [enabled]);

  return ref;
}

/* ---------------- count-up metric ---------------- */

function CountUp({
  raw,
  run,
}: {
  raw: string;   // e.g. "300+", "4 hours", "$1,000", "~All"
  run: boolean;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("0");
  const ref = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!run) return;

    // Parse numeric part
    const match = raw.replace(/,/g, "").match(/(\d+)/);
    if (!match) {
      setDisplay(raw); // e.g. "~All"
      return;
    }
    if (reduced) {
      setDisplay(raw);
      return;
    }

    const target = parseInt(match[1], 10);
    const prefix = raw.startsWith("$") ? "$" : raw.startsWith("~") ? "~" : "";
    const suffix = raw.endsWith("+") ? "+" : raw.includes("hour") ? " hours" : "";

    ref.current = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        const formatted = Math.round(v).toLocaleString();
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
      onComplete() {
        setDisplay(raw);
      },
    });

    return () => ref.current?.stop();
  }, [run, raw, reduced]);

  return <>{display}</>;
}

/* ---------------- timeline ---------------- */

const STATE_COLOR: Record<string, string> = {
  detected: "var(--crit)",
  contained: "var(--crit)",
  mitigated: "var(--warn)",
  resolved: "var(--ok)",
};

const STEP = 0.4;

function Timeline({ run }: { run: boolean }) {
  const reduced = useReducedMotion();
  const nodes = incident.timeline;
  const n = nodes.length;

  return (
    <div className="mt-16">
      <div className="relative flex flex-col gap-10 md:flex-row md:gap-0">
        {/* connecting line (desktop) */}
        <svg
          className="pointer-events-none absolute hidden md:block"
          style={{ left: 0, right: 0, top: 26, width: "100%", height: 2 }}
          viewBox={`0 0 ${n * 100} 2`}
          preserveAspectRatio="none"
        >
          <line
            x1={50}
            x2={n * 100 - 50}
            y1={1}
            y2={1}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
          {nodes.slice(1).map((node, i) => (
            <motion.line
              key={node.t}
              x1={50 + i * 100}
              x2={150 + i * 100}
              y1={1}
              y2={1}
              stroke={STATE_COLOR[node.state]}
              strokeWidth={1}
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: run || reduced ? 1 : 0 }}
              transition={{
                duration: reduced ? 0 : STEP,
                delay: reduced ? 0 : (i + 1) * STEP - STEP,
                ease: "linear",
              }}
            />
          ))}
        </svg>

        {nodes.map((node, i) => {
          const color = STATE_COLOR[node.state];
          return (
            <div key={`${node.t}-${i}`} className="relative flex-1 min-w-0 pr-6">
              <p className="type-data text-[11px] text-text-dim">{node.t}</p>
              <motion.div
                className="mt-3"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: color,
                }}
                initial={{ opacity: reduced ? 1 : 0.15, scale: 1 }}
                animate={{
                  opacity: run || reduced ? 1 : 0.15,
                  scale: run || reduced ? [0.6, 1.6, 1] : 1,
                }}
                transition={{
                  duration: reduced ? 0 : 0.45,
                  delay: reduced ? 0 : i * STEP,
                  ease: EASE,
                }}
              />
              <p
                className="mt-4 text-text-dim"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  maxWidth: 180,
                }}
              >
                {node.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- badge ---------------- */

function SeverityBadge({ resolved }: { resolved: boolean }) {
  return (
    <div className="relative h-[24px] min-w-[92px]">
      <motion.span
        className="type-data absolute right-0 top-0 text-[11px] uppercase tracking-[0.16em]"
        style={{
          color: "var(--crit)",
          border: "1px solid var(--crit)",
          borderRadius: 4,
          padding: "4px 10px",
        }}
        animate={
          resolved
            ? { opacity: 0 }
            : { opacity: 1, borderColor: ["rgba(224,85,90,1)", "rgba(224,85,90,0.3)", "rgba(224,85,90,1)"] }
        }
        transition={
          resolved
            ? { duration: 0.6, ease: EASE }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {incident.severity}
      </motion.span>
      <motion.span
        className="type-data absolute right-0 top-0 text-[11px] uppercase tracking-[0.16em]"
        style={{
          color: "var(--ok)",
          border: "1px solid var(--ok)",
          borderRadius: 4,
          padding: "4px 10px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: resolved ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        RESOLVED
      </motion.span>
    </div>
  );
}

/* ---------------- section ---------------- */

export function IncidentReport() {
  const reduced = useReducedMotion();
  const { ref, revealed, className } = useReveal<HTMLDivElement>();
  const sectionRef = useThemeFlip(!reduced);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    if (reduced) {
      setResolved(true);
      return;
    }
    const delay = (incident.timeline.length - 1) * STEP * 1000 + 500;
    const id = window.setTimeout(() => setResolved(true), delay);
    return () => window.clearTimeout(id);
  }, [revealed, reduced]);

  return (
    <section
      id="incident"
      ref={sectionRef}
      className={`scroll-mt-24 border-t border-hairline py-24 ${reduced ? "theme-incident" : ""}`}
    >
      <div ref={ref} className={className}>
        <div className="flex items-start justify-between gap-6">
          <h2 className="type-eyebrow">04 / INCIDENT REPORT</h2>
          <SeverityBadge resolved={resolved} />
        </div>

        {/* Incident ID with blinking terminal cursor */}
        <p className="type-data mt-8 text-[12px] text-text-dim">
          {incident.id}
          <motion.span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 1,
              height: "1em",
              backgroundColor: "var(--crit)",
              marginLeft: 3,
              verticalAlign: "middle",
            }}
            animate={resolved ? { opacity: 0 } : { opacity: [1, 0, 1] }}
            transition={
              resolved
                ? { duration: 0.4 }
                : { duration: 1.1, repeat: Infinity, ease: "steps(1)" }
            }
          />
        </p>
        <p className="type-section mt-3 text-text">{incident.title}</p>
        <p
          className="mt-6 text-text-dim"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 17,
            lineHeight: 1.65,
            maxWidth: "62ch",
          }}
        >
          {incident.summary}
        </p>

        <div className="mt-12">
          {revealed ? (
            <Suspense fallback={<div style={{ height: 260 }} aria-hidden="true" />}>
              <IncidentChart run={revealed} />
            </Suspense>
          ) : (
            <div style={{ height: 260 }} aria-hidden="true" />
          )}
        </div>
        <Timeline run={revealed} />

        {/* impact strip — animated count-up */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0 md:grid-cols-4">
          {incident.impact.map((item) => (
            <div
              key={item.label}
              className="border-hairline pl-6 sm:py-6 md:py-0 border-l max-sm:border-l-0 max-sm:pl-0 first:border-l-0 first:pl-0 sm:[&:nth-child(3)]:border-l-0 sm:[&:nth-child(3)]:pl-0 md:[&:nth-child(3)]:border-l md:[&:nth-child(3)]:pl-6"
            >
              <div
                className="text-text"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "clamp(24px, 6vw, 36px)",
                  lineHeight: 1.1,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                <CountUp raw={item.value} run={revealed} />
              </div>
              <div className="type-data mt-2 text-[11px] uppercase tracking-[0.14em] text-text-dim">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* follow-up — border transitions crit → ok as incident resolves */}
        <div className="mt-20">
          <p className="type-eyebrow">FOLLOW-UP ACTIONS</p>
          <motion.p
            className="mt-5 text-text-dim"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.65,
              borderLeft: "2px solid",
              paddingLeft: 20,
              maxWidth: "68ch",
            }}
            animate={{
              borderColor: resolved ? "var(--ok)" : "var(--crit)",
            }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            {incident.followUp}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
