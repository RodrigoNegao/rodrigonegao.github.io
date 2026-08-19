/* animations — scroll reveal, efeito de digitacao, navbar e utilidades.
   Tudo em JS puro; respeita prefers-reduced-motion. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var observer = null;

  function initReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      /* Sem animacao: tudo visivel de uma vez. */
      showAll();
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    observeNew();
  }

  function showAll() {
    var nodes = document.querySelectorAll('.reveal');
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
  }

  /* Elementos renderizados depois precisam entrar no observer. */
  function observeNew() {
    if (!observer) { showAll(); return; }
    var nodes = document.querySelectorAll('.reveal:not(.is-visible)');
    for (var i = 0; i < nodes.length; i++) {
      /* Escalona os irmaos para o fade nao entrar todo de uma vez. */
      var siblings = nodes[i].parentNode ? nodes[i].parentNode.children : null;
      if (siblings && siblings.length > 1) {
        var index = Array.prototype.indexOf.call(siblings, nodes[i]);
        nodes[i].style.transitionDelay = Math.min(index, 6) * 70 + 'ms';
      }
      observer.observe(nodes[i]);
    }
  }

  /* ---------- Navbar: fundo solido apos rolar ---------- */
  function initNav() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();

    initMenu();
  }

  /* ---------- Menu mobile ---------- */
  function initMenu() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!nav || !toggle || !menu) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Fecha ao escolher uma secao, ao clicar fora ou com Esc. */
    menu.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') close();
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });
  }

  /* ---------- Efeito de digitacao no hero ---------- */
  var typingTimer = null;

  function startTyping(node, words) {
    stopTyping();
    if (!node || !words || !words.length) return;

    if (reducedMotion) {
      node.textContent = words[0];
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var firstDelay = 500;

    /* Se o texto estatico ja for a primeira palavra, continua de onde ela esta
       em vez de apagar e redigitar — evita o flash no carregamento. */
    if (node.textContent === words[0]) {
      charIndex = words[0].length;
      deleting = true;
      firstDelay = 1700;
    } else {
      node.textContent = '';
    }

    function tick() {
      var word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      node.textContent = word.slice(0, charIndex);

      var delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 320;
      }
      typingTimer = window.setTimeout(tick, delay);
    }
    typingTimer = window.setTimeout(tick, firstDelay);
  }

  function stopTyping() {
    if (typingTimer) {
      window.clearTimeout(typingTimer);
      typingTimer = null;
    }
  }

  /* ---------- E-mail montado em runtime (anti-scraping) ---------- */
  function initEmail() {
    var nodes = document.querySelectorAll('[data-email-user]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var address = node.getAttribute('data-email-user') + '@' +
        node.getAttribute('data-email-domain');
      if (node.tagName === 'A') node.href = 'mailto:' + address;
      if (!node.textContent.trim()) node.textContent = address;
    }
  }

  /* ---------- Ano corrente no rodape ---------- */
  function initYear() {
    var nodes = document.querySelectorAll('.year');
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  /* ---------- Secao ativa no menu ---------- */
  function initScrollSpy() {
    var links = document.querySelectorAll('#nav-menu a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) continue;
      byId[id] = links[i];
      sections.push(section);
    }

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var linkNode = byId[entry.target.id];
        if (linkNode) linkNode.classList.toggle('is-current', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener('langchange', function (event) {
    var node = document.getElementById('typing');
    startTyping(node, event.detail.dict.hero.typing);
  });

  /* Conteudo novo (projetos, timeline) entra no observer de reveal. */
  document.addEventListener('contentrendered', observeNew);

  function boot() {
    initNav();
    initEmail();
    initYear();
    initReveal();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
