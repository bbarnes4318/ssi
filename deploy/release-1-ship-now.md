# Release 1 — ship now

**Status: READY.** Nothing in this file waits on the FMO or on anyone else.
Everything blocked on outside information is in `release-2-medicare-held.md`
or `../docs/open-items.md`, not here.

Source of the item numbering: the P0–P4 task list. P3's contents were not
itemised in the brief and are reconstructed from `../docs/audit.md` §3 — see
the last row of `../docs/open-items.md`.

Format: `[ ] item — touches: page or template — verify: how`.
Where a step says "view source", that means the served HTML, not the builder.

---

## P0 — today

- [ ] **P0.1 Viewport zoom lock removed sitewide.** Change the viewport tag to
  `<meta name="viewport" content="width=device-width, initial-scale=1">`;
  delete `maximum-scale` and `user-scalable`.
  — touches: theme `<head>` / header template, all pages
  — verify: view source on all five pages, confirm the tag; pinch-zoom on
  Chrome Android (iOS Safari ignores the lock, so Android is the real test).
- [ ] **P0.2 Unpublished editorial note deleted from the health insurance
  page.** Remove "An interactive comparison tool could improve user engagement
  here. Consider linking to a feature that allows users to compare plans side
  by side." from under the "Compare plans" heading.
  — touches: `/heatlh-insurance/`
  — verify: search the served page text for "comparison tool"; zero hits.
- [ ] **P0.3 Wrong-product Medicare copy replaced on the health insurance
  page.** The "Why Choose Senior Solutions Insurance" block on the ACA page
  says the team helps people "find the best Medicare Advantage plans".
  Rewrite it to reference ACA marketplace coverage.
  — touches: `/heatlh-insurance/`
  — verify: search the served page text for "Medicare Advantage"; zero hits on
  the ACA page.
- [ ] **P0.4 Header phone number wrapped in `tel:` sitewide.**
  `<a href="tel:+18889573337">` with a minimum 48×48px tap area.
  — touches: header template, all pages
  — verify: tap the header number on a real phone; the dialer opens with
  1-888-957-3337 prefilled. Check every page, not just the homepage.
- [ ] **P0.5 `/medicare/` false claim removed.** Ships immediately and
  independently of the FMO — this is removal of a false claim, not
  publication of new marketing. Delete "Comprehensive coverage and no cost to
  the beneficiary" and "Includes vision, dental, and prescription drugs, with
  many plans offering no out-of-pocket costs." Replace the card with:
  - Heading: **Comprehensive coverage in one plan**
  - Body: **Speak with a licensed agent to compare the Medicare Advantage
    plans available where you live.**
  — touches: `/medicare/`, first card under "Why Choose Medicare Advantage?"
  — verify: search the served page text for "no cost" and "out-of-pocket";
  zero hits. The other two cards and the rest of the page are untouched until
  Release 2.
- [ ] **P0.5a `/medicare/` set to `noindex, follow`** until Release 2 ships.
  `<meta name="robots" content="noindex, follow">` on that page only.
  — touches: `/medicare/` `<head>` (Yoast/RankMath per-page setting, or the
  page template)
  — verify: view source on `/medicare/`, confirm the tag; confirm it is
  absent from every other page.
- [ ] **P0.6 "Save Up to 60%" replaced.** Delete the claim. It is an
  unsubstantiated savings claim in a state-regulated advertising context, and
  it either gets a footnote with a real methodology or it goes; there is no
  third option. No methodology exists today, so it goes. (If one is supplied
  later, see `../docs/open-items.md`.)
  — touches: homepage trust strip
  — verify: search the served homepage text for "60%"; zero hits.
- [ ] **P0.7 "Instant quotes" replaced with "same-day quotes".** The site
  cannot return an instant quote; the form produces a callback. Change the
  trust-strip line so it promises what actually happens.
  — touches: homepage trust strip
  — verify: search the served homepage text for "instant"; zero hits.

## P1 — forms, accessibility, trust

- [ ] **Duplicate form removed** on `/contact-us/`. Keep the one in the main
  content area; delete the copy inside the footer CTA block.
  — touches: `/contact-us/`
  — verify: one `<form>` in the served HTML; no duplicate `id` values
  (axe flags these).
