import nodemailer from "nodemailer"

function notificationTo() {
  return (
    process.env.NOTIFICATION_EMAIL ??
    process.env.CONTACT_EMAIL ??
    process.env.SMTP_USER ??
    "info@leapai.ai"
  ).trim()
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS)
}

export function getMailStatus() {
  return { configured: smtpConfigured(), notificationTo: notificationTo() }
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

export async function sendAdminMfaCodeEmail(input: { email: string; code: string; expiresInMinutes: number }) {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured")
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim()
  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to: input.email,
    subject: "LeapAI Admin — verification code",
    text: [
      "Your LeapAI Admin verification code is:",
      "",
      input.code,
      "",
      `This code expires in ${input.expiresInMinutes} minutes.`,
      "If you did not try to sign in, change your password immediately.",
    ].join("\n"),
    html: `
      <p>Your <strong>LeapAI Admin</strong> verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:8px">${escapeHtml(input.code)}</p>
      <p>This code expires in ${input.expiresInMinutes} minutes.</p>
      <p>If you did not try to sign in, change your password immediately.</p>
    `,
  })
}

export async function sendDemoLeadEmail(input: { name: string; email: string; phone: string }) {
  if (!smtpConfigured()) {
    console.warn(
      "SMTP is not configured — demo lead saved but not emailed. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally NOTIFICATION_EMAIL).",
    )
    return { emailed: false as const, reason: "smtp_not_configured" }
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim()
  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to: notificationTo(),
    replyTo: input.email,
    subject: `Book a demo — ${input.name}`,
    text: [
      "New demo request from leapai.ai",
      "",
      `Full name: ${input.name}`,
      `Business email: ${input.email}`,
      `Phone: ${input.phone}`,
      "",
      "Reply directly to this message to reach the lead.",
    ].join("\n"),
    html: `
      <p>New demo request from <strong>leapai.ai</strong></p>
      <ul>
        <li><strong>Full name:</strong> ${escapeHtml(input.name)}</li>
        <li><strong>Business email:</strong> ${escapeHtml(input.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>
      </ul>
      <p>Reply directly to this message to reach the lead.</p>
    `,
  })
  return { emailed: true as const }
}

export async function sendContactInquiryEmail(input: {
  source: "contact" | "partner" | "campaign"
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  message: string
}) {
  if (!smtpConfigured()) {
    console.warn(
      "SMTP is not configured — contact message saved but not emailed. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally NOTIFICATION_EMAIL).",
    )
    return { emailed: false as const, reason: "smtp_not_configured" }
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim()
  const sourceLabel =
    input.source === "partner" ? "Partner inquiry" : input.source === "campaign" ? "Campaign lead" : "Contact Us"
  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to: notificationTo(),
    replyTo: input.email,
    subject: `${sourceLabel} — ${input.name}`,
    text: [
      `New ${sourceLabel.toLowerCase()} from leapai.ai`,
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      input.company ? `Company: ${input.company}` : "",
      input.address ? `Address: ${input.address}` : "",
      "",
      `Message:\n${input.message}`,
      "",
      "Reply directly to this message to reach the sender.",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>New ${escapeHtml(sourceLabel.toLowerCase())} from <strong>leapai.ai</strong></p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(input.name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>
        ${input.company ? `<li><strong>Company:</strong> ${escapeHtml(input.company)}</li>` : ""}
        ${input.address ? `<li><strong>Address:</strong> ${escapeHtml(input.address)}</li>` : ""}
      </ul>
      <p><strong>Message:</strong><br/>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
      <p>Reply directly to this message to reach the sender.</p>
    `,
  })
  return { emailed: true as const }
}

export async function sendCareersApplicationEmail(input: {
  name: string
  email: string
  phone: string
  positionTitle: string
  positionSlug: string
  message?: string
}) {
  if (!smtpConfigured()) {
    console.warn(
      "SMTP is not configured — job application saved but not emailed. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally NOTIFICATION_EMAIL).",
    )
    return { emailed: false as const, reason: "smtp_not_configured" }
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim()
  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to: notificationTo(),
    replyTo: input.email,
    subject: `Job application — ${input.positionTitle} (${input.name})`,
    text: [
      "New job application from leapai.ai",
      "",
      `Position: ${input.positionTitle} (${input.positionSlug})`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      input.message ? `Cover letter:\n${input.message}` : "",
      "",
      "Download the CV from the dashboard Careers inbox.",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>New job application from <strong>leapai.ai</strong></p>
      <ul>
        <li><strong>Position:</strong> ${escapeHtml(input.positionTitle)} (${escapeHtml(input.positionSlug)})</li>
        <li><strong>Name:</strong> ${escapeHtml(input.name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>
      </ul>
      ${input.message ? `<p><strong>Cover letter:</strong><br/>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p>Download the CV from the dashboard Careers inbox.</p>
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
