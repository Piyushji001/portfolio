export type SectionDef = {
  id: string;
  index: string;
  label: string;
  eyebrow: string;
};

export const SECTIONS: SectionDef[] = [
  { id: "hero", index: "00", label: "HERO", eyebrow: "00 / HERO" },
  { id: "system", index: "01", label: "SYSTEM", eyebrow: "01 / SYSTEM OVERVIEW" },
  { id: "stack", index: "02", label: "STACK", eyebrow: "02 / STACK" },
  { id: "log", index: "03", label: "LOG", eyebrow: "03 / LOG" },
  { id: "incident", index: "04", label: "INCIDENT", eyebrow: "04 / INCIDENT" },
  { id: "architecture", index: "05", label: "ARCHITECTURE", eyebrow: "05 / ARCHITECTURE" },
  { id: "endpoints", index: "06", label: "ENDPOINTS", eyebrow: "06 / ENDPOINTS" },
];