- [ ] **Visible labels on every form field.** Persistent `<label for>`
  associated by `id`; placeholders demoted to format hints.
  — touches: the quote form component, every page it renders on
  — verify: axe DevTools "form elements must have labels" passes; labels stay
  visible after typing.
- [ ] **Quote form fields rebuilt.** Name, Phone, ZIP, Date of Birth. Drop the
  free-text Message field. Add hidden `ssi_age`, `ssi_gender`, `ssi_coverage`,
  `ssi_tobacco` so the estimator can fill them.
  — touches: the quote form component
  — verify: submit a test lead; the CRM/email record shows the four fields
  and the four hidden fields, and no Message field.
- [ ] **Consent checkbox with stored evidence.** Unchecked checkbox with the
  TCPA language adjacent; on submit, store timestamp, IP, user agent, page
  URL and the exact consent text served.
  — touches: the quote form component and its submission handler
  — verify: submit a test lead with the box unchecked (must be refused) and
  checked; confirm the stored record contains all five evidence fields.
- [ ] **Turnstile plus honeypot.** Cloudflare Turnstile on every form, plus a
  hidden honeypot field rejected server-side when filled.
  — touches: the quote form component
  — verify: a submission with the honeypot filled is rejected; Turnstile
  challenge renders on a real device.
- [ ] **Alt text fixes.** Rewrite every `alt` descriptively. Strip the
  `Avanti-renovation-green` title attribute from the footer logo. Replace
  `mold-icon-1.png` with a real phone icon and give the `tel:` icon link an
  accessible name. Fix the mismatched alts on the ACA page (`alt="devoted"`
  on `uhc.jpg`, `alt="uhc"` on `aetna.jpg`).
  — touches: all pages, footer template
  — verify: grep the served HTML for `Avanti`, `mold-icon`, `alt=""`; zero
  hits. axe "images must have alternate text" passes.
- [ ] **H1 on the About page.** Add an H1; demote the current H2s one level.
  — touches: `/about-us/`
  — verify: exactly one `<h1>` in the served HTML.
- [ ] **Heading hierarchy normalised sitewide.** No level skips (H2 → H4/H5).
  — touches: all pages
  — verify: axe "heading levels should only increase by one" passes on all
  five pages.
- [ ] **Skip-to-content link** as the first focusable element.
  — touches: header template
  — verify: press Tab once on page load; the skip link appears and Enter moves
  focus to `<main>`.
- [ ] **Visible focus styles.** 2px outline, 3:1 contrast against adjacent
  colours, on every interactive element.
  — touches: theme CSS
  — verify: Tab through the homepage; every stop is visibly outlined.
- [ ] **18px base body text, 16px minimum on inputs.**
  — touches: theme CSS
  — verify: computed `font-size` on `body` ≥ 18px; on every `input`/`select`
  ≥ 16px. Focus a form field on iOS Safari: no auto-zoom.
- [ ] **BBB badge.** Link the badge to the live BBB business profile, or
  remove it. **The profile URL is not yet supplied** (`../docs/open-items.md`)
  — until it is, remove the badge rather than leave an unverifiable one.
  — touches: homepage trust strip
  — verify: the badge is either a working link to bbb.org or absent.
- [ ] **axe pass.** axe DevTools on all five pages, plus a manual keyboard-only
  pass and a screen-reader run of the form (NVDA or VoiceOver).
  — touches: all pages
  — verify: zero critical or serious axe findings; form completes by keyboard
  alone; every field is announced with its label.

## P2 — final expense page

- [ ] **New `/final-expense-insurance/` page.** Repoint the "Life Insurance"
  nav item to it in header and footer.
  — touches: new page, header and footer templates
  — verify: page returns 200; nav links resolve to it; self-referencing
  canonical present.
- [ ] **Estimator widget** — `../widgets/ssi-cost-estimator.html` pasted into
  an HTML widget on the page, `data-form` pointing at the quote form's
  selector.
  — touches: `/final-expense-insurance/`
  — verify: complete all four steps; the result renders both bands; "Have an
  agent call me instead" scrolls to the form and the hidden fields are
  populated.
