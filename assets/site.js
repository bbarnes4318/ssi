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

  // ── Rate card tabs (Women / Men) ─────────────────────────────────────────
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = box.querySelectorAll('[data-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
        box.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      });
    });
  });

  // ── Footer year ──────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ── Open / closed in Mountain Time (top bar + mobile call bar) ──────────
  (function () {
    var open = null;
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Denver', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ''; };
      var day = get('weekday'), h = Number(get('hour')) + Number(get('minute')) / 60;
      var close = (day === 'Sat') ? 17 : (day === 'Sun') ? null : 19;
      open = close !== null && h >= 9 && h < close;
    } catch (e) { return; }
    var state = document.querySelector('[data-callstate]');
    if (state) {
      state.textContent = open ? 'Open now — a licensed agent will answer' : 'Closed now · Mon–Fri 9–7, Sat 9–5 MT';
      state.classList.toggle('is-open', open);
    }
    var top = document.querySelector('[data-openstate]');
    if (top) top.textContent = open ? 'Licensed agents answering now · Mon–Fri 9–7, Sat 9–5 MT' : 'Licensed agents available Mon–Fri 9–7, Sat 9–5 MT';
    var dot = document.querySelector('[data-open-dot]');
    if (dot) dot.classList.toggle('is-open', open);
  })();

  // ── Sticky header shadow ────────────────────────────────────────────────
  (function () {
    var hdr = document.querySelector('[data-hdr]');
    if (!hdr) return;
    var tick = false;
    function paint() { hdr.classList.toggle('is-stuck', window.scrollY > 8); tick = false; }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
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

})();
