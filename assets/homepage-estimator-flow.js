/* Homepage estimator flow: selecting a valid age immediately advances to Step 2. */
(function () {
  'use strict';
  var root = document.querySelector('.page-home .ssi-est');
  if (!root) return;

  var age = root.querySelector('[data-age]');
  if (!age) return;

  age.addEventListener('change', function () {
    if (!this.value || this.value === 'gt85') return;

    /* estimator.js owns the actual state and navigation. Trigger its existing
       Continue control after the change event has finished updating state. */
    window.setTimeout(function () {
      var next = root.querySelector('[data-step="1"] [data-next]');
      if (next) next.click();
    }, 30);
  });
})();