- [ ] **Both rate tables** — `docs/audit.md` Appendix A, Table A, women and
  men. Real HTML `<table>` with `<th scope="col">` and `<th scope="row">`, not
  an image. Must reflow on mobile.
  — touches: `/final-expense-insurance/`
  — verify: tables are selectable text; readable at 375px with no horizontal
  scroll on the body.
- [ ] **Underwriting explainer** — the simplified-issue vs. guaranteed-issue
  split from Appendix A, with the trade-off stated plainly (GI costs more and
  carries a two-year waiting period) and the line that a licensed agent will
  tell them in one call which they qualify for.
  — touches: `/final-expense-insurance/`
  — verify: both terms appear on the page with the trade-off sentence.
- [ ] **Carrier table** — Appendix A carrier positioning, split into
  simplified issue (Transamerica, Americo, Liberty Bankers) and guaranteed
  issue (AIG), plus the Prosperity New Vista product line.
  — touches: `/final-expense-insurance/`
  — verify: table renders as HTML; "Rates shown are averages for
  50-year-olds" appears beneath it.
- [ ] **Footnote block** — Appendix A "Footnote copy — paste as-is", beneath
  the tables.
  — touches: `/final-expense-insurance/`
  — verify: the footnote text matches Appendix A character for character and
  contains the phone number.
- [ ] **Tobacco line** beneath Table A: "Tobacco use typically adds 25–30% to
  these figures." Do not publish a tobacco table.
  — touches: `/final-expense-insurance/`
  — verify: one line, no second table.

## P3 — SEO (all except the `/medicare/` title and meta description)

- [ ] **Homepage title rewritten.** Replace `Senior Solutions Insurance |`
  with a keyworded title under 60 characters, e.g. `Final Expense & Burial
  Insurance Quotes | Senior Solutions Insurance`.
  — touches: homepage `<title>`
  — verify: view source; no trailing pipe.
- [ ] **Meta descriptions** on the homepage, `/about-us/`,
  `/health-insurance/`, `/contact-us/` and `/final-expense-insurance/`.
  150–160 characters each, each containing the phone number or a call CTA.
  **Not `/medicare/`** — that is Release 2.
  — touches: those five pages
  — verify: view source on each; a `<meta name="description">` is present.
- [ ] **URL fix `/heatlh-insurance/` → `/health-insurance/`.** 301 from the
  misspelled path; update canonical, header and footer links.
  — touches: WordPress permalink, redirect rule, header and footer templates
  — verify: `curl -I https://ssifinalexpense.com/heatlh-insurance/` returns
  301 to the corrected URL; no internal link still points at the typo.
- [ ] **Structured data.** `InsuranceAgency` (address, hours, phone, sameAs)
  and `Organization` sitewide; `FAQPage` on the homepage/FE page and the ACA
  page. **Not `/medicare/`** — that is Release 2.
  — touches: theme `<head>` and the two FAQ pages
  — verify: Google Rich Results Test passes on each page.
- [ ] **Open Graph and Twitter card tags** sitewide (`og:title`,
  `og:description`, `og:image`, `og:url`, `og:site_name`, `twitter:card`).
  — touches: theme `<head>`
  — verify: paste a page URL into a Facebook or iMessage preview; image and
  description render.
- [ ] **Contextual in-body links** between the FE, Medicare and ACA pages.
  — touches: all three product pages
  — verify: each product page has at least one body link (not nav/footer)
  to each of the other two.
- [ ] **Privacy policy URL standardised.** One of `/privacy` or `/privacy/`,
  301 the other, update footer and `/contact-us/`.
  — touches: footer template, `/contact-us/`
  — verify: `curl -I` on both; one returns 200, the other 301 to it.
- [ ] **`robots.txt` verified and XML sitemap submitted** in Search Console.
  — touches: site root, Search Console
  — verify: `robots.txt` loads and does not block anything it shouldn't;
  Search Console shows the sitemap as "Success".
- [ ] **Local SEO.** Greenwood Village, CO address and hours marked up in the
  `InsuranceAgency` schema (covered above); Google Business Profile link in the
  footer.
  — touches: footer template
  — verify: footer link resolves to the GBP listing.
