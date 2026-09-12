# Cutover checklist — ssifinalexpense.com, WordPress → static build on Vercel

The domain does not move. The stack behind it does: the WordPress site is
replaced by the committed static build in this repo, served by Vercel. Every
URL Google has indexed on the old site needs a destination on the new one,
or an honest 410.

Owner of each step is whoever holds the login named in it. Tick a box only
after the verify line passes.

---

## 1. Redirect map

The live rules are in `vercel.json` (`redirects` for 301s, `routes` for
410s). This table is the human-readable copy; if the two disagree, fix
`vercel.json` and update this table in the same commit.

Every row is a **301**, explicitly (`"statusCode": 301`). Vercel's
`"permanent": true` emits a 308 and is not used. Vercel's `trailingSlash`
option is also off: its 308 runs *before* custom redirects, which turned
`/privacy` into a 308 and `/about` into a 308→301 chain when tested. Instead
the slash-less form of every page has its own 301 row below, so each lands
in one hop. Any new page added to the site needs a slash-less row too.

### Pages that moved

| Old URL (WordPress) | New URL | Status |
|---|---|---|
| `/heatlh-insurance/` | `/health-insurance/` | 301 |
| `/heatlh-insurance` | `/health-insurance/` | 301 |
| `/privacy` | `/privacy/` | 301 |
| `/privacy-policy/` | `/privacy/` | 301 |
| `/privacy-policy` | `/privacy/` | 301 |
| `/terms-and-conditions` | `/terms-and-conditions/` | 301 |
| `/terms/`, `/terms` | `/terms-and-conditions/` | 301 |
| `/life-insurance/`, `/life-insurance` | `/final-expense-insurance/` | 301 |
| `/final-expense/`, `/final-expense` | `/final-expense-insurance/` | 301 |
| `/about/`, `/about` | `/about-us/` | 301 |
| `/contact/`, `/contact` | `/contact-us/` | 301 |
| `/index.php`, `/index.html` | `/` | 301 |
| `/home/`, `/home` | `/` | 301 |

### Slash-less forms of the live pages (replaces Vercel's 308)

| Request | New URL | Status |
|---|---|---|
| `/final-expense-insurance` | `/final-expense-insurance/` | 301 |
| `/medicare` | `/medicare/` | 301 |
| `/health-insurance` | `/health-insurance/` | 301 |
| `/about-us` | `/about-us/` | 301 |
| `/contact-us` | `/contact-us/` | 301 |
| `/privacy` | `/privacy/` | 301 |
| `/terms-and-conditions` | `/terms-and-conditions/` | 301 |

### Pages that keep their URL (200 on both stacks, no rule needed)

`/`, `/medicare/`, `/about-us/`, `/contact-us/`, `/privacy/`,
`/terms-and-conditions/`.

### WordPress machinery — 410 Gone

There is no equivalent on a static host. Return 410 so Google drops the URL
instead of re-crawling a redirect. **Never redirect these to the homepage.**

| Old path pattern | Status |
|---|---|
| `/wp-content/*` | 410 |
| `/wp-includes/*` | 410 |
| `/wp-admin`, `/wp-admin/*` | 410 |
| `/wp-json`, `/wp-json/*` | 410 |
| `/wp-login.php` | 410 |
| `/xmlrpc.php` | 410 |
| `/wp-sitemap*.xml` | 410 |
| `/feed/`, `/comments/feed/`, `/*/feed/` | 410 |
| `/author/*`, `/tag/*`, `/category/*` | 410 |
| `/?p=…`, `/?page_id=…`, `/?s=…` | 410 |

Exception worth a 301 instead of a 410: a `/wp-content/uploads/…` image that
has real image-search traffic in Search Console. Map it to the same image's
new path under `/assets/img/` if one exists; otherwise leave it at 410.

### Before cutover — complete this map from Search Console

- [ ] Search Console → Indexing → Pages → **Export** every indexed URL
      (indexed and "crawled – currently not indexed" both).
- [ ] Search Console → Performance → Pages, last 16 months → **Export**.
      Anything with impressions needs a row even if it is no longer indexed.
