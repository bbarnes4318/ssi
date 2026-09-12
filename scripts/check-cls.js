#!/usr/bin/env node
// Guards against the JS-revealed layout shift class of bug: content that ships
// hidden (the hidden attribute or display:none) and is then revealed by a
// deferred or async script pushes everything below it down once the script
// runs. The cost estimator shell did exactly that (CLS 0.125 on the homepage).
//
// Two checks:
//
//   1. Static (runs inside `node scripts/build.js`): every script loaded with
//      defer or async is scanned for a reveal that runs at load time — a
//      `.hidden = false`, `removeAttribute('hidden')`, `classList.remove(…)`
//      or `.style.display =` statement at the top level of the file or its
//      outer IIFE, rather than inside an event handler or a function that is
//      called later. Reveals inside handlers are fine: they happen on
//      interaction, after layout has settled.
//
//   2. Lighthouse (run by hand or in CI after a deploy):
//        node scripts/check-cls.js --lighthouse [baseUrl] [runs]
//      Runs Lighthouse mobile `runs` times (default 3) on the homepage, the
//      final expense page and one state page, and fails if any run's CLS is
//      above 0.05. Intermittent shifts do not show up in a single run.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CLS_LIMIT = 0.05;
const PAGES = ['/', '/final-expense-insurance/', '/final-expense-insurance/tennessee/'];
const REVEAL = /\.hidden\s*=\s*false|removeAttribute\(\s*['"]hidden['"]\s*\)|classList\.remove\(|\.style\.display\s*=/;
const STRING = /(['"`])(?:\\.|(?!\1).)*\1/g;
const FN_BEFORE_BRACE = /\bfunction\b[^{]*\)$|=>$/;

// Deferred / async scripts referenced from the layout and from the head
// template in build.js (the estimator is injected there).
function deferredScripts() {
  const srcs = new Set();
  const scan = text => { for (const m of text.matchAll(/<script\s[^>]*src="([^"?]+)[^"]*"[^>]*>/g)) if (/\b(defer|async)\b/.test(m[0])) srcs.add(m[1]); };
  scan(fs.readFileSync(path.join(ROOT, 'src', 'layout.html'), 'utf8'));
  scan(fs.readFileSync(path.join(ROOT, 'scripts', 'build.js'), 'utf8').replace(/\$\{[^}]+\}/g, '/assets/estimator.js'));
  return [...srcs].map(s => path.join(ROOT, s.replace(/^\//, '')));
}

// Function-scope depth per statement, with strings and comments blanked so
// their braces do not count. Only braces that open a function body count
// (`function (…) {`, `=> {`); if/for/try/object-literal braces do not. Depth 0
// is the file top level and depth 1 the outer IIFE — a reveal at either runs
// at load time. Anything deeper is inside a handler or a helper called later.
function loadTimeReveals(js) {
  const out = [];
  const stack = [];
  let inBlock = false;
  js.split('\n').forEach((raw, i) => {
    let line = raw;
    if (inBlock) { const e = line.indexOf('*/'); if (e < 0) return; line = line.slice(e + 2); inBlock = false; }
    line = line.replace(/\/\*[\s\S]*?\*\//g, ' ');
    const b = line.indexOf('/*'); if (b >= 0) { line = line.slice(0, b); inBlock = true; }
    line = line.replace(STRING, '""').replace(/\/\/.*$/, '');
    const fnDepthAtStart = stack.filter(k => k === 'fn').length;
    let firstOpenIsFn = null;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '{') {
        const isFn = FN_BEFORE_BRACE.test(line.slice(0, c).trimEnd());
        if (firstOpenIsFn === null) firstOpenIsFn = isFn;
        stack.push(isFn ? 'fn' : 'block');
      } else if (line[c] === '}') stack.pop();
    }
    // a reveal on this line runs at load time unless it sits inside a function
    // body deeper than the outer IIFE (a same-line `function () { … }` counts)
    const fnDepth = fnDepthAtStart + (firstOpenIsFn ? 1 : 0);
    if (REVEAL.test(raw) && fnDepth <= 1) out.push({ line: i + 1, text: raw.trim() });
  });
  return out;
}

function staticCheck() {
  const files = deferredScripts();
  const problems = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    for (const r of loadTimeReveals(fs.readFileSync(file, 'utf8'))) problems.push(`${path.relative(ROOT, file)}:${r.line}: load-time reveal in a deferred script — ${r.text}`);
  }
  if (problems.length) throw new Error('Layout-shift guard: content revealed by a deferred script at load time shifts everything below it. Lay it out from first paint (html.js is set synchronously by host-guard.js) instead.\n  ' + problems.join('\n  '));
  return files.length;
}

function lighthouseCheck(base, runs) {
  const results = [];
  let failed = false;
  for (const p of PAGES) for (let i = 1; i <= runs; i++) {
    const out = path.join(os.tmpdir(), `ssi-cls-${p.replace(/\W+/g, '_')}-${i}.json`);
    if (fs.existsSync(out)) fs.unlinkSync(out);
    const r = spawnSync('npx', ['lighthouse@12', base.replace(/\/$/, '') + p, '--form-factor=mobile', '--screenEmulation.mobile', '--quiet', '--only-categories=performance', '--chrome-flags="--headless=new --no-sandbox"', '--output=json', `--output-path=${out}`], { shell: true, stdio: 'ignore' });
    if (r.status !== 0 || !fs.existsSync(out)) { console.log(`${p} run ${i}: lighthouse did not produce a report`); failed = true; continue; }
    const cls = JSON.parse(fs.readFileSync(out, 'utf8')).audits['cumulative-layout-shift'].numericValue;
    results.push({ page: p, run: i, cls });
    console.log(`${p} run ${i}: CLS ${cls.toFixed(3)}${cls > CLS_LIMIT ? '  <-- over ' + CLS_LIMIT : ''}`);
    if (cls > CLS_LIMIT) failed = true;
  }
  console.log(`worst CLS ${Math.max(0, ...results.map(r => r.cls)).toFixed(3)} over ${results.length} runs (limit ${CLS_LIMIT})`);
  if (failed) { console.error('CLS check failed'); process.exit(1); }
}

module.exports = { staticCheck, loadTimeReveals };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--lighthouse') lighthouseCheck(args[1] || 'http://localhost:8765', Number(args[2]) || 3);
  else { const n = staticCheck(); console.log(`layout-shift guard: ${n} deferred script(s) checked, no load-time reveals`); }
}
