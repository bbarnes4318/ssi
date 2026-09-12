# ACA state-page copy. Every opener leads with the state's Medicaid expansion
# position and a dollar threshold specific to that position.
#
# Sources (12 Sep 2026):
#   Expansion status — KFF, Status of State Medicaid Expansion Decisions, as of
#     21 Aug 2026 (41 states incl. DC adopted; 10 not), cross-checked against
#     medicaid.gov's Adult Coverage Expansion map. Expanded: CO, CA, PA, OH,
#     MI, NC, AZ. Not expanded: TN, FL, TX, GA.
#   Poverty guidelines — HHS/ASPE 2026 guidelines, 48 states + DC: $15,960 (1),
#     $21,640 (2), $27,320 (3), $33,000 (4), +$5,680 each additional person.
#     138% of those: $22,025 / $29,863 / $37,702 / $45,540 (rounded).
#   Georgia Pathways — pathways.georgia.gov: ages 19-64, up to 100% FPL,
#     80 hours a month of qualifying activities.
P = lambda *ps: "\n".join(f"<p>{p}</p>" for p in ps)
KFF = 'https://www.kff.org/status-of-state-medicaid-expansion-decisions/'
HHS = 'https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines'
CITE = (f'Expansion status per <a href="{KFF}" rel="noopener">KFF&rsquo;s Medicaid expansion tracker</a> (as of August 2026) and '
        f'<a href="https://www.medicaid.gov/medicaid/program-information/downloads/medicaid-expansion-state-map.pdf" rel="noopener">medicaid.gov</a>; '
        f'income lines from the <a href="{HHS}" rel="noopener">2026 HHS poverty guidelines</a>.')

FPL1, FPL138_1 = "$15,960", "$22,025"   # 2026 HHS poverty guideline for one person; 138% of it
def hero(state, is_expanded):
    """One-line hero strip: the state's Medicaid position and the dollar line that follows from it."""
    if is_expanded:
        return f"{state} has expanded Medicaid: an adult qualifies up to about <strong>{FPL138_1}</strong> in 2026, and marketplace subsidies pick up above that."
    return f"{state} has not expanded Medicaid: marketplace subsidies begin at <strong>{FPL1}</strong> for one person in 2026, and below that there is no subsidy."

def expanded(state, medicaid_name, extra=''):
    return (f'<p><strong>{state} has expanded Medicaid.</strong> An adult with household income up to about 138% of the federal poverty level qualifies for {medicaid_name} rather than a marketplace plan &mdash; in 2026 that is roughly <strong>$22,025</strong> for one person, <strong>$29,863</strong> for two, <strong>$37,702</strong> for three and <strong>$45,540</strong> for four. Above those lines the premium tax credit takes over and is applied to a marketplace plan. There is no coverage gap: the application checks income first and routes each household to the right program. {extra}{CITE}</p>')

def not_expanded(state, extra=''):
    return (f'<p><strong>{state} has not expanded Medicaid.</strong> Adult Medicaid here covers specific groups only &mdash; children, pregnant women, some parents with very low income, people with disabilities and older adults. Marketplace premium tax credits begin at 100% of the federal poverty level, which in 2026 is <strong>$15,960</strong> for one person, <strong>$21,640</strong> for two, <strong>$27,320</strong> for three and <strong>$33,000</strong> for four. An adult in {state} who earns less than that and does not fit a Medicaid category is in the coverage gap: no Medicaid and no marketplace subsidy. If that is your situation, say so on the call &mdash; the honest answer is not a quote for a plan you cannot afford. {extra}{CITE}</p>')

COPY = {}

