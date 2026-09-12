// State landing pages: 11 states x 3 products, generated from src/states/.
//
//   src/states/states.json          per-state data and per-page copy (FAQs,
//                                   intros, observations) — the content
//   src/states/publish.json         one flag per product; false = built and
//                                   deployed noindex, out of the sitemap, no
//                                   hub section and no footer link
//   src/states/templates/*.html     fe / medicare / aca page templates
//
// Everything a visitor reads is either in states.json or in the template.
// This file only does arithmetic on the verified funeral-cost figures (the
// national comparisons and the coverage sums) and fills tokens. Nothing here
// invents a figure. Sources for the looked-up facts are cited in the JSON.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'src', 'states');
const data = JSON.parse(fs.readFileSync(path.join(DIR, 'states.json'), 'utf8'));
const publish = JSON.parse(fs.readFileSync(path.join(DIR, 'publish.json'), 'utf8'));
const tpl = {};
for (const p of ['fe', 'medicare', 'aca']) tpl[p] = fs.readFileSync(path.join(DIR, 'templates', p + '.html'), 'utf8');

const PRODUCTS = {
  fe: { base: '/final-expense-insurance/', parentName: 'Final Expense Insurance', og: '/assets/img/og-final-expense.jpg', ogAlt: 'Final expense insurance monthly rates by age, 50 to 85', hub: 'Final expense insurance by state', hubId: 'by-state' },
  medicare: { base: '/medicare/', parentName: 'Medicare', og: '/assets/img/og-medicare.jpg', ogAlt: 'A licensed agent comparing Medicare Advantage plans', hub: 'Medicare Advantage by state', hubId: 'by-state' },
  aca: { base: '/health-insurance/', parentName: 'Health Insurance', og: '/assets/img/og-health.jpg', ogAlt: 'A licensed agent comparing ACA marketplace plans', hub: 'ACA marketplace plans by state', hubId: 'by-state' }
};

