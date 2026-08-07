export function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transition: "background-image 600ms cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}
