# Assembles src/states/states.json from the verified facts below and the
# per-product copy modules (copy_fe.py, copy_medicare.py, copy_aca.py).
#
#   python src/states/assemble.py
#
# Run it after editing any copy module, then node scripts/build.js.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import copy_fe, copy_medicare, copy_aca

NAT = {"cremation": 1995, "burial": 2800, "basic": 2195, "full": 6415, "cemeteryLow": 2000, "cemeteryHigh": 5000}

# State Health Insurance Assistance Programs — shiphelp.org state listings, read 12 Sep 2026.
SHIP = {
 "colorado": ("State Health Insurance Assistance Program (SHIP)", "https://doi.colorado.gov/insurance-products/health-insurance/senior-health-care-medicare", "1-888-696-7213"),
 "tennessee": ("State Health Insurance Assistance Program (SHIP)", "https://www.tn.gov/disability-and-aging/disability-aging-programs/tn-ship.html", "1-877-801-0044"),
 "florida": ("Serving Health Insurance Needs of Elders (SHINE)", "https://www.floridashine.org/", "1-800-963-5337"),
 "texas": ("Health Information, Counseling, and Advocacy Program (HICAP)", "https://hhs.texas.gov/services/health/medicare", "1-800-252-9240"),
 "california": ("California Health Insurance Counseling and Advocacy Program (HICAP)", "https://www.aging.ca.gov/hicap/", "1-800-434-0222"),
 "pennsylvania": ("PA MEDI &ndash; Pennsylvania Medicare Education and Decision Insight", "https://www.pa.gov/agencies/aging/aging-programs-and-services/pa-medi-medicare-counseling", "1-800-783-7067"),
 "ohio": ("Ohio Senior Health Insurance Information Program (OSHIIP)", "https://insurance.ohio.gov/consumers/medicare/01-oshiip", "1-800-686-1578"),
 "michigan": ("Michigan State Health Insurance Assistance Program (SHIP)", "https://www.michigan.gov/mdhhs/adult-child-serv/adults-and-seniors/acls/state-health-insurance-assistance-program", "1-800-803-7174"),
 "north-carolina": ("Seniors&rsquo; Health Insurance Information Program (SHIIP)", "https://www.ncdoi.gov/consumers/medicare-and-seniors-health-insurance-information-program-shiip", "1-855-408-1212"),
 "georgia": ("Georgia State Health Insurance Assistance Program", "https://aging.georgia.gov/georgia-ship", "1-866-552-4464"),
 "arizona": ("Arizona State Health Insurance Assistance Program (SHIP)", "https://azship.org/", "1-800-432-4040"),
}
# Insurance departments — homepages fetched and title-checked 12 Sep 2026.
DEPT = {
 "colorado": ("Colorado Division of Insurance", "https://doi.colorado.gov/"),
 "tennessee": ("Tennessee Department of Commerce and Insurance", "https://www.tn.gov/commerce/insurance-division.html"),
 "florida": ("Florida Department of Financial Services, Division of Consumer Services", "https://www.myfloridacfo.com/division/consumers"),
 "texas": ("Texas Department of Insurance", "https://www.tdi.texas.gov/"),
 "california": ("California Department of Insurance", "https://www.insurance.ca.gov/"),
 "pennsylvania": ("Pennsylvania Insurance Department", "https://www.pa.gov/agencies/insurance"),
 "ohio": ("Ohio Department of Insurance", "https://insurance.ohio.gov/"),
 "michigan": ("Michigan Department of Insurance and Financial Services", "https://www.michigan.gov/difs"),
 "north-carolina": ("North Carolina Department of Insurance", "https://www.ncdoi.gov/"),
 "georgia": ("Georgia Office of Insurance and Safety Fire Commissioner", "https://oci.georgia.gov/"),
 "arizona": ("Arizona Department of Insurance and Financial Institutions", "https://difi.az.gov/"),
}
EXCH = {"colorado": ("Connect for Health Colorado", "https://connectforhealthco.com/", "state"), "california": ("Covered California", "https://www.coveredca.com/", "state"), "pennsylvania": ("Pennie", "https://pennie.com/", "state"), "georgia": ("Georgia Access", "https://georgiaaccess.gov/", "state")}
FFM = ("healthcare.gov", "https://www.healthcare.gov/", "ffm")
# Funeral figures — docs/content/state-pages.md (verified 2026 price-list analysis): lists, cremation, burial, basic services fee.
FUNERAL = {"colorado": (31, 1650, 2565, 1985), "tennessee": (26, 2348, 2990, 2298), "florida": (32, 1882, 2695, 2025), "texas": (40, 2015, 2890, 2245), "california": (90, 1895, 2499, 1995), "pennsylvania": (24, 2462, 2998, 2562), "ohio": (31, 1850, 2648, 1995), "michigan": (29, 2250, 2575, 2345), "north-carolina": (13, 1700, 2920, 2190), "georgia": (40, 2525, 3225, 2578), "arizona": (29, 1240, 2045, 1550)}
# Expansion status — KFF tracker as of 21 Aug 2026, cross-checked with medicaid.gov.
EXPANDED = {"colorado": True, "tennessee": False, "florida": False, "texas": False, "california": True, "pennsylvania": True, "ohio": True, "michigan": True, "north-carolina": True, "georgia": False, "arizona": True}
NAMES = {"colorado": ("Colorado", "CO"), "tennessee": ("Tennessee", "TN"), "florida": ("Florida", "FL"), "texas": ("Texas", "TX"), "california": ("California", "CA"), "pennsylvania": ("Pennsylvania", "PA"), "ohio": ("Ohio", "OH"), "michigan": ("Michigan", "MI"), "north-carolina": ("North Carolina", "NC"), "georgia": ("Georgia", "GA"), "arizona": ("Arizona", "AZ")}

