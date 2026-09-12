#!/usr/bin/env node
// Assembles the static site from src/ into the repo root.
//
//   node scripts/build.js
//
// Every file in src/pages/ starts with one <!-- meta {...} --> comment holding
// the page's title, description, output path and flags, followed by the page
// body. The body is dropped into src/layout.html; {{quoteForm}} inside a body
// pulls in src/partials/quote-form.html. Output is committed, so Vercel needs
// no build step — run this after editing anything under src/.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const layout = fs.readFileSync(path.join(SRC, 'layout.html'), 'utf8');
const partials = {};
for (const f of fs.readdirSync(path.join(SRC, 'partials'))) {
  partials[path.basename(f, '.html')] = fs.readFileSync(path.join(SRC, 'partials', f), 'utf8');
}
// The estimator markup is inlined at build time from the widget file; its CSS
// and JS are separate files (assets/estimator.*) referenced from <head> on the
// pages that carry it, so the CSP needs no inline allowances.
partials['estimator'] = fs.readFileSync(path.join(ROOT, 'widgets', 'ssi-cost-estimator.html'), 'utf8')
  .replace(/^<!--[\s\S]*?-->\s*/, '');

const SITE = 'https://ssifinalexpense.com';

// Cache-busting: stamp css/js URLs with a content hash so a redeploy can never
// leave a visitor on an old stylesheet.
const crypto = require('crypto');
function stamp(rel) {
  const h = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex').slice(0, 8);
  return '/' + rel + '?v=' + h;
}
const ASSET = { css: stamp('assets/site.css'), js: stamp('assets/site.js'), guard: stamp('assets/host-guard.js'), estCss: stamp('assets/estimator.css'), estJs: stamp('assets/estimator.js') };

const AGENCY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  '@id': SITE + '/#agency',
  name: 'Senior Solutions Insurance',
  legalName: 'Christopher L Martin Insurance Group',
  url: SITE + '/',
  telephone: '+1-888-957-3337',
  image: SITE + '/assets/img/team-boardroom.jpg',
  logo: SITE + '/assets/ssi-logo.png',
  foundingDate: '2008',
  founder: { '@type': 'Person', name: 'Chris Martin', jobTitle: 'Founder & CEO' },
  description: 'Licensed insurance agency in Greenwood Village, Colorado. Final expense and burial insurance, Medicare Advantage and ACA health plans, quoted by licensed agents.',
  hasMap: 'https://www.google.com/maps/dir/?api=1&destination=5775+DTC+Blvd+Suite+250-S+Greenwood+Village+CO+80111',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5775 DTC Blvd, Suite 250-S',
    addressLocality: 'Greenwood Village',
    addressRegion: 'CO',
    postalCode: '80111',
    addressCountry: 'US'
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' }
  ],
  // Licensed in all 50 states (client confirmation, 12 Sep 2026): one Country
  // node, not fifty State nodes. No geo, aggregateRating or Google Business
  // Profile URL yet — each needs verifying first; see docs/open-items.md.
  areaServed: { '@type': 'Country', name: 'United States' },
  sameAs: ['https://www.facebook.com/SeniorSolutionsInsuranceMedicare', 'https://www.bbb.org/us/co/denver/profile/funeral-related-services/senior-solutions-insurance-1296-90265012']
};

