# ssi — ssifinalexpense.com

The static site for **ssifinalexpense.com** (Senior Solutions Insurance), plus
the compliance language, drop-in widgets and deployment plans behind it.

Deploys to Vercel from `main`. There is no build step on Vercel: the page HTML
is committed. Edit under `src/`, then run

    node scripts/build.js

and commit the output alongside the source.

## The site

| URL | Source | Notes |
|---|---|---|
| `/` | `src/pages/home.html` | |
| `/final-expense-insurance/` | `src/pages/final-expense-insurance.html` | Rate tables, underwriting explainer, carrier table, estimator (loaded from `/widgets/`). |
| `/medicare/` | `src/pages/medicare.html` | **HELD, served `noindex`.** Block C copy, Block A disclosure inline. See `deploy/release-2-medicare-held.md`. |
| `/health-insurance/` | `src/pages/health-insurance.html` | `/heatlh-insurance/` 301s here. |
| `/about-us/` | `src/pages/about-us.html` | |
| `/contact-us/` | `src/pages/contact-us.html` | |
| `/privacy/` | `src/pages/privacy.html` | Text as published on the live WordPress site. |
| `/preview/` | `preview/index.html` | Internal links page, `noindex`. |
| `/api/lead` | `api/lead.js` | Quote form handler. Needs `LEAD_WEBHOOK_URL` (see below). |

Shared pieces: `src/layout.html` (head, header, footer, sticky call bar),
`src/partials/quote-form.html` (the one lead form, every page), `assets/site.css`,
`assets/site.js`. Redirects and security headers are in `vercel.json`.

### Environment variables (Vercel → Settings → Environment Variables)

Set **one** of the two delivery options (both is fine). Until one is set the
form returns 503 and tells the visitor to call.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | **Option 1, simplest.** Emails every lead to `LEAD_TO_EMAIL`. Free resend.com account; until a sending domain is verified there, `LEAD_TO_EMAIL` must be the address the Resend account was created with. |
| `LEAD_WEBHOOK_URL` | **Option 2.** POSTs every lead as JSON to that URL — a CRM webhook, a Make.com/Zapier catch hook, a Google Apps Script. |
| `TURNSTILE_SECRET` | Optional bot check (Cloudflare Turnstile, free). When set, submissions must carry a valid token; put the matching site key in `TURNSTILE_SITE_KEY` at the top of `assets/site.js`. The honeypot runs regardless, so this can wait until spam actually shows up. |

Every lead carries TCPA consent evidence: timestamp, IP, user agent, page URL
and the exact consent text shown. Whatever receives the webhook must store it.

## Layout

| Path | What it is |
|---|---|
| `/src/` | Page sources, layout and partials. Edit here, then build. |
| `/scripts/` | `build.js` — assembles `src/` into the committed page HTML and `sitemap.xml`. |
| `/api/` | Vercel serverless functions (`lead.js`). |
| `/widgets/` | Self-contained HTML widgets. The estimator is served from here and loaded into `/final-expense-insurance/`; it also drops into a WordPress HTML widget unchanged. |
| `/compliance/` | Regulated disclosure language and the FMO review packet. Verbatim only — see below. |
| `/docs/` | The site audit and the open-items register. |
| `/deploy/` | Release checklists. Release 1 is implemented in this site and doubles as its QA list; Release 2 is held. |
| `/assets/` | Brand assets (`ssi-logo.png`, 325×100). |
| `/preview/` | Internal links page for the widget previews and docs. `noindex`. |
| `CHANGELOG.md` | What changed, when, and why. Read the *Removed* entries before reusing any old copy. |

## Status

| Deliverable | File | Status | Waiting on |
|---|---|---|---|
| Final expense cost estimator | `widgets/ssi-cost-estimator.html` | **Ready to ship** — Release 1 | Nothing. Goes on the new `/final-expense-insurance/` page. |
| Footer licensing line (Block B) | `compliance/ssi-medicare-disclosures.html` | **Ready to ship** — Release 1 | Nothing. Entity name is supplied; state list deliberately omitted. |
| `/medicare/` false-claim removal | `deploy/release-1-ship-now.md` | **Ready to ship** — Release 1 | Nothing. Removal of a false claim does not wait on the FMO. |
| `/medicare/` TPMO disclaimer (Block A) | `compliance/ssi-medicare-disclosures.html` | **HELD** — Release 2 | FMO determination (marketing vs. communications) and current plan-year disclaimer text. |
| `/medicare/` copy rewrite (Block C) | `compliance/ssi-medicare-disclosures.html` | **HELD** — Release 2 | Same FMO determination. |
| FMO review packet | `compliance/fmo-review-packet.md` | **Ready to send** | Jimmy to send it. |
| Site audit | `docs/audit.md` | Reference | — |
| Open items | `docs/open-items.md` | Live register | See the table. |

While Release 2 is held, `/medicare/` should carry
`<meta name="robots" content="noindex, follow">`. Details in
`deploy/release-2-medicare-held.md`.

## Before you edit anything

Files under `/compliance/` contain **regulated disclosure language that must be
used verbatim.** The TPMO disclaimer, the not-connected-or-endorsed line and
the Part B premium statement are CMS-governed wording, not house copy.

Any change to a file in `/compliance/` — including punctuation, line breaks
inside a sentence, or "tidying" — needs **FMO compliance sign-off before it
goes live.** Record the sign-off in `CHANGELOG.md` when you commit the change.

Do not reintroduce values from old copies of these files. Several placeholder
values were removed because they were fabricated; they are named in the
*Removed* section of `CHANGELOG.md` so they are recognisable if they resurface.

## Rate data

`widgets/ssi-cost-estimator.html` carries market-average premium figures from
**MoneyGeek's 2026 final expense rate analysis, updated 12 August 2026.** The
same figures back the rate tables planned for `/final-expense-insurance/`.

The source must be re-pulled annually. A rate table dated 2026 sitting on the
site in 2028 is worse than no table at all.

**Review by: 1 August 2027.**

When re-pulling: update the `BASE` table in the widget, the two rate tables on
the page, the "updated" date in every footnote and disclaimer that cites the
source, and this section.
