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

  // ── Decision rails: give visitors a useful next step before asking for contact details ──
  (function () {
    var body = document.body;
    var hero = document.querySelector('main > .hero');
    if (!hero || document.querySelector('[data-decision-rail]')) return;

    var rail = document.createElement('section');
    rail.className = 'decision-rail';
    rail.setAttribute('data-decision-rail', '');
    rail.setAttribute('aria-label', 'How to approach your insurance options');

    var path = body.dataset.path || location.pathname;
    if (body.classList.contains('page-medicare') || path.indexOf('/medicare') === 0) {
      rail.innerHTML = '<div class="wrap decision-rail__in">' +
        '<div class="decision-rail__intro"><span class="eyebrow">Start with what matters to you</span><h2>Medicare decisions get easier when you compare the things you actually use.</h2><p>You do not need to understand every Medicare term before you talk with us. Start with the priorities that matter most, then compare the plans available in your area.</p></div>' +
        '<div class="decision-rail__grid">' +
          '<div class="decision-card"><span class="decision-card__num">01</span><strong>Your doctors</strong><p>Check whether the doctors and hospitals you use are in a plan\'s network.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">02</span><strong>Your prescriptions</strong><p>Compare how plans handle the medicines you take and the pharmacies you prefer.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">03</span><strong>Your costs</strong><p>Look beyond a premium and understand deductibles, copays and other plan costs.</p></div>' +
        '</div>' +
        '<div class="decision-rail__cta"><p><strong>Want help sorting it out?</strong> Bring your Medicare card, doctor names and prescription list.</p><a class="btn btn--gold" href="#quote">Talk through your options</a></div>' +
      '</div>';
    } else if (body.classList.contains('page-health') || path.indexOf('/health-insurance') === 0) {
      rail.innerHTML = '<div class="wrap decision-rail__in">' +
        '<div class="decision-rail__intro"><span class="eyebrow">A better way to compare</span><h2>Start with your household. Then look at the plans.</h2><p>Marketplace pricing is personal. County, age, household size and income can change what you pay, so a plan that looks inexpensive at first may not be the best fit once your full costs are considered.</p></div>' +
        '<div class="decision-rail__grid">' +
          '<div class="decision-card"><span class="decision-card__num">01</span><strong>Financial help</strong><p>See whether your household may qualify for premium tax credits or other savings.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">02</span><strong>Doctors & prescriptions</strong><p>Check the networks and drug coverage before choosing a lower monthly premium.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">03</span><strong>Total cost</strong><p>Compare premiums with deductibles, copays and out-of-pocket exposure.</p></div>' +
        '</div>' +
        '<div class="decision-rail__cta"><p><strong>Not sure where to start?</strong> A licensed agent can walk through the options available for your situation.</p><a class="btn btn--gold" href="#quote">Compare health plans</a></div>' +
      '</div>';
    } else if (body.classList.contains('page-fe') || path.indexOf('/final-expense-insurance') === 0) {
      rail.innerHTML = '<div class="wrap decision-rail__in decision-rail__in--fe">' +
        '<div class="decision-rail__intro"><span class="eyebrow">What actually changes the price</span><h2>There is no single “final expense rate.”</h2><p>Your age, coverage amount, tobacco use and health answers all influence which carriers may fit and what they charge. That is why comparing carriers matters.</p></div>' +
        '<div class="decision-rail__grid">' +
          '<div class="decision-card"><span class="decision-card__num">01</span><strong>Age</strong><p>Premiums generally rise as you get older, so the same benefit can cost different amounts at different ages.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">02</span><strong>Coverage</strong><p>Choose enough to cover the expenses you want your policy to handle without buying more than you need.</p></div>' +
          '<div class="decision-card"><span class="decision-card__num">03</span><strong>Underwriting</strong><p>Some policies ask health questions; guaranteed-issue options generally do not, but can cost more.</p></div>' +
        '</div>' +
        '<div class="decision-rail__cta"><p><strong>Want a starting point?</strong> Use the four-question estimate above, then speak with a licensed agent about your options.</p><a class="btn btn--gold" href="#estimate">Use the free estimate</a></div>' +
      '</div>';
    } else {
      return;
    }

    hero.insertAdjacentElement('afterend', rail);
  })();

  // ── Premium decision-rail styling ───────────────────────────────────────
  (function () {
    if (document.querySelector('[data-decision-rail]')) {
      var css = document.createElement('style');
      css.textContent = '.decision-rail{background:#f7f5f1;border-top:1px solid #e1ded7;border-bottom:1px solid #dedbd4}.decision-rail__in{padding-top:5.25rem;padding-bottom:5.25rem}.decision-rail__intro{max-width:52rem;margin:0 auto 2.5rem;text-align:center}.decision-rail__intro h2{margin:.55rem 0 .9rem;font-size:clamp(1.9rem,3.2vw,2.8rem);line-height:1.1;letter-spacing:-.035em}.decision-rail__intro p{margin:0;color:#5d6875;font-size:1.02rem;line-height:1.72}.decision-rail__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#dfe3e7;border:1px solid #dfe3e7;border-radius:10px;overflow:hidden}.decision-card{background:#fff;padding:2rem 1.9rem 2.1rem;min-height:12rem}.decision-card__num{display:block;font-size:.75rem;font-weight:700;letter-spacing:.12em;color:#b18d4b;margin-bottom:1.2rem}.decision-card strong{display:block;font-size:1.12rem;color:#101923;margin-bottom:.5rem}.decision-card p{margin:0;color:#5d6875;line-height:1.65;font-size:.94rem}.decision-rail__cta{margin-top:1.75rem;padding:1.25rem 1.4rem 1.25rem 1.5rem;border:1px solid #d7d2c8;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:1.5rem}.decision-rail__cta p{margin:0;color:#4f5965;line-height:1.5}.decision-rail__cta p strong{color:#101923}.decision-rail__cta .btn{flex:0 0 auto;white-space:nowrap}@media(max-width:760px){.decision-rail__in{padding-top:4rem;padding-bottom:4rem}.decision-rail__grid{grid-template-columns:1fr}.decision-card{min-height:0;padding:1.5rem}.decision-rail__cta{align-items:flex-start;flex-direction:column}.decision-rail__cta .btn{width:100%;text-align:center}}@media(max-width:430px){.decision-rail__intro h2{font-size:1.75rem}.decision-rail__intro p{font-size:.95rem}.decision-card{padding:1.35rem}.decision-rail__cta{padding:1.15rem}}';
      document.head.appendChild(css);
    }
  })();

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
      el.textContent = open ? 'Licensed agents answering now' : 'Licensed agents available';
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
    var consentBox = form.querySelector('[name="consent"]');
    if (consentBox) { consentBox.checked = false; consentBox.removeAttribute('checked'); }
    var RULES = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name so we know who to ask for.'; },
      phone: function (v) { var d = v.replace(/\D/g, ''); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d.length === 10 ? '' : 'Please enter a 10-digit phone number, like 303-555-0123.'; },
      zip: function (v) { return /^\d{5}$/.test(v.trim()) ? '' : 'Please enter your 5-digit ZIP code.'; },
      dob: function (v) { if (!v) return 'Please enter your date of birth.'; var d = new Date(v + 'T12:00:00'), now = new Date(); if (isNaN(d)) return 'Please enter a valid date of birth.'; var age = now.getFullYear() - d.getFullYear() - ((now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) ? 1 : 0); if (age < 18) return 'You must be 18 or older to request a quote.'; if (age > 110) return 'That date of birth does not look right. Please check the year.'; return ''; },
      consent: function (v, el) { return el.checked ? '' : 'Please tick the consent box so we are allowed to call you back.'; }
    };
    function errEl(name) { return form.querySelector('[data-err-for="' + name + '"]'); }
    function check(field) { var rule = RULES[field.name]; if (!rule) return true; var m = rule(field.value, field); var e = errEl(field.name); if (e) { e.textContent = m; e.hidden = !m; } field.setAttribute('aria-invalid', m ? 'true' : 'false'); field.classList.toggle('is-invalid', !!m); return !m; }
    form.querySelectorAll('input').forEach(function (i) { i.addEventListener('blur', function () { if (i.value || i.type === 'checkbox') { i.dataset.touched = '1'; check(i); } }); i.addEventListener('input', function () { if (i.dataset.touched) check(i); }); i.addEventListener('change', function () { if (i.type === 'checkbox') check(i); }); });
    var tsMount = form.querySelector('[data-turnstile]');
    if (TURNSTILE_SITE_KEY && tsMount) { tsMount.className = 'cf-turnstile'; tsMount.setAttribute('data-sitekey', TURNSTILE_SITE_KEY); var s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; s.async = true; s.defer = true; document.head.appendChild(s); }
    function say(text, cls) { msg.textContent = text; msg.className = 'form__msg ' + (cls || ''); }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var firstBad = null, badCount = 0;
      form.querySelectorAll('input[name]').forEach(function (i) { if (!RULES[i.name]) return; i.dataset.touched = '1'; if (!check(i)) { badCount++; if (!firstBad) firstBad = i; } });
      if (firstBad) { say(badCount === 1 ? 'One field needs your attention.' : badCount + ' fields need your attention.', 'is-error'); firstBad.focus(); return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      var consentLabel = form.querySelector('[data-consent-text]'); data.consent_text = consentLabel ? String(consentLabel.innerText || consentLabel.textContent || '').trim() : ''; data.consent_checked = !!(consentBox && consentBox.checked);
      var ts = form.querySelector('[name="cf-turnstile-response"]'); if (ts) data.turnstile = ts.value;
      var btn = form.querySelector('button[type="submit"]'); if (btn.disabled) return; btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending your request…'; say('');
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); }).then(function (res) {
        if (res.ok) {
          var first = String(data.name || '').trim().split(/\s+/)[0] || '';
          var est = data.ssi_age ? '<p class="form__done-est">We have your estimate details (age ' + String(data.ssi_age).replace(/\D/g, '') + ', $' + Number(data.ssi_coverage || 0).toLocaleString('en-US') + ' of coverage), so the agent can start with real quotes.</p>' : '';
          var done = document.createElement('div'); done.className = 'form__done'; done.setAttribute('role', 'status'); done.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>' + '<h3>Thank you' + (first ? ', ' + first.replace(/[<>&]/g, '') : '') + '.</h3>' + '<p>A licensed agent will call you at <strong>' + String(data.phone || '').replace(/[<>&]/g, '') + '</strong> during business hours — Monday to Friday 9–7, Saturday 9–5 Mountain Time.</p>' + est + '<p class="form__done-alt">Rather not wait? <a href="tel:+18889573337">Call 1-888-957-3337 now</a>.</p>'; form.replaceWith(done); done.querySelector('h3').setAttribute('tabindex', '-1'); done.querySelector('h3').focus({ preventScroll: true }); return;
        } else { say((res.body && res.body.error) || 'We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error'); }
      }).catch(function () { say('We could not send your request. Please call 1-888-957-3337 and we will take care of you.', 'is-error'); }).then(function () { btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; });
    });
  });

})();
