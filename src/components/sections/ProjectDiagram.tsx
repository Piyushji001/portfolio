import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { projects } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type Pos = { x: number; y: number; w: number; h: number };
const NODE_H = 34;

function box(x: number, y: number, w = 140): Pos {
  return { x, y, w, h: NODE_H };
}

/** Pre-computed layout coordinates keyed by project name and node id */
const LAYOUT_POS: Record<string, Record<string, Pos>> = {
  "Vistofy.in": {
    cf: box(250, 0),
    lb: box(250, 74),
    fe: box(40, 148),
    be: box(460, 148),
    redis: box(340, 222, 130),
    ai: box(490, 222, 150),
    loki: box(250, 300),
  },
  "Multi-Repository CI/CD Infrastructure": {
    commit: box(0, 0, 90),
    build: box(110, 0, 90),
    test: box(220, 0, 90),
    push: box(330, 0, 90),
    deploy: box(440, 0, 90),
    health: box(550, 0, 90),
  },
};

const VIEWBOX_SIZE: Record<string, { w: number; h: number }> = {
  "Vistofy.in": { w: 640, h: 340 },
  "Multi-Repository CI/CD Infrastructure": { w: 640, h: 34 },
};

function edgePath(a: Pos, b: Pos) {
  const ax = a.x + a.w / 2;
  const ay = a.y + a.h;
  const bx = b.x + b.w / 2;
  const by = b.y;
  if (Math.abs(ay - by) < 4) {
    // horizontal chain
    return `M ${a.x + a.w} ${a.y + a.h / 2} L ${b.x} ${b.y + b.h / 2}`;
  }
  const mid = ay + (by - ay) / 2;
  return `M ${ax} ${ay} L ${ax} ${mid} L ${bx} ${mid} L ${bx} ${by}`;
}

export function Diagram({
  project,
  run,
}: {
  project: (typeof projects)[number];
  run: boolean;
}) {
  const reduced = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [edgesDone, setEdgesDone] = useState(false);

  useEffect(() => {
    if (!run) return;
    if (reduced) {
      setEdgesDone(true);
      return;
    }
    const t = setTimeout(() => setEdgesDone(true), 1200);
    return () => clearTimeout(t);
  }, [run, reduced]);

  const posMap = LAYOUT_POS[project.name];
  const size = VIEWBOX_SIZE[project.name];
  if (!posMap || !size || !project.diagram) return null;

  const { nodes, edges } = project.diagram;
  const hoveredNode = nodes.find((n) => n.id === hoveredId);

  const connected = (id: string) =>
    hoveredId !== null &&
    (id === hoveredId ||
      edges.some(
        ([a, b]) => (a === hoveredId && b === id) || (b === hoveredId && a === id)
      ));

  const pad = 24;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${size.w + pad * 2} ${size.h + pad * 2 + 34}`}
      className="w-full"
      role="img"
      aria-label={`${project.name} system diagram`}
      onMouseLeave={() => setHoveredId(null)}
    >
      {edges.map(([a, b], i) => {
        const pA = posMap[a];
        const pB = posMap[b];
        if (!pA || !pB) return null;
        const active = hoveredId !== null && (hoveredId === a || hoveredId === b);

        return (
          <motion.path
            key={`${a}->${b}`}
            d={edgePath(pA, pB)}
            fill="none"
            stroke={active ? "var(--accent)" : "var(--hairline)"}
            strokeWidth={1}
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={run ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              duration: reduced ? 0 : 1.2,
              ease: EASE,
              delay: reduced ? 0 : i * 0.04,
            }}
          />
        );
      })}

      {nodes.map((node, i) => {
        const p = posMap[node.id];
        if (!p) return null;
        const isHovered = hoveredId === node.id;
        const dimmed = hoveredId !== null && !connected(node.id);

        return (
          <motion.g
            key={node.id}
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{
              opacity: run && (edgesDone || reduced) ? (dimmed ? 0.35 : 1) : 0,
            }}
            transition={{
              duration: reduced ? 0 : 0.4,
              ease: EASE,
              delay: edgesDone && !reduced && !hoveredId ? i * 0.06 : 0,
            }}
            onMouseEnter={() => setHoveredId(node.id)}
            onFocus={() => setHoveredId(node.id)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
          >
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={4}
              fill="var(--surface)"
              stroke={isHovered ? "var(--accent)" : "var(--hairline)"}
              strokeWidth={1}
            />
            <text
              x={p.x + p.w / 2}
              y={p.y + p.h / 2 + 4}
              textAnchor="middle"
              fill={isHovered ? "var(--accent)" : "var(--text)"}
              style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            >
              {node.label}
            </text>
          </motion.g>
        );
      })}

      {hoveredNode && (
        <g>
          <text
            x={size.w / 2}
            y={size.h + 34}
            textAnchor="middle"
            fill="var(--accent)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
          >
            {hoveredNode.label} — {hoveredNode.host}
          </text>
        </g>
      )}
    </svg>
  );
}
