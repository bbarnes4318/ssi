/* Final Expense estimator bootstrap.
   Keeps the existing estimator logic intact while making every question follow
   the same one-answer-per-step interaction: choosing a valid age advances to Step 2
   just like the existing radio questions advance to the next step. */
(function () {
  'use strict';

  var core = document.createElement('script');
  core.src = '/assets/estimator-core.js?v=1';
  core.onload = function () {
    var root = document.querySelector('.ssi-est');
    if (!root) return;

    var age = root.querySelector('[data-age]');
    if (!age) return;

    age.addEventListener('change', function () {
      /* Over 85 is intentionally a phone/contact path, not a normal step. */
      if (!this.value || this.value === 'gt85') return;

      /* Let estimator-core finish updating its state, then use its existing
         Continue handler so validation, progress, focus, and transitions stay
         centralized in one place. */
      window.setTimeout(function () {
        var next = root.querySelector('[data-step="1"] [data-next]');
        if (next) next.click();
      }, 30);
    });
  };

  document.head.appendChild(core);
})();
