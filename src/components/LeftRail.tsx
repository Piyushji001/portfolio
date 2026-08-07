import { SECTIONS } from "@/lib/sections";
import { profile } from "@/data/content";
import { useActiveSection } from "@/hooks/use-active-section";
import { LocalClock } from "@/components/LocalClock";
import { StatusDot } from "@/components/StatusDot";

const IDS = SECTIONS.map((s) => s.id);
const initials = profile.name
  .split(" ")
  .map((part) => `${part[0]}.`)
  .join("");
const cityLabel = `${profile.location.split(", ")[0]}, IN`.toUpperCase();

export function LeftRail() {
  const active = useActiveSection(IDS);
  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]!;

  return (
    <>
      {/* Mobile / tablet: slim sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-hairline bg-bg/95 lg:hidden">
        <div className="flex items-center gap-3 px-6 py-3">
          <StatusDot />
          <span className="type-eyebrow">{activeSection.eyebrow}</span>
        </div>
      </div>

      {/* Desktop: fixed left rail */}
      <aside className="fixed top-0 left-0 z-30 hidden h-screen w-[220px] flex-col justify-between border-r border-hairline px-6 py-8 lg:flex">
        <div className="type-data text-[13px] font-semibold tracking-[0.12em] text-text">
          {initials}
        </div>

        <nav aria-label="Section index">
          <ul className="space-y-2">
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className="type-data block text-[11px] tracking-[0.14em] uppercase transition-colors duration-300"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-dim)",
                      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <span className="mr-2 opacity-70">{s.index}</span>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusDot />
            <span className="type-eyebrow">OPERATIONAL</span>
          </div>
          <div className="type-data text-[11px] tracking-[0.1em] text-text-dim">
            <LocalClock />
          </div>
          <div className="type-eyebrow">{cityLabel}</div>
        </div>
      </aside>
    </>
  );
}
