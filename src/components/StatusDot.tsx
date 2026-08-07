export function StatusDot() {
  return (
    <span
      aria-hidden="true"
      className="pulse-dot inline-block h-[6px] w-[6px] shrink-0 rounded-full"
      style={{ backgroundColor: "var(--ok)" }}
    />
  );
}
