# Website Audit — ssifinalexpense.com (Senior Solutions Insurance)

**Audit date:** September 10, 2026
**Pages inspected:** `/`, `/about-us/`, `/medicare/`, `/heatlh-insurance/`, `/contact-us/`
**Benchmark competitor:** ehealthinsurance.com (see §9)
**Stack detected:** WordPress (generator reports 7.1 on most pages, 7.0.2 on `/about-us/`), page-builder driven, no CDN or image-format optimization evident

## Method note

Findings below come from live retrieval and source inspection of the five pages listed. Core Web Vitals could not be measured with a real browser from this environment, so speed grades are derived from asset inventory, stack fingerprints, and structural evidence, and are marked as estimated. Everything in the SEO, accessibility, copy, IA, and trust sections is directly observed in the served markup, not inferred.

## Assumed business context

The brief left the context fields blank. This audit assumes:

- **Primary goal:** inbound phone calls to 1-888-957-3337, with web form submissions as the secondary conversion.
- **Target audience:** US adults roughly 50–85 shopping for final expense / burial coverage, plus adult children researching on a parent's behalf. Secondary audiences on the Medicare and ACA pages.
- **Competitor benchmark:** ehealthinsurance.com, supplied by the client. Note that eHealth is a NASDAQ-listed marketplace (EHTH) with an engineering organization measured in hundreds, and it does not sell final expense at all. It is a valid benchmark for the Medicare and ACA pages and for execution standards generally, not a like-for-like competitor on the core product.

If the real goal is selling or brokering leads rather than writing policies directly, several CRO recommendations change materially — say so and this gets revised.

---

## Executive Summary

| # | Category | Grade | Verdict |
|---|---|---|---|
| 1 | UX & Visual Design | C | Clean and conventional, but the header phone number is not tappable and the same generic form is stacked two and three times per page. |
| 2 | Page Speed & Performance | C− | Unoptimized PNG/JPG logo grids and page-builder overhead on shared WordPress hosting; no evidence of modern image formats, caching layer, or CDN. |
| 3 | SEO | D | Homepage title is literally `Senior Solutions Insurance |`, no meta descriptions, the health page URL is misspelled `heatlh-insurance` and canonicalized that way, and there is no blog or content depth to rank on. |
| 4 | Accessibility (WCAG 2.1) | D | `user-scalable=0` blocks pinch-zoom sitewide — a direct 1.4.4 failure on a site built for seniors — plus placeholder-only form fields and an unlabeled icon link. |
| 5 | Copywriting & CRO | C− | Value proposition is legible, but an unpublished editorial note is live on the ACA page, Medicare copy appears on the ACA page, and the lead form asks for five fields including a free-text Message. |
| 6 | Security & Trust | C | HTTPS is in place and a TCPA disclosure exists, but there is no verifiable BBB link, no email address, no license or NPN disclosure, and no visible consent checkbox or anti-spam layer. |
| 7 | Content Strategy & IA | D | Five pages total, no resources or blog, "Life Insurance" points at the homepage, footer and header use different labels for the same page, and the copyright reads 2024. |
| 8 | Cross-Browser & Device | B− | Standard WordPress builder output will render consistently across engines; the zoom lock and unlinked phone number are the real cross-device defects, not layout breakage. |
| 9 | Competitive Benchmark | — | eHealth solves nearly every defect flagged above in production, including the full CMS Medicare disclaimer set that SSI is missing while claiming the opposite. |

**Overall: C−.** This is a competent-looking brochure site with a small number of defects that are disproportionately expensive given the audience and the goal. Most of the highest-value fixes are edits, not rebuilds.

---

## 1. User Experience & Visual Design — Grade: C

### Key strengths
- Conventional, predictable layout for a senior audience: logo top-left, phone top-right, five-item horizontal nav, no hamburger-only navigation on desktop.
- The homepage answers "what is this" above the fold with an eyebrow ("Affordable Plans For"), an H1 ("Final Expense Insurance"), a supporting line, and a single primary CTA.
- Carrier logo wall (Americo, Transamerica, Prosperity, Liberty Bankers, Sentinel, AIG) is a strong recognition anchor for this demographic.
- Three-step enrollment strip ("Speak with our experts / Select a plan / Enroll with ease") is the right level of simplicity.

### Critical weaknesses
- **The header phone number is plain text, not a `tel:` link.** On the homepage, Medicare, ACA, About, and Contact pages the header renders `Call Today: 1-888-957-3337` as static text. Footer and mid-page instances are linked; the most prominent one is not. For a call-driven business on mobile, this is the single most costly UX defect on the site.
- **The same contact form appears twice on `/contact-us/`** — once under "Get in Touch" and again inside the shared footer CTA block. Two forms, identical fields, identical disclosure text. Duplicate field IDs in the same document break label-for association and confuse autofill and screen readers.
- **The mid-page "Get a Quote!" CTA links to `#quote`**, but the visible section headed "Nationwide Network of Final Expense Insurers / Start by completing the form below" contains no form — the form is further down in the footer block. The anchor and the surrounding copy disagree about what is on screen.
- **Repetition creates cognitive load.** The "Step-by-Step Enrollment Process" block, the Calendly CTA, and the full quote form are appended identically to every single page. A visitor moving from Medicare to About sees the same three blocks each time.
- **Section headings with no body content** on `/heatlh-insurance/`: "See what savings you qualify for" and "Find the best value for your budget" are headings with nothing beneath them.
- **Missing H1 on `/about-us/`** — the page opens at H2 ("25+ Years of Combined Experience"), so there is no visual or structural page title.
- **The BBB badge is a bare image** (`bbb.png`), not a link to a BBB profile. Unverifiable trust marks read as decoration.

### Priority fixes
1. Wrap the header phone number in `<a href="tel:+18889573337">` on every template, with a minimum 48×48px tap area.
2. Delete the duplicated form on `/contact-us/` — keep one, in the main content area.
3. Move the quote form to sit directly beneath the "Start by completing the form below" heading, or change the copy to "Call us or complete the form below."
4. Add an H1 to `/about-us/` and demote the current H2s one level.
5. Fill or remove the two empty headings on the ACA page.
6. Link the BBB badge to the live BBB business profile, or remove it.
7. Reduce the repeated footer CTA stack to one block per page.

---

## 2. Page Speed & Technical Performance — Grade: C−

*Estimated from asset inventory and stack fingerprints; not a measured Lighthouse run.*

