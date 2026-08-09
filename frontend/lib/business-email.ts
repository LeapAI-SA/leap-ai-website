const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.co.uk",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "gmx.de",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmailFormat(email: string): boolean {
  return EMAIL_RE.test(email.trim()) && email.trim().length <= 200
}

export function isBusinessEmail(email: string): boolean {
  if (!isValidEmailFormat(email)) return false
  const domain = email.split("@")[1]?.trim().toLowerCase()
  return Boolean(domain && !FREE_EMAIL_DOMAINS.has(domain))
}
