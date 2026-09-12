# State landing pages — data pack and build spec

**Status: PUBLISHED at cutover, 12 Sep 2026** (all three product flags in `src/states/publish.json` are `true`; the 33 pages are in the sitemap and linked from the parent-page hub sections and the footer). Originally a draft proposal built and deployed unpublished for agency review.

**Scope:** 11 states × 3 products = 33 pages.

---

## The 11 states

| State | Why | Exchange |
|---|---|---|
| Colorado | Home state — the agency's own office and existing exchange certification | Connect for Health Colorado |
| Tennessee | | healthcare.gov |
| Florida | 21.8% of residents aged 65 and over — the fourth-highest share in the country in 2024, behind Maine, Vermont and West Virginia (Census ACS 2024 via USAFacts) | healthcare.gov |
| Texas | | healthcare.gov |
| California | More residents aged 65 and over than any other state, about 6.5 million in 2024, though only about 16.6% of the state's population (Census 2024 via USAFacts) | Covered California |
| Pennsylvania | | Pennie |
| Ohio | | healthcare.gov |
| Michigan | | healthcare.gov |
| North Carolina | | healthcare.gov |
| Georgia | | Georgia Access |
| Arizona | Second-largest net domestic in-migration of residents 65 and over of any state: 18,318 (2022 ACS via the University of Arizona Economic and Business Research Center) | healthcare.gov |

Override any of these if the agency has better selection criteria — call volume by state, carrier appointments, or where the existing book of business sits all beat population.

### Sources (the same set recorded in `src/states/states.json` → `sources`)

