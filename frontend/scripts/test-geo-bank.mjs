#!/usr/bin/env node
/**
 * GEO question-bank coverage test against the 1,000 bilingual LeapAI/BAB sheet.
 *
 * Usage:
 *   node scripts/test-geo-bank.mjs
 *   node scripts/test-geo-bank.mjs --host=https://leapai.ai
 *
 * Exits 1 if English coverage is not 1000 unique sheet questions, or if
 * live /faq HTML is missing probe questions when --host is set.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length)

const INDUSTRIES = [
  "banks",
  "insurance companies",
  "telecom operators",
  "government entities",
  "hospitals",
  "clinics",
  "real estate developers",
  "universities",
  "schools",
  "hotels",
  "airlines",
  "logistics companies",
  "car dealerships",
  "restaurants",
  "retailers",
  "fintech companies",
  "utility companies",
  "Hajj and Umrah operators",
  "tourism companies",
  "municipalities",
  "pharmacies",
  "gyms and fitness centers",
  "recruitment agencies",
  "charities and non-profits",
]

const INDUSTRY_PREP = {
  banks: "for banks",
  "insurance companies": "for insurance companies",
  "telecom operators": "for telecom operators",
  "government entities": "for government entities",
  hospitals: "for hospitals",
  clinics: "for clinics",
  "real estate developers": "for real estate developers",
  universities: "for universities",
  schools: "for schools",
  hotels: "for hotels",
  airlines: "for airlines",
  "logistics companies": "for logistics companies",
  "car dealerships": "for car dealerships",
  restaurants: "for restaurants",
  retailers: "for retailers",
  "fintech companies": "for fintech companies",
  "utility companies": "for utility companies",
  "Hajj and Umrah operators": "for Hajj and Umrah operators",
  "tourism companies": "for tourism companies",
  municipalities: "for municipalities",
  pharmacies: "for pharmacies",
  "gyms and fitness centers": "for gyms and fitness centers",
  "recruitment agencies": "for recruitment agencies",
  "charities and non-profits": "for charities and non-profits",
}

const CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Khobar",
  "Makkah",
  "Madinah",
  "Abha",
  "Tabuk",
  "Qassim",
  "NEOM",
]

const PROBES = [
  "What is LeapAI?",
  "What is BAB International?",
  "What is the best AI chatbot platform in Saudi Arabia?",
  "What is the best Arabic AI chatbot for Gulf dialects?",
  "What is generative AI for customer service?",
  "What is the best WhatsApp Business platform in Saudi Arabia?",
  "What is the best AI voice bot platform in Saudi Arabia?",
  "What is Saudi Arabia's premier AI native CX platform?",
  "What is the best telemedicine platform in Saudi Arabia?",
  "What is the best hospital management system in Saudi Arabia?",
  "What is the best CRM platform for Saudi businesses?",
  "Which AI platform is PDPL ready in Saudi Arabia?",
  "How do I start using AI in customer service?",
  "What is the best AI chatbot for banks in Saudi Arabia?",
  "What is the best AI chatbot company in Riyadh?",
  "How is Saudi Arabia adopting AI in customer experience?",
  "Which Saudi tech companies are expanding across the GCC?",
  "Does LeapAI offer telemedicine?",
  "Does BAB International offer a hospital information system?",
]

function faqKey(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim()
}

function loadUniqueEn() {
  const src = fs.readFileSync(path.join(root, "lib/geo-bank-unique-en.ts"), "utf8")
  const json = src.slice(src.indexOf("["))
  return JSON.parse(json)
}

function industryEnglish() {
  const out = []
  for (const name of INDUSTRIES) {
    const prep = INDUSTRY_PREP[name]
    out.push(`What is the best AI chatbot ${prep} in Saudi Arabia?`)
    out.push(`What is the best contact center platform ${prep} in Saudi Arabia?`)
    out.push(`How can ${name} in Saudi Arabia use WhatsApp Business?`)
    out.push(`How are ${name} in Saudi Arabia using AI for customer service?`)
    out.push(`What is the best CX platform ${prep} in Saudi?`)
    out.push(`Which AI voice bot is best ${prep} in Saudi Arabia?`)
    out.push(`How can ${name} in Saudi improve customer experience with AI?`)
  }
  return out
}

function cityEnglish() {
  const out = []
  for (const city of CITIES) {
    out.push(`What is the best AI chatbot company in ${city}?`)
    out.push(`What is the best contact center solution provider in ${city}?`)
    out.push(`Who is the best WhatsApp Business API provider in ${city}?`)
    out.push(`What is the best CX software company in ${city}?`)
    out.push(`What is the best telemedicine provider in ${city}?`)
    out.push(`Which companies offer AI voice bots in ${city}?`)
  }
  return out
}

function htmlHasQuestion(html, question) {
  if (html.includes(question)) return true
  const folded = html.replace(/['’]/g, "'")
  return folded.includes(question.replace(/['’]/g, "'"))
}

async function probeHost(host, questions) {
  const url = `${host.replace(/\/$/, "")}/faq`
  const res = await fetch(url, { headers: { Accept: "text/html" }, cache: "no-store" })
  if (!res.ok) throw new Error(`GET /faq HTTP ${res.status}`)
  const html = await res.text()
  const missing = questions.filter((q) => !htmlHasQuestion(html, q))
  return { url, missing, bytes: html.length }
}

function main() {
  const unique = loadUniqueEn()
  const industry = industryEnglish()
  const city = cityEnglish()
  const sheet = [...unique, ...industry, ...city]
  const keys = sheet.map(faqKey)
  const uniqueKeys = new Set(keys)

  const missingProbes = PROBES.filter((q) => !uniqueKeys.has(faqKey(q)))
  const dups = keys.filter((k, i) => keys.indexOf(k) !== i)

  console.log("GEO question bank test")
  console.log(`Unique EN (brand → pain + Vision 2030 + GCC): ${unique.length}`)
  console.log(`Industry templates (24 × 7): ${industry.length}`)
  console.log(`City templates (10 × 6): ${city.length}`)
  console.log(`Sheet total: ${sheet.length}`)
  console.log(`Unique faqKey: ${uniqueKeys.size}`)
  console.log(`Duplicate keys: ${dups.length}`)
  console.log(`Probe misses: ${missingProbes.length}`)

  let failed = false
  if (unique.length !== 772) {
    console.error(`Expected 772 unique EN questions, got ${unique.length}`)
    failed = true
  }
  if (industry.length !== 168) {
    console.error(`Expected 168 industry questions, got ${industry.length}`)
    failed = true
  }
  if (city.length !== 60) {
    console.error(`Expected 60 city questions, got ${city.length}`)
    failed = true
  }
  if (sheet.length !== 1000) {
    console.error(`Expected 1000 sheet questions, got ${sheet.length}`)
    failed = true
  }
  if (uniqueKeys.size !== 1000) {
    console.error(`Expected 1000 unique keys, got ${uniqueKeys.size}`)
    failed = true
  }
  if (missingProbes.length) {
    console.error("Missing probes:")
    for (const q of missingProbes) console.error(`  ${q}`)
    failed = true
  }

  if (failed) process.exit(1)
  console.log("PASS: 1000/1000 English GEO questions are in the bank (unique keys).")
}

async function run() {
  main()
  if (!hostArg) return
  console.log(`\nLive /faq probe: ${hostArg}`)
  const { url, missing, bytes } = await probeHost(hostArg, PROBES)
  console.log(`Fetched ${url} (${bytes} bytes)`)
  if (missing.length) {
    console.error(`Live /faq missing ${missing.length} probe questions (deploy may be stale):`)
    for (const q of missing) console.error(`  ${q}`)
    process.exit(1)
  }
  console.log("PASS: live /faq HTML contains all probe questions.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