COPY["colorado"] = dict(
 intro=P("Colorado has expanded Medicaid, so a single adult earning up to about $22,025 in 2026 &mdash; 138% of the federal poverty level &mdash; qualifies for Health First Colorado, the state&rsquo;s Medicaid program, and the marketplace subsidy picks up from there. Colorado also runs its own exchange, Connect for Health Colorado, and Senior Solutions Insurance is certified with it."),
 exch_note="It is a state-based marketplace, and Senior Solutions Insurance holds the Connect for Health Colorado certification shown on our health insurance page.",
 medicaid=expanded("Colorado", "Health First Colorado, the state&rsquo;s Medicaid program"),
 faq=[
  ("Do I buy a marketplace plan in Colorado through healthcare.gov?", "No. Colorado runs its own exchange, Connect for Health Colorado, and that is where every subsidized individual and family plan in the state is sold. Senior Solutions Insurance is certified with Connect for Health Colorado and can enroll you there at no extra cost."),
  ("Has Colorado expanded Medicaid, and what is the income line?", "Yes. In 2026 a single adult earning up to about $22,025, or a family of four up to about $45,540, qualifies for Health First Colorado rather than a marketplace plan. Above those figures the premium tax credit applies to a Connect for Health Colorado plan. There is no coverage gap in Colorado."),
  ("How does the premium tax credit work on Connect for Health Colorado?", "Connect for Health Colorado calculates it from your household income and size and applies it to the monthly premium, so the price you see after the credit is what you pay. Because Colorado&rsquo;s Medicaid line sits at about $22,025 for one person, the credit is what most single applicants above that income are shopping with."),
  ("What if I am turning 65 in Colorado?", "Once Medicare Part A and Part B begin, the Connect for Health Colorado subsidy ends and Medicare becomes primary. The usual next step is a Medicare Advantage plan filed for your Colorado county, and Colorado&rsquo;s State Health Insurance Assistance Program at the Division of Insurance offers free counseling on that choice; our agents in Greenwood Village handle both steps on one call."),
 ],
)

COPY["tennessee"] = dict(
 intro=P("Tennessee has not expanded Medicaid, which means a Tennessee adult earning less than $15,960 a year in 2026 &mdash; the federal poverty level for one person &mdash; who does not fit a traditional Medicaid category gets neither Medicaid nor a marketplace subsidy. That coverage gap is the most important thing this page can tell a low-income Tennessee resident. Above $15,960 the premium tax credit applies, and Tennessee&rsquo;s plans are sold on healthcare.gov."),
 exch_note="Tennessee has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=not_expanded("Tennessee"),
 faq=[
  ("I earn less than the poverty level in Tennessee. What are my options?", "This is Tennessee&rsquo;s coverage gap. Below $15,960 for one person (or $27,320 for a family of three) in 2026, healthcare.gov offers no premium tax credit, and Tennessee Medicaid (TennCare) covers only specific groups because the state did not expand. If you are a parent with very low income, pregnant, disabled or over 65 you may still qualify for TennCare; otherwise a licensed agent can tell you honestly what exists rather than quoting an unsubsidized plan."),
  ("Where do Tennessee residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; Tennessee does not run its own exchange. The same application decides whether you are above the $15,960 subsidy line and calculates your premium tax credit. A licensed agent can enroll you there at no extra cost."),
  ("What does a Tennessee marketplace plan cost if I am above the poverty level?", "The premium after your tax credit, which is set by household income and size and applied monthly. A Tennessee household just above $15,960 for one person or $33,000 for four receives close to the largest credit available; we calculate it before comparing plans."),
  ("I am turning 65 in Tennessee. Do I keep my healthcare.gov plan?", "Usually not. Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary. Tennessee&rsquo;s State Health Insurance Assistance Program (SHIP), run by the Department of Disability and Aging at 1-877-801-0044, offers free counseling on the switch, and our agents compare the Medicare Advantage plans filed for your Tennessee county."),
 ],
)

