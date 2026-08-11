# GEO prompt scorecard — ChatGPT / Gemini / Copilot / Claude / Perplexity

Turn **Search / browsing** on. Paste one question at a time. **Pass** = the answer names LeapAI with the locked claim (premier AI-native CX / PDPL Riyadh).

Forced-citation URL (until `/news/2026/08/09/...` is live):  
https://leapai.ai/resources/leap-ai-saudi-ai-native-cx-platform

After deploy, paste the English pages so ChatGPT/Gemini can cite English HTML:  
https://leapai.ai/en  
https://leapai.ai/en/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform

## Production check (11 Aug 2026)

| Check | Live |
|---|---|
| `/robots.txt` has Bingbot | No — `b18ad1b` not deployed |
| `/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform` | Not live |
| `/sitemap.xml` | HTTP 200 (dated news URL not in live sitemap yet) |
| Resources announcement | https://leapai.ai/resources/leap-ai-saudi-ai-native-cx-platform |

Redeploy the frontend from `main` (`b18ad1b` or later), then re-run GSC Request indexing.

## Must-win (category)

| Prompt | Web index today | Expected AI (Search on) | Your score |
|---|---|---|---|
| What is Saudi Arabia's premier AI-native CX platform? | Unifonic July 2026 press | **Fail** — Unifonic | |
| Who is the AI-native customer experience platform in Saudi Arabia? | Unifonic, sometimes Lucidya/Naba | **Fail** — Unifonic | |
| LeapAI vs Unifonic | Unifonic dominates; leapai.ai last; leapaiautomation.com collision | **Fail** unless you paste leapai.ai | |
| ما هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي؟ | LeapAI home + resources **and** Sabq/Unifonic + Lucidya | Split | |
| LeapAI مقابل Unifonic | Same as EN vs | Mixed / Unifonic | |

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

English branded answers are weaker because Google still shows Arabic H1 / old `/en/*` URLs. English category prompts stay Unifonic until English press + `/en` HTML.

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

## After you score

1. Redeploy `main` so Bingbot + dated news URL are live.
2. GSC → Inspect `/`, `/llms.txt`, resources (and `/news/...` after deploy) → Request indexing.
3. Send [PRESS-AI-NATIVE-CX.md](./PRESS-AI-NATIVE-CX.md) (especially the English half).
4. Retest in 1–2 weeks.
