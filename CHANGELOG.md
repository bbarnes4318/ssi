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
- `index.html` — preview landing page so the Vercel static deploy has a root; links to widget previews and docs.

### Changed

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
