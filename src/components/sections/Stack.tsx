import { useState } from "react";
import { stack } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";

export function Stack() {
  const { ref, className } = useReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="stack" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">02 / STACK</h2>

        <div className="mt-10" onMouseLeave={() => setHovered(null)}>
          {stack.map((band, bi) => (
            <div
              key={band.layer}
              className="flex flex-col gap-4 py-7 min-[720px]:flex-row min-[720px]:gap-6"
              style={
                bi === 0
                  ? { paddingTop: 0 }
                  : { borderTop: "1px solid var(--hairline)" }
              }
            >
              <div className="min-[720px]:w-[140px] min-[720px]:shrink-0 min-[720px]:border-r min-[720px]:border-hairline min-[720px]:pr-6">
                <span className="type-data text-[11px] tracking-[0.14em] uppercase text-text-dim">
                  {band.layer}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {band.items.map((item) => {
                  const key = `${band.layer}:${item}`;
                  const isHovered = hovered === key;
                  const dimmed = hovered !== null && !isHovered;
                  return (
                    <span
                      key={key}
                      tabIndex={0}
                      onMouseEnter={() => setHovered(key)}
                      onFocus={() => setHovered(key)}
                      onBlur={() => setHovered(null)}
                      className="type-data inline-block border text-[13px]"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        borderColor: isHovered ? "var(--accent)" : "var(--hairline)",
                        color: isHovered ? "var(--accent)" : "var(--text)",
                        opacity: dimmed ? 0.35 : 1,
                        transition:
                          "opacity 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
