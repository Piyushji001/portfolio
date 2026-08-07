const CLASS = "motion-off";

export function motionDisabled() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains(CLASS);
}

/** Returns the new state: true = motion disabled. */
export function toggleMotion() {
  const next = !motionDisabled();
  document.documentElement.classList.toggle(CLASS, next);
  return next;
}
