import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { profile } from "@/data/content";
import { toggleMotion } from "@/lib/motion";

type Command = {
  label: string;
  category: string;
  run: () => void;
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function okToast(message: string) {
  toast(message, {
    style: {
      background: "var(--surface-hi)",
      border: "1px solid var(--ok)",
      color: "var(--ok)",
      borderRadius: "4px",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
    },
  });
}

function openExternal(url: string, name: string) {
  if (url === "") {
    okToast(`${name} link not configured`);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export function useCommands(): Command[] {
  return useMemo(
    () => [
      { label: "goto hero", category: "NAVIGATE", run: () => scrollTo("hero") },
      { label: "goto system", category: "NAVIGATE", run: () => scrollTo("system") },
      { label: "goto stack", category: "NAVIGATE", run: () => scrollTo("stack") },
      { label: "goto experience", category: "NAVIGATE", run: () => scrollTo("log") },
      { label: "goto incident", category: "NAVIGATE", run: () => scrollTo("incident") },
      { label: "goto projects", category: "NAVIGATE", run: () => scrollTo("architecture") },
      { label: "goto contact", category: "NAVIGATE", run: () => scrollTo("endpoints") },
      {
        label: "open resume",
        category: "FILE",
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resumeUrl;
          a.download = "";
          a.click();
        },
      },
      {
        label: "open linkedin",
        category: "LINK",
        run: () => openExternal(profile.linkedin, "LinkedIn"),
      },
      {
        label: "open github",
        category: "LINK",
        run: () => openExternal(profile.github, "GitHub"),
      },
      {
        label: "copy email",
        category: "CLIPBOARD",
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            okToast(`copied ${profile.email}`);
          } catch {
            okToast("clipboard unavailable");
          }
        },
      },
      {
        label: "toggle motion",
        category: "SETTING",
        run: () => okToast(toggleMotion() ? "motion disabled" : "motion enabled"),
      },
    ],
    [],
  );
}

export function CommandPalette() {
  const commands = useCommands();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setIndex(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[index];
      if (cmd) {
        close();
        cmd.run();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[18vh]"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onMouseDown={close}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        className="w-full max-w-[560px] overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 4,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type a command…"
          className="type-data w-full bg-transparent px-4 py-4 text-[14px] text-text outline-none placeholder:text-text-dim"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        />
        <ul className="max-h-[320px] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="type-data px-4 py-3 text-[13px] text-text-dim">
              no matching command
            </li>
          )}
          {results.map((cmd, i) => {
            const active = i === index;
            return (
              <li key={cmd.label}>
                <button
                  type="button"
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    close();
                    cmd.run();
                  }}
                  className="type-data flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-[13px]"
                  style={{
                    borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    background: active ? "var(--surface-hi)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-dim)",
                  }}
                >
                  <span>{cmd.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-text-dim">
                    {cmd.category}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function PaletteHint() {
  return (
    <div
      aria-hidden="true"
      className="type-data pointer-events-none fixed right-4 bottom-4 z-30 hidden text-[11px] text-text-dim [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{
        border: "1px solid var(--hairline)",
        borderRadius: 4,
        padding: "4px 8px",
        background: "var(--surface)",
      }}
    >
      ⌘K
    </div>
  );
}
