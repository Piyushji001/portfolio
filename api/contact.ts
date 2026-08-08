import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company, message } = req.body as {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Mail service not configured." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["mr.piyush0270@gmail.com"],
        reply_to: email,
        subject: `Recruiting enquiry — ${name}${company ? ` · ${company}` : ""}`,
        html: `
          <div style="font-family:monospace;font-size:14px;line-height:1.6;color:#0E1116;background:#fff;padding:32px;max-width:560px">
            <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A94A0;margin:0 0 24px">
              PORTFOLIO CONTACT / INC-${Date.now()}
            </p>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;border-top:1px solid #262E38;color:#8A94A0;width:100px">NAME</td><td style="padding:8px 0;border-top:1px solid #262E38">${name}</td></tr>
              <tr><td style="padding:8px 0;border-top:1px solid #262E38;color:#8A94A0">EMAIL</td><td style="padding:8px 0;border-top:1px solid #262E38"><a href="mailto:${email}" style="color:#F2A93B">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;border-top:1px solid #262E38;color:#8A94A0">COMPANY</td><td style="padding:8px 0;border-top:1px solid #262E38">${company}</td></tr>` : ""}
              <tr><td style="padding:8px 0;border-top:1px solid #262E38;color:#8A94A0;vertical-align:top">MESSAGE</td><td style="padding:8px 0;border-top:1px solid #262E38;white-space:pre-wrap">${message}</td></tr>
            </table>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send message." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
