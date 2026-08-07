import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { incident } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- chart ---------------- */

const CH_W = 1000;
const CH_H = 260;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 26;
const PAD_B = 26;
const Y_MAX = 320;
const GRIDLINES = [0, 100, 200, 300];

const SERIES = incident.curve;
const PEAK_INDEX = 5;

function sx(t: number) {
  return PAD_L + t * (CH_W - PAD_L - PAD_R);
}
function sy(v: number) {
  return CH_H - PAD_B - (v / Y_MAX) * (CH_H - PAD_T - PAD_B);
}

type Pt = { x: number; y: number };

/** Catmull-Rom → cubic bezier smoothing. */
function smoothPath(pts: Pt[]) {
  const at = (i: number): Pt => pts[Math.min(Math.max(i, 0), pts.length - 1)] as Pt;
  let d = `M ${at(0).x} ${at(0).y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function IncidentChart({ run }: { run: boolean }) {
  const reduced = useReducedMotion();
  const { line, area, peak } = useMemo(() => {
    const pts: Pt[] = SERIES.map(([t, v]) => ({ x: sx(t), y: sy(v) }));
    const line = smoothPath(pts);
    const first = pts[0] as Pt;
    const last = pts[pts.length - 1] as Pt;
    const area = `${line} L ${last.x} ${sy(0)} L ${first.x} ${sy(0)} Z`;
    return { line, area, peak: pts[PEAK_INDEX] as Pt };
  }, []);


  return (
    <>
      <svg
        viewBox={`0 0 ${CH_W} ${CH_H}`}
        width="100%"
        role="img"
        aria-label="Unauthorised instance count over the four-hour incident window, peaking above 300"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <clipPath id="incident-wipe">
            <motion.rect
              x={PAD_L}
              y={0}
              height={CH_H}
              initial={{ width: reduced ? CH_W : 0 }}
              animate={{ width: run ? CH_W : reduced ? CH_W : 0 }}
              transition={{ duration: reduced ? 0 : 2.2, ease: EASE }}
            />
          </clipPath>
        </defs>

        {GRIDLINES.map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              x2={CH_W - PAD_R}
              y1={sy(v)}
              y2={sy(v)}
              stroke="var(--hairline)"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 10}
              y={sy(v) + 3.5}
              textAnchor="end"
              fill="var(--text-dim)"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            >
              {v}
            </text>
          </g>
        ))}

        <g clipPath="url(#incident-wipe)">
          <path d={area} fill="var(--crit)" fillOpacity={0.08} stroke="none" />
        </g>

        <motion.path
          d={line}
          fill="none"
          stroke="var(--crit)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: run || reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 2.2, ease: EASE }}
        />

        <motion.g
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: run || reduced ? 1 : 0 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 1.1, ease: EASE }}
        >
          <circle cx={peak.x} cy={peak.y} r={3.5} fill="var(--crit)" />
          <text
            x={peak.x + 12}
            y={peak.y - 8}
            fill="var(--crit)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
          >
            300+ instances
          </text>
        </motion.g>

        {/* axis */}
        <line
          x1={PAD_L}
          x2={CH_W - PAD_R}
          y1={sy(0)}
          y2={sy(0)}
          stroke="var(--hairline)"
          strokeWidth={1}
        />
        <text
          x={PAD_L}
          y={CH_H - 4}
          fill="var(--text-dim)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
        >
          T+00:00
        </text>
        <text
          x={CH_W - PAD_R}
          y={CH_H - 4}
          textAnchor="end"
          fill="var(--text-dim)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
        >
          T+04:00
        </text>
      </svg>
    </>
  );
}