COPY["florida"] = dict(
 intro=P("Florida has not expanded Medicaid, so a Florida adult earning less than $15,960 a year in 2026 &mdash; the federal poverty level for one person &mdash; who does not fit a traditional Medicaid category gets neither Medicaid nor a marketplace subsidy. With 21.8% of its residents aged 65 and over &mdash; the fourth-highest share in the country in 2024 &mdash; Florida also has a large population approaching 65 who need to know that the premium tax credit, which begins at $15,960, ends the month Medicare starts. Florida&rsquo;s plans are sold on healthcare.gov."),
 exch_note="Florida has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=not_expanded("Florida"),
 faq=[
  ("I earn less than the poverty level in Florida. Can I get help?", "Below $15,960 for one person or $21,640 for two in 2026, healthcare.gov offers no premium tax credit, and because Florida did not expand Medicaid, adult Medicaid covers only specific groups. That is Florida&rsquo;s coverage gap. If you are a low-income parent, pregnant, disabled or 65 and over, Florida Medicaid may still apply; otherwise ask the agent what exists rather than accepting a quote you cannot pay."),
  ("Where do Florida residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; Florida does not run its own exchange. The application checks whether your income is above Florida&rsquo;s $15,960 subsidy line for one person and calculates the premium tax credit. A licensed agent can enroll you at no extra cost."),
  ("I retired to Florida before 65. What will a marketplace plan cost me?", "The premium after your tax credit, which is set by household income and size. Many early retirees in Florida qualify for a larger credit than they expect once earned income stops, provided household income stays above the $15,960 (one person) or $21,640 (two) subsidy floor. We calculate it before comparing plans."),
  ("I am turning 65 in Florida. What changes?", "Your premium tax credit ends when Medicare Part A and Part B begin, and Medicare becomes primary. Florida&rsquo;s SHINE program (Serving Health Insurance Needs of Elders), run by the Department of Elder Affairs at 1-800-963-5337, offers free Medicare counseling, and our agents compare the Medicare Advantage plans filed for your Florida county."),
 ],
)

COPY["texas"] = dict(
 intro=P("Texas has not expanded Medicaid, so a Texas adult earning less than $15,960 a year in 2026 &mdash; the federal poverty level for one person, $33,000 for a family of four &mdash; who does not fit a traditional Medicaid category gets neither Medicaid nor a marketplace subsidy. In a state of 254 counties that coverage gap reaches a great many people. Above the poverty level the premium tax credit applies, and Texas plans are sold on healthcare.gov."),
 exch_note="Texas has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=not_expanded("Texas"),
 faq=[
  ("I earn less than the poverty level in Texas. What can I do?", "This is the Texas coverage gap. Below $15,960 for one person or $33,000 for a family of four in 2026, healthcare.gov offers no premium tax credit, and Texas Medicaid covers only specific groups because the state did not expand. Low-income parents, pregnant women, people with disabilities and adults 65 and over may still qualify for Texas Medicaid; a licensed agent will tell you honestly what exists for anyone else."),
  ("Where do Texans buy ACA marketplace coverage?", "Through healthcare.gov, the federal marketplace; Texas does not run its own exchange. The application checks whether you are above the $15,960 subsidy line and calculates your premium tax credit. A licensed agent can enroll you at no extra cost."),
  ("How much will a Texas marketplace plan cost me above the poverty level?", "The premium after the tax credit, set by household income and size and applied monthly. A Texas household just above $15,960 for one person or $27,320 for three receives close to the largest credit available. We calculate it first and compare plans on the net price."),
  ("I am turning 65 in Texas. Should I keep my marketplace plan?", "Usually not. Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary. Texas&rsquo;s Health Information, Counseling, and Advocacy Program (HICAP), run through Texas Health and Human Services at 1-800-252-9240, offers free Medicare counseling, and our agents compare the Medicare Advantage plans filed for your Texas county."),
 ],
)

COPY["california"] = dict(
 intro=P("California has expanded Medicaid, so a single adult earning up to about $22,025 in 2026 &mdash; 138% of the federal poverty level &mdash; qualifies for Medi-Cal, and the marketplace subsidy picks up above that line. California sells its plans through its own exchange, Covered California, not healthcare.gov."),
 exch_note="It is a state-based marketplace with its own enrollment system and its own open enrollment window.",
 medicaid=expanded("California", "Medi-Cal, California&rsquo;s Medicaid program"),
 faq=[
  ("Do Californians use healthcare.gov?", "No. California runs its own exchange, Covered California, and that is where every subsidized individual and family plan in the state is sold. The same application checks Medi-Cal eligibility &mdash; about $22,025 for one person in 2026 &mdash; before it calculates a premium tax credit. A licensed agent can help you enroll there at no extra cost."),
  ("Has California expanded Medicaid, and what is the income line?", "Yes. An adult with household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person or $45,540 for a family of four in 2026 &mdash; qualifies for Medi-Cal. Above that, premium tax credits apply to a Covered California plan. There is no coverage gap in California."),
  ("Does Covered California run a longer open enrollment than healthcare.gov?", "Covered California sets its own window rather than following healthcare.gov&rsquo;s, and it has often run longer than the federal one. The dates are set each plan year, so we confirm the current Covered California window on the call rather than publishing one here. Two things in California do not wait for open enrollment: Medi-Cal, which enrolls year-round for adults up to about $22,025 for one person in 2026, and a special enrollment period after a qualifying event such as losing job coverage."),
  ("I am turning 65 in California. What happens to my Covered California plan?", "Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary, so most people leave Covered California. The California Health Insurance Counseling and Advocacy Program (HICAP), run by the Department of Aging at 1-800-434-0222, offers free Medicare counseling, and our agents compare the Medicare Advantage plans filed for your California county."),
 ],
)

