import { useState, useRef } from "react";
import { education, profile } from "@/data/content";
import { useReveal } from "@/hooks/use-reveal";
import { useUptime } from "@/hooks/use-uptime";
import { StatusDot } from "@/components/StatusDot";

type Status = "idle" | "sending" | "sent" | "error";

const FIELDS = [
  { id: "name",    label: "NAME",    type: "text",  placeholder: "Your name",        required: true  },
  { id: "email",   label: "EMAIL",   type: "email", placeholder: "your@email.com",   required: true  },
  { id: "company", label: "COMPANY", type: "text",  placeholder: "Company / role",   required: false },
] as const;

export function Endpoints() {
  const { ref, className } = useReveal<HTMLDivElement>();
  const uptime = useUptime();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Request failed");
      }
      setStatus("sent");
      formRef.current?.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--hairline)",
    outline: "none",
    color: "var(--text)",
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    padding: "10px 0",
    transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <section id="endpoints" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">06 / ENDPOINTS & CONTACT</h2>

        <p className="type-display mt-8 text-text">OPEN TO WORK</p>

        <div className="mt-12 grid grid-cols-1 gap-12 min-[900px]:grid-cols-12">
          {/* Left Column: Direct Details */}
          <div className="min-[900px]:col-span-5 flex flex-col justify-between">
            <div>
              <p
                className="text-text-dim"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  lineHeight: 1.65,
                  maxWidth: "38ch",
                }}
              >
                Available for DevOps, SRE and cloud infrastructure roles. Drop a message using the form or reach out directly.
              </p>

              <div className="mt-8 space-y-4">
                <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16 }}>
                  <span className="type-data text-[11px] uppercase tracking-[0.16em] text-text-dim">
                    DIRECT EMAIL
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="type-data mt-1 block text-[15px] text-text transition-colors duration-200 hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </div>

                {profile.linkedin && (
                  <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16 }}>
                    <span className="type-data text-[11px] uppercase tracking-[0.16em] text-text-dim">
                      LINKEDIN
                    </span>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="type-data mt-1 block text-[15px] text-text transition-colors duration-200 hover:text-accent"
                    >
                      {profile.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Recruiter Contact Form */}
          <div className="min-[900px]:col-span-7">
            {status === "sent" ? (
              <div
                className="flex flex-col gap-3 p-8"
                style={{ border: "1px solid var(--ok)", borderRadius: 4 }}
              >
                <p
                  className="type-data text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--ok)" }}
                >
                  MESSAGE RECEIVED
                </p>
                <p
                  className="text-text-dim"
                  style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6 }}
                >
                  Got it. I'll be in touch within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="type-data mt-2 w-fit text-[12px] uppercase tracking-[0.14em] text-text-dim transition-colors duration-200 hover:text-accent"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-6">
                  {FIELDS.map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={`contact-${field.id}`}
                        className="type-data block text-[11px] uppercase tracking-[0.14em] text-text-dim"
                      >
                        {field.label}
                        {field.required && (
                          <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>
                        )}
                      </label>
                      <input
                        id={`contact-${field.id}`}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        autoComplete="off"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.currentTarget.style.borderBottomColor = "var(--accent)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderBottomColor = "var(--hairline)";
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="type-data block text-[11px] uppercase tracking-[0.14em] text-text-dim"
                    >
                      MESSAGE <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="What's the opportunity?"
                      required
                      style={{
                        ...inputStyle,
                        resize: "none",
                        display: "block",
                        paddingTop: 10,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderBottomColor = "var(--accent)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderBottomColor = "var(--hairline)";
                      }}
                    />
                  </div>

                  {status === "error" && (
                    <p
                      className="type-data text-[12px]"
                      style={{ color: "var(--crit)" }}
                    >
                      {errorMsg || "Failed to send. Try emailing directly."}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="type-data inline-flex items-center gap-3 border px-6 py-3 text-[13px] uppercase tracking-[0.1em] transition-colors duration-300"
                      style={{
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                        borderRadius: 4,
                        opacity: status === "sending" ? 0.6 : 1,
                        cursor: status === "sending" ? "not-allowed" : "pointer",
                        background: "transparent",
                        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                      }}
                      onMouseEnter={(e) => {
                        if (status !== "sending") {
                          e.currentTarget.style.background = "var(--accent)";
                          e.currentTarget.style.color = "var(--bg)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                    >
                      {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
                      {status !== "sending" && (
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                          <path
                            d="M1 5 H8 M5 2 L8 5 L5 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
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
