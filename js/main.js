(function () {
  'use strict';

  var THEME_KEY = 'mb-theme';
  var root = document.documentElement;

  function applyTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    var dark = stored
      ? stored === 'dark'
      : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(dark);

    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    var label = toggle.querySelector('[data-theme-label]');

    function render() {
      var isDark = root.getAttribute('data-theme') === 'dark';
      if (label) label.textContent = isDark ? 'Light' : 'Dark';
    }
    render();

    toggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(!isDark);
      try { localStorage.setItem(THEME_KEY, !isDark ? 'dark' : 'light'); } catch (e) {}
      render();
    });
  }

  var ROLES = ['tester', 'QA', 'quality analyst', 'quality engineer', 'developer', 'scrum master', 'test automation expert'];

  function initTypewriter() {
    var el = document.querySelector('[data-role]');
    if (!el) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = ROLES[0];
      return;
    }

    var roleIndex = 0;
    var typed = 6;
    var deleting = false;
    var timer = null;

    function render() {
      el.textContent = ROLES[roleIndex].slice(0, typed);
    }

    function tick() {
      var word = ROLES[roleIndex];
      var delay;
      if (deleting) {
        if (typed === 0) {
          roleIndex = (roleIndex + 1) % ROLES.length;
          deleting = false;
          typed = 1;
          render();
          timer = setTimeout(tick, 110);
          return;
        }
        typed -= 1;
        delay = 45;
      } else {
        if (typed >= word.length) {
          deleting = true;
          timer = setTimeout(tick, 2000);
          return;
        }
        typed += 1;
        delay = 70 + Math.random() * 55;
      }
      render();
      timer = setTimeout(tick, delay);
    }

    render();
    timer = setTimeout(tick, 2200);
  }

  function initExpandAll() {
    var toggleAllBtn = document.querySelector('[data-toggle-all]');
    var details = Array.prototype.slice.call(document.querySelectorAll('.entry-details'));
    if (!details.length) return;

    function allOpen() {
      return details.every(function (d) { return d.open; });
    }

    function renderToggleAllLabel() {
      if (toggleAllBtn) toggleAllBtn.textContent = allOpen() ? 'Collapse all' : 'Expand all';
    }

    details.forEach(function (d) {
      d.addEventListener('toggle', renderToggleAllLabel);
    });

    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', function () {
        var open = !allOpen();
        details.forEach(function (d) { d.open = open; });
        renderToggleAllLabel();
      });
    }

    renderToggleAllLabel();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initTypewriter();
    initExpandAll();
  });
})();
