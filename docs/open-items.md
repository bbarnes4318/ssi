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
| BBB business profile URL | Linking the BBB badge | homepage | open |
| Google Business Profile URL | Footer link and `InsuranceAgency` schema `sameAs` | sitewide | open |
| Methodology behind "Save Up to 60%", if any exists | Only if the claim is to return with a footnote; otherwise it stays deleted (Release 1, P0.6) | homepage | open |
| `LEAD_WEBHOOK_URL` — where quote-form leads go | `api/lead.js` forwards every lead there with its consent evidence. Until set, the form tells visitors to call. | quote form, every page | open |
| Cloudflare Turnstile site key + secret | Bot protection on the quote form beyond the honeypot | quote form, every page | open |
| Public contact email — confirm which | The privacy policy publishes `admin@ssi-medicare.com`; the terms publish `cmartin@ssifinalexpense.com`. The contact page uses `admin@ssi-medicare.com` pending confirmation. | `/contact-us/` | supplied — confirm |
| Terms and Conditions text | The live page is a generic template (subscriptions, free trials, a return policy, Texas courts) and could not be reproduced verbatim. The footer links to the live WordPress URL until real terms exist; that link dies when the domain moves. | sitewide footer | open |
| Legal entity name vs. dba | Terms say "Christopher L Martin Insurance Group, doing business as Senior Solutions Insurance". The footer licensing line uses "Senior Solutions Insurance" as supplied. Confirm with counsel whether the legal name must appear. | sitewide footer | open |
| Carrier logo files | Logos render as text names on the new site. Supply PNG/SVG files (with rights to use them) to show marks instead. | homepage, product pages | open |
| Canonical P0–P4 task list | `deploy/release-1-ship-now.md` maps P0–P4 to checklist items. P0, P1, P2 and P4 were itemised in the brief; P3 was not, so its checklist entries were reconstructed from `docs/audit.md` §3 (SEO). Confirm the mapping matches the original list. | `deploy/release-1-ship-now.md` | open |