COPY["pennsylvania"] = dict(
 intro=P("Pennsylvania&rsquo;s Medicaid expansion covers an adult earning up to about $22,025 in 2026 &mdash; 138% of the federal poverty level &mdash; and Pennie, the state&rsquo;s own exchange rather than healthcare.gov, applies the premium tax credit to everyone above that line."),
 exch_note="It is a state-based marketplace with its own enrollment system and its own open enrollment window.",
 medicaid=expanded("Pennsylvania", "Pennsylvania Medicaid"),
 faq=[
  ("Where do Pennsylvania residents buy marketplace coverage?", "Through Pennie, Pennsylvania&rsquo;s own exchange, not healthcare.gov. Pennie checks Medicaid eligibility first &mdash; about $22,025 for one person in 2026 &mdash; then calculates the premium tax credit for everyone above that line. A licensed agent can help you enroll at no extra cost."),
  ("Has Pennsylvania expanded Medicaid, and what is the income line?", "Yes. Household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person, $29,863 for two, $45,540 for four in 2026 &mdash; qualifies for Pennsylvania Medicaid. Above that, premium tax credits apply to a Pennie plan, so Pennsylvania has no coverage gap."),
  ("Is Pennie&rsquo;s open enrollment the same as healthcare.gov&rsquo;s?", "Not necessarily. Pennie is a state-based marketplace and sets its own window, which has often run longer than the federal one. The dates are set each plan year; we confirm the current Pennie window on the call."),
  ("I am turning 65 in Pennsylvania. What happens to my Pennie plan?", "Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary, so the Pennie plan should end when Medicare starts; tell both Pennie and your agent the start date so you are not billed for a month you cannot use. PA MEDI, the state&rsquo;s Medicare counseling program at 1-800-783-7067, is a free second opinion on the Medicare Advantage plans filed for your Pennsylvania county."),
 ],
)

COPY["ohio"] = dict(
 intro=P("In Ohio, Medicaid covers an adult earning up to about $22,025 a year in 2026 (138% of the federal poverty level) under the state&rsquo;s expansion; above that line the premium tax credit on healthcare.gov takes over, and the one application sorts an Ohio household into the right program by income."),
 exch_note="Ohio has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=expanded("Ohio", "Ohio Medicaid"),
 faq=[
  ("Where do Ohio residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; Ohio did not build its own exchange. The application checks Ohio Medicaid eligibility &mdash; about $22,025 for one person in 2026 &mdash; and then calculates the premium tax credit. A licensed agent can complete it with you at no extra cost."),
  ("Has Ohio expanded Medicaid, and what is the income line?", "Yes. Household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person or $37,702 for a family of three in 2026 &mdash; qualifies for Ohio Medicaid, so there is no coverage gap. If your income sits near the line, say so; a small change in the estimate can move an Ohio household between the two programs."),
  ("What will an Ohio marketplace plan actually cost?", "The premium after your tax credit, which is set by household income and size and applied monthly. An Ohio household just above the $22,025 Medicaid line for one person receives close to the largest credit available; we calculate it first and compare plans on the net price."),
  ("I am turning 65 in Ohio. Do I keep my marketplace plan?", "Usually not. Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary. The Ohio Senior Health Insurance Information Program (OSHIIP), run by the Ohio Department of Insurance at 1-800-686-1578, offers free Medicare counseling, and our agents compare the Medicare Advantage plans filed for your Ohio county."),
 ],
)

