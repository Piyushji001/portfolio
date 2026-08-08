import { useEffect, useRef, useState } from "react";
import { metrics, profile } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";

function splitValue(value: string) {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: value, num: null as number | null, suffix: "" };
  return { prefix: match[1] ?? "", num: Number(match[2]), suffix: match[3] ?? "" };
}

function CountUp({
  value,
  active,
  delay,
}: {
  value: string;
  active: boolean;
  delay: number;
}) {
  const { prefix, num, suffix } = splitValue(value);
  const [display, setDisplay] = useState(num === null ? null : 0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (num === null || !active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(num);
      return;
    }

    let start = 0;
    const duration = 900;
    const timer = window.setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(num * eased));
        if (p < 1) frame.current = window.requestAnimationFrame(step);
      };
      frame.current = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [num, active, delay]);

  if (num === null) return <>{value}</>;
  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

function MetricTile({
  metric,
  active,
  delay,
}: {
  metric: (typeof metrics)[number];
  active: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="border p-5 transition-all duration-300 flex flex-col justify-between"
      style={{
        backgroundColor: hovered ? "rgba(242, 169, 59, 0.06)" : "var(--surface)",
        borderColor: hovered ? "var(--accent)" : "var(--hairline)",
        borderRadius: "4px",
        minHeight: "155px",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div>
        <div
          className="type-data text-[44px] leading-none font-semibold"
          style={{ color: "var(--accent)" }}
        >
          <CountUp value={metric.value} active={active} delay={delay} />
        </div>
        <div className="type-data mt-3 text-[11px] tracking-[0.14em] uppercase text-text-dim">
          {metric.label}
        </div>
      </div>
      <div
        className="mt-3 text-[12px] leading-snug transition-opacity duration-300"
        style={{
          color: hovered ? "var(--fg)" : "var(--fg-dim)",
          opacity: hovered ? 1 : 0.65,
        }}
      >
        {metric.detail}
      </div>
    </div>
  );
}

export function SystemOverview() {
  const { ref, revealed, className } = useReveal<HTMLDivElement>();

  return (
    <section id="system" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">01 / SYSTEM OVERVIEW</h2>

        <div className="mt-10 grid grid-cols-1 gap-10 min-[900px]:grid-cols-12">
          <div className="min-[900px]:col-span-7">
            <p className="type-body text-text">{profile.bio}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2 min-[900px]:col-span-5">
            {metrics.map((m, i) => (
              <MetricTile
                key={m.label}
                metric={m}
                active={revealed}
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