- [ ] **Resources hub** — 8–12 articles targeting informational final expense
  queries (funeral cost by state, guaranteed vs. simplified issue, coverage
  amount by age, graded benefit period, FE vs. term vs. whole life). This is
  a content programme and can ship after the rest of Release 1 without
  holding anything.
  — touches: new section
  — verify: each article has its own URL, title, meta description and at
  least one contextual link to `/final-expense-insurance/`.

## P4 — performance, security, mobile

- [ ] **Images.** Convert to WebP with fallback; compress (target < 60KB per
  carrier logo); explicit `width`/`height` on every `<img>`; `loading="lazy"`
  below the fold; `fetchpriority="high"` on the hero only; `srcset`/`sizes`
  on content images; purge duplicate media (`About.jpg`/`about.jpg`,
  `anthem.jpg`/`anthem-2.jpg`); replace `favicon.jpg` with a proper
  `favicon.ico` + 180×180 apple-touch-icon + 512×512 PNG.
  — touches: media library, all pages
  — verify: PageSpeed Insights mobile: CLS < 0.1, no "serve images in
  next-gen formats" or "image elements do not have explicit width and height"
  audits failing.
- [ ] **Caching.** Caching + optimisation plugin with critical CSS extraction
  and unused-CSS removal; site behind Cloudflare; clear all cache layers so
  every page reports the same WordPress build (currently 7.1 vs 7.0.2 on
  `/about-us/`). Remove the WordPress generator meta tag while in there.
  — touches: WordPress plugins, DNS
  — verify: PageSpeed Insights mobile LCP < 2.5s; `curl -I` shows Cloudflare
  headers; no `<meta name="generator">` in the served HTML.
- [ ] **Security headers.** HSTS (with preload), `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, a basic CSP. Confirm
  `/wp-login.php` is rate-limited.
  — touches: Cloudflare / server config
  — verify: securityheaders.com grade A or better; `curl -I` shows all five.
- [ ] **Sticky mobile call bar.** Persistent bottom bar on mobile showing the
  `tel:` number and whether the office is currently open (Mon–Fri 9–7,
  Sat 9–5 Mountain).
  — touches: theme footer / a global HTML widget
  — verify: on a real phone, the bar is visible on every page while
  scrolling, tapping it opens the dialer, and the open/closed state is
  correct for the current time.

## Also in Release 1 — small audit items outside P0–P4

Nothing here waits on anyone. Each is a few minutes.

- [ ] **Strip `?month=2025-01` from every Calendly link.**
  — touches: every "Schedule A Call Online" button
  — verify: grep the served HTML for `month=`; zero hits.
- [ ] **One experience number sitewide.** Founded 2008 supports "18 years".
  Replace "25+ Years of Combined Experience", "a combined 25 years" and
  "nearly 18 year career" so all pages agree.
  — touches: homepage, `/about-us/`
  — verify: grep the served HTML for "25"; only non-experience hits remain.
- [ ] **Copyright year rendered dynamically.**
  — touches: footer template
  — verify: footer shows the current year.
- [ ] **Empty headings on the ACA page** ("See what savings you qualify for",
  "Find the best value for your budget") filled or removed.
  — touches: `/health-insurance/`
  — verify: no heading on the page is followed directly by another heading.
- [ ] **Health page label standardised** to one term across header, footer and
  H1.
  — touches: header and footer templates, `/health-insurance/`
  — verify: all three use the same label.
- [ ] **Children's ages removed** from the About page bio.
  — touches: `/about-us/`
  — verify: grep the served HTML for "ages 3"; zero hits.
- [ ] **Active-page indicator** in the navigation.
  — touches: header template
  — verify: the current page's nav item is visually distinct on every page.
- [ ] **Mid-page "Get a Quote!" anchor** made honest: either move the form
  under "Start by completing the form below" or change the copy to "Call us or
  complete the form below."
  — touches: homepage
  — verify: clicking the CTA lands on a form, or the copy no longer promises
  one.
- [ ] **Public email address on `/contact-us/`.** **Blocked** — address not
  yet supplied (`../docs/open-items.md`). Skip until it is.
