/* ssifinalexpense.com — site behaviour. No dependencies. */
(function () {
  'use strict';

  var TURNSTILE_SITE_KEY = ''; // Cloudflare Turnstile site key. Empty = Turnstile off, honeypot only.

  // ── Nav: current page + mobile toggle ────────────────────────────────────
  var path = document.body.dataset.path || location.pathname;
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });
  var menuBtn = document.querySelector('.hdr__menu');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // ── Footer year ──────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ── Sticky call bar: open / closed in Mountain Time ─────────────────────
  (function () {
    var state = document.querySelector('[data-callstate]');
    if (!state) return;
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Denver', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ''; };
      var day = get('weekday'), h = Number(get('hour')) + Number(get('minute')) / 60;
      var close = (day === 'Sat') ? 17 : (day === 'Sun') ? null : 19;
      var open = close !== null && h >= 9 && h < close;
      state.textContent = open ? 'Open now — a licensed agent will answer' : 'Closed now · Mon–Fri 9–7, Sat 9–5 MT';
    } catch (e) { /* leave the default hours text */ }
  })();

  // ── Lead form ────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    var msg = form.querySelector('[data-form-msg]');
    var pageUrl = form.querySelector('[name="page_url"]');
    if (pageUrl) pageUrl.value = location.href;

    form.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('blur', function () { i.dataset.touched = '1'; });
    });

    var tsMount = form.querySelector('[data-turnstile]');
    if (TURNSTILE_SITE_KEY && tsMount) {
      tsMount.className = 'cf-turnstile';
      tsMount.setAttribute('data-sitekey', TURNSTILE_SITE_KEY);
      var s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }

    function say(text, cls) {
      msg.textContent = text;
      msg.className = 'form__msg ' + (cls || '');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      form.querySelectorAll('input').forEach(function (i) { i.dataset.touched = '1'; });

      if (!form.checkValidity()) {
        var bad = form.querySelector(':invalid');
        say(bad && bad.name === 'consent'
          ? 'Please tick the consent box so we are allowed to call you back.'
          : 'Please check the highlighted fields.', 'is-error');
        if (bad) bad.focus();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.consent_text = (form.querySelector('[data-consent-text]') || {}).textContent || '';
      var ts = form.querySelector('[name="cf-turnstile-response"]');
      if (ts) data.turnstile = ts.value;

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say('Sending…');

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            say('Thank you. A licensed agent will call you back during business hours.', 'is-ok');
          } else {
            say((res.body && res.body.error) || 'We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error');
          }
        })
        .catch(function () {
          say('We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error');
        })
        .then(function () { btn.disabled = false; });
    });
  });

  // ── Estimator: load the drop-in widget from /widgets/ so there is one copy ─
  (function () {
    var mount = document.querySelector('[data-estimator]');
    if (!mount) return;
    fetch('/widgets/ssi-cost-estimator.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var scripts = Array.prototype.slice.call(doc.querySelectorAll('script'));
        scripts.forEach(function (s) { s.remove(); });
        mount.innerHTML = doc.body.innerHTML;
        scripts.forEach(function (s) {
          var n = document.createElement('script');
          n.textContent = s.textContent;
          document.body.appendChild(n);
        });
      })
      .catch(function () {
        mount.innerHTML = '<p>To see estimated monthly rates, call a licensed agent at <a href="tel:+18889573337">1-888-957-3337</a>.</p>';
      });
  })();
})();
