import nodemailer from "nodemailer"

const DEMO_TO = (process.env.DEMO_LEADS_EMAIL ?? "sales@leapai.ai").trim()

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS)
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendDemoLeadEmail(input: { name: string; email: string }) {
  if (!smtpConfigured()) {
    console.warn(
      "SMTP is not configured — demo lead saved but not emailed. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally DEMO_LEADS_EMAIL).",
    )
    return { emailed: false as const, reason: "smtp_not_configured" }
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim()
  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to: DEMO_TO,
    replyTo: input.email,
    subject: `Book a demo — ${input.name}`,
    text: [
      "New demo request from leapai.ai",
      "",
      `Full name: ${input.name}`,
      `Business email: ${input.email}`,
      "",
      "Reply directly to this message to reach the lead.",
    ].join("\n"),
    html: `
      <p>New demo request from <strong>leapai.ai</strong></p>
      <ul>
        <li><strong>Full name:</strong> ${escapeHtml(input.name)}</li>
        <li><strong>Business email:</strong> ${escapeHtml(input.email)}</li>
      </ul>
      <p>Reply directly to this message to reach the lead.</p>
    `,
  })
  return { emailed: true as const }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