### Key strengths
- No video backgrounds, no carousel libraries visible, no third-party chat widget. Payload is text and images rather than heavy JS frameworks.
- Only one confirmed third-party embed (Calendly), and it is a link rather than an inline iframe.
- `max-image-preview:large` is set, so images are eligible for large SERP previews.

### Critical weaknesses
- **Every image is PNG or JPG.** Carrier logos (`sentinel3-1.png`, `liberty-bankers2.png`, `americo2.png`, `transamerica2.png`, `aig2-1.png`, `prosperity2.png`), Medicare carrier tiles (`anthem.jpg`, `cigna.jpg`, `humana.jpg`, `devoted.jpg`, `aetna.jpg`, `uhc.jpg`), and hero/about photography (`about.jpg`, `About.jpg`, `image.png`) show no WebP or AVIF variants. A twelve-to-fifteen logo grid in raw PNG is the most likely LCP and total-bytes offender.
- **`favicon.jpg`** — a JPEG used as a favicon and as the `msapplication-TileImage`. Wrong format, no `.ico`/PNG set, no Apple touch icon.
- **Duplicate assets served under different filenames.** `About.jpg` (2025/01) and `about.jpg` (2024/11) both load; `anthem.jpg` (2024/12) and `anthem-2.jpg` (2025/01) both exist. Cache efficiency suffers and the media library is unmanaged.
- **Two different WordPress versions reported across pages** (7.1 vs 7.0.2 on `/about-us/`) indicates stale full-page cache fragments or an incomplete deploy — a caching-layer inconsistency, not a cosmetic one.
- **Page-builder overhead.** The heading structure (H2 section titles, H4/H5 card titles, H5 FAQ accordions) is characteristic of a heavy builder, which typically ships large bundled CSS/JS regardless of what a given page uses. Expect render-blocking CSS in `<head>` and unminified builder JS.
- **Logo grids with no dimensions or lazy-loading signals** are the classic CLS driver on this template pattern.

### Estimated Core Web Vitals
| Metric | Estimate | Driver |
|---|---|---|
| LCP | 3.0–4.5s on 4G mobile | Uncompressed hero image plus render-blocking builder CSS |
| INP | 200–400ms | Builder JS, accordion handlers, form script |
| CLS | 0.10–0.25 | Logo grids and hero image without explicit width/height |

### Priority fixes
1. Convert all images to WebP with AVIF fallback and compress; target under 60KB per carrier logo.
2. Set explicit `width`/`height` on every `<img>` to eliminate layout shift.
3. Add `loading="lazy"` to everything below the fold, and explicitly `loading="eager"` + `fetchpriority="high"` on the hero image only.
4. Install a caching + optimization layer (WP Rocket / LiteSpeed / FlyingPress) with critical CSS extraction and unused-CSS removal, and put the site behind Cloudflare.
5. Replace `favicon.jpg` with a proper `favicon.ico` + 180×180 apple-touch-icon + 512×512 PNG.
6. Purge duplicate media and standardize on one file per asset.
7. Resolve the WP version mismatch — clear all cache layers and confirm every page renders from the same build.

---

## 3. Search Engine Optimization — Grade: D

### Key strengths
- Self-referencing canonical tags are present and correct on every page inspected.
- URL structure is clean, lowercase, hyphenated, with trailing slashes and no query strings or IDs.
- No `noindex` or crawl-blocking directives detected.
- Page titles on inner pages follow a coherent `Page | Brand` pattern.

### Critical weaknesses
- **The homepage title is `Senior Solutions Insurance |`** — a trailing pipe with nothing after it, and zero keywords. The most valuable title tag on the domain contains no mention of final expense, burial insurance, or any commercial term, despite the domain being *ssifinalexpense.com* and the H1 reading "Final Expense Insurance."
- **No meta descriptions on any page inspected.** Google is writing every SERP snippet for this site.
- **The health insurance URL is misspelled: `/heatlh-insurance/`** — and the canonical tag points to the misspelled version, making the typo authoritative. Header and footer both link to it, so the error is fully propagated through the internal link graph.
- **Alt text is broken across the site:**
  - Footer logo alt is `logo white` with a title attribute of **`Avanti-renovation-green`** — leftover metadata from a renovation company's template.
  - The Medicare and ACA "Call us" icon is `mold-icon-1.png` — an asset from a mold remediation site, wrapped in a `tel:` link with **no alt text at all**.
  - On `/heatlh-insurance/`, alt values are mismatched to files: `alt="devoted"` on `uhc.jpg`, `alt="uhc"` on `aetna.jpg`.
  - Most alts are filename fragments (`bbb gray`, `sentinel`, `med-adv2`) rather than descriptions.
- **No content depth.** Five pages, no blog, no resource library, no state or carrier landing pages. There is nothing to rank for informational final expense queries — which is where most of this audience begins its search.
- **Thin internal linking.** Every internal link is either the global nav or the global footer. No contextual in-body links between the FE, Medicare, and ACA pages.
- **No structured data evident** — no InsuranceAgency/LocalBusiness schema despite a physical address and posted hours, no FAQPage schema despite four Q&A blocks on three separate pages, no Review/AggregateRating despite nine testimonials.
- **Trailing-slash inconsistency in the privacy policy link:** footer uses `/privacy`, `/contact-us/` uses `/privacy/`. At minimum a redirect hop, potentially a duplicate URL.
- **Local SEO not built.** A Greenwood Village, CO address and full business hours are on the site but not marked up, and no Colorado or nationwide geographic targeting exists in any title or heading.

### Priority fixes
1. Rewrite the homepage title, e.g. `Final Expense & Burial Insurance Quotes | Senior Solutions Insurance` (under 60 characters).
2. Write unique 150–160 character meta descriptions for all five pages, each containing the phone number or a call CTA.
3. Fix the URL to `/health-insurance/` with a 301 from the misspelled path, update canonical, header, and footer.
4. Rewrite every alt attribute descriptively; strip the `Avanti-renovation-green` title attribute; replace `mold-icon-1.png` with a real phone icon and give it alt text.
5. Add JSON-LD: `InsuranceAgency` with address/hours/phone/sameAs, `FAQPage` on all three FAQ pages, and `Organization` sitewide.
6. Publish a resources section targeting the actual search behavior: "How much does a funeral cost in 2026," "Final expense vs. term life," "Guaranteed issue life insurance for seniors with health conditions," "Burial insurance after age 75."
7. Add contextual body links between FE, Medicare, and ACA pages.
8. Standardize on one privacy policy URL and 301 the other.
9. Verify `robots.txt` and submit an XML sitemap in Search Console (neither could be confirmed from this environment).