COPY["michigan"] = dict(
 intro=P("A Michigan adult earning up to about $22,025 in 2026 &mdash; 138% of the federal poverty level &mdash; qualifies for Michigan Medicaid under the state&rsquo;s expansion, and the healthcare.gov subsidy begins above that line; because the application routes a household by projected income, the line matters most for Michigan&rsquo;s seasonal and self-employed workers, whose income moves through the year."),
 exch_note="Michigan has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=expanded("Michigan", "Michigan Medicaid"),
 faq=[
  ("Where do Michigan residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; Michigan has not set up a state exchange. The application checks Michigan Medicaid eligibility &mdash; about $22,025 for one person in 2026 &mdash; and then calculates the premium tax credit. Enrolling through a licensed agent costs nothing extra."),
  ("Has Michigan expanded Medicaid, and what is the income line?", "Yes. Household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person or $29,863 for two in 2026 &mdash; qualifies for Michigan Medicaid, so there is no coverage gap. If your income varies through the year, as it does for many seasonal and self-employed Michigan workers, an agent can help you estimate it so you land in the right program."),
  ("How does the subsidy change what I pay in Michigan?", "The premium tax credit is set by household income and size and applied to your monthly premium. A Michigan household just above the $22,025 Medicaid line for one person receives close to the largest credit available; the sticker price on healthcare.gov is not what you pay."),
  ("I am turning 65 in Michigan. What changes?", "Your premium tax credit ends when Medicare Part A and Part B begin, and Medicare becomes primary. Michigan&rsquo;s State Health Insurance Assistance Program (SHIP), run through the Department of Health and Human Services at 1-800-803-7174, offers free Medicare counseling; if you spend winters in a warmer state, tell the agent, because it changes which Medicare Advantage plan types are worth comparing."),
 ],
)

COPY["north-carolina"] = dict(
 intro=P("North Carolina&rsquo;s Medicaid expansion &mdash; a recent change here &mdash; means an adult earning up to about $22,025 in 2026, 138% of the federal poverty level, now qualifies for North Carolina Medicaid, with the healthcare.gov subsidy picking up above that line. Anyone once told they earned too little for a subsidy but too much for Medicaid should ask again."),
 exch_note="North Carolina has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=expanded("North Carolina", "North Carolina Medicaid"),
 faq=[
  ("Where do North Carolina residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; North Carolina does not run its own exchange. The application checks North Carolina Medicaid eligibility &mdash; about $22,025 for one person in 2026 &mdash; and then calculates the premium tax credit. A licensed agent can walk through it with you at no extra cost."),
  ("Has North Carolina expanded Medicaid, and what is the income line?", "Yes. Household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person or $45,540 for a family of four in 2026 &mdash; qualifies for North Carolina Medicaid. If you were once told you earned too little for a marketplace subsidy but too much for Medicaid, that answer no longer applies in North Carolina."),
  ("What will a North Carolina marketplace plan actually cost?", "The premium after your tax credit, set by household income and size and applied monthly. For a North Carolina household near the $22,025 Medicaid line for one person, the first question is whether you belong in Medicaid at all; the application settles that before any premium is quoted."),
  ("I am turning 65 in North Carolina. What changes?", "Your premium tax credit ends when Medicare Part A and Part B begin, and Medicare becomes primary. North Carolina&rsquo;s Seniors&rsquo; Health Insurance Information Program (SHIIP), run by the Department of Insurance at 1-855-408-1212, offers free Medicare counseling, and our agents compare the Medicare Advantage plans filed for your North Carolina county."),
 ],
)