- **Funeral medians** — analysis of 1,000+ funeral home General Price Lists across 50 states, 2026, medians per state (the table below). Client-supplied dataset; the pages quote it verbatim.
- **Population share 65+** — US Census Bureau, 2024 American Community Survey, via USAFacts: Maine 23.5%, Vermont 22.9%, West Virginia 21.9%, Florida 21.8% (fourth). usafacts.org/articles/america-is-getting-older-which-states-have-the-largest-elderly-populations/ (read 12 Sep 2026).
- **California 65+ count and share** — US Census Bureau 2024 via USAFacts: about 6.52 million, 16.6%. usafacts.org/data/topics/people-society/population-and-demographics/our-changing-population/state/california/.
- **Arizona 65+ in-migration** — University of Arizona Economic and Business Research Center, from the 2022 1-year ACS: second-largest net domestic migration of people 65+, 18,318 (Florida first, 49,732). azeconomy.org/2023/12/economy/what-states-do-workers-and-retirees-migrate-to/.
- **Medicaid expansion status** — KFF, *Status of State Medicaid Expansion Decisions* (as of 21 Aug 2026: 41 incl. DC adopted / 10 not), cross-checked with medicaid.gov's Adult Coverage Expansion map. Georgia Pathways criteria from pathways.georgia.gov. Income lines from the 2026 HHS poverty guidelines (aspe.hhs.gov).
- **SHIP programs** — shiphelp.org state listings (https://www.shiphelp.org/ships/<state>/), read 12 Sep 2026; operating agencies from the linked program sites. Phone numbers only as listed there.
- **Exchanges** — exchange type and name per state from the exchange's own site / healthcare.gov's state list, confirmed 12 Sep 2026.
- **Insurance departments** — each department homepage fetched and title-checked 12 Sep 2026; only services that appear on that homepage are named on the pages. No department phone numbers unless shown on the department's own site.
- **County counts** — state county lists, confirmed 12 Sep 2026.

Correction record: the original rows for Florida ("largest senior share in the country" — false; Florida is fourth), California ("largest 65+ population" — imprecise) and Arizona ("large retiree in-migration" — unsourced) were replaced on 12 Sep 2026 with the sourced figures above.

---

## The one thing that matters for quality

Eleven near-identical pages differing only by a state name is a doorway page pattern, and Google has an explicit policy against it. This is the single real risk in the build.

**The rule: if the only difference between two pages is the state name, the second one is not worth shipping.**

Every page below carries at least four genuinely state-specific facts, three of them numbers that differ materially. That is what makes these real pages instead of a template loop, and it is what the agency should be checking when they review.

---

## Final expense — state funeral cost data (verified)

Source: analysis of more than 1,000 funeral home General Price Lists collected across 50 states, 2026, medians reported per state. Funeral-home charges only — cemetery plot, vault and headstone are billed separately and add $2,000–$5,000 or more.

| State | Price lists | Direct cremation | Immediate burial | Basic services fee |
|---|---|---|---|---|
| Colorado | 31 | $1,650 | $2,565 | $1,985 |
| Tennessee | 26 | $2,348 | $2,990 | $2,298 |
| Florida | 32 | $1,882 | $2,695 | $2,025 |
| Texas | 40 | $2,015 | $2,890 | $2,245 |
| California | 90 | $1,895 | $2,499 | $1,995 |
| Pennsylvania | 24 | $2,462 | $2,998 | $2,562 |
| Ohio | 31 | $1,850 | $2,648 | $1,995 |
| Michigan | 29 | $2,250 | $2,575 | $2,345 |
| North Carolina | 13 | $1,700 | $2,920 | $2,190 |
| Georgia | 40 | $2,525 | $3,225 | $2,578 |
| Arizona | 29 | $1,240 | $2,045 | $1,550 |

**National comparison figures** for the "how your state compares" line:

- Direct cremation: **$1,995** median (range $575–$6,285, 919 price lists)
- Immediate burial: **$2,800** median (range $689–$7,978, 831 price lists)
- Basic services fee: **$2,195** median, non-declinable (range $500–$5,500)
- Full traditional funeral, funeral-home charges only: **$6,415**
- Cheapest state for cremation: **Nevada, $1,190**. Most expensive: **Rhode Island, $3,315**

**The specific observation each page leads with**, computed from the table:

- **Colorado** — cremation at $1,650 is 17% below national and burial at $2,565 is 8% below. Cheaper than average on every measure, worth saying plainly on the home-state page.
- **Tennessee** — cremation at $2,348 runs 18% above national and burial at $2,990 is above it too. *(The earlier "cuts against Tennessee's reputation as a low-cost state for services" framing was deleted 12 Sep 2026 as unsourceable — do not reinstate it from an old copy.)*
- **Arizona** — $1,240 cremation is the second-lowest in the country, 38% below national. The strongest single state fact in the set.
- **Georgia** — $2,525 cremation and $3,225 burial are both well above national and the highest of the eleven states in this set. *(The earlier "among the highest in the South" / "Southern states are cheap" framing was deleted 12 Sep 2026 as unsourceable — the dataset table covers eleven states, not a regional ranking. Do not reinstate it from an old copy.)*
- **Pennsylvania** — highest basic services fee of the eleven at $2,562, 17% above national. That is the one charge nobody can decline.
- **North Carolina** — widest cremation-to-burial gap of the eleven: $1,700 against $2,920, a 72% difference. The choice between the two matters more here than anywhere else in the set.
- **Michigan** — narrowest gap of the eleven: $2,250 against $2,575, just 14%. Cremation saves a Michigan family far less than it saves a North Carolina family.
- **California** — 90 price lists, the largest sample of any state, so these are the most reliable figures in the dataset. Also below national on both cremation and burial.
- **Texas** — burial at $2,890 sits above national while cremation at $2,015 is right at it.
- **Florida** and **Ohio** — within a few percent of national on all three measures. For these two, lead instead with the cemetery costs that get left out of every published average.

Each is real, checkable and specific. That is the content earning the index slot.

---

## Final expense state page — template

URL: `/final-expense-insurance/[state]/`
Title: `Final Expense Insurance in [State] | Rates & Funeral Costs`
Description: 150–160 chars including that state's cremation or burial figure and the phone number.

**H1:** Final Expense Insurance in [State]

**Intro:** two to three sentences leading with the state's own number, not a generic definition. Shape: "A direct cremation in Arizona has a median cost of $1,240 and an immediate burial $2,045 — the second-lowest cremation cost in the country. Final expense insurance covers those costs with a small whole life policy that pays cash directly to your family."

**H2: What a funeral costs in [State]** — the three figures as a table with the national median beside each, then the specific observation from the list above, then the note that cemetery costs are separate and add $2,000–$5,000 or more.

**H2: Final expense rates by age** — the national rate table for $10,000, both genders, as it appears on `/final-expense-insurance/`. State plainly that rates are set by age, gender, tobacco use and health, not by state. Do not invent state-varying rates.

**H2: How much coverage [State] families typically need** — the state's burial figure plus cemetery costs, worked as an actual sum, landing on a coverage band. Differs between states because the inputs do.

**H2: [State] insurance regulation** — name the department and link to its homepage.

| State | Department |
|---|---|
| Colorado | Colorado Division of Insurance |
| Tennessee | Tennessee Department of Commerce and Insurance |
| Florida | Florida Department of Financial Services, Division of Consumer Services |
| Texas | Texas Department of Insurance |
| California | California Department of Insurance |
| Pennsylvania | Pennsylvania Insurance Department |
| Ohio | Ohio Department of Insurance |
| Michigan | Michigan Department of Insurance and Financial Services |
| North Carolina | North Carolina Department of Insurance |
| Georgia | Georgia Office of Insurance and Safety Fire Commissioner |
| Arizona | Arizona Department of Insurance and Financial Institutions |

No phone numbers unless verified on the department's own site.

**H2: Common questions** — four minimum, at least two state-specific using that state's figures.

**Closing CTA** and **sources block** with a last-updated date.

---

## Medicare state page — template

URL: `/medicare/[state]/`
Title: `Medicare Advantage Plans in [State] | Senior Solutions Insurance`

Written to the standard the FMO already cleared for `/medicare/`: **no plan names, no named benefits, no premium figures, no $0-premium references, no superlatives.** The full disclosure block from `compliance/ssi-medicare-disclosures.html` on every page, plus TTY 711. Holding that standard in the draft means the agency reviews copy that is already publishable rather than copy they have to send back.

**H1:** Medicare Advantage Plans in [State]

**H2: How plan availability works in [State]** — the genuinely useful point, and one almost no competitor makes: Medicare Advantage availability is set by county, not by state. Two people in the same state can have entirely different options. Name the state, say the county decides it, and make the call the way to find out.

**H2: Free Medicare help in [State]** — every state runs a State Health Insurance Assistance Program, federally funded and free, and the TPMO disclaimer already references SHIP. Name that state's program and link to it.

> **Agent: read each program name off shiphelp.org and cite it. Do not write these from memory — several states use similar acronyms and getting one wrong on a page that names a federal program is worse than omitting it.**

**H2: When you can enroll** — the annual windows and special enrollment periods, described generically. No plan-year-specific dates unless verified.

**H2: [State] insurance regulation** — same department table as above.

**H2: Common questions** — four minimum, at least two referencing the state, none naming a plan or a benefit.

Then the full disclosure block, TTY 711, and the CTA.

---

## ACA state page — template

URL: `/health-insurance/[state]/`
Title: `ACA Marketplace Plans in [State] | Senior Solutions Insurance`

The state-specific content here is stronger than for either other product, because the marketplace genuinely differs by state.

**H1:** ACA Marketplace Health Insurance in [State]

**H2: Where [State] residents buy marketplace coverage** — name the actual exchange. The single most useful fact on the page, and it differs across the set:

| State | Exchange |
|---|---|
| Colorado | Connect for Health Colorado |
| California | Covered California |
| Pennsylvania | Pennie |
| Georgia | Georgia Access |
| Tennessee, Florida, Texas, Ohio, Michigan, North Carolina, Arizona | healthcare.gov |

**H2: Medicaid expansion in [State]** — important and almost never explained well. In states that expanded Medicaid, adults below roughly 138% of the federal poverty level qualify for Medicaid. In states that did not, there is a coverage gap where people earn too much for Medicaid and too little for marketplace subsidies. This changes what a visitor should actually do, and it differs across this set.

> **Agent: verify each state's current expansion status against a primary source before writing this section. Status has changed in several states in recent years, and a wrong answer sends someone to the wrong program.**

**H2: Subsidies and what you would actually pay** — premium tax credits applied to the monthly premium rather than refunded at tax time, based on household income and household size.

**H2: Open enrollment in [State]** — note that state-based exchanges sometimes run longer windows than healthcare.gov, a real and useful distinction for the four state-exchange states here. No specific dates unless verified for the current plan year.

**H2: Turning 65 in [State]** — short section linking to `/medicare/[state]/`. The natural bridge between the two products and the reason to build both.

**H2: Common questions**, **CTA**, **sources**.

---

## What must differ across the eleven — shipping gate

Per product, verify all six before the agency review:

1. The state's own figures or exchange name — different on every page.
2. The lead observation — the specific fact for that state.
3. Any arithmetic — different, because the inputs differ.
4. The insurance department — different on every page.
5. At least two FAQ answers written for that state.
6. The intro's opening sentence — leads with that state's fact.

Legitimately identical across all eleven: the FE rate table, the plan-type explanations, the Medicare disclosure block, the CTA. Shared boilerplate is fine when the information genuinely is the same.

---

## Internal linking

- Hub sections on the three parent pages: "Final expense insurance by state", "Medicare Advantage by state", "ACA marketplace plans by state", each linking all eleven.
- Each state page links back to its parent. FE state pages also link to `/how-much-does-a-funeral-cost/`, `/burial-insurance-with-pre-existing-conditions/` and `/#estimate`.
- ACA state pages link to the matching Medicare state page from the turning-65 section. That is the only cross-link worth having.
- **Do not cross-link state pages within a product.** Eleven pages each linking to ten others is a pattern that looks engineered because it is.
- Hub sections link from the footer, not the header nav.

---

## Schema

`InsuranceAgency` stays sitewide with the `areaServed` Country node. **No per-state LocalBusiness node** — the agency has one office, in Greenwood Village, and inventing eleven locations would be false.

`FAQPage` on every state page, generated from visible markup at build time.

`BreadcrumbList`: Home → [Product] → [State].

No `Article` markup and no author node. These are service pages.

---

## Deploy as a draft

All 33 pages deploy `noindex` with `X-Robots-Tag`, out of `sitemap.xml`, out of nav, with hub sections built but not linked from any indexed page. The agency reviews working pages on the preview URL.

One flag per product in the repo, so publishing is a single change once they sign off.

---

## What the agency decides before publication

Not blockers on the build. Items for their review, each a row in `docs/open-items.md`:

1. **Medicare** — whether the FMO determination covering `/medicare/` extends to eleven state pages written to the same standard. Likely yes; worth one email.
2. **ACA** — whether SSI holds FFM certification for the seven healthcare.gov states, and certification with Covered California, Pennie and Georgia Access for the other three. Colorado is already confirmed. Publish only where the answer is yes — an ACA page for a state where nobody can be enrolled is useless to the visitor.
3. **State selection** — whether these eleven match where the agency actually writes business.
4. **Claim review** — the same review that applied to the pre-existing conditions table applies to any state-specific claim an agent would have to stand behind on a call.

## Sequencing recommendation

Ship the eleven FE pages first and leave them 60 days. If they rank, Medicare and ACA follow cheaply on a proven model. If they do not, the problem is diagnosable at a third of the cost, and 33 pages of unproven templated content on a young domain is much harder to unwind than eleven.

That is a recommendation, not a gate. If the agency wants all 33 live at once, they will be built and ready.
