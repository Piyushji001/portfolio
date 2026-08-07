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

function hostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function Details({ project }: { project: (typeof projects)[number] }) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <div onMouseLeave={() => setHoveredTag(null)}>
      <h3
        className="type-data text-[28px] text-text"
        style={{ fontWeight: 500, lineHeight: 1.15 }}
      >
        {project.name}
      </h3>
      <p className="type-data mt-2 text-[14px] text-text-dim">{project.tagline}</p>
      <p className="type-data mt-3 text-[11px] uppercase tracking-[0.16em] text-text-dim">
        {project.role}
      </p>

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

      {project.url !== "" && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="type-data mt-7 inline-flex items-center gap-2 text-[13px]"
          style={{ color: "var(--accent)" }}
        >
          {hostname(project.url)}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path
              d="M2 8 L8 2 M4 2 H8 V6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </a>
      )}
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
