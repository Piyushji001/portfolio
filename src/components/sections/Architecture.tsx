import { Fragment, Suspense, lazy, useState } from "react";
import { projects } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";

/** Lazy: diagrams only mount once the section has been reached. */
const Diagram = lazy(() =>
  import("@/components/sections/ProjectDiagram").then((m) => ({ default: m.Diagram })),
);

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

/** Status badge: green = operational, amber = in-progress, grey = planned */
function StatusBadge({ status }: { status: (typeof projects)[number]["status"] }) {
  const colorMap = {
    operational:  "var(--ok)",
    "in-progress": "var(--accent)",
    planned:       "var(--fg-dim)",
  } as const;

  const labelMap = {
    operational:  "OPERATIONAL",
    "in-progress": "IN PROGRESS",
    planned:       "PLANNED",
  } as const;

  const color = colorMap[status] ?? "var(--fg-dim)";
  const label = labelMap[status] ?? status.toUpperCase();

  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label={`Project status: ${label}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span
        className="type-data text-[11px] uppercase tracking-[0.14em]"
        style={{ color }}
      >
        {label}
      </span>
    </span>
  );
}

function Details({ project }: { project: (typeof projects)[number] }) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <div onMouseLeave={() => setHoveredTag(null)}>
      {/* Section tags */}
      <div className="flex flex-wrap gap-2">
        {project.sectionTags.map((tag) => (
          <span
            key={tag}
            className="type-data text-[10px] uppercase tracking-[0.16em]"
            style={{
              color: "var(--accent)",
              border: "1px solid var(--hairline)",
              padding: "3px 8px",
              borderRadius: 2,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <h3
        className="type-data mt-4 text-[28px] text-text"
        style={{ fontWeight: 500, lineHeight: 1.15 }}
      >
        {project.name}
      </h3>
      <p className="type-data mt-2 text-[14px] text-text-dim">{project.tagline}</p>

      {/* Status + role row */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span
          aria-hidden="true"
          className="inline-block h-[11px] w-px"
          style={{ backgroundColor: "var(--hairline)" }}
        />
        <p className="type-data text-[11px] uppercase tracking-[0.16em] text-text-dim">
          {project.role}
        </p>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {project.points.map((point) => (
          <li
            key={point}
            className="text-text-dim"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.6,
              borderLeft: "1px solid var(--hairline)",
              paddingLeft: 16,
            }}
          >
            {highlightNumbers(point)}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap gap-2">
        {project.tags.map((tag) => {
          const isHovered = hoveredTag === tag;
          const dimmed = hoveredTag !== null && !isHovered;
          return (
            <span
              key={tag}
              tabIndex={0}
              onMouseEnter={() => setHoveredTag(tag)}
              onFocus={() => setHoveredTag(tag)}
              onBlur={() => setHoveredTag(null)}
              className="type-data inline-block border text-[13px]"
              style={{
                padding: "6px 12px",
                borderRadius: 4,
                borderColor: isHovered ? "var(--accent)" : "var(--hairline)",
                color: isHovered ? "var(--accent)" : "var(--text)",
                opacity: dimmed ? 0.35 : 1,
                transition:
                  "opacity 200ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* Links: live URL and/or repo */}
      <div className="mt-7 flex flex-wrap gap-5">
        {project.url !== "" && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="type-data inline-flex items-center gap-2 text-[13px]"
            style={{ color: "var(--accent)" }}
          >
            {(() => {
              try { return new URL(project.url).hostname; } catch { return project.url; }
            })()}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 8 L8 2 M4 2 H8 V6" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </a>
        )}
        {project.repoUrl !== "" && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="type-data inline-flex items-center gap-2 text-[13px]"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; }}
          >
            REPO ↗
          </a>
        )}
      </div>
    </div>
  );
}

export function Architecture() {
  const { ref, revealed, className } = useReveal<HTMLDivElement>();

  return (
    <section id="architecture" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">05 / ARCHITECTURE</h2>

        <div className="mt-12">
          {projects.map((project, i) => {
            const flipped = i % 2 === 1;
            return (
              <div
                key={project.name}
                className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-12 min-[900px]:gap-12"
                style={{
                  paddingTop: i === 0 ? 0 : 80,
                  paddingBottom: 80,
                  borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
                }}
              >
                <div
                  className={`min-w-0 min-[900px]:col-span-5 ${flipped ? "min-[900px]:order-2" : ""}`}
                >
                  <Details project={project} />
                </div>
                <div
                  className={`min-w-0 min-[900px]:col-span-7 ${flipped ? "min-[900px]:order-1" : ""} flex items-start`}
                >
                  {revealed && (
                    <Suspense fallback={null}>
                      <Diagram project={project} run={revealed} />
                    </Suspense>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
