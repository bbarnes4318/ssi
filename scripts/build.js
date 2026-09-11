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
// The estimator is inlined at build time from the single drop-in widget file,
// so the site and the WordPress paste-in never drift apart.
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
const ASSET = { css: stamp('assets/site.css'), js: stamp('assets/site.js') };

const AGENCY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Senior Solutions Insurance',
  url: SITE + '/',
  telephone: '+1-888-957-3337',
  image: SITE + '/assets/ssi-logo.png',
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
  sameAs: ['https://www.facebook.com/SeniorSolutionsInsuranceMedicare', 'https://share.google/7cX0zbH3SjcK8Eqj2', 'https://www.bbb.org/us/co/denver/profile/funeral-related-services/senior-solutions-insurance-1296-90265012']
};

function fill(tpl, vars) {
  return tpl.replace(/\{\{([\w-]+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

const pagesDir = path.join(SRC, 'pages');
const built = [];
for (const f of fs.readdirSync(pagesDir).sort()) {
  if (!f.endsWith('.html')) continue;
  const raw = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  const m = raw.match(/^<!--\s*meta\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!m) throw new Error(f + ': missing <!-- meta {...} --> header');
  const meta = JSON.parse(m[1]);
  let body = raw.slice(m[0].length);
  body = fill(fill(body, partials), partials); // partials may nest one level

  const schemas = [AGENCY_SCHEMA];
  if (meta.faq) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.faq.map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    });
  }

  const vars = {
    title: meta.title,
    description: meta.description || '',
    descriptionTag: meta.description ? `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">` : '',
    robots: meta.noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large',
    canonical: SITE + meta.path,
    path: meta.path,
    bodyClass: meta.bodyClass || '',
    schema: schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n'),
    body
  };
  const html = fill(fill(layout, partials), vars)
    .replace('/assets/site.css', ASSET.css)
    .replace('/assets/site.js', ASSET.js);

  const outFile = path.join(ROOT, meta.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  built.push({ path: meta.path, noindex: !!meta.noindex, out: path.relative(ROOT, outFile) });
}

// Sitemap: every indexable page.
const today = new Date().toISOString().slice(0, 10);
const urls = built.filter(p => !p.noindex).map(p =>
  `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

for (const p of built) console.log((p.noindex ? 'noindex ' : '        ') + p.out);
console.log('sitemap.xml');
