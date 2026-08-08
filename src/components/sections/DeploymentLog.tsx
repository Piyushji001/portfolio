import { Fragment, useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { experience } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";

const PIPELINE_STAGES = [
  "COMMIT",
  "BUILD",
  "TEST",
  "PUSH GHCR",
  "DEPLOY",
  "HEALTH CHECK",
] as const;

/* SVG geometry */
const NODE_W = 148;
const NODE_H = 40;
const GAP = 32;
const VB_W = PIPELINE_STAGES.length * NODE_W + (PIPELINE_STAGES.length - 1) * GAP;
const VB_H = 60;
const MID = NODE_H / 2 + 8;

function nodeX(i: number) {
  return i * (NODE_W + GAP);
}

function Pipeline({ run }: { run: boolean }) {
  const reduced = useReducedMotion();
  const [passed, setPassed] = useState(reduced && run ? PIPELINE_STAGES.length : 0);
  const [progress, setProgress] = useState(reduced && run ? 1 : 0);
  const [elapsed, setElapsed] = useState(reduced && run ? 12 : 0);
  const lineStart = NODE_W / 2;
  const lineEnd = VB_W - NODE_W / 2;
  const lineLen = lineEnd - lineStart;

  useEffect(() => {
    if (!run) return;
    if (reduced) {
      setPassed(PIPELINE_STAGES.length);
      setProgress(1);
      setElapsed(12);
      return;
    }
    const controls = animate(0, 1, {
      duration: 12, // 12 seconds total execution time (realistic GitHub Actions pace)
      ease: "linear",
      onUpdate: (v) => {
        setProgress(v);
        setElapsed(Math.min(12, Number((v * 12).toFixed(1))));
        const x = lineStart + v * lineLen;
        let count = 0;
        for (let i = 0; i < PIPELINE_STAGES.length; i++) {
          if (x >= nodeX(i) + NODE_W / 2) count = i + 1;
        }
        if (v >= 1) count = PIPELINE_STAGES.length;
        setPassed(count);
      },
    });
    return () => controls.stop();
  }, [run, reduced, lineLen, lineStart]);

  const headX = lineStart + progress * lineLen;
  const done = progress >= 1;
  const currentStageIndex = Math.min(passed, PIPELINE_STAGES.length - 1);
  const activeStageName = done
    ? "ALL STEPS COMPLETED"
    : `STEP ${currentStageIndex + 1}/${PIPELINE_STAGES.length}: ${PIPELINE_STAGES[currentStageIndex]}`;

  return (
    <div className="mt-8 space-y-4">
      {/* GitHub Actions style status header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] type-data text-text-dim">
        <div className="flex items-center gap-2">
          <span className="text-text font-medium">deploy.yml #248</span>
          <span>·</span>
          <span className="text-text-dim">{activeStageName}</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span
            className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold"
            style={{
              backgroundColor: done
                ? "rgba(70,185,138,0.15)"
                : "rgba(242,169,59,0.15)",
              color: done ? "var(--ok)" : "var(--accent)",
              border: `1px solid ${done ? "var(--ok)" : "var(--accent)"}`,
            }}
          >
            {done ? "SUCCESS" : "IN PROGRESS"}
          </span>
          <span className="text-[11px] text-text-dim tabular-nums">
            {elapsed.toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          role="img"
          aria-label="CI/CD pipeline execution animation"
          style={{ minWidth: 680, display: "block" }}
        >
          {/* base connecting line */}
          <line
            x1={lineStart}
            y1={MID}
            x2={lineEnd}
            y2={MID}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
          {/* travelled segment */}
          <line
            x1={lineStart}
            y1={MID}
            x2={lineEnd}
            y2={MID}
            stroke="var(--ok)"
            strokeWidth={2}
            strokeDasharray={lineLen}
            strokeDashoffset={lineLen - progress * lineLen}
            opacity={0.7}
          />
          {/* accent travelling head */}
          {progress > 0 && !done && (
            <line
              x1={Math.max(lineStart, headX - 60)}
              y1={MID}
              x2={headX}
              y2={MID}
              stroke="var(--accent)"
              strokeWidth={2}
            />
          )}

          {PIPELINE_STAGES.map((stage, i) => {
            const x = nodeX(i);
            const isPassed = i < passed;
            const isActive = !isPassed && progress > 0 && headX >= x && !done;
            const border = isPassed
              ? "var(--ok)"
              : isActive
                ? "var(--accent)"
                : "var(--hairline)";

            return (
              <Fragment key={stage}>
                <rect
                  x={x}
                  y={8}
                  width={NODE_W}
                  height={NODE_H}
                  rx={4}
                  fill="var(--surface)"
                  stroke={border}
                  strokeWidth={isActive ? 1.5 : 1}
                />
                <text
                  x={x + NODE_W / 2}
                  y={MID + 3.5}
                  textAnchor="middle"
                  fill={
                    isPassed
                      ? "var(--ok)"
                      : isActive
                        ? "var(--accent)"
                        : "var(--text-dim)"
                  }
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: isPassed || isActive ? 600 : 400,
                    letterSpacing: "0.14em",
                  }}
                >
                  {isPassed ? `✓ ${stage}` : stage}
                </text>
              </Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/** Wrap numeric tokens (60%, 300+, 4) in an accent span. */
function highlightNumbers(text: string) {
  const parts = text.split(/(~?\d[\d,.]*\s*(?:%|\+|x)?)/g);
  return parts.map((part, i) =>
    /^~?\d/.test(part) ? (
      <span
        key={i}
        style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}
      >
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function DeploymentLog() {
  const { ref, revealed, className } = useReveal<HTMLDivElement>();

  return (
    <section id="log" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">03 / DEPLOYMENT LOG</h2>

        <Pipeline run={revealed} />

        <div className="mt-16">
          {experience.map((job, i) => (
            <div
              key={`${job.company}-${job.role}`}
              className="flex flex-col gap-6 min-[820px]:flex-row min-[820px]:gap-10"
              style={{
                paddingTop: i === 0 ? 0 : 48,
                paddingBottom: 48,
                borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
              }}
            >
              <div className="min-[820px]:w-[120px] min-[820px]:shrink-0">
                <div className="type-data text-[12px] text-text-dim">
                  {job.start} —
                  <br className="hidden min-[820px]:block" /> {job.end}
                </div>
                {job.current && (
                  <span
                    className="type-data mt-3 inline-block text-[10px] tracking-[0.16em]"
                    style={{
                      color: "var(--ok)",
                      border: "1px solid var(--ok)",
                      borderRadius: 4,
                      padding: "2px 8px",
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="type-data text-[22px] text-text"
                  style={{ fontWeight: 500, lineHeight: 1.2 }}
                >
                  {job.role}
                </h3>
                <p className="type-data mt-1 text-[14px] text-text-dim">
                  {job.company}
                </p>

                <ul className="mt-6 flex flex-col gap-4">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="text-text-dim"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 16,
                        lineHeight: 1.6,
                        borderLeft: "1px solid var(--hairline)",
                        paddingLeft: 16,
                        maxWidth: "72ch",
                      }}
                    >
                      {highlightNumbers(point)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
