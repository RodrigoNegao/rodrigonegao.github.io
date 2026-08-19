/* i18n — carrega data/i18n.json, aplica traducoes e avisa o resto da pagina.
   Sem dependencias. Expoe window.I18N. */
(function () {
  'use strict';

  var LOCALES = { pt: 'pt-BR', en: 'en-US' };
  var STORAGE_KEY = 'lang';

  var I18N = {
    lang: 'pt',
    dict: null,
    t: t,
    formatMonth: formatMonth,
    formatRange: formatRange,
    setLang: setLang
  };
  window.I18N = I18N;

  /* Idioma salvo, senao o do navegador, senao ingles. */
  function detectLang() {
    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    if (saved === 'pt' || saved === 'en') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  /* Busca por caminho pontuado: t('hero.role'). */
  function t(path) {
    var node = I18N.dict;
    var parts = String(path).split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return '';
      node = node[parts[i]];
    }
    return node == null ? '' : node;
  }

  /* "2022-12" -> "dez/2022" | "Dec 2022". Null vira o rotulo de "atual". */
  function formatMonth(iso) {
    if (!iso) return t('experience.current');
    var bits = iso.split('-');
    var year = Number(bits[0]);
    var month = Number(bits[1]);
    var date = new Date(Date.UTC(year, month - 1, 1));
    var name = new Intl.DateTimeFormat(LOCALES[I18N.lang], {
      month: 'short', timeZone: 'UTC'
    }).format(date).replace(/\.$/, '');
    return I18N.lang === 'pt' ? name + '/' + year : name + ' ' + year;
  }

  function formatRange(start, end) {
    return formatMonth(start) + ' \u2013 ' + formatMonth(end);
  }

  /* Aplica o dicionario em tudo que estiver marcado no HTML. */
  function applyToDom() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = t(el.getAttribute('data-i18n'));
      if (typeof value !== 'string' || value === '') continue;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    }
    document.documentElement.lang = LOCALES[I18N.lang];
  }

  function markButtons() {
    var buttons = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < buttons.length; i++) {
      var active = buttons[i].getAttribute('data-lang') === I18N.lang;
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
      buttons[i].classList.toggle('is-active', active);
    }
  }

  function setLang(lang, persist) {
    if (lang !== 'pt' && lang !== 'en') return;
    if (!I18N.all) return;
    I18N.lang = lang;
    I18N.dict = I18N.all[lang];
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* modo privado */ }
    }
    applyToDom();
    markButtons();
    document.dispatchEvent(new CustomEvent('langchange', {
      detail: { lang: lang, dict: I18N.dict }
    }));
  }

  function wireButtons() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('[data-lang]') : null;
      if (!button) return;
      event.preventDefault();
      setLang(button.getAttribute('data-lang'));
    });
  }

  /* O body comeca escondido para nao piscar o texto PT antes de trocar por EN. */
  function reveal() {
    document.body.classList.remove('i18n-pending');
  }

  function boot() {
    wireButtons();
    fetch('data/i18n.json')
      .then(function (res) {
        if (!res.ok) throw new Error('i18n.json: HTTP ' + res.status);
        return res.json();
      })
      .then(function (all) {
        I18N.all = all;
        setLang(detectLang(), false);
        reveal();
      })
      .catch(function (err) {
        /* Sem traducoes o conteudo estatico em PT do HTML continua valendo. */
        console.error('[i18n]', err);
        reveal();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
