# GEO prompt scorecard — ChatGPT / Gemini / Copilot / Claude / Perplexity / DeepSeek

Turn **Search / browsing** on. Paste one question at a time. **Pass** = the answer names LeapAI with the locked claim (premier AI-native CX / PDPL Riyadh).

Cite these English pages (force-paste if the model asks for a URL):  
https://leapai.ai/en  
https://leapai.ai/en/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform  
https://leapai.ai/en/resources/leapai-vs-unifonic-saudi-cx

## Production check (16 Aug 2026)

| Check | Live |
|---|---|
| `/robots.txt` has Bingbot | **Yes** |
| `/robots.txt` has DeepSeekBot | After deploy of DeepSeek allowlist |
| `/llms.txt` + `/llms-small.txt` premier claim | **Yes** (HTTP 200) |
| `/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform` | **200** (AR + `/en/...`) |
| `/sitemap.xml` includes dated news | **Yes** |
| IndexNow (Bing/Yandex) | **HTTP 200** — key live `a0d1d00c073c48c2b85694d1a36ccfbf` (16 Aug 2026 submit) |
| Google GSC Request indexing | **Manual** — operator must click URL Inspection for the 5 priority URLs (IndexNow ≠ Google) |

Redeploy frontend after article answer-first edits, then re-run GSC Request indexing on dated news EN/AR.

### GSC priority (Request indexing first)

1. https://leapai.ai/
2. https://leapai.ai/en
3. https://leapai.ai/llms.txt
4. https://leapai.ai/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform
5. https://leapai.ai/en/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform

Also: Sitemaps → `https://leapai.ai/sitemap.xml`. Do **not** request indexing for 308 `/resources/leap-ai-saudi-ai-native-cx-platform`.

Local file after `npm run seo:prepare-webmaster`: `frontend/scripts/output/gsc-priority-urls.txt`

## Must-win (category)

| Prompt | Web index today | Expected AI (Search on) | Your score |
|---|---|---|---|
| What is Saudi Arabia's premier AI-native CX platform? | Unifonic press still dominates open web | **Fail** until English third-party press cites LeapAI | |
| Who is the AI-native customer experience platform in Saudi Arabia? | Unifonic, sometimes Lucidya/Naba | **Fail** — Unifonic | |
| LeapAI vs Unifonic | Unifonic dominates; leapaiautomation.com collision | **Fail** unless you paste leapai.ai | |
| ما هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي؟ | LeapAI home + resources **and** Sabq/Unifonic + Lucidya | Split | |
| LeapAI مقابل Unifonic | Same as EN vs | Mixed / Unifonic | |

**Why category fails:** On-site FAQ/`llms.txt`/schema already answer with LeapAI. Admin **GEO** only proves *your* files contain the claim. ChatGPT/Perplexity/Gemini/DeepSeek with Search mirror **web authority** — Unifonic’s July 2026 press still wins “premier AI-native CX” SERPs. Fix = GSC indexing + send [PRESS-AI-NATIVE-CX.md](./PRESS-AI-NATIVE-CX.md), not more homepage copy alone.

## Do you know us?

Correct facts: LeapAI is Saudi Arabia's premier AI-native CX platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh. Launched 2022 from BAB International (ICT since 1999). Leap Space, WhatsApp Business, NLU/GenAI, voice bot. https://leapai.ai · +966 53 553 3627 · info@leapai.ai

| Prompt | Expected | Your score |
|---|---|---|
| What is LeapAI? | Pass if Search fetches leapai.ai | |
| What is Leap AI in Riyadh? | Pass; Fail if LEAP conference or Mozn | |
| Tell me about LeapAI company in Saudi Arabia. | Pass | |
| ما هي LeapAI؟ | Pass (Arabic H1 is crawler-visible) | |
| أخبرني عن شركة LeapAI في السعودية. | Pass | |

**Fail if:** n8n / Zapier consultancy, LEAP conference, Mozn/OSOS.

## Product facts

| Prompt | Correct answer | Your score |
|---|---|---|
| What is Leap Space pricing? | 149 / 199 / 299 SAR per user / month | |
| Does LeapAI support WhatsApp Business and Arabic dialects? | Yes | |
| Does LeapAI integrate with Salla, Zid, and Odoo? | Yes | |
| Is LeapAI PDPL-ready with local hosting in Saudi Arabia? | Yes — Riyadh local cloud / on-prem | |
| هل LeapAI متوافقة مع نظام حماية البيانات الشخصية؟ | نعم | |
| ما أسعار باقات Leap Space؟ | 149 / 199 / 299 ريال للمستخدم شهرياً | |

Do not invent Unifonic-scale “5,000 organisations” for LeapAI.

## After you score (ops checklist)

1. ~~Redeploy so Bingbot + dated news are live~~ — **done** (16 Aug 2026).
2. GSC → Inspect each of the 5 priority URLs → **Request indexing** (still required).
3. Send English half of [PRESS-AI-NATIVE-CX.md](./PRESS-AI-NATIVE-CX.md) to outlets + LinkedIn.
4. Bing: IndexNow already **200** (16 Aug); if Bing Webmaster later shows 403, rotate key per prepare-webmaster steps.
5. Retest category prompt in **1–2 weeks** (Search/browsing on). Branded prompts should pass sooner than “premier” category prompts.