- [ ] Old site `/wp-sitemap.xml` and its sub-sitemaps: pull every `<loc>`.
- [ ] For each URL not already in the tables above, add a row: closest
      equivalent page, or 410. **No catch-all to the homepage.**
- [ ] Add each new row to `vercel.json` (`redirects` with `"statusCode": 301`,
      or `routes` with `"status": 410`), commit, and confirm it on the
      preview host with `curl -sI https://ssi-dusky-one.vercel.app/<old-path>`.

---

## 2. Pre-cutover (T-24h and earlier)

- [ ] **Lower DNS TTL** on the apex `A`/`ALIAS` record and the `www` `CNAME`
      to 300 seconds, at least 24 hours before the switch.
      — verify: `dig +noall +answer ssifinalexpense.com` shows TTL ≤ 300.
- [ ] **Add both domains to the Vercel project** (`ssifinalexpense.com` and
      `www.ssifinalexpense.com`), set the apex as primary so `www` redirects
      to it. Vercel will show the record values it expects.
- [ ] **Confirm SSL provisions** on the new host. Vercel issues the
      certificate once DNS verifies; until then the domain shows
      "Pending". If the registrar has a CAA record, it must permit
      `letsencrypt.org` (and `pki.goog` if Vercel asks).
      — verify: Vercel → Project → Domains shows a valid certificate for
      both names.
- [ ] **Verify the production domain in Search Console** as a Domain
      property (DNS TXT record), so both `http`/`https` and apex/`www` are
      covered by one property. Keep the existing URL-prefix property too.
- [ ] **Lead delivery is configured** in Vercel → Settings → Environment
      Variables for Production: `RESEND_API_KEY` + `LEAD_TO_EMAIL`, or
      `LEAD_WEBHOOK_URL`. Without one of them `/api/lead` returns 503 and
      the form tells visitors to call.
      — verify: submit a test lead on the preview host and confirm receipt,
      including the TCPA consent block (timestamp, IP, user agent, page URL,
      consent text).
- [ ] **Turn on Vercel Deployment Protection** for preview deployments
      (Settings → Deployment Protection → Standard Protection). Belt and
      braces alongside the host-based noindex already in `vercel.json`.
- [ ] Take a **full export of the WordPress site** (Tools → Export → All
      content) and a database backup, and note the current DNS records
      exactly. This is the rollback.
- [ ] Snapshot **baseline Lighthouse** scores (mobile) for the old `/` and
      `/heatlh-insurance/` so the post-cutover comparison is like for like.

## 3. Cutover

- [ ] **Point DNS**: apex `A` → Vercel's IP (currently `76.76.21.21`; use the
      value the Vercel Domains page shows), `www` `CNAME` →
      `cname.vercel-dns.com`. Remove the old host's records for these names
      only; leave MX and everything else alone.
      — verify: `dig +short ssifinalexpense.com` returns the Vercel IP from
      two resolvers (`@1.1.1.1` and `@8.8.8.8`).
- [ ] **Confirm the noindex flips off** on the production host. The
      preview-only rules in `vercel.json` key on the request host, so
      nothing needs redeploying.
      — verify all four:
      `curl -sI https://ssifinalexpense.com/ | grep -i x-robots-tag` → no
      output;
      `curl -s https://ssifinalexpense.com/ | grep -o '<meta name="robots"[^>]*>'`
      → `index, follow, max-snippet:-1, max-image-preview:large`;
      `curl -s https://ssifinalexpense.com/robots.txt` → the `Allow: /`
      file with the sitemap line;
      `curl -sI https://ssi-dusky-one.vercel.app/ | grep -i x-robots-tag` →
      still `noindex, nofollow`.
- [ ] **`/medicare/` still carries noindex** (`X-Robots-Tag: noindex, follow`
      and the meta tag) until Release 2 is cleared by the FMO. That one is
      per-path and is meant to survive cutover.
- [ ] **Submit the XML sitemap** in Search Console:
      `https://ssifinalexpense.com/sitemap.xml`. Remove the old
      `wp-sitemap.xml` entry.
      — verify: status "Success", 5 URLs discovered (`/`,
      `/final-expense-insurance/`, `/health-insurance/`, `/about-us/`,
      `/contact-us/`). `/privacy/` and `/terms-and-conditions/` are
      noindex, follow by design and are not in the sitemap.