DESC = {
 "colorado": ("Final expense insurance in Colorado. A direct cremation runs $1,650 and an immediate burial $2,565, below the national median. Call 1-888-957-3337 today.", "Medicare Advantage in Colorado is filed by county. Free counseling from Colorado SHIP; a Greenwood Village agent compares your county. Call 1-888-957-3337.", "ACA plans in Colorado: Health First Colorado Medicaid up to about $22,025 for one person, then subsidies on Connect for Health Colorado. Call 1-888-957-3337."),
 "tennessee": ("Final expense insurance in Tennessee. A direct cremation runs $2,348 and an immediate burial $2,990, above the national median. Call 1-888-957-3337 now.", "Medicare Advantage in Tennessee is filed by county. Free counseling from Tennessee SHIP; a licensed agent compares your county's plans. Call 1-888-957-3337.", "ACA plans in Tennessee: no Medicaid expansion, so adults under $15,960 face a coverage gap; subsidies start above it on healthcare.gov. Call 1-888-957-3337."),
 "florida": ("Final expense insurance in Florida. A direct cremation runs $1,882 and an immediate burial $2,695, near the national median. Call 1-888-957-3337 today.", "Medicare Advantage in Florida is filed by county. Free counseling from SHINE; a licensed agent compares the plans for your county. Call 1-888-957-3337, TTY 711.", "ACA plans in Florida: no Medicaid expansion, so adults under $15,960 face a coverage gap; subsidies start above it on healthcare.gov. Call 1-888-957-3337 today."),
 "texas": ("Final expense insurance in Texas. A direct cremation runs $2,015 and an immediate burial $2,890, above the national median. Call 1-888-957-3337 today.", "Medicare Advantage in Texas is filed county by county across 254 counties. Free counseling from Texas HICAP; an agent compares your county. Call 1-888-957-3337.", "ACA plans in Texas: no Medicaid expansion, so adults under $15,960 face a coverage gap; subsidies start above it on healthcare.gov. Call 1-888-957-3337 today."),
 "california": ("Final expense insurance in California. A direct cremation runs $1,895 and an immediate burial $2,499, below the national median. Call 1-888-957-3337 now.", "Medicare Advantage in California is filed by county. Free counseling from California HICAP; a licensed agent compares your county's plans. Call 1-888-957-3337.", "ACA plans in California: Medi-Cal up to about $22,025 for one person, then premium tax credits on Covered California. Licensed agents. Call 1-888-957-3337."),
 "pennsylvania": ("Final expense insurance in Pennsylvania. The basic services fee runs $2,562 here, the highest of our eleven states. Rates by age. Call 1-888-957-3337.", "Medicare Advantage in Pennsylvania is filed by county. Free counseling from PA MEDI; a licensed agent compares your county's plans. Call 1-888-957-3337 today.", "ACA plans in Pennsylvania: Medicaid up to about $22,025 for one person, then premium tax credits on Pennie, the state exchange. Call 1-888-957-3337 for numbers."),
 "ohio": ("Final expense insurance in Ohio. A direct cremation runs $1,850 and an immediate burial $2,648, close to the national median. Call 1-888-957-3337 today.", "Medicare Advantage in Ohio is filed by county. Free counseling from OSHIIP at the Department of Insurance; an agent compares your county. Call 1-888-957-3337.", "ACA plans in Ohio: Ohio Medicaid up to about $22,025 for one person, then premium tax credits on healthcare.gov. Agents check your subsidy. Call 1-888-957-3337."),
 "michigan": ("Final expense insurance in Michigan. A direct cremation runs $2,250 and an immediate burial $2,575, only 14% apart. Rates by age. Call 1-888-957-3337 today.", "Medicare Advantage in Michigan is filed by county. Free counseling from Michigan SHIP; a licensed agent compares your county's plans. Call 1-888-957-3337 now.", "ACA plans in Michigan: Medicaid up to about $22,025 for one person, then premium tax credits on healthcare.gov. Agents check your subsidy. Call 1-888-957-3337."),
 "north-carolina": ("Final expense insurance in North Carolina. A direct cremation runs $1,700 and an immediate burial $2,920, a 72% gap. Call 1-888-957-3337 for rates by age.", "Medicare Advantage in North Carolina is filed by county. Free counseling from SHIIP at the NC Department of Insurance. Call 1-888-957-3337, TTY 711, today.", "ACA plans in North Carolina: Medicaid up to about $22,025 for one person, then premium tax credits on healthcare.gov. Licensed agents. Call 1-888-957-3337."),
 "georgia": ("Final expense insurance in Georgia. A direct cremation runs $2,525 and an immediate burial $3,225, well above the national median. Call 1-888-957-3337.", "Medicare Advantage in Georgia is filed by county across 159 counties. Free counseling from Georgia SHIP; an agent compares your county. Call 1-888-957-3337.", "ACA plans in Georgia: no Medicaid expansion, so adults under $15,960 face a coverage gap unless Pathways applies; subsidies start above it. Call 1-888-957-3337."),
 "arizona": ("Final expense insurance in Arizona. A direct cremation runs $1,240, second-lowest in the country, and an immediate burial $2,045. Call 1-888-957-3337.", "Medicare Advantage in Arizona is filed by county. Free counseling from Arizona SHIP; a licensed agent compares your county's plans. Call 1-888-957-3337 now.", "ACA plans in Arizona: AHCCCS Medicaid up to about $22,025 for one person, then premium tax credits on healthcare.gov. Licensed agents. Call 1-888-957-3337."),
}

