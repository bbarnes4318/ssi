# Release 2 — /medicare/ — HELD

**Status: HELD.** Nothing in this file ships until the FMO answers the four
questions in `../compliance/fmo-review-packet.md`. The determination that
unblocks it: whether the stripped page is "marketing" or "communications"
under CMS rules, and the current plan-year TPMO disclaimer text.

**Until this release ships, `/medicare/` carries
`<meta name="robots" content="noindex, follow">`** so a page that is not yet
compliant is not being actively surfaced in search. That tag goes in with
Release 1 (item P0.5a). **Remove it when this release goes live** — it is the
last item on this list.

What is already live on `/medicare/` from Release 1, and does not wait:
the "no cost to the beneficiary" card replaced with "Comprehensive coverage in
one plan" / "Speak with a licensed agent to compare the Medicare Advantage
plans available where you live."

---

## Gate

- [ ] FMO answers received for all four questions in
  `../compliance/fmo-review-packet.md`.
- [ ] If the answer to question 1 is **marketing**: carrier approval obtained
  and HPMS filing completed per the answer to question 2, and the material
  ID, organization names and organization/product counts from question 4
  entered in `../docs/open-items.md` and applied below. Do not proceed
  without them.
- [ ] If the answer to question 1 is **communications**: no material ID and
  no counts are added. Proceed.
- [ ] Verbatim current plan-year TPMO disclaimer text from question 3 received
  and, if it differs from Block A paragraph 1, substituted character for
  character. Record the FMO sign-off in `CHANGELOG.md`.

## Content — Block C copy edits

All from `../compliance/ssi-medicare-disclosures.html`, Block C. Apply in the
page builder in one edit, keyed to the LIVE text listed there.

- [ ] **H2 "Why Choose Medicare Advantage?" → "How Medicare Advantage Works".**
  — verify: heading text matches.
- [ ] **Card 1** — already shipped in Release 1. Confirm it is still the
  "Comprehensive coverage in one plan" card and no old copy has crept back.
  — verify: grep the served page for "no cost" and "out-of-pocket"; zero hits.
- [ ] **Card 2 "Simplified experience"** — body replaced (removes "drug
  coverage").
  — verify: grep for "drug"; zero hits.
- [ ] **Card 3 "Wellness benefits" → "Every plan is different"** — heading and
  body replaced (removes "fitness programs and transportation assistance").
  — verify: grep for "fitness" and "transportation"; zero hits.
- [ ] **FAQ "What is Medicare Advantage?"** — answer replaced (removes
  "dental, vision, and prescription drug coverage").
  — verify: grep for "dental", "vision", "prescription"; zero hits on the page.
- [ ] **"Dedicated agents" body** — "find the best Medicare Advantage plans" →
  "compare Medicare Advantage plans and find one that fits their needs".
  — verify: text matches Block C.
- [ ] **Whole-page sweep.** After the edits above, the served page text must
  contain none of: dental, vision, hearing, prescription, Part D, $0 premium,
  giveback, no cost, out-of-pocket, fitness, transportation.
  — verify: grep the served HTML for each term; zero hits.

## Content — Block A placement

- [ ] **Block A pasted** at the foot of the page body, after the contact form
  and before the global footer, in an HTML widget. Not in the site footer —
  the disclaimer must be on the page itself.
  — verify: view source; the `<section class="ssi-disc ssi-disc--cms">` is
  inside the page content, present on `/medicare/` and on no other page.
- [ ] **Paragraph 1 is the FMO-confirmed current plan-year text**, character
  for character (Gate, above).
  — verify: diff the served paragraph against the FMO's text.
- [ ] **TTY 711** renders beside the phone number and the `tel:` link works.
  — verify: tap on a real phone.
- [ ] **Readable at the audience's size.** 17px floor, reflows at 375px.
  — verify: computed `font-size` on the block ≥ 17px; no horizontal scroll.

## Head

- [ ] **`/medicare/` title** — a keyworded title under 60 characters that
  does not name a plan benefit. The wording is not set in this repo; agree it
  with the FMO if the page is ruled marketing, since the title is part of the
  material.
  — verify: view source; no benefit term in the title.
- [ ] **`/medicare/` meta description** — 150–160 characters, contains the
  phone number, names no benefit. Same FMO note as the title.
  — verify: view source; present; no benefit term.
- [ ] **`FAQPage` schema** for the four FAQ entries on this page, using the
  post-Block-C answer text.
  — verify: Google Rich Results Test passes; the schema's answer text matches
  the visible text exactly.

## Un-hold

- [ ] **Remove `<meta name="robots" content="noindex, follow">`** from
  `/medicare/`.
  — verify: view source; the tag is gone; `curl -I` shows no `X-Robots-Tag`
  noindex header either.
- [ ] Request indexing for `/medicare/` in Search Console.
- [ ] Record the release, the FMO determination and the sign-off reference in
  `CHANGELOG.md`, and update the Status table in `README.md`.
