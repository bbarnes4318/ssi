# Open items

Everything blocked on information Jimmy has to supply. When an item is
supplied, change its Status, note where the value now lives, and record the
change in `CHANGELOG.md`.

| Item | Needed for | Blocking | Status |
|---|---|---|---|
| Number of MA/Part D organizations and products represented | TPMO disclaimer, if the FMO rules the page is marketing | `/medicare/` | open |
| CMS material ID | Only if `/medicare/` keeps plan-specific benefits | `/medicare/` | open |
| Names of all MA/Part D organizations represented | Required on marketing materials | `/medicare/` | open |
| FMO determination: is the stripped `/medicare/` page "marketing" or "communications" under CMS rules | Decides whether carrier approval and annual HPMS filing are required | `/medicare/` | open |
| Current plan-year verbatim TPMO disclaimer text from the FMO | The disclaimer is standardized and must be used character for character | `/medicare/` | open |
| Licensed entity name | Footer licensing line | sitewide | supplied — "Senior Solutions Insurance", in `compliance/ssi-medicare-disclosures.html` Block B and `widgets/ssi-cost-estimator.html` |
| List of states the agency is licensed in | Fuller footer licensing line | sitewide | open |
| BBB business profile URL | Linking the BBB badge | homepage | supplied — linked from the hero badge, trust strip, footer and schema `sameAs`. Profile shows A+ and **not accredited**; do not add "Accredited" wording. |
| Google Business Profile URL | Footer link and `InsuranceAgency` schema `sameAs` | sitewide | supplied but **unconfirmed** — `https://share.google/7cX0zbH3SjcK8Eqj2` (Knowledge Graph id `/g/11q2w5b020`) is linked from the footer and reviews section. Removed from the schema `sameAs` on 11 Sep 2026 (SEO pass 4.1) until the canonical GBP URL is confirmed; add it back to `AGENCY_SCHEMA` in `scripts/build.js` when it is. |
| Google star rating and review count | Supplied: 4.3 stars, 6 reviews (11 Sep 2026). Hard-coded in the badge on the homepage reviews section (`src/pages/home.html`, class `grating`: number, count, and the star fill via the `grating__stars--43` class in `assets/site.css`, `--fill` = rating ÷ 5; inline styles are blocked by the CSP). Refresh by hand when it changes. | homepage reviews section | supplied — refresh periodically |
| `InsuranceAgency` schema `geo` (latitude/longitude) | Local-business schema completeness | sitewide `<head>` | open — coordinates must be verified against the suite address (5775 DTC Blvd, Suite 250-S), not geocoded from the street. Not added until then. |
| `InsuranceAgency` schema `areaServed` | Local-business schema; advertising scope | sitewide `<head>` | open — needs the licensed-states list (row above). Not added until then. |
| `InsuranceAgency` schema `aggregateRating` | Rating rich result | sitewide `<head>` | open — must match the live Google profile exactly at the moment it is added (currently shown as 4.3 / 6 on the homepage badge). Not added; if it ever disagrees with the profile, remove it rather than adjust it. |
| `/about-us/` title and meta description | Client copy supplied 12 Sep 2026: title "About Senior Solutions Insurance \| Licensed Since 2008" (54), description 153 characters. | `/about-us/` | supplied — applied |
| `/contact-us/` title | Client copy supplied 12 Sep 2026: "Contact Senior Solutions Insurance \| 1-888-957-3337" (51). | `/contact-us/` | supplied — applied |
| `/privacy/` and `/terms-and-conditions/` meta descriptions | 85 and 87 characters. Client decision 12 Sep 2026: no change. | `/privacy/`, `/terms-and-conditions/` | not applicable, page is noindex |
| `/medicare/` meta description length | Client supplied a 159-character version 12 Sep 2026; applied. | `/medicare/` | supplied — applied |
| Funeral cost pillar page content (`/how-much-does-a-funeral-cost/`) | Content supplied 12 Sep 2026 at `docs/content/funeral-costs.md` and built verbatim. | `/how-much-does-a-funeral-cost/` | supplied — built |
| State-by-state funeral cost table | Second pass on `/how-much-does-a-funeral-cost/` per the content file's Open item: opens the "average funeral cost in [state]" long tail and carries no licensing exposure (no insurance product advertised). Needs a sourced per-state dataset. | `/how-much-does-a-funeral-cost/` | deferred — second pass |
| Inbound link from the eventual "How much burial insurance do I need" page | The content file lists it as a third inbound link to the funeral cost page; that page does not exist yet. | future page | deferred |
| Condition table review against SSI carrier panel — blocking publication of `/burial-insurance-with-pre-existing-conditions/` | The page is built from `docs/content/preexisting-conditions.md` and deployed **held**: `noindex, follow`, out of `sitemap.xml`, out of the nav, no inbound links. Every row of the 36-row condition table must be checked against what SSI's agents see across the carrier panel; change or delete rows that do not match, do not generalise. To publish after sign-off: remove `"held": true` from the page meta, add the two inbound links (FE pre-existing-conditions FAQ answer, anchor "see which conditions affect approval"; homepage FAQ answer on the same subject), remove the path from the noindex header rule in `vercel.json`, rebuild. | `/burial-insurance-with-pre-existing-conditions/` | **open — blocking publication** |
| Methodology behind "Save Up to 60%", if any exists | Only if the claim is to return with a footnote; otherwise it stays deleted (Release 1, P0.6) | homepage | open |
| Lead delivery: `RESEND_API_KEY` + `LEAD_TO_EMAIL` (email) or `LEAD_WEBHOOK_URL` (CRM/webhook) | `api/lead.js` needs one of them or the form tells visitors to call. Email is the 10-minute option. | quote form, every page | open |
| Cloudflare Turnstile keys | Optional bot check on the quote form. Honeypot is already on; only needed if spam shows up. | quote form, every page | deferred |
| Public contact email — confirm which | The privacy policy publishes `admin@ssi-medicare.com`; the terms publish `cmartin@ssifinalexpense.com`. The contact page uses `admin@ssi-medicare.com` pending confirmation. | `/contact-us/` | supplied — confirm |
| Terms and Conditions text | Supplied by the client 11 Sep 2026 (the live text, last updated 15 Nov 2024) and published verbatim at `/terms-and-conditions/`. | `/terms-and-conditions/` | supplied |
| Address in the legal documents | Client instruction 11 Sep 2026: the legal documents keep the address they already carried (6000 E. Evans Ave., Ste 1-121, Denver, CO 80222). The office address (5775 DTC Blvd, Suite 250-S, Greenwood Village) stays everywhere else. Not a discrepancy to fix. | `/privacy/`, `/terms-and-conditions/` | resolved |
| Legal entity name vs. dba | Terms say "Christopher L Martin Insurance Group, doing business as Senior Solutions Insurance". The footer licensing line uses "Senior Solutions Insurance" as supplied. Confirm with counsel whether the legal name must appear. | sitewide footer | open |
| Canonical P0–P4 task list | `deploy/release-1-ship-now.md` maps P0–P4 to checklist items. P0, P1, P2 and P4 were itemised in the brief; P3 was not, so its checklist entries were reconstructed from `docs/audit.md` §3 (SEO). Confirm the mapping matches the original list. | `deploy/release-1-ship-now.md` | open |
