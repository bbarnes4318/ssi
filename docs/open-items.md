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
| Google Business Profile URL | Footer link and `InsuranceAgency` schema `sameAs` | sitewide | supplied — `https://share.google/7cX0zbH3SjcK8Eqj2` (Knowledge Graph id `/g/11q2w5b020`), linked from footer, reviews section and schema |
| Google star rating and review count | Supplied: 4.3 stars, 6 reviews (11 Sep 2026). Hard-coded in the badge on the homepage reviews section (`src/pages/home.html`, class `grating`: number, count and `--fill` = rating ÷ 5). Refresh by hand when it changes. | homepage reviews section | supplied — refresh periodically |
| Methodology behind "Save Up to 60%", if any exists | Only if the claim is to return with a footnote; otherwise it stays deleted (Release 1, P0.6) | homepage | open |
| Lead delivery: `RESEND_API_KEY` + `LEAD_TO_EMAIL` (email) or `LEAD_WEBHOOK_URL` (CRM/webhook) | `api/lead.js` needs one of them or the form tells visitors to call. Email is the 10-minute option. | quote form, every page | open |
| Cloudflare Turnstile keys | Optional bot check on the quote form. Honeypot is already on; only needed if spam shows up. | quote form, every page | deferred |
| Public contact email — confirm which | The privacy policy publishes `admin@ssi-medicare.com`; the terms publish `cmartin@ssifinalexpense.com`. The contact page uses `admin@ssi-medicare.com` pending confirmation. | `/contact-us/` | supplied — confirm |
| Terms and Conditions text | Migrated verbatim from the live WordPress page on 11 Sep 2026 into `/terms-and-conditions/` (`src/pages/terms-and-conditions.html`), so the footer link survives the domain move. The text is still a generic template: it references subscriptions, a 30-day free trial, a return policy, Texas courts for litigation, phone 832-805-0387, `cmartin@ssifinalexpense.com` and the 6000 E. Evans Ave. address. Counsel should replace it with terms written for an insurance agency. | `/terms-and-conditions/` | supplied — needs counsel review |
| Registered address vs. office address | The privacy policy and the terms publish 6000 E. Evans Ave., Ste 1-121, Denver, CO 80222 (the registered address in the terms). Every other page, the footer and the `InsuranceAgency` schema publish the office at 5775 DTC Blvd, Suite 250-S, Greenwood Village. Both legal documents were left verbatim; confirm which address the legal documents should carry, and whether the privacy policy's Google Analytics / AdSense paragraphs still apply (this site loads neither). | `/privacy/`, `/terms-and-conditions/` | open |
| Legal entity name vs. dba | Terms say "Christopher L Martin Insurance Group, doing business as Senior Solutions Insurance". The footer licensing line uses "Senior Solutions Insurance" as supplied. Confirm with counsel whether the legal name must appear. | sitewide footer | open |
| Canonical P0–P4 task list | `deploy/release-1-ship-now.md` maps P0–P4 to checklist items. P0, P1, P2 and P4 were itemised in the brief; P3 was not, so its checklist entries were reconstructed from `docs/audit.md` §3 (SEO). Confirm the mapping matches the original list. | `deploy/release-1-ship-now.md` | open |
