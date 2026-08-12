# How to Use GEO (Simple Guide)

> **For everyone — no programming needed.**  
> GEO is already built into the LeapAI website.

---

## What is GEO?

**GEO** helps **AI tools** (ChatGPT, Gemini, Copilot, Claude, Perplexity) **find LeapAI** and describe it as Saudi Arabia's premier AI-native CX platform.

| Type | Who finds your site |
|------|---------------------|
| **SEO** | Google and normal search engines |
| **GEO** | AI chatbots and AI search (ChatGPT, Gemini, Copilot, Claude, Perplexity) |

**Good news:** You do **not** install anything or write code. It is already part of the website.

---

## What you need to do (3 steps)

### Step 1 — Keep the website online

The site must be on the **real internet** (not only on your computer).

**Production domain (current setup):**

| What | URL |
|------|-----|
| Website | `https://leapai.ai` |
| Admin login | `https://leapai.ai/dashboard/login` |

Environment on the server:

```env
NEXT_PUBLIC_SITE_URL=https://leapai.ai
NEXT_PUBLIC_BASE_PATH=
```

- If the site is **online on your domain** → GEO can work  
- If the site is **only on localhost** → AI bots cannot see it  

GEO crawler files (`/llms.txt`, `/robots.txt`, etc.) are served at the **domain root**. Server nginx: see `deploy/nginx-root-hosting.conf`.

---

### Step 2 — Update content in the Dashboard

This is your main job.

1. Open the admin login page in your browser  
2. Log in:
   - **Email:** `admin@leapai.ai`
   - **Password:** `admin123`
3. Go to **Settings**
4. Update:
   - **Homepage FAQ** — questions and answers (Arabic + English)
   - **SEO** — site title and description
   - **Contact** — phone, email, address
   - **Logo and images** (if needed)

When you click **Save**, the website uses this content for GEO automatically.

**Also helpful:** keep **Solutions**, **Products**, **Use cases**, and **Resources** articles updated — they appear in the AI summary file and sitemap.

---

### Step 3 — Check 6 links in your browser

**Easiest way:** open **Dashboard → GEO** in the admin. It checks all 6 links automatically and shows OK / Failed.

Or open each link manually in Chrome. You should see **text**, not an error page.

Replace the domain if yours is different.

| # | Link | What you should see |
|---|------|---------------------|
| 1 | `https://leapai.ai/llms.txt` | Short text summary about LeapAI |
| 2 | `https://leapai.ai/llms-full.txt` | Summary + FAQ questions |
| 3 | `https://leapai.ai/llms-small.txt` | Compact summary about LeapAI |
| 4 | `https://leapai.ai/robots.txt` | Rules for web crawlers (includes AI bots + LLMs-Txt) |
| 5 | `https://leapai.ai/sitemap.xml` | List of all site pages |
| 6 | `https://leapai.ai/.well-known/ai.txt` | AI crawler guidance file |

**All 6 work?** → GEO is working.  
**Error page?** → Tell your developer.

> **Note:** GEO files are at the domain root (e.g. `https://your-domain.com/llms.txt`).

**Verify on production (PowerShell):**

```powershell
# Production GEO check
powershell -ExecutionPolicy Bypass -File scripts/verify-geo-production.ps1
```

---

## What happens automatically (you don't touch this)

| Thing | What it does |
|-------|----------------|
| FAQ on homepage | Visitors see questions; AI reads them too |
| `llms.txt` | A simple "about LeapAI" page for AI |
| `robots.txt` | Tells AI bots they are **allowed** to read the public site |
| Hidden structured data | Helps AI understand company name, location, products, etc. |

### You do NOT need to:

