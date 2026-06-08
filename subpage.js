// Studio Velora — lichte subpagina helper (reveal + FAQ + bel-bolletje)
(function () {
  "use strict";

  // Scroll reveal
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.dataset.stagger) {
        Array.prototype.forEach.call(e.target.children, function (child, i) {
          setTimeout(function () { child.classList.add('in'); }, i * parseInt(e.target.dataset.stagger));
        });
      } else {
        e.target.classList.add('in');
      }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal],[data-stagger]').forEach(function (el) { obs.observe(el); });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (x) {
        x.classList.remove('open'); x.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // Beschikbaarheidsbolletje (09–20u)
  var dot = document.getElementById('avail-dot');
  var text = document.getElementById('avail-text');
  if (dot && text) {
    var h = new Date().getHours();
    var open = h >= 9 && h < 20;
    dot.classList.add(open ? 'on' : 'off');
    text.textContent = open ? 'Nu telefonisch bereikbaar' : 'Nu gesloten — open vanaf 09:00';
  }
})();