// Photos: every /assets/img/*.jpg has a WebP sibling, so serve that first, and
// stamp the real pixel size so the markup never lies about intrinsic dimensions.
let sizeOf;
try { sizeOf = require('./imgsize'); } catch (e) { sizeOf = null; }
function pictures(html) {
  // Carrier logos: every raster logo has a WebP sibling; SVGs are served as is.
  html = html.replace(/<img([^>]*?)src="(\/assets\/carriers\/([\w-]+)\.png)"([^>]*)>/g, (m, pre, src, name, post) => {
    const webp = path.join(ROOT, 'assets', 'carriers', name + '.webp');
    if (!fs.existsSync(webp)) return m;
    return '<picture><source type="image/webp" srcset="/assets/carriers/' + name + '.webp"><img' + pre + 'src="' + src + '"' + post + '></picture>';
  });
  return html.replace(/<img([^>]*?)src="(\/assets\/img\/([\w-]+)\.jpg)"([^>]*)>/g, (m, pre, src, name, post) => {
    const webp = path.join(ROOT, 'assets', 'img', name + '.webp');
    let attrs = pre + 'src="' + src + '"' + post;
    if (sizeOf) {
      const d = sizeOf(path.join(ROOT, 'assets', 'img', name + '.jpg'));
      if (d) attrs = attrs.replace(/width="\d+"/, 'width="' + d.width + '"').replace(/height="\d+"/, 'height="' + d.height + '"');
    }
    if (!fs.existsSync(webp)) return '<img' + attrs + '>';
    return '<picture><source type="image/webp" srcset="/assets/img/' + name + '.webp"><img' + attrs + '></picture>';
  });
}

