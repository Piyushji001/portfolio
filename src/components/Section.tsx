import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

export function Section({
  id,
  eyebrow,
  children,
}: {
  id: string;
  eyebrow: string;
  children?: ReactNode;
}) {
  const { ref, className } = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <p className="type-eyebrow">{eyebrow}</p>
        {children}
      </div>
    </section>
  );
}