states = []
for slug, (name, abbr) in NAMES.items():
    fe, med, aca = copy_fe.COPY[slug], copy_medicare.COPY[slug], copy_aca.COPY[slug]
    lists, crem, bur, basic = FUNERAL[slug]; ex = EXCH.get(slug, FFM); ship = SHIP[slug]
    kind_text = (f"{ex[0]} is a state-based marketplace and sets its own window, which has often run longer than the federal one." if ex[2] == "state"
                 else f"{name} uses the federal marketplace, so its window follows the healthcare.gov schedule.")
    states.append({
        "slug": slug, "name": name, "abbr": abbr,
        "funeral": {"lists": lists, "cremation": crem, "burial": bur, "basic": basic},
        "dept": {"name": DEPT[slug][0], "url": DEPT[slug][1]},
        "ship": {"name": ship[0], "url": ship[1], "phone": ship[2], "source": f"https://www.shiphelp.org/ships/{slug}/"},
        "exchange": {"name": ex[0], "url": ex[1], "kind": kind_text, "note": aca["exch_note"]},
        "counties": med["counties"],
        "medicaid": {"expanded": EXPANDED[slug], "section": aca["medicaid"]},
        "titles": {"fe": f"Final Expense Insurance in {name} | Rates & Funeral Costs", "medicare": f"Medicare Advantage Plans in {name} | Senior Solutions Insurance", "aca": f"ACA Marketplace Plans in {name} | Senior Solutions Insurance"},
        "descriptions": dict(zip(("fe", "medicare", "aca"), DESC[slug])),
        "fe": {"intro": fe["intro"], "observation": fe["obs"], "coverageNote": fe["cov"], "regSection": fe["reg"], "bandLow": copy_fe.BAND[slug][0], "bandHigh": copy_fe.BAND[slug][1]},
        "medicare": {"intro": med["intro"], "shipSection": med["ship"], "regSection": med["reg"], "heroStat": copy_medicare.COUNTY.format(s=name)},
        "aca": {"intro": aca["intro"], "regSection": None, "heroStat": copy_aca.hero(name, EXPANDED[slug])},
        "faq": {"fe": fe["faq"], "medicare": med["faq"], "aca": aca["faq"]},
    })