// Character references in page copy, decoded for schema text (JSON, not
// HTML). The named table is the complete WHATWG list (scripts/entities.json,
// from https://html.spec.whatwg.org/entities.json — 2,231 names, including
// the legacy forms without a trailing semicolon); numeric references follow
// the spec's tokenizer rules. An unknown name is left as written and caught
// by the JSON-LD assert below rather than silently emitted.
const ENTITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'entities.json'), 'utf8'));
const NUMERIC_REPLACEMENTS = { 0x00: 0xFFFD, 0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178 };
function decodeEntities(s) {
  return s.replace(/&(#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);?/g, (m, e) => {
    if (e[0] === '#') {
      const hex = e[1] === 'x' || e[1] === 'X';
      let cp = parseInt(e.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (cp in NUMERIC_REPLACEMENTS) cp = NUMERIC_REPLACEMENTS[cp];
      if (cp > 0x10FFFF || (cp >= 0xD800 && cp <= 0xDFFF)) cp = 0xFFFD;
      return String.fromCodePoint(cp);
    }
    if (m in ENTITIES) return ENTITIES[m].characters;              // "&name;" or a legacy "&name"
    if (('&' + e + ';') in ENTITIES) return ENTITIES['&' + e + ';'].characters;
    // Legacy reference without a semicolon followed by more text (&copy2026):
    // the spec takes the longest table entry that prefixes the name.
    if (!m.endsWith(';')) for (let i = e.length - 1; i > 0; i--) if (('&' + e.slice(0, i)) in ENTITIES) return ENTITIES['&' + e.slice(0, i)].characters + e.slice(i);
    return m;
  });
}

// Every JSON-LD block must be plain text: no character reference may survive
// into the structured data, whether it came from copy, a title or a FAQ.
function assertNoEntitiesInJsonLd(f, html) {
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const hit = json.match(/&(#[xX]?[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/);
    if (hit) throw new Error(f + ': undecoded character reference in JSON-LD: ' + hit[0] + ' near ' + JSON.stringify(json.slice(Math.max(0, hit.index - 40), hit.index + 40)));
  }
}

function fill(tpl, vars) {
  return tpl.replace(/\{\{([\w:-]+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// Dates from git for a set of source files: first commit (published) and last
// commit (modified). A file with uncommitted edits is "modified" today.
const { execSync } = require('child_process');
function git(cmd) { try { return execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { return ''; } }
function gitDates(files) {
  const now = new Date();
  const today = now.toLocaleDateString('en-CA');
  const list = files.map(f => JSON.stringify(f)).join(' ');
  const dirty = git('git status --porcelain -- ' + list);
  // Published: when the page's own file (files[0]) first landed in git. A page
  // that is not committed yet is published now. Full ISO 8601 with offset,
  // which is what Article markup wants; the sitemap uses the date part.
  const firstIso = git('git log --diff-filter=A --format=%cI -- ' + JSON.stringify(files[0])).split(/\r?\n/).filter(Boolean).pop() || now.toISOString();
  const lastIso = dirty ? now.toISOString() : (git('git log -1 --format=%cI -- ' + list) || now.toISOString());
  return { published: firstIso, modified: lastIso, modifiedDate: dirty ? today : lastIso.slice(0, 10) };
}

// State landing pages are generated from src/states/ (data + three templates)
// and flow through the same pipeline as the hand-written pages.
const states = require('./states');
const statePages = states.pages({ SITE, partials });
partials['state-hub:fe'] = states.hub('fe');
partials['state-hub:medicare'] = states.hub('medicare');
partials['state-hub:aca'] = states.hub('aca');
partials['state-footer-links'] = states.footerLinks();
if (states.syncVercelNoindex()) console.log('vercel.json: state-page noindex rule updated from src/states/publish.json');

const pagesDir = path.join(SRC, 'pages');
const built = [];
const pageSources = fs.readdirSync(pagesDir).sort().filter(f => f.endsWith('.html')).map(f => ({ f, raw: fs.readFileSync(path.join(pagesDir, f), 'utf8'), src: 'src/pages/' + f }))
  .concat(statePages.map(p => ({ f: p.name, raw: p.raw, src: p.src })));
for (const { f, raw, src } of pageSources) {
  const m = raw.match(/^<!--\s*meta\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!m) throw new Error(f + ': missing <!-- meta {...} --> header');
  const meta = JSON.parse(m[1]);
  let body = raw.slice(m[0].length);
  // Which source files this page is made of (for the sitemap lastmod).
  const sources = [src];
  const addPartials = (txt) => {
    for (const [, k] of txt.matchAll(/\{\{([\w:-]+)\}\}/g)) {
      if (k === 'estimator') { if (!sources.includes('widgets/ssi-cost-estimator.html')) sources.push('widgets/ssi-cost-estimator.html'); }
      else if (k in partials) { const sp = 'src/partials/' + k + '.html'; if (!sources.includes(sp)) { sources.push(sp); addPartials(partials[k]); } }
    }
  };
  addPartials(body);
  body = fill(fill(body, partials), partials); // partials may nest one level

  const schemas = [AGENCY_SCHEMA];

  // FAQPage is read from the page's own <details> so the markup can never
  // say something the visitor cannot see. Only pages flagged faqSchema get
  // it: the final expense page owns those questions (the homepage FAQ
  // overlaps and is deliberately not marked up), and /medicare/ never
  // while it is noindex and held.
  if (meta.faqSchema) {
    const qa = [...body.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
      .map(m => [m[1], m[2]].map(t => decodeEntities(t.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()));
    if (!qa.length) throw new Error(f + ': faqSchema set but no <details> FAQ found');
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: qa.map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    });
  }

  // Article markup for long-form guide pages: author is a Person node for the
  // founder, publisher points at the InsuranceAgency node already on the page.
  // No Product or Offer — nothing is sold on these pages.
  if (meta.article) {
    const dates = gitDates(sources);
    const h1 = (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, meta.title])[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': SITE + meta.path + '#article',
      mainEntityOfPage: SITE + meta.path,
      headline: h1,
      description: meta.description || '',
      image: SITE + (meta.og || '/assets/img/hero-home.jpg'),
      datePublished: dates.published,
      dateModified: dates.modified,
      inLanguage: 'en-US',
      author: { '@type': 'Person', name: 'Chris Martin', jobTitle: 'Founder & CEO', url: SITE + '/about-us/', worksFor: { '@id': SITE + '/#agency' } },
      publisher: { '@id': SITE + '/#agency' }
    });
  }

  // BreadcrumbList on every real page except the homepage (the 404 has no
  // canonical place in the tree). Names are the nav labels the visitor sees.
  if (meta.path !== '/' && !meta.out) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        ...(meta.parent ? [{ '@type': 'ListItem', position: 2, name: meta.parent.name, item: SITE + meta.parent.path }] : []),
        { '@type': 'ListItem', position: meta.parent ? 3 : 2, name: meta.crumb || meta.title.split('|')[0].trim(), item: SITE + meta.path }
      ]
    });
  }

  // Social image: each page names its own 1200x630 in meta.og; the homepage
  // hero is the default. Size is read from the file so the tags never lie.
  const OG_DEFAULT = { file: '/assets/img/hero-home.jpg', alt: 'Senior Solutions Insurance — final expense insurance from licensed agents' };
  const og = meta.og ? { file: meta.og, alt: meta.ogAlt || OG_DEFAULT.alt } : OG_DEFAULT;
  const ogSize = (sizeOf && sizeOf(path.join(ROOT, og.file.replace(/^\//, '')))) || { width: 1200, height: 630 };

  const hasForm = /id="quote"/.test(body);
  // The estimator's CSS and JS are separate files (strict CSP: no inline
  // script or style), pulled in only on pages that carry the widget.
  const hasEstimator = /class="ssi-est"/.test(body);
  const head = hasEstimator
    ? `<link rel="stylesheet" href="${ASSET.estCss}">
<script src="${ASSET.estJs}" defer></script>`
    : '';
  const vars = {
    head,
    ogImage: SITE + og.file,
    ogAlt: og.alt.replace(/"/g, '&quot;'),
    ogWidth: ogSize.width,
    ogHeight: ogSize.height,
    title: meta.title,
    quoteHref: hasForm ? '#quote' : '/contact-us/#quote',
    preload: meta.preload ? `<link rel="preload" as="image" href="${meta.preload}" type="image/webp" fetchpriority="high">` : '',
    description: meta.description || '',
    descriptionTag: meta.description ? `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">` : '',
    // meta.held: built and deployable, but unpublished — noindex and out of the
    // sitemap until the content is signed off (see docs/open-items.md).
    robots: (meta.noindex || meta.held) ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large',
    canonical: SITE + meta.path,
    path: meta.path,
    bodyClass: meta.bodyClass || '',
    schema: schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n'),
    body
  };
  const html = pictures(fill(fill(layout, partials), vars))
    .replace('/assets/site.css', ASSET.css)
    .replace('/assets/site.js', ASSET.js)
    .replace('/assets/host-guard.js', ASSET.guard);

  // Strict CSP: no inline <script> (other than JSON-LD data blocks) and no
  // inline <style> may reach the page.
  for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
    if (!/\bsrc=/.test(tag) && !/type="application\/ld\+json"/.test(tag)) throw new Error(f + ': inline <script> is not allowed under the CSP: ' + tag);
  }
  if (/<style\b/.test(html)) throw new Error(f + ': inline <style> is not allowed under the CSP');
  assertNoEntitiesInJsonLd(f, html);
  const styleAttr = html.match(/<[a-z][^>]*\sstyle="[^"]*"[^>]*>/i);
  if (styleAttr) throw new Error(f + ': style="" attribute is not allowed under the CSP: ' + styleAttr[0].slice(0, 120));

  // Every <img> ships with explicit width and height so nothing reflows.
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) throw new Error(f + ': <img> without width/height: ' + tag.slice(0, 120));
  }

  // meta.out overrides the output file (the 404 page must be /404.html for Vercel).
  const outFile = meta.out ? path.join(ROOT, meta.out) : path.join(ROOT, meta.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  built.push({ path: meta.path, noindex: !!meta.noindex || !!meta.out || !!meta.held, out: path.relative(ROOT, outFile), sources });
}

// Sitemap: every indexable page, with a real lastmod — the date of the last
// commit that touched the page's source or a partial it pulls in (the layout
// is deliberately excluded: a nav label is not a content change). A file
// with uncommitted edits is dated today, since that is what is about to ship.
const urls = built.filter(p => !p.noindex).map(p =>
  `  <url><loc>${SITE}${p.path}</loc><lastmod>${gitDates(p.sources).modifiedDate}</lastmod></url>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

for (const p of built) console.log((p.noindex ? 'noindex ' : '        ') + p.out);
console.log('sitemap.xml');
