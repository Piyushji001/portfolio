import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { projects } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type Pos = { x: number; y: number; w: number; h: number };
const NODE_H = 34;

function box(x: number, y: number, w = 140): Pos {
  return { x, y, w, h: NODE_H };
}

/** Pre-computed layout coordinates keyed by project name and node id.
 *  All layouts are ≤ 545px wide so the SVG scales to a readable height
 *  in the 7/12-column container without scrollbars. */
const LAYOUT_POS: Record<string, Record<string, Pos>> = {
  // ARCHIVED 2026-08 — restore if needed
  // "Vistofy.in": { ... },
  // "Multi-Repository CI/CD Infrastructure": { ... },

  "Self-Healing Multi-Cloud Kubernetes Platform": {
    // Row 0 — GitOps source
    gitrepo:    box(10,   0,   100),
    argocd:     box(126,  0,   100),
    // Row 1 — target clusters
    gke:        box(64,   76,  110),
    kind:       box(192,  76,  100),
    // Row 2 — workload
    workload:   box(112,  152, 130),
    // Row 3 — observability triad + dashboard
    prometheus: box(0,    232, 120),
    loki:       box(136,  232, 76),
    otel:       box(228,  232, 126),
    grafana:    box(372,  232, 90),
    // Row 4 — alerting → AIOps loop
    alertmgr:   box(0,    312, 120),
    remediator: box(136,  312, 126),
    llm:        box(280,  312, 110),
    k8sapi:     box(408,  312, 120),
  },

  "AI-Augmented Secure CI/CD Pipeline": {
    // Row 0 — left half of pipeline
    commit:   box(0,   0,  100),
    test:     box(118, 0,  74),
    build:    box(210, 0,  74),
    trivy:    box(302, 0,  100),
    sbom:     box(420, 0,  74),
    // Row 1 — right half wraps to new row
    cosign:   box(0,   82, 104),
    ghcr:     box(122, 82, 90),
    kyverno:  box(230, 82, 106),
    argocd:   box(354, 82, 120),
    // Row 2 — AI branch (below commit)
    aireview: box(0,   164, 120),
  },

  "Self-Service Developer Platform with AI FinOps": {
    // Row 0 — developer golden path
    dev:        box(0,   0,  72),
    backstage:  box(90,  0,  110),
    template:   box(218, 0,  110),
    crossplane: box(346, 0,  108),
    // Row 1 — provisioned outputs (fanned from crossplane)
    ns:         box(250, 82, 90),
    pipeline:   box(358, 82, 100),
    repo:       box(476, 82, 82),
    // Row 2 — FinOps chain
    chatops:    box(0,   164, 106),
    opencost:   box(124, 164, 100),
    grafana:    box(242, 164, 90),
    // Row 3 — AI query + autoscaling
    llm:        box(0,   246, 80),
    keda:       box(140, 246, 128),
    cluster:    box(286, 246, 96),
  },
};

const VIEWBOX_SIZE: Record<string, { w: number; h: number }> = {
  // ARCHIVED 2026-08 — restore if needed
  // "Vistofy.in": { w: 660, h: 370 },
  // "Multi-Repository CI/CD Infrastructure": { w: 640, h: 108 },
  "Self-Healing Multi-Cloud Kubernetes Platform": { w: 534, h: 348 },
  "AI-Augmented Secure CI/CD Pipeline":           { w: 500, h: 200 },
  "Self-Service Developer Platform with AI FinOps": { w: 562, h: 282 },
};

/** Screen-reader descriptions of each diagram flow */
const SR_DESCRIPTIONS: Record<string, string> = {
  "Self-Healing Multi-Cloud Kubernetes Platform":
    "Architecture diagram: Git Repo feeds Argo CD which deploys to GKE Cluster and kind local cluster. Workloads emit metrics to Prometheus, logs to Loki, and traces to OpenTelemetry; all feed Grafana. Prometheus also feeds Alertmanager which triggers the AI Remediator. The remediator queries an LLM for root-cause analysis, then calls the Kubernetes API to restart, scale, or roll back workloads.",
  "AI-Augmented Secure CI/CD Pipeline":
    "Architecture diagram: A commit or pull request branches to an AI PR Review stage, and also proceeds through Test, Build, Trivy vulnerability scan, SBOM generation, Cosign signing, push to GHCR, Kyverno policy gate, and finally Argo CD deployment.",
  "Self-Service Developer Platform with AI FinOps":
    "Architecture diagram: A developer requests via the Backstage portal which uses a software template and Crossplane to provision a new namespace, pipeline, and repo. OpenCost feeds Grafana dashboards. A ChatOps bot queries an LLM and OpenCost. KEDA plus Karpenter handle cost-efficient autoscaling on the cluster.",
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
  const srDesc = SR_DESCRIPTIONS[project.name] ?? `${project.name} system diagram`;

  const connected = (id: string) =>
    hoveredId !== null &&
    (id === hoveredId ||
      edges.some(
        ([a, b]) => (a === hoveredId && b === id) || (b === hoveredId && a === id)
      ));

  const pad = 24;
  const svgId = `diagram-desc-${project.name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div role="img" aria-labelledby={svgId} style={{ width: "100%" }}>
      {/* Screen-reader only description */}
      <span id={svgId} className="sr-only">{srDesc}</span>

      <svg
        viewBox={`${-pad} ${-pad} ${size.w + pad * 2} ${size.h + pad * 2 + 34}`}
        className="w-full"
        aria-hidden="true"
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
    </div>
  );
}
