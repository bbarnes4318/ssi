# ssi — ssifinalexpense.com compliance, copy and widget assets

This repo holds the compliance language, replacement copy, drop-in widgets and
deployment plans for **ssifinalexpense.com** (Senior Solutions Insurance).

**The WordPress site itself is not in this repo.** Nothing here deploys
anywhere on its own. Files are pasted into the page builder or footer template
by hand, following the checklists in `/deploy/`.

## Layout

| Path | What it is |
|---|---|
| `/widgets/` | Self-contained HTML widgets that drop into an Elementor HTML widget or Gutenberg Custom HTML block. |
| `/compliance/` | Regulated disclosure language and the FMO review packet. Verbatim only — see below. |
| `/docs/` | The site audit and the open-items register. |
| `/deploy/` | Release checklists. Release 1 ships now; Release 2 is held. |
| `/assets/` | Brand assets (`ssi-logo.png`, 325×100). |
| `index.html` | Preview landing page for the Vercel deploy. Links to the widget previews and the docs. Not part of the site. |
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
