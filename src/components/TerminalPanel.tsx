import { useEffect, useRef, useState } from "react";
import { incident, profile, stack } from "@/data/content";
import { careerUptime } from "@/lib/uptime";

const PROMPT = "piyush@control-plane:~$";

type Line = { text: string; color?: string };

const HELP: Line[] = [
  { text: "available commands:" },
  { text: "  help              list available commands" },
  { text: "  whoami            identity" },
  { text: "  ls                list sections" },
  { text: "  cat incident.log  print the incident timeline" },
  { text: "  uptime            career uptime counter" },
  { text: "  skills            stack grouped by layer" },
  { text: "  clear             clear the buffer" },
  { text: "  exit              close the terminal" },
];

function stateColor(state: string) {
  if (state === "resolved") return "var(--ok)";
  if (state === "mitigated") return "var(--warn)";
  return "var(--crit)";
}

export function TerminalPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [buffer, setBuffer] = useState<Line[]>([
    { text: "type 'help' for available commands." },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [buffer, open]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const echo: Line = { text: `${PROMPT} ${cmd}`, color: "var(--text)" };

    if (cmd === "") {
      setBuffer((b) => [...b, echo]);
      return;
    }
    if (cmd === "clear") {
      setBuffer([]);
      return;
    }
    if (cmd === "exit") {
      onClose();
      return;
    }

    let out: Line[] = [];
    if (cmd === "help") {
      out = HELP;
    } else if (cmd === "whoami") {
      out = [{ text: "piyush sharma — devops engineer" }];
    } else if (cmd === "ls") {
      out = [{ text: "overview  stack  experience  incident.log  projects  contact" }];
    } else if (cmd === "cat incident.log") {
      out = [
        { text: `${incident.id}  ${incident.title}` },
        ...incident.timeline.map((entry) => ({
          text: `${entry.t}  [${entry.state.toUpperCase()}]  ${entry.text}`,
          color: stateColor(entry.state),
        })),
      ];
    } else if (cmd === "uptime") {
      out = [{ text: careerUptime().toLowerCase() }];
    } else if (cmd === "skills") {
      out = stack.map((band) => ({
        text: `${band.layer.padEnd(15, " ")} ${band.items.join(", ")}`,
      }));
    } else {
      out = [{ text: `command not found: ${cmd}. try 'help'`, color: "var(--crit)" }];
    }

    setBuffer((b) => [...b, echo, ...out]);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 h-[60vh] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[320px]"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--hairline)",
        transform: open ? "translateY(0)" : "translateY(100%)",
        visibility: open ? "visible" : "hidden",
      }}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col px-4 py-3" style={{ fontFamily: "var(--font-mono)" }}>
        <div className="flex items-center justify-between pb-2" style={{ borderBottom: "1px solid var(--hairline)" }}>
          <span className="text-[11px] uppercase tracking-[0.14em] text-text-dim">
            {profile.name.toLowerCase()} · terminal
          </span>
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Close terminal"
            className="text-[11px] uppercase tracking-[0.14em] text-text-dim hover:text-accent"
          >
            ESC
          </button>
        </div>

        <div ref={bodyRef} className="mt-3 flex-1 overflow-y-auto text-[12px] leading-[1.7]">
          {buffer.map((line, i) => (
            <div key={i} style={{ color: line.color ?? "var(--text-dim)", whiteSpace: "pre-wrap" }}>
              {line.text}
            </div>
          ))}
        </div>

        <form
          className="mt-2 flex items-center gap-2 pt-2"
          style={{ borderTop: "1px solid var(--hairline)" }}
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <span className="text-[12px]" style={{ color: "var(--accent)" }}>
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-[12px] text-text outline-none"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </form>
      </div>
    </div>
  );
}
