# How to Use the Admin Dashboard (Simple Guide)

> **No programming needed.** Change the website from your browser.

---

## Login

| Field | Value |
|-------|--------|
| **URL** | `https://your-domain.com/leap-ai/dashboard/login` |
| **Email** | `admin@leapai.ai` |
| **Password** | `admin123` |

Local: http://localhost:3000/leap-ai/dashboard/login

---

## Dashboard home

After login you see the main dashboard with:

- **Homepage settings** — hero, contact, menus, SEO, FAQ
- **GEO** — check AI crawler files and AI search readiness
- **Content library** — Solutions, Products, Use cases pages
- **Contact Us inbox** — messages from the contact form
- **Create new page** — add new content

Always click **Save** at the bottom of Settings when you finish editing.

---

## What you can change from admin

### 1. Site Settings (`Dashboard → Settings`)

| Section | What it controls on the website |
|---------|----------------------------------|
| **General** | Maintenance mode, default language (Arabic/English) |
| **Contact information** | Email, phone, business hours, address (header + footer + contact page) |
| **Social media** | Facebook, Twitter, Instagram, YouTube, LinkedIn links in footer |
| **Brand / SEO** | Site title, meta description, footer mission text |
| **Homepage images** | Hero image, section images, logo |
| **Hero text** | Main homepage headline and button text (AR + EN) |
| **Homepage stats** | Numbers on homepage (projects, experts, customers) |
| **Header & footer navigation** | Menu links: Home, About, Partner, Contact, Privacy, FAQ |
| **Technology partners** | Partner logos on homepage (Meta, Microsoft, etc.) |
| **Pricing plans** | Leap Space 149 / 199 / 299 cards on homepage |
| **Add-ons accordion** | Homepage add-ons section title and accordion items |
| **About Us page** | Full About page text, image, stats, and quote |
| **Privacy Policy page** | Full Privacy Policy text and sections |
| **Button labels** | Main CTA buttons (pricing, stores, header signup, etc.) |
| **Homepage FAQ** | Questions and answers on homepage (`/#faq`) |

---

### 2. Content library (`Dashboard → Content`)

Edit **Solutions**, **Products**, and **Use cases** pages:

- Title (Arabic + English)
- Short description
- Full description
- Features list
- Image
- Publish / hide page

These pages appear in the top menu mega dropdowns and on list pages.

**To edit one page:** Content → click a row → edit → Save.

**To add a page:** Content → Add new → fill form → Save.

---

### 3. Contact Us inbox (`Dashboard → Contact`)

Read messages sent from the **Contact Us** form on the website.

You cannot edit the form labels here — only read incoming messages.

---

### 4. GEO — AI visibility (`Dashboard → GEO`)

Check that AI tools (ChatGPT, Perplexity, Claude) can read your public summary files.

- Click **Check all links** — each file should show **OK**
- Click **Open** on any row to view the text file in a new tab
- Use the links on the page to update **FAQ**, **SEO**, and **Content** (those feed GEO automatically)

You do **not** need to run scripts or edit code.

---

## Quick map: “I want to change…”

| I want to change… | Go to… |
|-------------------|--------|
| Logo | Settings → Homepage images → Logo |
| Homepage main text | Settings → Hero text |
| Homepage banner image | Settings → Homepage images → Hero |
| Email or phone (header/footer) | Settings → Contact information |
| Working hours | Settings → Contact information → Business hours |
| Footer links (الرئيسية, اتصل بنا…) | Settings → Header & footer navigation |
| Header menu links | Settings → Header & footer navigation |
| FAQ on homepage | Settings → Homepage FAQ |
| Partner logos on homepage | Settings → Technology partners |
| Pricing cards (149/199/299) | Settings → Pricing plans |
| Add-ons accordion on homepage | Settings → Add-ons accordion |
| About Us page text | Settings → About Us page |
| Privacy Policy text | Settings → Privacy Policy page |
| Button labels (Talk to advisor, etc.) | Settings → Button labels |
| Google/search description | Settings → Brand / SEO |
| Check AI crawler files (GEO) | GEO → Check all links |
| Facebook / LinkedIn links | Settings → Social media |
| A product or solution page | Content → open page → edit |
| Put site in maintenance | Settings → General → Maintenance mode |
| Read contact form messages | Contact Us inbox |

---

## What is NOT in admin yet (ask developer)

These are still built into the website code:

| Item | Notes |
|------|--------|
| Services / Omni-channel section text | Fixed translations |
| Store integration card titles | Fixed in code |
| Acquire section heading | Fixed translations |
| Some header/footer chrome labels | Fixed translations |

If you need these editable too, ask your developer.

---

## Step-by-step: common tasks

### Change logo

1. Login → **Settings**
2. Scroll to **Homepage images**
3. Click upload on **Logo**
4. Click **Save** at the bottom

### Change footer links

1. Login → **Settings**
2. Scroll to **Header & footer navigation**
3. Edit **Footer — main links** or **Footer — legal links**
4. Change label (Arabic + English) and path (e.g. `/about-us`)
5. Click **Save**

### Edit a product page

1. Login → **Content**
2. Filter or find the product
3. Click to open
4. Edit title, description, image
5. Click **Save**

### Turn on maintenance mode

1. Login → **Settings**
2. **General** → turn on **Maintenance mode**
3. Public site shows maintenance page; dashboard still works

---

## Tips

- Fill in **both Arabic and English** for best results
- Use **Save** once after all changes (sticky bar at bottom)
- Keep the public site open in another tab — after you save, changes appear within a few seconds (no need to wait a minute)
- Use **Preview site** from dashboard to check changes
- Paths for links start with `/` — examples: `/`, `/about-us`, `/#faq`, `/privacy-policy`

---

*Last updated: July 2026*