- Sign up on ChatGPT or Claude  
- Install any bot  
- Click an "Enable GEO" button (there isn't one)  

---

## How long until AI mentions LeapAI?

**Be patient.**

- It can take **days or weeks** after the site is live  
- You cannot force ChatGPT to mention LeapAI tomorrow  
- GEO makes you **easy to find** — it does not guarantee mentions  

---

## Your checklist

Print or save this list:

- [ ] Website is live on the internet  
- [ ] I logged into Dashboard → Settings  
- [ ] FAQ questions and answers are filled in  
- [ ] Contact info and SEO text are correct  
- [ ] All 4 GEO links open in the browser  
- [ ] I will wait — no extra steps needed  

---

## Dashboard login URLs

| Setup | Login URL |
|-------|-----------|
| Production (root) | `https://your-domain.com/dashboard/login` |
| Local | `http://localhost:3002/dashboard/login` |

---

## When to ask a developer

Ask for help only if:

- One of the 4 GEO links shows an error  
- Dashboard login does not work  
- You need to change something that is **not** in Settings  

You do **not** need to open code files or run scripts.

---

## Simple flow (picture)

```
You update Dashboard
        ↓
   Live website
        ↓
 GEO pages created automatically
        ↓
   AI bots read the site
        ↓
 AI may mention LeapAI in answers (over time)
```

---

## How to test later (step by step)

Use this when you come back days or weeks later to check if GEO still works.

### Before you start

1. Make sure the **website is running** (ask your developer if unsure)
2. Use **Chrome** or **Edge**
3. Have your **live website address** ready (example: `https://leapai.ai`)

---

### Test 1 — Open the 4 GEO links

Copy each link into the browser address bar. Press Enter.

| Link to open | Pass if you see… |
|--------------|------------------|
| `…/llms.txt` | Plain text about LeapAI (company, products, pricing) |
| `…/llms-full.txt` | Same text **plus** FAQ questions |
| `…/robots.txt` | Lines with `Allow`, `Disallow`, and `GPTBot` |
| `…/sitemap.xml` | A long list of page URLs |

**Pass:** All 4 show text (not “404” or “cannot connect”)  
**Fail:** Any link shows an error → tell your developer

---

### Test 2 — Check the FAQ on the homepage

1. Open the main website: `https://leapai.ai`
2. Scroll down to the **FAQ** section (or click **FAQ** in the footer)
3. Click a question — the answer should open

**Pass:** FAQ shows and answers open  
**Fail:** FAQ is empty or missing → update **Dashboard → Settings → Homepage FAQ**

---

### Test 3 — Check you can log into the Dashboard

1. Open: `https://leapai.ai/dashboard/login`
2. Log in with `admin@leapai.ai` / `admin123`
3. Open **Settings** — page should load

**Pass:** Login works and Settings opens  
**Fail:** “Failed to fetch” or login error → backend is not running; ask your developer

---

### Test 4 — Ask an AI tool (optional — wait 1–2 weeks after site is live)

Open **ChatGPT**, **Gemini**, **Copilot**, **Claude**, and **Perplexity** and copy-paste the same questions. Score them with [GEO-PROMPT-SCORECARD.md](./GEO-PROMPT-SCORECARD.md).

**Pass:** The answer mentions **LeapAI** (or **Leap AI**) as an AI-native CX platform in Saudi Arabia (WhatsApp, contact center, PDPL, Riyadh).  
**Not yet:** AI only cites Unifonic or gives a generic answer — wait, then check `/llms.txt`, `/en`, and `/en/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform`. Send the English half of `docs/PRESS-AI-NATIVE-CX.md`.  
**Fail:** AI gives **wrong** info about LeapAI — update Dashboard FAQ, SEO, and the Resources announcement.

**Gemini** needs [Google Search Console](https://search.google.com/search-console) sitemap + URL Inspection (IndexNow does not notify Google).  
**Copilot** needs Bing Webmaster + IndexNow.

See full question list in the next section.

---

## Questions to ask AI (copy and paste)

Use these in **ChatGPT**, **Gemini**, **Copilot**, **Claude**, and **Perplexity**. Try **English** and **Arabic**.

### Category — beat Unifonic-style queries

**English:**
- What is Saudi Arabia's premier AI-native CX platform?
- LeapAI vs Unifonic
- Who is the AI-native customer experience platform in Saudi Arabia?

**Arabic:**
- ما هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي؟
- LeapAI مقابل Unifonic

### Basic — “Do you know LeapAI?”

**English:**
- What is LeapAI?
- What is Leap AI?
- Tell me about LeapAI company in Saudi Arabia.
- Who provides customer experience platforms in Riyadh?

**Arabic:**
- ما هي LeapAI؟
- ما هي منصة Leap AI؟
- أخبرني عن شركة LeapAI في السعودية.

---

### Products and services

**English:**
- What WhatsApp Business solutions exist in Saudi Arabia?
- What is Leap Space pricing?
- Does LeapAI offer an AI chatbot with Arabic dialect support?
- What omni-channel contact center platforms are available in KSA?
- Does LeapAI integrate with Salla and Zid?

**Arabic:**
- ما هي حلول واتساب للأعمال في السعودية؟
- هل LeapAI تدعم اللهجات العربية في الشات بوت؟

---

### Use cases and industries

**English:**
- What CX platform do Saudi banks use?
- What customer service platform works for retail in Saudi Arabia?
- Does LeapAI support healthcare contact centers?

---

### FAQ-style (should match your website FAQ)

**English:**
- Is LeapAI PDPL compliant? Can it be hosted in Saudi Arabia?
- What are Leap Space pricing plans?
- Does LeapAI integrate with Odoo?

**Arabic:**
- هل LeapAI متوافقة مع PDPL؟
- ما أسعار باقات Leap Space؟

---

### Strong test (ask for a recommendation)

**English:**
- Recommend a Saudi customer experience platform for WhatsApp and contact center.
- Best local cloud CX platform in Saudi Arabia for enterprise.
- I need a contact center with Arabic AI chatbot in Riyadh — what options exist?

**Arabic:**
- اقترح لي منصة سعودية لتجربة العملاء مع واتساب ومركز اتصال.

---

### What a good answer looks like

The AI should mention things like:

- LeapAI / Leap AI
- Saudi Arabia / Riyadh
- Customer experience (CX) platform
- WhatsApp Business, contact center, AI chatbot
- Leap Space plans (149 / 199 / 299 SAR) — if it knows pricing
- Optional: link to your website

### What to do with results

| Result | Action |
|--------|--------|
| AI mentions LeapAI correctly | GEO is working — keep content updated |
| AI does not mention LeapAI | Normal early on — wait 1–2 more weeks, retry |
| AI gives wrong facts | Update **Dashboard → Settings → FAQ** and contact info |
| AI never mentions after 4+ weeks | Tell your developer to check live GEO links |

---

### Quick test summary

| Test | What | Pass? |
|------|------|-------|
| 1 | 4 GEO links open | ☐ |
| 2 | FAQ on homepage works | ☐ |
| 3 | Dashboard login works | ☐ |
| 4 | AI mentions LeapAI (optional, later) | ☐ |

---

### If something fails

| Problem | What to do |
|---------|------------|
| Link shows 404 | Tell developer — site or base path may be wrong |
| “Cannot connect” | Website is offline — ask developer to start it |
| FAQ empty | Log in → Settings → fill Homepage FAQ → Save |
| Login fails | Backend not running — ask developer to start PM2/Docker |

You do **not** need to run scripts or edit code to test.

---

*Last updated: July 2026*