const NAT = data.national; // verified national medians from the content file
const money = n => '$' + Number(n).toLocaleString('en-US');
const pct = (state, national) => Math.round(Math.abs(state / national - 1) * 100);
const esc = s => String(s).replace(/&(?!amp;|mdash;|ndash;|rarr;|nbsp;|#)/g, '&amp;');

function faq(list) {
  return list.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n');
}

// Every token the templates can use, for one state.
function vars(st, product) {
  const f = st.funeral;
  const P = PRODUCTS[product];
  const v = {
    state: st.name, slug: st.slug, abbr: st.abbr,
    productBase: P.base, productName: P.parentName,
    deptName: st.dept.name, deptUrl: st.dept.url,
    exchangeName: st.exchange.name, exchangeUrl: st.exchange.url,
    shipName: st.ship.name, shipUrl: st.ship.url, shipPhone: st.ship.phone, shipTel: '+1' + st.ship.phone.replace(/\D/g, '').replace(/^1/, ''),
    shipSource: st.ship.source,
    faq: faq(st.faq[product] || []),
    description: st.descriptions[product]
  };
  if (product === 'fe') {
    // National comparisons, computed from the verified table.
    const cmp = (val, nat) => {
      const d = pct(val, nat);
      if (d === 0) return 'at the national median';
      return d + '% ' + (val < nat ? 'below' : 'above') + ' the national median of ' + money(nat);
    };
    Object.assign(v, {
      lists: f.lists,
      cremation: money(f.cremation), burial: money(f.burial), basic: money(f.basic),
      natCremation: money(NAT.cremation), natBurial: money(NAT.burial), natBasic: money(NAT.basic), natFull: money(NAT.full),
      cremationCmp: cmp(f.cremation, NAT.cremation), burialCmp: cmp(f.burial, NAT.burial), basicCmp: cmp(f.basic, NAT.basic),
      gapPct: Math.round((f.burial / f.cremation - 1) * 100),
      // Coverage arithmetic: the state's own immediate-burial median plus the
      // cemetery range from the content file, then the national full funeral
      // figure plus the same range.
      burialPlusLow: money(f.burial + NAT.cemeteryLow), burialPlusHigh: money(f.burial + NAT.cemeteryHigh),
      fullPlusLow: money(NAT.full + NAT.cemeteryLow), fullPlusHigh: money(NAT.full + NAT.cemeteryHigh),
      cemLow: money(NAT.cemeteryLow), cemHigh: money(NAT.cemeteryHigh),
      intro: st.fe.intro, observation: st.fe.observation, coverageNote: st.fe.coverageNote, regSection: st.fe.regSection
    });
  }
  if (product === 'aca') {
    Object.assign(v, { intro: st.aca.intro, medicaidSection: st.medicaid.section, exchangeKind: st.exchange.kind, exchangeNote: st.exchange.note || '' });
  }
  if (product === 'medicare') {
    Object.assign(v, { intro: st.medicare.intro, shipSection: st.medicare.shipSection, regSection: st.medicare.regSection });
  }
  return v;
}

// Partials ({{icons}}, {{quote-form}}, {{block-a}}) are filled later by the
// main build; everything else must come from the state data.
const PARTIAL_TOKENS = new Set(['icons', 'quote-form', 'block-a', 'form', 'steps']);
function render(product, st) {
  const v = vars(st, product);
  let body = tpl[product].replace(/\{\{([\w-]+)\}\}/g, (m, k) => (k in v ? v[k] : m));
  const left = (body.match(/\{\{([\w-]+)\}\}/g) || []).filter(t => !PARTIAL_TOKENS.has(t.slice(2, -2)));
  if (left.length) throw new Error(`states: unfilled token(s) in ${product}/${st.slug}: ${[...new Set(left)].join(' ')}`);
  return body;
}

// Virtual page sources, in the same <!-- meta --> + body shape as src/pages.
function pages({ SITE, partials }) {
  const out = [];
  for (const product of Object.keys(PRODUCTS)) {
    const P = PRODUCTS[product];
    for (const st of data.states) {
      const meta = {
        crumb: st.name,
        parent: { name: P.parentName, path: P.base },
        faqSchema: true,
        held: !publish[product],
        path: P.base + st.slug + '/',
        og: P.og, ogAlt: P.ogAlt,
        title: st.titles[product],
        description: st.descriptions[product],
        bodyClass: 'page-guide page-state'
      };
      out.push({
        name: `${product}-${st.slug}.html`,
        src: 'src/states/states.json',
        raw: `<!-- meta ${JSON.stringify(meta)} -->\n${render(product, st)}`
      });
    }
  }
  // Review index for the agency: lists all 33 draft pages. Lives under
  // /preview/, which is noindex by header and disallowed in robots.txt.
  const groups = Object.keys(PRODUCTS).map(product => {
    const P = PRODUCTS[product];
    const items = data.states.map(st => `<li><a href="${P.base}${st.slug}/">${st.name}</a> <span class="review__status">${publish[product] ? 'published' : 'draft — noindex'}</span></li>`).join('\n');
    return `<h2>${P.hub}</h2>\n<ul class="review__list">\n${items}\n</ul>`;
  }).join('\n');
  out.push({
    name: 'preview-state-pages.html',
    src: 'src/states/states.json',
    raw: `<!-- meta ${JSON.stringify({ crumb: 'State pages review', path: '/preview/state-pages/', out: 'preview/state-pages/index.html', noindex: true, title: 'State landing pages — draft review | Senior Solutions Insurance', description: 'Review index for the 33 draft state landing pages.', bodyClass: 'page-guide' })} -->
{{icons}}
<section class="hero hero--band hero--legal"><div class="wrap"><div class="hero__copy"><p class="hero__eyebrow">Draft review</p><h1>State landing pages</h1></div></div></section>
<article class="sec guide"><div class="wrap"><div class="prose prose--guide">
<p>Thirty-three draft pages, eleven states across three products. Every page is served <code>noindex</code>, is outside the sitemap and the navigation, and is not linked from any indexed page until its product is signed off. Publishing a product is one flag in <code>src/states/publish.json</code>.</p>
${groups}
</div></div></article>`
  });
  return out;
}

// Hub section for a parent page — empty while the product is unpublished.
function hub(product) {
  if (!publish[product]) return '';
  const P = PRODUCTS[product];
  const items = data.states.map(st => `<li><a href="${P.base}${st.slug}/">${st.name}</a></li>`).join('\n      ');
  return `<section class="sec sec--tight statehub" id="${P.hubId}" aria-labelledby="${P.hubId}-h">
  <div class="wrap">
    <h2 class="sec__h sec__h--sm" id="${P.hubId}-h">${P.hub}</h2>
    <ul class="statehub__list">
      ${items}
    </ul>
  </div>
</section>`;
}

// Footer links to the hub sections — only for published products.
function footerLinks() {
  return Object.keys(PRODUCTS).filter(p => publish[p]).map(p => `        <li><a href="${PRODUCTS[p].base}#${PRODUCTS[p].hubId}">${PRODUCTS[p].hub}</a></li>`).join('\n');
}

// Keep the per-path X-Robots-Tag noindex rule in vercel.json in step with the
// publish flags, so publishing a product is the flag plus a rebuild and
// nothing else. The rule covers the unpublished products' state pages; it
// is removed entirely once all three are published.
function syncVercelNoindex() {
  const file = path.join(ROOT, 'vercel.json');
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  const isStateRule = h => /^\/\((?:[a-z-]+\|?)+\)\/\(\[a-z-\]\+\)\/$/.test(h.source || '') && (h.headers || []).some(k => k.key === 'X-Robots-Tag');
  const unpublished = Object.keys(PRODUCTS).filter(p => !publish[p]).map(p => PRODUCTS[p].base.replace(/\//g, ''));
  const rule = unpublished.length ? { source: '/(' + unpublished.join('|') + ')/([a-z-]+)/', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] } : null;
  const idx = cfg.headers.findIndex(isStateRule);
  const before = JSON.stringify(idx >= 0 ? cfg.headers[idx] : null), after = JSON.stringify(rule);
  if (before === after) return false;
  if (idx >= 0 && rule) cfg.headers[idx] = rule;
  else if (idx >= 0) cfg.headers.splice(idx, 1);
  else { const legal = cfg.headers.findIndex(h => h.source === '/(privacy|terms-and-conditions)/'); cfg.headers.splice(legal + 1, 0, rule); }
  let out = JSON.stringify(cfg, null, 2);
  // keep the compact one-line object style the file uses
  out = out.replace(/\{\s+("key": "[^"]*"),\s+("value": "[^"]*")\s+\}/g, '{ $1, $2 }')
    .replace(/\{\s+("source": "[^"]*"),\s+("destination": "[^"]*"),\s+("statusCode": 301)\s+\}/g, '{ $1, $2, $3 }')
    .replace(/\{\s+("src": "[^"]*"),\s+("status": 410)\s+\}/g, '{ $1, $2 }')
    .replace(/\{\s+("type": "(?:host|query)"),\s+("(?:value|key)": "[^"]*")\s+\}/g, '{ $1, $2 }')
    .replace(/\{\s+("src": "\/"),\s+"has": \[\s+(\{ "type"[^\n]*\})\s+\],\s+("status": 410)\s+\}/g, '{ $1, "has": [ $2 ], $3 }')
    .replace(/"headers": \[\s+(\{ "key"[^\n]*\})\s+\]/g, '"headers": [ $1 ]')
    .replace(/"(has|missing)": \[\s+(\{ "type"[^\n]*\})\s+\]/g, '"$1": [ $2 ]');
  fs.writeFileSync(file, out + '\n');
  return true;
}

module.exports = { pages, hub, footerLinks, syncVercelNoindex, data, publish, PRODUCTS };
