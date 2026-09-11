# Changelog

All notable changes to the ssifinalexpense.com asset repo are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Changes to anything under `/compliance/` must cite the FMO sign-off in the
entry.

## [Unreleased]

## [2026-09-10]

### Added

- Repo structure: `/widgets/`, `/compliance/`, `/docs/`, `/deploy/`, `/assets/`,
  `.gitignore`, `README.md`, this changelog.
- `widgets/ssi-cost-estimator.html` — four-step final expense cost estimator
  (age, gender, coverage, tobacco). Returns an estimated monthly range for
  simplified-issue and guaranteed-issue coverage side by side, fills hidden
  qualification fields on the existing lead form, and hands off to the phone
  number. Rate basis: MoneyGeek 2026 final expense analysis, updated
  12 Aug 2026. Review by 1 Aug 2027.
- `compliance/ssi-medicare-disclosures.html` — three blocks:
  - Block A: CMS simplified TPMO disclaimer set for `/medicare/` (TPMO
    disclaimer, not-connected-or-endorsed line, deductibles/copays/Part B
    premium paragraph, TTY 711).
  - Block B: footer licensing line, entity name only.
  - Block C: `/medicare/` copy replacements stripping every named plan
    benefit, keyed to the live page text as served 10 Sep 2026.
- `compliance/fmo-review-packet.md` — cover, four questions for the FMO, the
  full proposed `/medicare/` page text, Block A as drafted, and the cover
  email.
- `docs/audit.md` — the ssifinalexpense.com site audit, committed unchanged.
- `docs/open-items.md` — register of everything blocked on information Jimmy
  has to supply.
- `deploy/release-1-ship-now.md` — checklist of everything that ships without
  waiting on anyone.
- `deploy/release-2-medicare-held.md` — HELD. The `/medicare/` work waiting on
  the FMO determination.
- `assets/ssi-logo.png`.
- **The site itself**, deployable to Vercel: `src/` sources, `scripts/build.js`,
  committed page HTML for `/`, `/final-expense-insurance/`, `/medicare/`
  (noindex, held), `/health-insurance/`, `/about-us/`, `/contact-us/`,
  `/privacy/`; `assets/site.css` and `assets/site.js`; `api/lead.js` form
  handler with TCPA consent evidence, honeypot and optional Turnstile;
  `vercel.json` with 301s (`/heatlh-insurance/` → `/health-insurance/`,
  `/privacy-policy` → `/privacy/`, `/life-insurance` →
  `/final-expense-insurance/`) and security headers (HSTS, CSP,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy);
  `robots.txt`, `sitemap.xml`, `assets/favicon.svg`.
- `preview/index.html` — internal links page (was the repo root; moved when
  the site took the root).
- Release 1 items implemented in the site: viewport without zoom lock, `tel:`
  header number and sticky mobile call bar with open/closed state, one quote
  form sitewide (Name / Phone / ZIP / DOB, visible labels, unchecked consent
  box, honeypot), "Save Up to 60%" deleted, "instant quotes" → "same-day
  quotes", editorial note and Medicare copy gone from the health page, H1 on
  every page, skip link, visible focus, 18px base / ≥16px inputs, meta
  descriptions and Open Graph on every indexable page, `InsuranceAgency` +
  `FAQPage` JSON-LD, contextual links between the three product pages,
  Calendly `?month=` stripped, one experience number (18 years / founded
  2008), children's ages removed, dynamic copyright year, active-page nav
  indicator, health page named one thing everywhere.

### Changed

- **Site redesigned to match and extend the existing Divi site** instead of a
  generic look: Poppins, the gold / navy / blue palette, full-bleed photo
  heroes with white type and gold CTAs, the two-row header (call line + gold
  button over the uppercase nav), the black four-column footer with the
  white logo, blue-icon trust blurbs, white testimonial cards on the grey
  band, the gold call-out band, the photo/FAQ split and the gold
  enrollment-steps + form section. All photography pulled from the WordPress
  media library into `assets/img/`.
- **The rate estimator now sits on the homepage**, in a card overlapping the
  hero, as the primary above-the-fold conversion — plus on
  `/final-expense-insurance/`. It is inlined at build time from
  `widgets/ssi-cost-estimator.html` (no runtime fetch), and rethemed to the
  site palette.
- BBB A+ badge restored to the hero as on the current site (still unlinked
  until the profile URL is supplied).
- Nav labels and order match the current site (Health Insurance / Medicare /
  Life Insurance / About Us / Contact Us); "Life Insurance" now points to the
  dedicated `/final-expense-insurance/` page.

- `widgets/ssi-cost-estimator.html`: result disclaimer now names the licensed
  entity ("Senior Solutions Insurance is a licensed insurance agency. Not all
  products are available in all states.").
- `compliance/ssi-medicare-disclosures.html`, Block A: first paragraph replaced
  with the CMS-permitted simplified TPMO disclaimer, which requires no
  organization or product counts. The "This ad is not from the government"
  lead line was dropped with it.
- `compliance/ssi-medicare-disclosures.html`, Block A: the sentence
  "$0 premium plans are not available in all areas" was dropped from the
  deductibles/copays paragraph. It only exists to qualify a $0-premium claim,
  and the page no longer makes one.
- `compliance/ssi-medicare-disclosures.html`, Block C: the "Comprehensive
  coverage and no cost to the beneficiary" card replacement now matches the
  Release 1 interim card ("Comprehensive coverage in one plan" / "Speak with a
  licensed agent to compare the Medicare Advantage plans available where you
  live.") so there is one version of that card, not two.

- `/medicare/` Step 3: "start enjoying your benefits immediately" → "Enroll in
  the plan that suits your needs." Effective dates are not immediate. Block C
  and the FMO packet updated to match.
- Carrier logos pulled from the WordPress media library into
  `assets/carriers/` (renamed to plain names, alt text corrected) and shown
  on the homepage, `/medicare/` and `/health-insurance/`. `bbb.png` saved to
  `assets/` but not displayed until the BBB profile URL is supplied.
- `api/lead.js` gained an email delivery option (Resend) alongside the
  webhook, so leads can go straight to an inbox with no CRM in the loop.

### Removed

The following values were **fabricated as layout placeholders** in an earlier
draft of `compliance/ssi-medicare-disclosures.html`. They were never real. They
have been removed from every file, including commented-out code, and must not
be reintroduced from any old copy:

- CMS material ID `MULTIPLAN_SSIFE_2027_0416_M` — **fabricated.** A material
  ID is issued through the CMS submission and review process; it is not a
  format an agency can self-assign. The rewritten `/medicare/` page names no
  plan benefit and is intended not to require material review, so it carries
  no material ID at all.
- Organization count "9 organizations" — **fabricated.** CMS requires the
  actual count of organizations represented. Replaced by the simplified TPMO
  disclaimer, which states no count.
- Product count "74 products" — **fabricated.** Same as above.
- Commented-out Block B2 (licensing line with a state list). No state list is
  published until the agency's actual resident and non-resident licence
  records are supplied — see `docs/open-items.md`.
- From `/medicare/` (via Block C and Release 1): "Comprehensive coverage and no
  cost to the beneficiary"; "many plans offering no out-of-pocket costs"; and
  every named plan benefit — vision, dental, prescription drugs, drug coverage,
  fitness programs, transportation assistance.
