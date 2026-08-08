import { education, profile } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";
import { useUptime } from "@/hooks/use-uptime";
import { StatusDot } from "@/components/StatusDot";

type Row = { key: string; value: string; href?: string; download?: boolean };

function rows(): Row[] {
  return [
    { key: "EMAIL", value: profile.email, href: `mailto:${profile.email}` },
  ];
}

function Arrow() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      className="-translate-x-1 opacity-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
    >
      <path d="M1 5 H8 M5 2 L8 5 L5 8" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Endpoints() {
  const { ref, className } = useReveal<HTMLDivElement>();
  const uptime = useUptime();

  return (
    <section id="endpoints" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">06 / ENDPOINTS</h2>

        <p className="type-display mt-8 text-text">OPEN TO WORK</p>

        <div className="mt-14">
          {rows().map((row) => (
            <div
              key={row.key}
              className="flex flex-col gap-1 py-5 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:justify-between min-[600px]:gap-6"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <span className="type-data text-[11px] uppercase tracking-[0.16em] text-text-dim">
                {row.key}
              </span>
              {row.href ? (
                <a
                  href={row.href}
                  {...(row.download ? { download: true } : {})}
                  {...(row.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="type-data group inline-flex items-center gap-2 text-[15px] text-text transition-colors duration-200 hover:text-accent focus-visible:text-accent"
                >
                  <span className="break-all">{row.value}</span>
                  <Arrow />
                </a>
              ) : (
                <span className="type-data text-[15px] text-text">{row.value}</span>
              )}
            </div>
          ))}
        </div>

        <footer className="mt-24">
          <div>
            {education.map((item) => (
              <div
                key={item.degree}
                className="flex flex-col gap-1 py-4 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:justify-between min-[600px]:gap-6"
                style={{ borderTop: "1px solid var(--hairline)" }}
              >
                <div>
                  <p className="type-data text-[14px] text-text">{item.degree}</p>
                  <p className="type-data mt-1 text-[12px] text-text-dim">
                    {item.school} · {item.year}
                  </p>
                </div>
                <span className="type-data text-[12px] text-text-dim min-[600px]:text-right">
                  {item.note}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-12 flex flex-wrap items-center gap-3 pt-6"
            style={{ borderTop: "1px solid var(--hairline)" }}
          >
            <span className="flex items-center gap-2">
              <StatusDot />
              <span className="type-data text-[11px] uppercase tracking-[0.14em] text-text-dim">
                ALL SYSTEMS OPERATIONAL
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hidden h-[11px] w-px min-[720px]:inline-block"
              style={{ backgroundColor: "var(--hairline)" }}
            />
            <span className="type-data text-[11px] uppercase tracking-[0.14em] text-text-dim">
              {uptime ?? "UPTIME --"}
            </span>
            <span
              aria-hidden="true"
              className="hidden h-[11px] w-px min-[720px]:inline-block"
              style={{ backgroundColor: "var(--hairline)" }}
            />
            <span className="type-data text-[11px] uppercase tracking-[0.14em] text-text-dim">
              BUILT AND DEPLOYED BY {profile.name.toUpperCase()}
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
