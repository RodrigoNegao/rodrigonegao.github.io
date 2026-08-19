/* render — monta experiencia, projetos, stack e formacao a partir dos JSONs.
   Redesenha tudo a cada troca de idioma. */
(function () {
  'use strict';

  var projects = null;

  /* Helper minimo: el('h3', 'classe', 'texto') */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function link(href, className, text, ariaLabel) {
    var a = el('a', className, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (ariaLabel) a.setAttribute('aria-label', ariaLabel);
    return a;
  }

  function pills(items) {
    var ul = el('ul', 'pills');
    items.forEach(function (item) {
      ul.appendChild(el('li', 'pill', item));
    });
    return ul;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ---------- Sobre: numeros de destaque ---------- */
  function renderHighlights(t) {
    var mount = document.getElementById('about-stats');
    if (!mount) return;
    clear(mount);
    (t('about.highlights') || []).forEach(function (item) {
      var li = el('li', 'stat');
      li.appendChild(el('span', 'stat__value', item.value));
      li.appendChild(el('span', 'stat__label', item.label));
      mount.appendChild(li);
    });
  }

  /* ---------- Experiencia: timeline vertical ---------- */
  function renderExperience(t) {
    var mount = document.getElementById('experience-list');
    if (!mount) return;
    clear(mount);

    (t('experience.items') || []).forEach(function (job) {
      var li = el('li', 'timeline__item reveal');
      li.appendChild(el('span', 'timeline__marker'));

      var body = el('div', 'timeline__body');
      var period = el('p', 'timeline__period',
        window.I18N.formatRange(job.start, job.end));
      if (!job.end) period.classList.add('is-current');
      body.appendChild(period);

      body.appendChild(el('h3', 'timeline__role', job.role));

      var meta = el('p', 'timeline__company');
      meta.appendChild(el('strong', null, job.company));
      meta.appendChild(document.createTextNode(' · ' + job.location));
      body.appendChild(meta);

      if (job.summary) body.appendChild(el('p', 'timeline__summary', job.summary));

      var bullets = job.bullets || [];
      var visible = bullets.slice(0, 2);
      var hidden = bullets.slice(2);

      if (visible.length) {
        var ul = el('ul', 'timeline__bullets');
        visible.forEach(function (b) { ul.appendChild(el('li', null, b)); });
        body.appendChild(ul);
      }

      if (hidden.length) {
        var details = el('details', 'timeline__more');
        details.appendChild(el('summary', null, t('experience.more')));
        var extra = el('ul', 'timeline__bullets');
        hidden.forEach(function (b) { extra.appendChild(el('li', null, b)); });
        details.appendChild(extra);
        body.appendChild(details);
      }

      li.appendChild(body);
      mount.appendChild(li);
    });
  }

  /* ---------- Projetos ---------- */
  function projectCard(project, t) {
    var copy = t('projects.items.' + project.id) || {};
    var name = copy.name || project.id;
    var card = el('article', 'card reveal' + (project.featured ? ' card--featured' : ''));

    var head = el('div', 'card__head');
    head.appendChild(el('h3', 'card__title', name));
    if (project.year) head.appendChild(el('span', 'card__year', project.year));
    card.appendChild(head);

    if (copy.desc) card.appendChild(el('p', 'card__desc', copy.desc));
    if (project.tags && project.tags.length) card.appendChild(pills(project.tags));

    var actions = el('div', 'card__actions');
    if (project.private) {
      actions.appendChild(el('span', 'badge badge--private', t('projects.private')));
    } else {
      if (project.demo) {
        actions.appendChild(link(project.demo, 'btn btn--small',
          t('projects.demo'), t('projects.demo') + ' — ' + name));
      }
      if (project.repo) {
        actions.appendChild(link(project.repo, 'btn btn--small btn--ghost',
          t('projects.code'), t('projects.code') + ' — ' + name));
      }
      if (project.release) {
        actions.appendChild(link(project.release, 'btn btn--small btn--ghost',
          t('projects.release'), t('projects.release') + ' — ' + name));
      }
    }
    if (actions.childNodes.length) card.appendChild(actions);

    return card;
  }

  function renderProjects(t) {
    if (!projects) return;
    var featured = document.getElementById('projects-featured');
    var others = document.getElementById('projects-list');
    if (!featured || !others) return;

    clear(featured);
    clear(others);

    projects.forEach(function (project) {
      var mount = project.featured ? featured : others;
      mount.appendChild(projectCard(project, t));
    });
  }

  /* ---------- Stack ---------- */
  function renderSkills(t) {
    var mount = document.getElementById('skills-list');
    if (!mount) return;
    clear(mount);
    (t('skills.groups') || []).forEach(function (group) {
      var block = el('div', 'skill-group reveal');
      block.appendChild(el('h3', 'skill-group__label', group.label));
      block.appendChild(pills(group.items));
      mount.appendChild(block);
    });
  }

  /* ---------- Formacao, certificacoes e idiomas ---------- */
  function renderEducation(t) {
    var mount = document.getElementById('education-grid');
    if (!mount) return;
    clear(mount);

    var degrees = el('div', 'edu-col reveal');
    degrees.appendChild(el('h3', 'edu-col__title', t('education.degrees_title')));
    var degreeList = el('ul', 'edu-list');
    (t('education.items') || []).forEach(function (item) {
      var li = el('li', 'edu-item');
      li.appendChild(el('span', 'edu-item__degree', item.degree));
      li.appendChild(el('span', 'edu-item__school', item.school));
      li.appendChild(el('span', 'edu-item__period', item.period));
      degreeList.appendChild(li);
    });
    degrees.appendChild(degreeList);
    mount.appendChild(degrees);

    var certs = el('div', 'edu-col reveal');
    certs.appendChild(el('h3', 'edu-col__title', t('education.certifications_title')));
    var certList = el('ul', 'edu-list edu-list--plain');
    (t('education.certifications') || []).forEach(function (item) {
      certList.appendChild(el('li', 'edu-item', item));
    });
    certs.appendChild(certList);
    mount.appendChild(certs);

    var langs = el('div', 'edu-col reveal');
    langs.appendChild(el('h3', 'edu-col__title', t('education.languages_title')));
    var langList = el('ul', 'edu-list edu-list--plain');
    (t('education.languages') || []).forEach(function (item) {
      var li = el('li', 'edu-item');
      li.appendChild(el('span', 'edu-item__degree', item.name));
      li.appendChild(el('span', 'edu-item__school', item.level));
      langList.appendChild(li);
    });
    langs.appendChild(langList);
    mount.appendChild(langs);
  }

  function renderAll() {
    if (!window.I18N || !window.I18N.dict) return;
    var t = window.I18N.t;
    renderHighlights(t);
    renderExperience(t);
    renderProjects(t);
    renderSkills(t);
    renderEducation(t);
    document.dispatchEvent(new CustomEvent('contentrendered'));
  }

  document.addEventListener('langchange', renderAll);

  fetch('data/projects.json')
    .then(function (res) {
      if (!res.ok) throw new Error('projects.json: HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      projects = data;
      renderAll();
    })
    .catch(function (err) { console.error('[render]', err); });
})();