problems = []
for st in states:
    for prod, d in st["descriptions"].items():
        if not (150 <= len(d) <= 160): problems.append(f"{st['slug']}/{prod} description {len(d)} chars")
    for prod, faqs in st["faq"].items():
        if len(faqs) < 4: problems.append(f"{st['slug']}/{prod} only {len(faqs)} FAQs")
        if sum(1 for q, a in faqs if st["name"] in q + a) < 2: problems.append(f"{st['slug']}/{prod} fewer than 2 state-named FAQs")
if problems:
    print("PROBLEMS:", *problems, sep="\n  "); sys.exit(1)

out = {"national": NAT, "sources": {
    "funeral": "docs/content/state-pages.md — analysis of 1,000+ funeral home General Price Lists, 50 states, 2026 (medians per state)",
    "ship": "shiphelp.org state listings (https://www.shiphelp.org/ships/<state>/), read 12 Sep 2026; operating agencies from the linked program sites",
    "medicaid": "KFF, Status of State Medicaid Expansion Decisions (as of 21 Aug 2026: 41 incl. DC adopted / 10 not), cross-checked with medicaid.gov's Adult Coverage Expansion map; Georgia Pathways criteria from pathways.georgia.gov; income lines from the 2026 HHS poverty guidelines (aspe.hhs.gov)",
    "departments": "each department homepage fetched and title-checked 12 Sep 2026; services named on pages appear on that homepage",
    "counties": "state county lists, confirmed 12 Sep 2026",
    "population": "Share of residents 65+ by state: US Census Bureau, 2024 American Community Survey, via USAFacts (Maine 23.5%, Vermont 22.9%, West Virginia 21.9%, Florida 21.8% — fourth; usafacts.org/articles/america-is-getting-older-which-states-have-the-largest-elderly-populations/, read 12 Sep 2026). California 65+ count and share: US Census Bureau 2024 via USAFacts (about 6.52 million, 16.6%; usafacts.org/data/topics/people-society/population-and-demographics/our-changing-population/state/california/). Arizona 65+ net domestic migration: University of Arizona Economic and Business Research Center, from the 2022 1-year ACS (second, 18,318; azeconomy.org/2023/12/economy/what-states-do-workers-and-retirees-migrate-to/)"
}, "states": states}
json.dump(out, open(os.path.join(HERE, "states.json"), "w", encoding="utf-8", newline="\n"), indent=1, ensure_ascii=False)
print("states:", len(states), "| faqs:", sum(len(v) for st in states for v in st["faq"].values()))
