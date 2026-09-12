#!/usr/bin/env node
// Local static server that sends the same response headers as production
// (read from vercel.json), so the Content-Security-Policy and friends can be
// tested before a deploy. Directory URLs serve their index.html; unknown paths
// serve 404.html. Nothing else from vercel.json (redirects, rewrites) is
// emulated — this exists to catch CSP violations.
//
//   node scripts/serve.js [port]      default 8765
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2]) || 8765;
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

// Convert a vercel.json path pattern to a RegExp (":param" and "(.*)" forms).
function toRe(src) { return new RegExp('^' + src.replace(/\(\.\*\)/g, '(.*)').replace(/:[\w]+/g, '[^/]+') + '$'); }
const rules = (cfg.headers || []).filter(r => !r.has && !r.missing).map(r => ({ re: toRe(r.source), headers: r.headers }));

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  let file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  let status = 200;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(ROOT, '404.html'); status = 404; }
  const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' };
  for (const r of rules) if (r.re.test(urlPath)) for (const h of r.headers) headers[h.key] = h.value;
  res.writeHead(status, headers);
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('serving ' + ROOT + ' on http://localhost:' + PORT + ' with vercel.json headers'));
