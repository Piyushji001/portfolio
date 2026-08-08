import { useState, useRef } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { profile } from "@/data/content";

type Status = "idle" | "sending" | "sent" | "error";

const FIELDS = [
  { id: "name",    label: "NAME",    type: "text",  placeholder: "Your name",        required: true  },
  { id: "email",   label: "EMAIL",   type: "email", placeholder: "your@email.com",   required: true  },
  { id: "company", label: "COMPANY", type: "text",  placeholder: "Company / role",   required: false },
] as const;

export function Contact() {
  const { ref, className } = useReveal<HTMLDivElement>();
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
        const body = await res.json().catch(() => ({})) as { error?: string };
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
    <section id="contact" className="scroll-mt-24 border-t border-hairline py-24">
      <div ref={ref} className={className}>
        <h2 className="type-eyebrow">07 / CONTACT</h2>

        <div className="mt-10 grid grid-cols-1 gap-16 min-[900px]:grid-cols-12">
          {/* Left — copy */}
          <div className="min-[900px]:col-span-4">
            <p
              className="type-section text-text"
              style={{ lineHeight: 1.15 }}
            >
              OPEN TO WORK
            </p>
            <p
              className="mt-5 text-text-dim"
              style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.65, maxWidth: "36ch" }}
            >
              Available for DevOps, SRE and cloud infrastructure roles. Drop a message and I will respond within 24 hours.
            </p>
            <div className="mt-8 space-y-3">
              <div>
                <p className="type-data text-[11px] uppercase tracking-[0.14em] text-text-dim">EMAIL</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="type-data mt-1 block text-[14px] text-text transition-colors duration-200 hover:text-accent"
                >
                  {profile.email}
                </a>
              </div>
              {profile.linkedin && (
                <div>
                  <p className="type-data text-[11px] uppercase tracking-[0.14em] text-text-dim">LINKEDIN</p>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="type-data mt-1 block text-[14px] text-text transition-colors duration-200 hover:text-accent"
                  >
                    {profile.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right — form */}
          <div className="min-[900px]:col-span-8">
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
                <div className="flex flex-col gap-8">
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
                        onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--accent)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderBottomColor = "var(--hairline)"; }}
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
                      rows={5}
                      placeholder="What's the opportunity?"
                      required
                      style={{
                        ...inputStyle,
                        resize: "none",
                        display: "block",
                        paddingTop: 12,
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--accent)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "var(--hairline)"; }}
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
                          <path d="M1 5 H8 M5 2 L8 5 L5 8" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
