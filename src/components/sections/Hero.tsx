import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/content";
import { useUptime } from "@/hooks/use-uptime";

const EASE = [0.16, 1, 0.3, 1] as const;

const BOOT_LINES = [
  "> initialising control plane...",
  "> loading profile: piyush.sharma",
  "> status: OK",
];

const HERO_COPY = {
  name: profile.name.toUpperCase(),
  role: profile.role.toUpperCase(),
  disciplines: "KUBERNETES · CI/CD · DEVSECOPS · OBSERVABILITY",
  status: "ALL SYSTEMS OPERATIONAL",
  primary: "VIEW WORK",
  secondary: "RESUME.PDF",
};

function UptimeCounter() {
  const value = useUptime();

  return (
    <span className="type-data text-[12px] tracking-[0.1em] text-text-dim">
      {value ?? "UPTIME --"}
    </span>
  );
}

/** Stage 0 = boot log, 1 = name, 2 = meta, 3 = status, 4 = actions */
function useBootSequence(instant: boolean) {
  const [bootCount, setBootCount] = useState(instant ? BOOT_LINES.length : 0);
  const [stage, setStage] = useState(instant ? 4 : 0);

  useEffect(() => {
    if (instant) return;
    const timers: number[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setBootCount(i + 1), 120 * (i + 1)),
      );
    });

    timers.push(window.setTimeout(() => setStage(1), 720));
    timers.push(window.setTimeout(() => setStage(2), 900));
    timers.push(window.setTimeout(() => setStage(3), 1100));
    timers.push(window.setTimeout(() => setStage(4), 1300));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [instant]);

  return { bootCount, stage };
}

export function Hero() {
  const reduced = useReducedMotion();
  const instant = Boolean(reduced);
  const { bootCount, stage } = useBootSequence(instant);
  const visibleLines = useMemo(
    () => BOOT_LINES.slice(0, bootCount),
    [bootCount],
  );

  const snap = instant
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14, scaleY: 0.86 },
        animate: { opacity: 1, y: 0, scaleY: 1 },
        transition: { duration: 0.32, ease: EASE },
      };

  const fade = (delay = 0) =>
    instant
      ? { initial: false as const, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE, delay },
        };

  return (
    <section
      id="hero"
      className="flex min-h-dvh flex-col justify-center py-24"
    >
      <div className="w-full">
        {/* Boot log — collapses upward once complete */}
        <AnimatePresence initial={false}>
          {stage === 0 && (
            <motion.div
              key="bootlog"
              className="type-data space-y-1 text-[13px] text-text-dim"
              exit={
                instant
                  ? { opacity: 0 }
                  : { opacity: 0, y: -18, height: 0, transition: { duration: 0.34, ease: EASE } }
              }
            >
              {visibleLines.map((line) => (
                <div key={line} className="flex items-baseline gap-2">
                  <span style={{ color: "var(--ok)" }}>✓</span>
                  <span>{line}</span>
                </div>
              ))}
              {visibleLines.length === 0 && (
                <div className="h-[13px]" aria-hidden="true" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {stage >= 1 && (
          <motion.h1
            {...snap}
            className="type-display uppercase text-text"
            style={{ transformOrigin: "left bottom" }}
          >
            {HERO_COPY.name}
          </motion.h1>
        )}

        {stage >= 2 && (
          <motion.div
            {...fade()}
            className="type-data mt-6 flex flex-wrap items-center gap-3 text-[15px] font-medium tracking-[0.14em] uppercase"
          >
            <span className="text-text">{HERO_COPY.role}</span>
            <span
              aria-hidden="true"
              className="inline-block h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--hairline)" }}
            />
            <span className="text-text-dim">{HERO_COPY.disciplines}</span>
          </motion.div>
        )}

        {stage >= 3 && (
          <motion.div
            {...fade()}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="pulse-dot inline-block h-[6px] w-[6px] rounded-full"
                style={{ backgroundColor: "var(--ok)" }}
              />
              <span className="type-data text-[12px] tracking-[0.14em] uppercase text-text">
                {HERO_COPY.status}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hidden h-4 w-px sm:block"
              style={{ backgroundColor: "var(--hairline)" }}
            />
            <UptimeCounter />
          </motion.div>
        )}

        {stage >= 4 && (
          <motion.div {...fade()} className="mt-10 flex flex-wrap gap-3">
            <a
              href="#architecture"
              className="type-data hover-glow inline-flex items-center rounded-sm border px-5 py-3 text-[13px] tracking-[0.1em] uppercase transition-colors duration-300"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                backgroundColor: "transparent",
                borderRadius: "4px",
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              {HERO_COPY.primary}
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="type-data hover-glow inline-flex items-center border px-5 py-3 text-[13px] tracking-[0.1em] uppercase transition-colors duration-300"
              style={{
                borderColor: "var(--hairline)",
                color: "var(--text-dim)",
                borderRadius: "4px",
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--text-dim)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--hairline)";
                e.currentTarget.style.color = "var(--text-dim)";
              }}
            >
              {HERO_COPY.secondary}
            </a>
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="type-data hover-glow inline-flex items-center border px-5 py-3 text-[13px] tracking-[0.1em] uppercase transition-colors duration-300"
                style={{
                  borderColor: "var(--hairline)",
                  color: "var(--text-dim)",
                  borderRadius: "4px",
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-dim)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hairline)";
                  e.currentTarget.style.color = "var(--text-dim)";
                }}
              >
                LINKEDIN
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="type-data hover-glow inline-flex items-center border px-5 py-3 text-[13px] tracking-[0.1em] uppercase transition-colors duration-300"
                style={{
                  borderColor: "var(--hairline)",
                  color: "var(--text-dim)",
                  borderRadius: "4px",
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-dim)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hairline)";
                  e.currentTarget.style.color = "var(--text-dim)";
                }}
              >
                GITHUB
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