---

## 4. Accessibility & Inclusivity (WCAG 2.1) — Grade: D

This is the category with the widest gap between the site's audience and its build quality. The primary users are seniors, the population most likely to need text resizing, high contrast, and keyboard or assistive technology support.

### Key strengths
- Semantic heading elements are used, and the FAQ sections are genuine accordions rather than images of text.
- Testimonial and FAQ content is real text, selectable and readable by assistive technology.
- Link text is mostly meaningful ("Schedule A Call Online," "Call now: 1-888-957-3337") rather than "click here."

### Critical weaknesses
- **`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">` on every page.** This disables pinch-to-zoom. It is a direct failure of **WCAG 2.1 SC 1.4.4 (Resize Text, Level AA)** and effectively a failure of **1.4.10 (Reflow)**. On a site selling burial insurance to people in their seventies and eighties, this is the most damaging line of code on the domain. It is also a live ADA/Section 508 litigation pattern for insurance sites.
- **Form fields appear to use placeholders as labels.** "First Name," "Last Name," "Email Address," "Phone Number," "Message" render as field text with no persistent visible label. Placeholder-only fields fail **SC 3.3.2 (Labels or Instructions)**, disappear on focus, and typically fail contrast as grey-on-white.
- **Duplicate forms on `/contact-us/`** almost certainly produce duplicate `id` values, breaking `<label for>` association and creating ambiguous screen-reader output — a **SC 4.1.1/4.1.2** issue.
- **Image link with no accessible name:** the `mold-icon-1.png` icon wrapped in `tel:18889573337` on the Medicare and ACA pages has an empty alt. A screen reader announces a bare URL. **SC 2.4.4 / 1.1.1.**
- **Missing H1 on `/about-us/`** and heading-level skips elsewhere (H2 → H4/H5 card and FAQ headings with no intervening H3, or H3 → H5). Structure-based navigation is unreliable. **SC 1.3.1.**
- **Contrast risk on the hero and light-grey trust strips.** The eyebrow text over the hero image and the muted grey "bbb gray" treatment are likely below 4.5:1. Needs measurement, but the pattern is a common failure. **SC 1.4.3.**
- **No skip-to-content link** detected, so keyboard users traverse the logo, quote button, phone, and five nav items on every page load. **SC 2.4.1.**
- **Focus visibility unverified but at risk** — most page-builder themes suppress the default focus ring. **SC 2.4.7.**
- **The TCPA disclosure text is rendered twice in sequence** ("TCPA Disclosure and Consent" followed by "TCPA Disclosure and Consent By providing your information..."), suggesting a heading and body both containing the label. Verbose and confusing for screen-reader users.

### Priority fixes
1. **Immediately** change the viewport tag to `width=device-width, initial-scale=1` and delete `maximum-scale` and `user-scalable`. One-line fix, highest accessibility value on the site.
2. Add persistent visible `<label>` elements to every form field, associated by `for`/`id`, and keep placeholders only as format hints.
3. Remove the duplicate form and audit for duplicate IDs.
4. Give the `tel:` icon link an accessible name (`alt="Call Senior Solutions Insurance"` or `aria-label`).
5. Add an H1 to `/about-us/` and normalize the heading hierarchy sitewide — no level skips.
6. Run a contrast pass on hero text, muted grey text, and button states; bring everything to 4.5:1 minimum, 3:1 for large text and UI components.
7. Add a skip-to-main-content link as the first focusable element.
8. Define a visible focus style — 2px outline, 3:1 contrast against adjacent colors.
9. Increase base body font to 18px minimum given the audience.
10. Run axe DevTools and a manual keyboard-only pass on all five pages, and validate the form flow with NVDA or VoiceOver.

---

## 5. Copywriting, Messaging & CRO — Grade: C−

### Key strengths
- The above-the-fold proposition is legible in under three seconds: affordable final expense insurance, top carriers, get a quote.
- Objection handling is well chosen for this market: "No Medical Exams," "many of our programs don't ask any medical questions at all," and a testimonial specifically about qualifying despite poor health.
- Nine testimonials with names is a reasonable volume of social proof.
- The three-step process ("Speak with our experts / Select a plan / Enroll with ease") sets expectations without overpromising.
- Dual conversion paths — phone and Calendly self-scheduling — is the right structure.

### Critical weaknesses
- **An unpublished editorial note is live on `/heatlh-insurance/`.** Under the "Compare plans" heading, the public body copy reads: *"An interactive comparison tool could improve user engagement here. Consider linking to a feature that allows users to compare plans side by side."* That is a strategy note to the site owner, published as customer-facing content. This alone is a credibility failure for anyone who reads it.
- **Wrong-product copy on the ACA page.** The "Why Choose Senior Solutions Insurance" block on `/heatlh-insurance/` states the team helps individuals *"find the best Medicare Advantage plans"* — copy pasted from the Medicare page, on a page about ACA marketplace coverage for all ages.
- **Contradictory experience claims.** Homepage: "18+ years of experience." About page H2: "25+ Years of Combined Experience," then body: "a combined 25 years," then "nearly 18 year career," with a 2008 founding date. Four numbers, one company.
- **The lead form is five fields including free-text "Message."** For a phone-first business selling to seniors, "Message" is pure friction with near-zero qualification value. Name, phone, ZIP, date of birth are what actually route a final expense lead.
- **"Instant Quotes" is promised but not delivered.** The homepage trust strip reads "We offer instant quotes with up to 25 insurance companies so you can make the right decision." Nothing on the site returns a quote. The form produces a callback. This is an unfulfilled above-the-fold promise, and the mismatch is discovered at the exact moment the visitor has just handed over a phone number.
- **Regulatory exposure in the copy.** Two lines need legal review before anything else:
  - Homepage: **"Save Up to 60%"** — an unsubstantiated savings claim in a state-regulated advertising context.
  - Medicare page: **"Comprehensive coverage and no cost to the beneficiary"** and "many plans offering no out-of-pocket costs." Medicare Advantage plans carry copays, coinsurance, and MOOP limits, and the beneficiary continues paying the Part B premium. This is the exact claim pattern CMS marketing rules target.
