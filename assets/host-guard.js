/* Only ssifinalexpense.com may be indexed. Any other host (Vercel preview,
   *.vercel.app, localhost) is switched to noindex, nofollow before anything
   else loads; vercel.json also sends X-Robots-Tag: noindex, nofollow and a
   Disallow-all robots.txt for those hosts. Loaded synchronously in <head> on
   purpose: it must run before the page renders and it is ~300 bytes. It is
   an external file so the CSP can forbid inline script. */
(function () {
  // Mark JS as available before first paint, so JS-only UI (the cost estimator
  // shell) can be laid out from the start instead of appearing after load and
  // pushing the page down. site.js adds the same class later for safety.
  document.documentElement.classList.add('js');
  var h = location.hostname;
  if (h === 'ssifinalexpense.com' || h === 'www.ssifinalexpense.com') return;
  var m = document.querySelector('meta[name="robots"]');
  if (m) m.setAttribute('content', 'noindex, nofollow');
})();
