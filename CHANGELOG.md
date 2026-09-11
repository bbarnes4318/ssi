# Changelog

All notable changes to the ssifinalexpense.com asset repo are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Changes to anything under `/compliance/` must cite the FMO sign-off in the
entry.

## [Unreleased]

## [2026-09-11] — A- to A+ optimization pass

### Added

- `/terms-and-conditions/` — the terms as supplied by the client (the live
  WordPress text, last updated 15 Nov 2024), so the footer link no longer
  points at the old domain. Markup only: numbered section headings with ids,
  sub-headings, real lists, a sticky contents rail (collapsible on phones)
  and a styled contact block. `/privacy/` got the same treatment. Both keep
  the address the documents already carried, per the client.
- `/404.html` — branded not-found page with the estimator, rates and phone as
  the three ways out. `noindex`.
- Estimator: "Step N of 4" progress text with a "Private · no contact details
  needed" note; "Under 50" and "Over 85" age options that explain the
  situation and hand off to the phone instead of dead-ending; a visible
  "An estimate, not a quote" line on the result card (the long version stays
  under "About these figures"); a third next step, "Schedule a time online"
  (`data-schedule` on the widget root); answers persist in `sessionStorage`
  so a refresh or the browser's back button restores the result.
- Lead form: per-field, plain-English validation under each field ("Please
  enter a 10-digit phone number, like 303-555-0123."), `aria-invalid` and
  `aria-describedby` wiring, a sending state on the button, a second-tap
  guard, and a success message that confirms the estimator details when the
  visitor used it. Field labels say why ZIP and date of birth are asked.
- WebP variant of every photo, served through `<picture>` (generated at
  build time; `scripts/imgsize.js` stamps true pixel sizes). Hero photo
  preloaded on the two pages that use it; `image-set()` WebP for the hero
  background. Unused photos and the superseded JPEG carrier logos removed.
- Header "Get a Quote" resolves to `/contact-us/#quote` on pages without the
  form (it was a dead `#quote` anchor on `/contact-us/` and `/privacy/`).
- Mobile menu closes on Escape and on an outside tap; the button reads
  "Close" while open. Rate-card tabs got real tab semantics and arrow-key
  navigation. `prefers-reduced-motion` now disables every transition.
- Schema: `legalName`, `foundingDate`, `founder`, `logo`, `hasMap`,
  `description` on the `InsuranceAgency`; `og:image` size/alt, `og:locale`,
  `theme-color`.

### Changed

- Homepage hero: specific sub-copy ($5,000–$25,000, no exam, licensed agents
  compare up to 25 carriers), buttons "See what it costs" / "Talk to a
  licensed agent", a proof row (BBB, since 2008, licensed agents) instead of
  the lone badge. Trust strip now carries different facts (families helped,
  same-day quotes, no exam, Google rating) so the fold does not repeat itself.
  "New" kicker → "Free estimate". Uppercase, exclamation-mark buttons retired.
- Homepage copy rewritten without filler: "Why families choose" blurbs, the
  founder section ("18 years of helping families plan for final expenses",
  no "nationally recognized" headline claim), the gold band ("Ready to see
  what you qualify for?" — "how much you can save" implied a savings claim).
- Reviews: six testimonials instead of nine under a badge that says "6
  Google reviews"; each attributed "Senior Solutions client"; link text
  "See our reviews on Google" (no count that could disagree with the badge).
  No testimonial text was altered.
- FAQ: two new entries — "Is the number on this page a quote?" and "Do I have
  to give my contact information to see prices?" — on the page and in the
  `FAQPage` schema.
- Quote-form section retitled "Prefer we call you? Here is what happens
  next." with three concrete steps (agent calls back, we compare carriers,
  you decide) instead of "Step 1 / Speak with our experts". Button "Request
  my call back" everywhere, and the TCPA consent text now names that button
  (it said "Submit", which was not on the page). Form intro no longer promises
  "all of the benefits you're entitled to".
- About page: hero "A real insurance office, run by the people you talk to";
  story and founder copy rewritten from the supplied facts only; the founder
  quote no longer appears twice; product trio links say where they go.
- Contact page: "Request a call back" is the gold primary, "Schedule a time
  online" secondary; the form card is `#quote`; "What happens next" is four
  steps starting with "You choose how to connect"; on phones the call card
  comes straight after the headline.
- Health page: hero "ACA Marketplace Health Insurance, Compared by a Licensed
  Agent"; "Why choose" blurbs replaced ("We understand that no two individuals
  are the same" is gone).
- Footer: "Coverage" / "Company" / "Hours (Mountain Time)" columns, identity
  line, TTY, hours summary, phone in the same `1-888-957-3337` format as the
  rest of the site (was `(888) 957-3337`), and a second licensing-line
  paragraph stating that estimator and rate-table figures are estimates, not
  quotes. Terms link → `/terms-and-conditions/`.
- Sticky mobile call bar reads "Call 1-888-957-3337" over the open/closed
  state; header phone label "Talk to a licensed agent" (was "Free quote, no
  obligation").
- Mobile: "Why" blurbs collapse to icon-left rows, trust strip is two
  columns, hero buttons hide where the estimator immediately follows, rate
  table scrolls inside its card at 320px, 21rem breakpoint for the smallest
  phones. Legal pages share one navy hero and a `prose--legal` measure.
- Carrier logo wall: no hover lift, consistent 2.6rem cap and 85% width.
- `/medicare/` was **not** edited beyond the shared header, footer and form —
  its copy is Block C under FMO review. The compliance file's own
  recommendation to replace the H1 ("Discover the Best…") still stands.

### Fixed

- Life page "At a glance" call card: `.split img` was stretching the agent
  avatar to full width, breaking the card and overflowing the viewport at
  375px.
- Privacy policy overflowed horizontally on phones (unbroken URLs).
- Contact-page consent "Privacy Policy" link was white on white.
- `.form__err` rows and the consent error were hidden on the contact card by
  the rule that hid the form intro.
- Steps used `h4` directly under `h2`; now `h3`.

### Removed

- `assets/img/about-founder.jpg`, `about-home.jpg`, `consult.jpg`,
  `hero-health.jpg`, `hero-medicare.jpg`, `agents-pair.jpg` and the JPEG
  carrier logos superseded by SVGs (`aetna`, `aig`, `anthem`, `humana`,
  `uhc`) — none were referenced.


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

- **Palette switched to the AurumShield system**: deep institutional navy
  (`#0B1220` / surfaces `#0F1A2B` `#13233A` `#182B46`, border `#243653`) +
  bullion gold (`#C6A86B`, hover `#D3B77D`, pressed `#C49A4A`, muted
  `#9F8A4C` for gold-as-text). Blue `#5A8CCB` is link-hover only, `#7FA6FF`
  the focus ring, cyan `#20A4F3` only for the "Open now" trust state. Gold
  buttons carry navy text (white-on-gold fails contrast). The Divi site's
  gold content sections became navy surfaces with gold accents; the short
  CTA band stays gold with navy text. Footer is navy with a gold rule.

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
