/* ssifinalexpense.com — site behaviour. No dependencies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // ── Reveal on scroll ─────────────────────────────────────────────────────
  (function () {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  var TURNSTILE_SITE_KEY = ''; // Cloudflare Turnstile site key. Empty = Turnstile off, honeypot only.

  // ── Nav: current page + mobile toggle ────────────────────────────────────
  var path = document.body.dataset.path || location.pathname;
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });
  var menuBtn = document.querySelector('.hdr__menu');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('b').textContent = open ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  // ── Rate card tabs (Women / Men) ─────────────────────────────────────────
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[data-tab]'));
    var panels = box.querySelectorAll('[data-panel]');
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.id = tab.id || 'tab-' + tab.dataset.tab;
      var panel = box.querySelector('[data-panel="' + tab.dataset.tab + '"]');
      if (panel) {
        panel.id = panel.id || 'panel-' + tab.dataset.tab;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        tab.setAttribute('aria-controls', panel.id);
      }
      tab.setAttribute('tabindex', tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j === null) return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
  });

  // ── Legal pages: contents list starts collapsed on phones ──────────────
  if (window.matchMedia && window.matchMedia('(max-width: 48rem)').matches) {
    document.querySelectorAll('[data-toc]').forEach(function (d) { d.removeAttribute('open'); });
  }

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
    document.querySelectorAll('[data-openstate]').forEach(function (el) {
      el.textContent = open ? 'Licensed agents answering now · Mon–Fri 9–7, Sat 9–5 MT' : 'Licensed agents available Mon–Fri 9–7, Sat 9–5 MT';
    });
    document.querySelectorAll('[data-open-dot]').forEach(function (d) { d.classList.toggle('is-open', open); });
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

    // Validation written for people: one plain sentence under the field that
    // needs attention, announced to screen readers, never colour alone.
    var RULES = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name so we know who to ask for.'; },
      phone: function (v) {
        var d = v.replace(/\D/g, '');
        if (d.length === 11 && d[0] === '1') d = d.slice(1);
        return d.length === 10 ? '' : 'Please enter a 10-digit phone number, like 303-555-0123.';
      },
      zip: function (v) { return /^\d{5}$/.test(v.trim()) ? '' : 'Please enter your 5-digit ZIP code.'; },
      dob: function (v) {
        if (!v) return 'Please enter your date of birth.';
        var d = new Date(v + 'T12:00:00'), now = new Date();
        if (isNaN(d)) return 'Please enter a valid date of birth.';
        var age = now.getFullYear() - d.getFullYear() - ((now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) ? 1 : 0);
        if (age < 18) return 'You must be 18 or older to request a quote.';
        if (age > 110) return 'That date of birth does not look right. Please check the year.';
        return '';
      },
      consent: function (v, el) { return el.checked ? '' : 'Please tick the consent box so we are allowed to call you back.'; }
    };
    function errEl(name) { return form.querySelector('[data-err-for="' + name + '"]'); }
    function check(field) {
      var rule = RULES[field.name];
      if (!rule) return true;
      var m = rule(field.value, field);
      var e = errEl(field.name);
      if (e) { e.textContent = m; e.hidden = !m; }
      field.setAttribute('aria-invalid', m ? 'true' : 'false');
      field.classList.toggle('is-invalid', !!m);
      return !m;
    }
    form.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('blur', function () { if (i.value || i.type === 'checkbox') { i.dataset.touched = '1'; check(i); } });
      i.addEventListener('input', function () { if (i.dataset.touched) check(i); });
      i.addEventListener('change', function () { if (i.type === 'checkbox') check(i); });
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
      var firstBad = null, badCount = 0;
      form.querySelectorAll('input[name]').forEach(function (i) {
        if (!RULES[i.name]) return;
        i.dataset.touched = '1';
        if (!check(i)) { badCount++; if (!firstBad) firstBad = i; }
      });
      if (firstBad) {
        say(badCount === 1 ? 'One field needs your attention.' : badCount + ' fields need your attention.', 'is-error');
        firstBad.focus();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.consent_text = (form.querySelector('[data-consent-text]') || {}).textContent || '';
      var ts = form.querySelector('[name="cf-turnstile-response"]');
      if (ts) data.turnstile = ts.value;

      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return; // a second tap while sending
      btn.disabled = true;
      btn.dataset.label = btn.textContent;
      btn.textContent = 'Sending your request…';
      say('');

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok) {
            var first = String(data.name || '').trim().split(/\s+/)[0] || '';
            var est = data.ssi_age ? '<p class="form__done-est">We have your estimate details (age ' + String(data.ssi_age).replace(/\D/g, '') + ', $' + Number(data.ssi_coverage || 0).toLocaleString('en-US') + ' of coverage), so the agent can start with real quotes.</p>' : '';
            var done = document.createElement('div');
            done.className = 'form__done';
            done.setAttribute('role', 'status');
            done.innerHTML =
              '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>' +
              '<h3>Thank you' + (first ? ', ' + first.replace(/[<>&]/g, '') : '') + '.</h3>' +
              '<p>A licensed agent will call you at <strong>' + String(data.phone || '').replace(/[<>&]/g, '') + '</strong> during business hours \u2014 Monday to Friday 9\u20137, Saturday 9\u20135 Mountain Time.</p>' +
              est +
              '<p class="form__done-alt">Rather not wait? <a href="tel:+18889573337">Call 1-888-957-3337 now</a>.</p>';
            form.replaceWith(done);
            done.querySelector('h3').setAttribute('tabindex', '-1');
            done.querySelector('h3').focus({ preventScroll: true });
            return;
          } else {
            say((res.body && res.body.error) || 'We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error');
          }
        })
        .catch(function () {
          say('We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error');
        })
        .then(function () { btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; });
    });
  });

})();