- [ ] **Request indexing** (URL Inspection → Request indexing) on the five
      indexable pages: `/`, `/final-expense-insurance/`, `/health-insurance/`,
      `/about-us/`, `/contact-us/`. (`/medicare/` is excluded while held;
      `/privacy/` and `/terms-and-conditions/` are noindex by design.)
- [ ] **Smoke test on the live domain**: header phone, mobile call bar,
      every form submits with the consent box ticked and is refused without
      it, estimator fills the form's hidden fields, `/404` page renders for
      a bad URL.

## 4. Post-cutover verification (same day, then day 7 and day 30)

- [ ] **Every redirect is a single 301, no chains.** For each row in the map:
      ```bash
      curl -sIL -o /dev/null -w '%{http_code} %{redirect_url}\n' https://ssifinalexpense.com/heatlh-insurance/
      ```
      Exactly one `301` line, whose `Location` is the final `200` page. Run
      the same for each 410 row and expect `410`.
      — also verify: `http://` → `https://` is one hop and `www` → apex is
      one hop, so `http://www.ssifinalexpense.com/heatlh-insurance/` never
      exceeds three hops total and each hop is 301.
- [ ] **HTTPS enforced, no mixed content.**
      `curl -sI http://ssifinalexpense.com/` → 301/308 to `https://`. Load
      each page in Chrome DevTools → Security: "This page is secure", no
      mixed-content warnings in the console.
- [ ] **Security headers present** on `/`, `/final-expense-insurance/` and
      `/api/lead` (`curl -sI`):
      `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
      `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`,
      `Content-Security-Policy` (the policy in `vercel.json`). Then submit
      the domain at hstspreload.org.
      — verify: securityheaders.com grade A or better.
- [ ] **Lighthouse (mobile) on `/` and `/final-expense-insurance/`**:
      Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95. Run from
      PageSpeed Insights (field + lab) and record the numbers in
      `CHANGELOG.md`.
- [ ] **Forms deliver from the production domain**: one real test lead,
      confirmed received, with the consent record intact. Delete the test
      lead from the inbox/CRM afterwards.
- [ ] **30-day crawl-error watch.** Search Console → Indexing → Pages and
      → Settings → Crawl stats, checked at day 1, 3, 7, 14, 30:
      - "Not found (404)" — any old URL appearing here gets a redirect row
        or a deliberate 410, same day.
      - "Redirect error" — a chain or loop; fix in `vercel.json`.
      - "Page with redirect" count should fall as Google processes the map.
      - "Excluded by 'noindex' tag" should list only `/medicare/`,
        `/privacy/` and `/terms-and-conditions/`.
      Log each check with the date in `docs/open-items.md`.
- [ ] **Old WordPress host**: keep it running but unreachable from DNS for
      30 days, then cancel. Keep the export and DB backup for a year.

## 5. Rollback

If the cutover fails — pages down, forms not delivering, certificate not
issuing, or redirects wrong in a way that cannot be fixed within the hour:

- [ ] **Revert DNS** to the exact old records noted in step 2 (apex `A` to
      the WordPress host's IP, `www` `CNAME` to its old target). With the
      300-second TTL from step 2 the old site is back for most visitors in
      five minutes; allow up to an hour for stragglers.
      — verify: `dig +short ssifinalexpense.com` returns the old IP;
      `curl -sI https://ssifinalexpense.com/` shows the WordPress response
      (`x-powered-by`/`link: …wp-json`).
- [ ] The WordPress install is untouched by the cutover — nothing was
      deleted from it — so no restore is needed unless the host was already
      cancelled. If it was, restore the export and DB backup from step 2 to a
      fresh WordPress install on the old host before reverting DNS.
- [ ] **Do not delete the Vercel project or the domain assignment.** Leave
      the static build live on `ssi-dusky-one.vercel.app` (still noindex by
      host) so the fix can be tested there before trying again.
- [ ] If the sitemap was already submitted, leave it; a reverted site serves
      the old URLs at 200 and Google simply sees 404 for the six new paths
      until the retry. Do not request removals.
- [ ] Record what failed, the time DNS was reverted, and the fix in
      `CHANGELOG.md` before the second attempt.