COPY["georgia"] = dict(
 intro=P("Georgia has not expanded Medicaid, so a Georgia adult earning less than $15,960 a year in 2026 &mdash; the federal poverty level for one person &mdash; gets no marketplace subsidy and, unless they fit a traditional Medicaid category or qualify for Georgia&rsquo;s limited Pathways to Coverage program, no Medicaid either. Pathways covers adults aged 19 to 64 up to that same 100% line who complete 80 hours a month of qualifying activities. Georgia sells its plans through its own exchange, Georgia Access."),
 exch_note="It is a state-based marketplace with its own enrollment system and its own open enrollment window.",
 medicaid=not_expanded("Georgia", extra='Georgia does run a limited alternative, <a href="https://pathways.georgia.gov/" rel="noopener">Georgia Pathways to Coverage</a>, for adults aged 19 to 64 with household income up to 100% of the federal poverty level who complete 80 hours a month of qualifying activities such as work, education or community service (criteria per <a href="https://pathways.georgia.gov/eligibility" rel="noopener">pathways.georgia.gov</a>). '),
 faq=[
  ("I earn less than the poverty level in Georgia. What are my options?", "Below $15,960 for one person in 2026, Georgia Access offers no premium tax credit, and Georgia did not expand Medicaid. The one Georgia-specific option is Pathways to Coverage: adults aged 19 to 64 up to 100% of the poverty level who complete 80 hours a month of work, education or community service. If you do not qualify for Pathways or a traditional Medicaid category, you are in the coverage gap, and an agent should say so plainly."),
  ("Where do Georgia residents buy marketplace coverage?", "Through Georgia Access, the state&rsquo;s own exchange, not healthcare.gov. Above the $15,960 subsidy line for one person, the Georgia Access application calculates your premium tax credit; a licensed agent can help you enroll there at no extra cost."),
  ("Does Georgia Access run a longer open enrollment than healthcare.gov?", "Georgia Access sets its own window rather than following healthcare.gov&rsquo;s, and state exchanges sometimes run longer than the federal one. The dates are set each plan year, so we confirm the current Georgia Access window on the call rather than publishing one here. Outside the window, a Georgia adult with a qualifying event still gets a special enrollment period, and an adult under $15,960 who meets the 80-hour monthly activity requirement can apply to Georgia Pathways at any time of year."),
  ("I am turning 65 in Georgia. What happens to my Georgia Access plan?", "Once Medicare Part A and Part B begin, the premium tax credit ends and Medicare becomes primary, so the Georgia Access plan should end when Medicare starts. The Georgia State Health Insurance Assistance Program, run through the Division of Aging Services at 1-866-552-4464, offers free Medicare counseling, and in Georgia the county you live in &mdash; one of 159 &mdash; decides which Medicare Advantage plans are filed for you."),
 ],
)

COPY["arizona"] = dict(
 intro=P("Arizona has expanded Medicaid, so a single adult earning up to about $22,025 in 2026 &mdash; 138% of the federal poverty level &mdash; qualifies for AHCCCS, Arizona&rsquo;s Medicaid program, and the marketplace subsidy picks up above that line. Arizona&rsquo;s plans are sold on healthcare.gov, and for the many people who retire to Arizona before 65, the application sizes the premium tax credit to retirement income rather than the salary they left behind."),
 exch_note="Arizona has no state-run exchange; the federal marketplace handles enrollment and the premium tax credit.",
 medicaid=expanded("Arizona", "AHCCCS, Arizona&rsquo;s Medicaid program"),
 faq=[
  ("Where do Arizona residents buy ACA coverage?", "Through healthcare.gov, the federal marketplace; Arizona has no state exchange. The application checks AHCCCS eligibility first &mdash; about $22,025 for one person in 2026 &mdash; then calculates the premium tax credit for a marketplace plan. A licensed agent can enroll you at no extra cost."),
  ("Has Arizona expanded Medicaid, and what is the income line?", "Yes. Household income up to about 138% of the federal poverty level &mdash; roughly $22,025 for one person or $29,863 for two in 2026 &mdash; qualifies for Medicaid through AHCCCS, so Arizona has no coverage gap. Above that, premium tax credits apply to a healthcare.gov plan."),
  ("I retired to Arizona before 65. What are my options until Medicare?", "A healthcare.gov plan with the premium tax credit applied monthly, sized to your household income. Many early retirees in Arizona find that once earned income stops, their income lands just above the $22,025 AHCCCS line for one person, where the credit is close to its largest; we calculate it before comparing plans."),
  ("I am turning 65 in Arizona. What changes?", "Your premium tax credit ends when Medicare Part A and Part B begin, and Medicare becomes primary. The Arizona State Health Insurance Assistance Program (SHIP), delivered through the Area Agencies on Aging at 1-800-432-4040, offers free Medicare counseling, and if your move to Arizona is recent it may also open a Special Enrollment Period for a Medicare Advantage plan filed for your county."),
 ],
)
