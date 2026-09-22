/* Final Expense Cost Estimator — behaviour. Markup: widgets/ssi-cost-estimator.html; styles: assets/estimator.css.
   Loaded with defer, so the .ssi-est markup is in the DOM when this runs. Configuration is read
   from the data- attributes on the wrapper div. No dependencies, no external requests. */
(function () {
  'use strict';

  window.SSIEstimator = window.SSIEstimator || {};

  var root = document.querySelector('.ssi-est');
  if (!root) return;

  // The shell is laid out from first paint (html.js is set by host-guard.js; this
  // is the fallback if that file is blocked). Nothing is revealed at load time.
  document.documentElement.classList.add('js');

  var PHONE = root.dataset.phone || '1-888-957-3337';
  var TEL   = root.dataset.tel   || '+18889573337';
  var FORM  = root.dataset.form  || '#quote';

  // Market-average monthly premium, simplified issue, non-tobacco.
  // Anchors at ages 50–85 in five-year steps.
  var AGES = [50, 55, 60, 65, 70, 75, 80, 85];
  var BASE = {
    female: {
      10000: [30, 36, 42, 50, 64, 87, 125, 155],
      20000: [56, 69, 80, 97, 124, 171, 246, 299],
      30000: [76, 89, 105, 129, 167, 229, 327, 460]
    },
    male: {
      10000: [38, 46, 53, 66, 84, 113, 164, 203],
      20000: [72, 87, 101, 126, 162, 220, 321, 396],
      30000: [96, 115, 137, 168, 220, 302, 424, 601]
    }
  };

  var SI_LOW = 0.80, SI_HIGH = 1.20;
  var GI_LOW = 1.42, GI_HIGH = 1.80;
  var TOB_LOW = 1.25, TOB_HIGH = 1.30;
  var GI_MAX_FACE = 25000;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function atAge(series, age) {
    if (age <= AGES[0]) return series[0];
    if (age >= AGES[AGES.length - 1]) return series[series.length - 1];
    for (var i = 0; i < AGES.length - 1; i++) {
      if (age >= AGES[i] && age <= AGES[i + 1]) {
        return lerp(series[i], series[i + 1], (age - AGES[i]) / (AGES[i + 1] - AGES[i]));
      }
    }
    return series[series.length - 1];
  }

  function baseRate(gender, age, coverage) {
    var t = BASE[gender];
    if (coverage <= 10000) return atAge(t[10000], age);
    if (coverage >= 30000) return atAge(t[30000], age);
    if (coverage === 20000) return atAge(t[20000], age);
    if (coverage < 20000) {
      return lerp(atAge(t[10000], age), atAge(t[20000], age), (coverage - 10000) / 10000);
    }
    return lerp(atAge(t[20000], age), atAge(t[30000], age), (coverage - 20000) / 10000);
  }

  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function range(lo, hi) { return money(lo) + ' to ' + money(hi); }

  var state = { age: null, gender: null, coverage: null, tobacco: null };
  var current = 0;

  // Build the age list. "Under 50" and "Over 85" are real answers too: they
  // get a straight explanation and the phone number instead of a dead end.
  var ageSel = root.querySelector('[data-age]');
  for (var a = 50; a <= 85; a++) {
    var o = document.createElement('option');
    o.value = String(a);
    o.textContent = String(a);
    ageSel.appendChild(o);
  }
  var over = document.createElement('option');
  over.value = 'gt85'; over.textContent = 'Over 85';
  ageSel.appendChild(over);
  var OUT_OF_RANGE = {
    lt50: 'Final expense plans are generally issued from age 50. Under 50, a licensed agent can usually quote a small whole life or term policy instead, often for less. Call ' + PHONE + ' and we will run it for you.',
    gt85: 'Over 85, coverage is limited and carrier-specific, so no market average would be honest. A licensed agent can tell you exactly what is available at your age. Call ' + PHONE + '.'
  };
  var ageRange = null; // 'lt50' | 'gt85' | null

  function stepEl(n) { return root.querySelector('[data-step="' + n + '"]'); }

  function paintProgress() {
    root.querySelectorAll('[data-dot]').forEach(function (li) {
      var n = Number(li.dataset.dot);
      li.dataset.state = n < current ? 'done' : (n === current ? 'on' : 'off');
    });
    root.querySelector('[data-progress]').hidden = current < 1 || current > 4;
    var sc = root.querySelector('[data-stepcount]');
    if (sc && current <= 4) sc.textContent = 'Step ' + current + ' of 4';
  }

  function show(n) {
    for (var i = 1; i <= 4; i++) {
      var el = stepEl(i);
      el.hidden = i !== n;
      if (i === n) { el.dataset.enter = '1'; setTimeout(function (e) { delete e.dataset.enter; }, 250, el); }
    }
    root.querySelector('[data-result]').hidden = true;
    current = n;
    paintProgress();
    syncNext(); // an already-answered step lands with Continue enabled
    var focusable = stepEl(n).querySelector('input:checked, select, input, button');
    if (focusable) focusable.focus({ preventScroll: true });
  }

  // Choosing an answer is the answer: advance without a second click.
  var advanceTimer = null;
  function advance() {
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(function () {
      if (!ready(current)) return;
      if (current < 4) { show(current + 1); } else { finish(); }
    }, 180);
  }

  function ready(n) {
    if (n === 1) return !!state.age;
    if (n === 2) return !!state.gender;
    if (n === 3) return !!state.coverage;
    if (n === 4) return !!state.tobacco;
    return false;
  }

  // Continue is always live. If nothing is answered yet, say so and put the
  // cursor where the answer goes instead of greying the button out.
  var NUDGE = {
    1: 'Please choose your age to continue.',
    2: 'Please choose male or female to continue.',
    3: 'Please choose a coverage amount to continue.',
    4: 'Please answer yes or no to continue.'
  };
  function syncNext() {
    var el = stepEl(current);
    if (!el) return;
    var n = el.querySelector('[data-nudge]');
    if (n && ready(current)) n.hidden = true;
  }
  function nudge() {
    var el = stepEl(current);
    var n = el.querySelector('[data-nudge]');
    n.textContent = NUDGE[current];
    n.hidden = false;
    var f = el.querySelector('select, input');
    if (f) f.focus({ preventScroll: true });
  }

  // ── Inputs ────────────────────────────────────────────────────────────────
  ageSel.addEventListener('change', function () {
    var note = root.querySelector('[data-agenote]');
    ageRange = OUT_OF_RANGE[this.value] ? this.value : null;
    if (ageRange) {
      state.age = null;
      note.textContent = OUT_OF_RANGE[ageRange];
      note.hidden = false;
      syncNext();
      return;
    }
    state.age = this.value ? Number(this.value) : null;
    if (state.age && state.age >= 76) {
      note.textContent = 'Premiums rise sharply after age 75, and some carriers reduce the maximum coverage they will issue. It is worth calling sooner rather than later.';
      note.hidden = false;
    } else {
      note.hidden = true;
    }
    syncNext();
  });

  // Keep a class in sync with :checked so browsers without :has() still show
  // the selected state. Seniors are more likely to be on an older device.
  function markChecked(name) {
    root.querySelectorAll('input[name="' + name + '"]').forEach(function (i) {
      i.closest('.ssi-est__choice').classList.toggle('is-checked', i.checked);
    });
  }
  root.querySelectorAll('.ssi-est__choice input').forEach(function (i) {
    i.addEventListener('focus', function () { i.closest('.ssi-est__choice').classList.add('is-focus'); });
    i.addEventListener('blur', function () { i.closest('.ssi-est__choice').classList.remove('is-focus'); });
  });

  root.querySelectorAll('input[name="ssi-gender"]').forEach(function (r) {
    r.addEventListener('change', function () { state.gender = this.value; markChecked('ssi-gender'); syncNext(); advance(); });
  });

  root.querySelectorAll('input[name="ssi-cov"]').forEach(function (r) {
    r.addEventListener('change', function () {
      state.coverage = Number(this.value);
      markChecked('ssi-cov');
      var note = root.querySelector('[data-covnote]');
      if (state.coverage > GI_MAX_FACE) {
        note.textContent = 'Above $25,000, coverage is generally available only with a health questionnaire. Guaranteed acceptance plans usually cap at $25,000.';
        note.hidden = false;
      } else {
        note.hidden = true;
      }
      syncNext();
      advance();
    });
  });

  root.querySelectorAll('input[name="ssi-tob"]').forEach(function (r) {
    r.addEventListener('change', function () { state.tobacco = this.value; markChecked('ssi-tob'); syncNext(); advance(); });
  });

  root.querySelectorAll('[data-next]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (current === 1 && ageRange) {
        // Out of range: the note is the answer. Point at the phone, do not advance.
        window.location.href = 'tel:' + TEL;
        return;
      }
      if (!ready(current)) { nudge(); return; }
      if (current < 4) { show(current + 1); } else { finish(); }
    });
  });

  root.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { if (current > 1) show(current - 1); });
  });

  // ── Result ────────────────────────────────────────────────────────────────
  function finish() {
    var base = baseRate(state.gender, state.age, state.coverage);
    var tobLo = state.tobacco === 'yes' ? TOB_LOW : 1;
    var tobHi = state.tobacco === 'yes' ? TOB_HIGH : 1;

    var siLow = base * SI_LOW * tobLo;
    var siHigh = base * SI_HIGH * tobHi;

    var giFace = Math.min(state.coverage, GI_MAX_FACE);
    var giBase = baseRate(state.gender, state.age, giFace);
    var giLow = giBase * GI_LOW * tobLo;
    var giHigh = giBase * GI_HIGH * tobHi;

    var res = root.querySelector('[data-result]');
    root.querySelector('[data-resulth]').textContent =
      'Estimated monthly cost for ' + money(state.coverage) + ' of coverage';

    root.querySelector('[data-si]').textContent = range(siLow, siHigh);
    root.querySelector('[data-gi]').textContent = range(giLow, giHigh);

    // Chips: what the estimate is for.
    var chips = root.querySelector('[data-chips]');
    chips.innerHTML = '';
    ['Age ' + state.age, state.gender === 'male' ? 'Male' : 'Female', money(state.coverage) + ' coverage', state.tobacco === 'yes' ? 'Tobacco' : 'Non-tobacco']
      .forEach(function (c) { var li = document.createElement('li'); li.textContent = c; chips.appendChild(li); });

    // Guaranteed issue caps at $25,000; say so on the card when it applies.
    var giTicks = root.querySelector('[data-giticks]');
    giTicks.innerHTML = state.coverage > GI_MAX_FACE
      ? '<li>Approved regardless of health</li><li>Shown for ' + money(GI_MAX_FACE) + ', the usual cap</li>'
      : '<li>Approved regardless of health</li><li>Full benefit after two years</li>';

    // The cost of waiting: now, +5 years, +10 years, on the same scale.
    var wait = root.querySelector('[data-wait]');
    var ladder = root.querySelector('[data-ladder]');
    if (state.age <= 80) {
      var ages = [state.age, Math.min(state.age + 5, 85), Math.min(state.age + 10, 85)]
        .filter(function (a, i, arr) { return arr.indexOf(a) === i; });
      var mids = ages.map(function (a) { var bse = baseRate(state.gender, a, state.coverage); return bse * (SI_LOW + SI_HIGH) / 2 * (tobLo + tobHi) / 2; });
      var top = mids[mids.length - 1];
      ladder.innerHTML = '';
      ages.forEach(function (a, i) {
        var d = document.createElement('div');
        d.className = 'ssi-est__rung ' + (i === 0 ? 'ssi-est__rung--now' : 'ssi-est__rung--later');
        var pct = Math.round((mids[i] / mids[0] - 1) * 100);
        d.innerHTML = '<i style="height:' + Math.max(8, Math.round(mids[i] / top * 36)) + 'px"></i>' +
          '<b>' + money(mids[i]) + '<span class="ssi-est__per">/mo</span></b>' +
          '<small>' + (i === 0 ? 'Buy now, age ' + a : 'At age ' + a) + '</small>' +
          (i === 0 ? '<em>&nbsp;</em>' : '<em>+' + pct + '%</em>');
        ladder.appendChild(d);
      });
      wait.hidden = false;
    } else {
      wait.hidden = true;
    }

    var call = root.querySelector('[data-call]');
    call.href = 'tel:' + TEL;
    root.querySelector('[data-callno]').textContent = PHONE;
    var sched = root.querySelector('[data-schedule-link]');
    if (sched && root.dataset.schedule) { sched.href = root.dataset.schedule; sched.hidden = false; }

    for (var i = 1; i <= 4; i++) stepEl(i).hidden = true;
    current = 5;
    paintProgress();
    res.hidden = false;
    res.dataset.enter = '1';
    setTimeout(function () { delete res.dataset.enter; }, 250);
    res.querySelector('.ssi-est__resulth').setAttribute('tabindex', '-1');
    res.querySelector('.ssi-est__resulth').focus({ preventScroll: true });

    var payload = {
      age: state.age,
      gender: state.gender,
      coverage: state.coverage,
      tobacco: state.tobacco,
      siLow: Math.round(siLow), siHigh: Math.round(siHigh),
      giLow: Math.round(giLow), giHigh: Math.round(giHigh)
    };

    fillForm(payload);
    try { sessionStorage.setItem('ssi-est', JSON.stringify(state)); } catch (e) {}
    if (typeof window.SSIEstimator.onComplete === 'function') {
      try { window.SSIEstimator.onComplete(payload); } catch (e) {}
    }
  }

  function fillForm(payload) {
    var form = document.querySelector(FORM);
    if (!form) return;
    var map = {
      ssi_age: payload.age,
      ssi_gender: payload.gender,
      ssi_coverage: payload.coverage,
      ssi_tobacco: payload.tobacco
    };
    Object.keys(map).forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) field.value = map[name];
    });
  }

  root.querySelector('[data-request]').addEventListener('click', function () {
    var form = document.querySelector(FORM);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var first = form.querySelector('input:not([type="hidden"]), select, textarea');
      if (first) setTimeout(function () { first.focus(); }, 400);
    } else {
      window.location.href = 'tel:' + TEL;
    }
  });

  root.querySelector('[data-restart]').addEventListener('click', function () {
    state = { age: null, gender: null, coverage: null, tobacco: null };
    ageRange = null;
    try { sessionStorage.removeItem('ssi-est'); } catch (e) {}
    ageSel.value = '';
    root.querySelectorAll('input[type="radio"]').forEach(function (r) { r.checked = false; });
    root.querySelectorAll('.ssi-est__choice').forEach(function (l) { l.classList.remove('is-checked'); });
    root.querySelectorAll('[data-agenote],[data-covnote],[data-nudge]').forEach(function (n) { n.hidden = true; });
    show(1);
    syncNext();
  });

  window.SSIEstimator.rate = baseRate;

  // A refresh or the browser's back button should not throw the answers away.
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem('ssi-est') || 'null'); } catch (e) {}
  if (saved && saved.age >= 50 && saved.age <= 85 && BASE[saved.gender] && saved.coverage && saved.tobacco) {
    state = saved;
    ageSel.value = String(state.age);
    var pick = function (name, val) { var r = root.querySelector('input[name="' + name + '"][value="' + val + '"]'); if (r) { r.checked = true; } markChecked(name); };
    pick('ssi-gender', state.gender); pick('ssi-cov', String(state.coverage)); pick('ssi-tob', state.tobacco);
    finish();
    // Do not steal focus on a plain page load.
    root.querySelector('.ssi-est__resulth').blur();
  } else {
    show(1);
    syncNext();
  }
})();