- **Missing CMS-required Medicare disclaimers.** No "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options," and no "Not connected with or endorsed by the U.S. Government or the federal Medicare program."
- **Testimonials are unattributed and unverifiable.** No source (Google, BBB, Trustpilot), no photos, no location, first-name-plus-initial in several cases, and one ends with a stray closing quote mark ("...definitely recommend.”). The Medicare page carries a single testimonial from "John D." — the least credible attribution format available.
- **Stale Calendly link:** every "Schedule A Call Online" button on every page points to `?month=2025-01`, hard-coding January 2025 as the opening view of the booking calendar.
- **No urgency, no risk reversal, no specificity.** No "average member saves $X," no coverage-amount ranges above the fold, no "no obligation, no callbacks unless you ask," no AEP/OEP deadline framing on the Medicare and ACA pages where those deadlines are the entire seasonal driver.
- **No email address anywhere on the site**, including on the Contact page. Phone, address, Calendly, and a form only.

### Priority fixes
1. **Delete the editorial note on `/heatlh-insurance/` today.** Then read all five pages end to end for other draft artifacts.
2. Rewrite the ACA "Why Choose Us" block so it references ACA and marketplace coverage, not Medicare Advantage.
3. Pick one experience number and use it everywhere. Founded 2008 supports "18 years" cleanly.
4. Cut the quote form to Name, Phone, ZIP, plus date of birth, and drop the Message field.
5. Send the "Save Up to 60%" and "no cost to the beneficiary" lines to compliance counsel before touching anything else on those pages, and add the two CMS-required Medicare disclaimers.
6. Attribute testimonials to a verifiable source, add city/state, and pull the aggregate rating from Google or BBB.
7. Strip `?month=2025-01` from every Calendly link.
8. Add a sticky mobile call bar with the phone number and business hours.
9. Add a publicly visible email address to the Contact page.
10. Add coverage specifics above the fold — "$5,000 to $25,000 in coverage. No medical exam. Rates from age 50 to 85." Specificity outperforms adjectives in this market.

---

## 6. Technical Security & Trust Signals — Grade: C

### Key strengths
- HTTPS is enforced; all internal links, canonicals, and image sources are `https://`, so no mixed-content warnings.
- Both a Privacy Policy and Terms and Conditions exist and are linked in the global footer.
- A complete, well-drafted TCPA disclosure is present on every form, with the required elements: automated technology, consent-not-required-to-purchase, revocation, STOP/HELP, message frequency, and rates.
- Full physical address, phone number, and posted business hours are published — real NAP data, not a PO box.
- A named, photographed founder with a biography is on the About page. That is real E-E-A-T signal.

### Critical weaknesses
- **No visible consent checkbox.** The TCPA text appears as static disclosure copy above a Submit button. Best practice — and the standard TCPA plaintiff-firm target — is an unchecked checkbox with the consent language adjacent, plus a stored timestamp, IP, user agent, and form snapshot. Without that, proving prior express written consent on a disputed call is very hard.
- **No TrustedForm or Jornaya/LeadiD script detected.** For an insurance lead form under current TCPA exposure, independent consent certification should be non-optional.
- **No visible spam protection** — no reCAPTCHA, hCaptcha, Turnstile, or honeypot evidence. A five-field WordPress form with a `tel:` field will be scraped and stuffed.
- **The BBB badge is a static image with no link** to a BBB business profile. An unverifiable trust badge reads as decoration or, to a skeptical shopper, as fabricated.
- **No producer licensing disclosure.** No NPN, no state license numbers, no list of licensed states, no "licensed insurance agent" designation for Chris Martin. For a nationwide-claiming agency this is both a trust gap and a state DOI advertising concern.
- **No security or privacy assurance near the form** — no "we never sell your information" line, no lock iconography, nothing to reduce the hesitation of a 74-year-old entering a phone number.
- **`meta-generator` publicly discloses the WordPress version** on every page. Minor, but it hands version-specific exploit targeting to scanners at no cost.
- **Only one social profile** (a single Facebook page). No Google Business Profile link, no LinkedIn, no review platform presence.
- **Copyright reads 2024**, signaling an unmaintained site to any visitor who checks.
- **Unverified from this environment** and worth checking directly: security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options), TLS version and cipher config, whether `/wp-admin` and `/wp-login.php` are rate-limited or IP-restricted, and whether the site has a WAF.

### Priority fixes
1. Add an unchecked consent checkbox to every form with the TCPA language beside it, and store timestamp, IP, user agent, page URL, and the exact consent text served.
2. Install TrustedForm or Jornaya on all lead forms.
3. Add Cloudflare Turnstile or reCAPTCHA v3 plus a honeypot field.
4. Link the BBB badge to the live BBB profile, or remove the badge.
5. Publish the licensed entity name and the states the agency is licensed in — a footer line plus a short licensing page. Individual producer NPNs are not required and are not being published; eHealth takes the same approach, disclosing "eHealthInsurance Services, Inc. is a licensed health insurance agency that does business as eHealth. In NY, IL and OK, eHealth does business as eHealthInsurance Agency" with no NPN anywhere on the page. Confirm the exact wording with counsel, since a handful of state DOIs have their own advertising identification requirements.
6. Add a short privacy assurance line directly above the Submit button.
7. Remove the WordPress generator meta tag.
8. Update the copyright year and set it to render dynamically.
9. Verify and add security headers: HSTS with preload, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and a basic CSP.
10. Add Google Business Profile and any review platform links to the footer.

---

## 7. Content Strategy & Information Architecture — Grade: D

### Key strengths
- Five items is the right nav width for this audience — no mega menu, no nested dropdowns.
- The three product lines (final expense/life, Medicare, ACA health) are a coherent portfolio for a senior-focused agency.
- FAQ blocks on three pages address genuine first-order questions.
- Header and footer navigation are consistent in ordering.

### Critical weaknesses
- **"Life Insurance" in the nav points to the homepage** (`https://ssifinalexpense.com/`), whose H1 is "Final Expense Insurance." A user clicking "Life Insurance" from an inner page lands on what looks like the homepage, with no current-page indicator and no dedicated life insurance content.
- **Label inconsistency for the same page.** Header says "Health Insurance," footer says "Healthcare Insurance," the page H1 says "Affordable Health Insurance Solutions for All Ages," and the content is about ACA marketplace plans. Four names, one destination.
- **No dedicated final expense page.** The flagship product — the one the domain is named after — has no URL of its own. It lives on the homepage, which cannot be optimized, linked to, or advertised as a product page.
- **Zero content depth.** No blog, no guides, no glossary, no funeral cost data, no carrier comparison pages, no state pages. Nothing supports the informational stage of the buying journey.
- **No site search**, which on a five-page site is defensible, but the absence is compounded by having nothing to search.
- **No freshness signals.** No dated content anywhere, and the copyright reads 2024. The ACA page discusses Open Enrollment without naming the current plan year.
- **Content that ages badly is hard-coded.** The About page lists the founder's children's ages ("ages 3, 6, 15 & 17"), which are wrong within twelve months of writing.
- **Internal linking is nav-and-footer only.** No contextual cross-links — the FE page never links to Medicare, the Medicare page never links to ACA, the FAQ answers never link to deeper explanations because none exist.
- **Every page ends with the same three blocks** (enrollment steps, Calendly CTA, quote form), so pages are structurally indistinguishable below the midpoint.

