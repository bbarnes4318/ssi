/* Only ssifinalexpense.com may be indexed. Any other host (Vercel preview,
   *.vercel.app, localhost) is switched to noindex, nofollow before anything
   else loads; vercel.json also sends X-Robots-Tag: noindex, nofollow and a
   Disallow-all robots.txt for those hosts. Loaded synchronously in <head> on
   purpose: it must run before the page renders and it is ~300 bytes. It is
   an external file so the CSP can forbid inline script. */
(function () {
  var h = location.hostname;
  if (h === 'ssifinalexpense.com' || h === 'www.ssifinalexpense.com') return;
  var m = document.querySelector('meta[name="robots"]');
  if (m) m.setAttribute('content', 'noindex, nofollow');
})();