### Priority fixes
1. Build a dedicated `/final-expense-insurance/` page and repoint "Life Insurance," or rename the nav item to "Final Expense" and let it point at the homepage honestly.
2. Standardize the health page label to one term across header, footer, and H1 — "Health Insurance (ACA)" is the clearest.
3. Add an active-page indicator to the navigation.
4. Launch a resources hub with 8–12 articles: funeral cost by state, guaranteed issue vs. simplified issue, coverage amount guidance by age, what happens during the graded benefit period, FE vs. term vs. whole life.
5. Add contextual in-body links between the three product pages.
6. Add "Last updated" dates to product pages and reference the current plan year on the ACA and Medicare pages.
7. Remove or genericize content that ages (the children's ages).
8. Differentiate page endings — the Medicare page should close on AEP timing, the ACA page on Open Enrollment timing, the FE page on coverage amounts.
9. Set the copyright year to render dynamically.

---

## 8. Cross-Browser & Device Adaptability — Grade: B−

### Key strengths
- Standard WordPress page-builder output using widely supported CSS. Grid and flex layouts of this type render consistently across Chromium, WebKit, and Gecko.
- A responsive viewport meta tag is present on every page (its contents are the problem, not its presence).
- No Flash, no browser-specific plugins, no legacy JS patterns, no `-webkit-`-only feature dependencies detected.
- The layout pattern — full-width hero, three-column card rows, logo grid, accordion FAQ, stacked form — degrades gracefully to a single column.

### Critical weaknesses
- **`user-scalable=0` behaves differently by engine.** iOS Safari 10+ deliberately ignores it and permits zoom anyway; Chrome on Android honors it. So Android users are locked out of zoom while iOS users are not — an inconsistent experience for the exact audience most likely to need it.
- **`initial-scale=1.0, maximum-scale=1.0` triggers iOS Safari's input auto-zoom behavior** unless every form input is 16px or larger. If the form fields are 14px or 15px, iOS will zoom on focus and, with zoom locked, the user may be unable to zoom back out — a known trap-state pattern.
- **The unlinked header phone number is a device-adaptability failure, not just a UX one.** On desktop it is fine as text. On mobile it is a phone number the user must memorize or transcribe.
- **No responsive image sourcing.** Without `srcset`/`sizes`, mobile devices download full desktop-resolution PNGs and JPGs.
- **The 12–15 tile carrier logo grid** is the most likely responsive breakpoint failure — these typically compress to unreadable thumbnails at 375px or reflow into a very long stack.
- **Accordion FAQ touch targets** on the Medicare, ACA, and FE FAQ blocks need verification against the 44×44px minimum.
- **Untestable from this environment and worth a real-device pass:** rendering on iOS Safari, Chrome Android, Firefox, and Edge at 375px, 390px, 768px, 1024px, and 1440px; landscape orientation; and the site at 200% browser zoom on desktop.

### Priority fixes
1. Fix the viewport tag (see §4) — this resolves the largest cross-engine inconsistency on the site.
2. Set all form inputs to 16px minimum font size to prevent iOS focus auto-zoom.
3. Implement `srcset`/`sizes` on all content images.
4. Test the carrier logo grid at 375px and set a sensible mobile arrangement — two or three columns, not one long stack.
5. Verify every tap target (nav items, accordion headers, buttons, phone links) meets 44×44px.
6. Run a real-device pass on iOS Safari, Chrome Android, Firefox, and Edge before signing off on any of the above.

---

## 9. Competitive Benchmark — ehealthinsurance.com

### Scale caveat, read this first

eHealth is a publicly traded insurance marketplace with roughly 1.3 million members and a full product engineering organization. It does not sell final expense insurance. Comparing the two sites on resources is meaningless. What the comparison is genuinely useful for is this: **eHealth demonstrates the compliance and execution standard that regulators, carriers, and the courts treat as normal for a nationwide insurance site.** Almost every defect flagged in §1–§8 above shows up as a solved problem on eHealth's homepage — which removes any argument that these are matters of taste.

### Head-to-head

| Category | SSI | eHealth | Gap |
|---|---|---|---|
| UX & Visual Design | C | A− | Wide |
| Page Speed & Performance | C− | B | Moderate |
| SEO | D | A | Wide |
| Accessibility | D | B | Wide |
| Copy & CRO | C− | A | Wide |
| Security & Trust | C | A | Wide |
| Content Strategy & IA | D | A | Very wide |
| Cross-Browser & Device | B− | A− | Narrow |

### Where the gap is decisive

**Regulatory disclosure — the most important finding in this comparison.** eHealth's homepage carries the full CMS disclaimer set that SSI's Medicare page carries none of:

- "We do not offer every plan available in your area. Currently we represent 55 organizations which offer 4,405 products in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program (SHIP) to get information on all of your options."
- "eHealth and Medicare supplement insurance plans are not connected with or endorsed by the U.S. government or the federal Medicare program."
- "This ad is not from the government. It's from eHealth."
- "Deductibles, copays, and coinsurance may apply. Limitations and exclusions may apply. $0 premium plans are not available in all areas. **You must continue to pay your Part B Premium.**"
- A CMS material ID: `MULTIPLAN_EHI_2025_3240_M`
- Named entity and state licensing disclosure: "eHealthInsurance Services, Inc. is a licensed health insurance agency that does business as eHealth. In NY, IL and OK, eHealth does business as eHealthInsurance Agency."

That last Part B line is the exact disclosure SSI's Medicare page needs, because SSI's page currently asserts the opposite — "Comprehensive coverage and **no cost to the beneficiary**." The competitor's site is direct evidence that this claim is not made by compliant operators.

**Claims substantiation.** Every quantitative claim on eHealth's homepage carries a numbered footnote with a citable source: the "nation's top plans" claim cites a Kaiser Family Foundation 2024 Medicare Advantage enrollment analysis; the 1.3 million member figure cites page 54 of the 2024 Annual Report; the "over $1,000 a year" savings figure carries a methodology note stating it is based on user sessions limited to plans eHealth offers, with cost data subject to updates, and that individual experiences vary. Even a small study is disclosed honestly ("Stress levels based on an eHealth study of 24 participants in July, 2023").

SSI's homepage says **"Save Up to 60%"** with no footnote, no methodology, and no source. Same category of claim, no substantiation.

**The BBB badge.** eHealth's BBB logo is wrapped in a link to `bbb.org/us/in/indianapolis/profile/insurance-agency/ehealthinsurance-services-inc-0382-90073641`, with a title attribute naming the accredited entity. SSI's BBB badge is an unlinked `bbb.png`. This is the identical fix recommended in §6, confirmed as standard practice.

**The conversion mechanic — the widest CRO gap.** eHealth's primary above-the-fold conversion is **ZIP code plus county, then "Compare plans."** No name, no phone, no email, no PII. The visitor gets value before surrendering anything, and the phone number is offered as an alternative rather than the only path. SSI's primary conversion is a five-field form ending in a free-text "Message" box, gated behind a TCPA disclosure, with no instant output of any kind.

SSI's own site actually admits this gap. The unpublished editorial note live on `/heatlh-insurance/` — "An interactive comparison tool could improve user engagement here. Consider linking to a feature that allows users to compare plans side by side" — is describing the thing eHealth built.

**Accessibility.** eHealth's viewport tag is `width=device-width, initial-scale=1` with no `maximum-scale` and no `user-scalable`. Zoom works. eHealth also publishes **TTY 711** next to every phone number, a hearing-accessibility provision required in Medicare marketing that appears nowhere on SSI's site despite SSI running a Medicare page and selling to seniors.

**Technical SEO.** eHealth ships a meta description, `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`, an application name, and an explicit `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` robots directive. SSI ships a canonical, a robots image-preview flag, and a Windows tile image. No description, no Open Graph, no Twitter card — SSI links shared on Facebook or by text message render with no preview image and no controlled description.

**Image pipeline.** eHealth serves `.webp` through a Next.js image optimizer with per-breakpoint widths (`w=256`, `640`, `750`, `1080`, `1200`) and a quality parameter (`q=75`). SSI serves raw `.png` and `.jpg` at a single size, including a `.jpg` used as a favicon. This is precisely the §2 recommendation, running in production at a competitor.

**Content depth.** eHealth has a "Learn" section, carrier partner pages, and dedicated landing pages for Medicare, individual and family, small business, ICHRA, short-term, dental, and vision — each with its own URL, its own bulleted value proposition, and its own CTA. SSI has five pages, one of which is a homepage doing double duty as the life insurance page.

**Product-line packaging.** eHealth's "Select the coverage you need for any stage of life" block gives each product three benefit bullets and a dedicated CTA. SSI's equivalent — the "Why Choose Senior Solutions Insurance" block — is copied verbatim across the Medicare and ACA pages and talks about Medicare Advantage in both places.

### Where eHealth is not the model

Be selective. Three things about eHealth's homepage are worth *not* copying:

1. **Duplicate DOM.** The ZIP/county plan-finder block renders three or more times in the source, almost certainly as separate desktop and mobile variants. Same duplicate-form pathology flagged on SSI's `/contact-us/` in §1 and §4, just at larger scale.
2. **Empty alt attributes on trust imagery.** The Healthspring, UnitedHealthcare, Humana, Blue Cross Blue Shield, and Trustpilot logos render with no alt text. SSI's alt text is bad, but this specific failure is not one to import.
3. **The disclaimer wall.** eHealth's homepage carries a very long block of legal copy near the top of the source. It is compliant, and it is also a readability burden. SSI should add the required disclosures without reproducing that volume — a short set placed contextually beside the relevant claims will meet the requirement and read better.

### Where SSI can beat eHealth

Do not try to out-build a marketplace. Compete where scale is a liability:

- **A named, licensed human.** SSI has Chris Martin — a founder with a photograph, a 2008 start date, a personal claim of helping over 5,000 families, and a family and community story. eHealth has "a licensed insurance agent" as an abstraction. For an 80-year-old buying burial coverage, a name and a face outperform a comparison engine. Surface Chris and the agent team far more prominently, state the licensed entity and the states covered, and put real agent photos beside the phone number.
- **The final expense category itself.** eHealth does not sell it. Every FE search term is open ground, and SSI's domain is literally *ssifinalexpense.com*. Currently the site has no dedicated FE page and no FE content library. That is the largest unclaimed asset in this audit.
- **Verified local and human proof.** Nine named testimonials, linked to a Google Business Profile and a live BBB listing with an aggregate rating, beats an anonymous Trustpilot badge for this demographic.
- **Speed of contact.** A small agency can answer the phone in two rings and put a licensed agent on the line immediately. Say so, above the fold, with the current office hours and a live open/closed indicator.

### What the benchmark changes about the recommendations

Nothing in §1–§8 gets softer. Three items get harder:

1. The Medicare disclaimer gap moves from "should fix" to "fix before the next AEP." A competitor operating at national scale carries the full disclosure set and a CMS material ID. SSI's page makes an affirmative claim in the opposite direction with nothing attached.
2. "Save Up to 60%" needs a footnote with a real methodology or it needs to be deleted. There is no third option.
3. The ZIP-code-first conversion pattern should be added as a fourth priority, immediately behind the current top three — but adapted, because there is no live rate engine behind it (see "Working without rate data" below).

### Working without rate data

The form returns a callback promise, not a quote. That constrains the eHealth-style conversion pattern but does not kill it, and it creates one problem that has to be fixed regardless.

**The problem:** the homepage currently promises **"We offer instant quotes with up to 25 insurance companies so you can make the right decision."** The site cannot deliver an instant quote. Submitting the form produces a callback. That is an unfulfilled above-the-fold promise, and it sits in the same category as "Save Up to 60%" — a claim the site makes and does not honor. Rewrite it to what actually happens: "Compare rates from up to 25 carriers with one phone call — usually under ten minutes."

**What to build instead of a rate engine:**

1. **A published rate table.** SSI represents Americo, Transamerica, Prosperity, Liberty Bankers, Sentinel, and AIG. Those carriers publish FE rate cards. A static table showing typical monthly premium by age band, gender, and coverage amount ($5,000 / $10,000 / $25,000) requires no engineering — it is a table — and it delivers the single thing every FE shopper actually wants before calling. Footnote it: rates shown are illustrative for standard non-tobacco applicants, actual rates vary by carrier, health, and state.
2. **A progressive micro-form in place of the current five-field block.** ZIP → date of birth → coverage amount → tobacco yes/no, one question per screen, phone number requested last. The visitor gets an eligibility outcome rather than a rate ("Based on your age you qualify for up to $25,000 with no medical exam"), and partial completions still capture qualification data. This raises completion rates over a single five-field block and gives the agent a warmer call.
3. **Set the callback expectation explicitly.** "A licensed agent will call you within 15 minutes during business hours" converts better than an unspecified promise, and it is a commitment a small agency can actually keep — which is the competitive advantage over a marketplace, not a liability.

If carrier rate cards are available to you, item 1 is a half-day of work and is probably the highest-value content addition on the site.

---

## Top 3 High-Impact Wins

Ranked by effect on the stated primary goal — inbound phone calls — weighted against effort.

### 1. Make the header phone number a `tel:` link, and add a sticky mobile call bar

**Effort:** under an hour. **Impact:** highest on the list.

The most prominent phone number on a call-driven site is currently unclickable text on every page. A senior on a mobile phone who wants to call must memorize a ten-digit number and switch apps. Every mobile visitor who intended to call and did not is a lead lost at the last inch of the funnel. Wrap it in a `tel:` link, give it a 48px tap area, and add a persistent bottom bar on mobile showing the number and whether the office is currently open.

### 2. Delete the viewport zoom lock and fix the two live content defects

**Effort:** one line of code plus fifteen minutes of copy editing. **Impact:** removes a live ADA exposure and a live credibility failure.

Three things, all editorial or one-line:

- Change the viewport tag to `width=device-width, initial-scale=1`. Selling burial insurance to seniors while blocking pinch-zoom is both a WCAG 1.4.4 failure and an active litigation pattern for insurance websites.
- Delete the unpublished strategy note sitting in public body copy on `/heatlh-insurance/` ("An interactive comparison tool could improve user engagement here...").
- Rewrite the ACA page's "Why Choose Us" block, which currently advertises Medicare Advantage expertise on a page about ACA coverage.

Then have counsel review "Save Up to 60%" and "no cost to the beneficiary," and add the two CMS-required Medicare disclaimers.

### 3. Rebuild the lead form: fewer fields, real consent, real certification

**Effort:** half a day. **Impact:** higher submission rate plus materially reduced TCPA exposure.

Cut to Name, Phone, ZIP, and date of birth — drop "Message," which adds friction and qualifies nothing. Add persistent visible labels (which also fixes a WCAG 3.3.2 failure). Add an unchecked consent checkbox with the TCPA language beside it, and capture timestamp, IP, user agent, page URL, and the exact consent text served. Install TrustedForm or Jornaya. Add Turnstile or reCAPTCHA. Delete the duplicate form on `/contact-us/`. Add one line of privacy assurance above the Submit button.

---

## Appendix A — Rate table, sourced and ready to publish

This is the data for the static rate table recommended in §9. No rate engine, no API, no carrier feed. It is a table.

### Source and standing

Figures are MoneyGeek's 2026 final expense rate analysis, published August 12, 2026, drawn from thousands of quotes across major carriers with a baseline profile of a nonsmoker in average health. <cite index="16-1">Their stated averages are $30 per month for a 50-year-old woman and $38 for a man at $10,000 in coverage, rising to $125 and $164 respectively by age 80.</cite> These are third-party market averages, not SSI's own carrier rate cards — which is the correct thing to publish anyway, because it is defensible, citable, and does not misrepresent any single carrier's filed rates.

### Table A — Monthly premium, non-tobacco (publish this one)

**Women**

| Age | $10,000 | $20,000 | $30,000 |
|---|---|---|---|
| 50 | $30 | $56 | $76 |
| 55 | $36 | $69 | $89 |
| 60 | $42 | $80 | $105 |
| 65 | $50 | $97 | $129 |
| 70 | $64 | $124 | $167 |
| 75 | $87 | $171 | $229 |
| 80 | $125 | $246 | $327 |
| 85 | $155 | $299 | $460 |

**Men**

| Age | $10,000 | $20,000 | $30,000 |
|---|---|---|---|
| 50 | $38 | $72 | $96 |
| 55 | $46 | $87 | $115 |
| 60 | $53 | $101 | $137 |
| 65 | $66 | $126 | $168 |
| 70 | $84 | $162 | $220 |
| 75 | $113 | $220 | $302 |
| 80 | $164 | $321 | $424 |
| 85 | $203 | $396 | $601 |

### Tobacco

Do not publish a second full table. Add one line beneath Table A: **"Tobacco use typically adds 25–30% to these figures."** <cite index="16-1">That range is supported by the source data — smoking raises average rates by 27% for 50-year-old women and 24% for men at $10,000 in coverage, and a 65-year-old female smoker averages $63 per month against $50 for a nonsmoker.</cite>

**Data quality flag:** the source's published "female smoker" table is row-for-row identical to its male non-smoker table across all ages and coverage amounts. That is an error on their page, not a real finding. Do not copy that table. The percentage uplift stated in their body copy is internally consistent with their other figures and is the safe thing to use.

### Two facts worth putting on the page alongside the table

- **Buy-before-75 framing.** <cite index="16-1">The sharpest jump in the data falls between ages 75 and 80, where average premiums rise 44% for women and 45% for men.</cite> This is legitimate urgency, sourced, and true — unlike "Save Up to 60%."
- **Coverage caps tighten with age.** <cite index="16-1">Transamerica, one of SSI's named carriers, allows up to $50,000 through age 55, $40,000 through 65, $30,000 through 75 and $25,000 through 85.</cite> Useful for setting expectations before the call.

### Carrier positioning — four of SSI's six named carriers appear in the source

| Carrier | Women, $10k | Men, $10k | Underwriting |
|---|---|---|---|
| Transamerica | $24 | $31 | Simplified issue — among the cheapest in the analysis for both genders |
| Americo | $26 | $31 | Simplified issue — among the three most affordable for men |
| Liberty Bankers Life | $26 | $33 | Simplified issue, coverage listed to $30k |
| AIG | $39 | $56 | **Guaranteed issue** — no health questions, graded death benefit |

Rates shown are averages for 50-year-olds.

**On AIG.** It is not an overpriced simplified-issue product. It is a guaranteed-issue product, and the price gap is the product working as designed. The source data corroborates it — AIG appears only at the $10,000 and $20,000 columns with N/A above, which is the low face-amount cap characteristic of GI. Independent 2026 analysis puts guaranteed issue at roughly 42% above simplified issue for the same applicant ($99.18 versus $69.78 per month for a 70-year-old male at $10,000), with a two-year waiting period during which most policies return premiums paid rather than the face amount. Other 2026 pricing work puts the gap at 50-80%. AIG at 63-81% above Transamerica sits inside that band.

**This changes how the table should be presented, and it is an improvement.** Split the carrier table into two groups — simplified issue and guaranteed issue — with one sentence explaining the difference. A shopper who assumes poor health disqualifies them is SSI's single best-converting visitor, and the site already carries a testimonial from exactly that person ("I didn't think I could get coverage because of my poor health, but Senior Solutions was able to get me a policy"). Showing GI as a distinct, priced, available path is far stronger content than a flat price ladder, and it dissolves the "why would anyone take the AIG quote" problem — the answer is on the page.

State the trade-off plainly: guaranteed issue costs more and carries a two-year waiting period. Then say a licensed agent will tell them in one phone call which of the two they qualify for. That is the call.

**Prosperity Life and Sentinel Security Life** are not in this dataset and have no reliable public rate table. For Prosperity, the publishable facts are product facts rather than prices: New Vista is a simplified-issue whole life product with Level, Graded and Modified benefit structures, issue ages 50-80, and Social Security draft billing — a genuine selling point for this demographic and worth a line on the FE page.

### Table or quoter? Both, in that order

They do different jobs and are not alternatives.

**The table does the SEO work.** It is server-rendered HTML that Google indexes, that answers "how much does final expense insurance cost at age 72" directly in the SERP, and that earns the FE page a reason to exist. A JavaScript quoter renders nothing crawlable. If SSI publishes only a quoter, the page ranks for nothing.

**The quoter does the conversion work.** It converts an anonymous reader into a named lead with age, gender, coverage amount and tobacco status attached — which is the qualification data an agent needs before dialing, and which the current five-field form with a "Message" box does not capture.

Ship the table first. It is a day of work, it is the SEO asset, and it is publishable without any vendor.

### On building a full quoter — don't build it, rent it

A real FE quoter needs licensed rate tables for six carriers across fifty states, sliced by age, gender, tobacco, face amount and benefit structure (level / graded / modified), maintained as carriers refile. That is a data-licensing and maintenance obligation, not a coding project, and it is the reason no one builds these from scratch. The market has already solved it cheaply:

| Option | Cost | Notes |
|---|---|---|
| NinjaQuoter | from ~$19/mo | Embeddable life and final expense quote forms for agent sites; returns instant estimates rather than selling directly. Also has a single-screen agent-side quoter for table ratings and non-med lookups. |
| FEX Quote Engine | ~$19.99/mo or ~$199/yr | Built specifically for final expense; includes an agent website quoting plug-in, mobile quotes, and a basic lead manager. |
| Compulife | ~$99 for the embed | Strongest as a standalone term quoter; less of a fit for FE. |

At roughly $20 a month, building is not the cheaper path under any accounting.

**One operational objection to weigh before embedding any of them.** Experienced FE agents make the point that this market is decided by underwriting, not premium — a quoter that shows a $31 Transamerica rate to someone who will only qualify graded creates a worse handoff than showing nothing, because the agent now has to walk the price back on the call. Two mitigations, both cheap:

1. Show a **range**, not a point estimate, and label it "estimated."
2. Segment the result by underwriting path — simplified issue if they can answer the health questions, guaranteed issue if not — using the AIG split described above. Then the agent's call confirms which path they're on rather than revising a number downward.

### If you want the middle option

Between a static table and a licensed quoter sits a four-step estimator that needs no vendor and no carrier data beyond Appendix A: age, gender, coverage amount, tobacco. It returns an estimated monthly range from the published averages, shows the simplified-issue and guaranteed-issue bands side by side, and hands off to the phone number with the inputs attached to the lead record. It captures the same qualification data as a real quoter and is honest about being an estimate. It will not show carrier-specific pricing, which is the trade.

### Footnote copy — paste as-is beneath the table

> Rates shown are illustrative monthly premiums for simplified-issue final expense whole life coverage, based on MoneyGeek's 2026 analysis of final expense quotes across major carriers, updated August 12, 2026. The baseline profile is a nonsmoker in average health. Rates shown are not a quote and not an offer of insurance. Your actual premium depends on your age, gender, tobacco use, health history, coverage amount, the carrier you select, and your state of residence. Coverage availability and maximum face amounts vary by carrier and by age. Call 1-888-957-3337 to speak with a licensed agent for rates specific to you.

That footnote is what "Save Up to 60%" is missing and what eHealth attaches to every number on its homepage.

### Build notes

- Place the table on a new `/final-expense-insurance/` page (§7 recommendation), not the homepage. It is the page that will rank.
- Publish it as a real HTML `<table>` with `<th scope="col">` and `<th scope="row">`, not an image. An image of a rate table is invisible to search engines and to screen readers.
- Add `Table` or `Dataset` structured data, and keep the FAQ schema from §3 on the same page.
- Minimum 18px text, and the table must reflow on mobile — a horizontally scrolling rate table is unusable for the audience.
- SSI's FAQ currently says policies "typically range from $5,000 to $25,000." The table covers $10k / $20k / $30k. Either align the FAQ language to the table or add a line noting that $25,000 falls between the second and third columns.
- Set a calendar reminder to re-pull the source annually. A rate table dated 2026 sitting on the site in 2028 is worse than no table.

Items that need access or tooling beyond public page retrieval:

- Lighthouse and CrUX field data for actual Core Web Vitals rather than estimates.
- `robots.txt` and XML sitemap status.
- Security header and TLS configuration audit.
- Measured color contrast ratios from the rendered stylesheet.
- Confirmation of whether the consent checkbox exists but was not surfaced in the extracted markup.
- Search Console and Analytics data — current impressions, click-through rate, form completion rate, and call volume by source. Without these, the CRO recommendations are based on structural best practice rather than the site's own funnel data.
- Whether SSI's own carrier rate cards (Americo, Transamerica, Prosperity, Liberty Bankers, Sentinel, AIG) are available. Appendix A does not need them — third-party market averages are the more defensible thing to publish — but carrier-specific figures would let the FE page show a genuine spread rather than an average.
- The licensed entity name and the list of states the agency is licensed in, for the footer disclosure line.
