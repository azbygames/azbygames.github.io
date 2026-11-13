/* AzbyGames v6.4. Vanilla JS: no dependencies, no page navigation during language switching. */
(() => {
  'use strict';
  const root = document.documentElement;
  const locales = window.AZBY_TRANSLATIONS || {};
  const supported = ['en','tr','es','zh','hi','ar','pt','fr','ru','bn','ja','de'];
  const langStorage = 'azbygames-language-v4';
  const themeStorage = 'azbygames-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer = null;
  let currentLang = 'en';
  let motionFrame = 0;
  const themeNames = {
    en:'Switch light or dark theme',tr:'Açık veya koyu temayı değiştir',es:'Cambiar tema claro u oscuro',
    zh:'切换浅色或深色主题',hi:'लाइट या डार्क थीम बदलें',ar:'التبديل بين المظهر الفاتح والداكن',
    pt:'Alternar tema claro ou escuro',fr:'Changer de thème clair ou sombre',ru:'Сменить светлую или тёмную тему',
    bn:'লাইট বা ডার্ক থিম বদলান',ja:'ライト・ダークテーマを切り替える',de:'Helles oder dunkles Design wechseln'
  };
  const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.5A9 9 0 0 1 10.5 3.3a9 9 0 1 0 10 10.2Z"/></svg>';
  function storeGet(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function storeSet(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function validLang(value) { return supported.includes(value) && !!locales[value]; }
  function browserLang() {
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (const locale of list) {
      const code = String(locale).toLowerCase().split('-')[0];
      if (validLang(code)) return code;
    }
    return 'en';
  }
  function isDark() {
    const choice = root.getAttribute('data-theme');
    return choice === 'dark' || (choice !== 'light' && prefersDark.matches);
  }
  function refreshTheme() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#13161b' : '#f4f3f1');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.innerHTML = isDark() ? sun : moon;
      button.setAttribute('aria-label', themeNames[currentLang] || themeNames.en);
      button.title = themeNames[currentLang] || themeNames.en;
      button.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
    }
  }
  function injectThemeButton() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let button = nav.querySelector('.theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.className = 'theme-toggle';
      button.type = 'button';
      nav.appendChild(button);
    }
    refreshTheme();
  }
  function updateMeta(selector, content) {
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute('content', content);
  }
  function prepareReveal() {
    if (observer) { observer.disconnect(); observer = null; }
    root.classList.remove('js-motion');
    if (prefersReduce.matches || !('IntersectionObserver' in window)) return;
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!items.length) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (typeof entry.target.animate === 'function') {
            entry.target.animate([{opacity:.62,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'});
          }
          observer.unobserve(entry.target);
        }
      }
    }, {threshold:.08,rootMargin:'0px 0px -25px 0px'});
    root.classList.add('js-motion');
    items.forEach(el => observer.observe(el));
  }
  function applyLang(requested, keepScroll = false) {
    const language = validLang(requested) ? requested : 'en';
    const data = locales[language];
    if (!data) return; // English HTML stays usable if translation setup failed.
    const oldScroll = keepScroll ? window.scrollY : 0;
    if (observer) { observer.disconnect(); observer = null; }
    root.classList.remove('js-motion'); // Prevent new content briefly being invisible.
    // The templates are fixed assets shipped with this site, never user-provided HTML.
    document.body.innerHTML = data.body;
    currentLang = language;
    root.lang = language;
    root.dir = data.dir || 'ltr';
    document.title = data.title;
    updateMeta('meta[name="description"]',data.description);
    updateMeta('meta[property="og:title"]',data.title);
    updateMeta('meta[property="og:description"]',data.description);
    updateMeta('meta[name="twitter:title"]',data.title);
    updateMeta('meta[name="twitter:description"]',data.description);
    updateMeta('meta[property="og:locale"]',language === 'en' ? 'en_US' : language === 'tr' ? 'tr_TR' : language);
    const selector = document.getElementById('language');
    if (selector) selector.value = language;
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
    injectThemeButton();
    prepareReveal();
    if (keepScroll) requestAnimationFrame(() => window.scrollTo({top:oldScroll,left:0,behavior:'instant'}));
  }
  function closeMenu() {
    const links = document.getElementById('nav-links');
    const button = document.getElementById('menu-toggle');
    if (!links || !button) return;
    links.classList.remove('open');
    button.setAttribute('aria-expanded','false');
    button.textContent='☰';
  }
  // Canonical homepage URL for every language. Keep locale in localStorage, never
  // in the address bar. Legacy language paths and ?lang= links are accepted once.
  function normalizeUrl() {
    const hosts = ['azbygames.com','www.azbygames.com','azbygames.github.io'];
    if (!hosts.includes(location.hostname)) return { language:null, anchor:null, redirected:false };
    const pathMatcher = new RegExp('^/(' + supported.join('|') + ')(?:/(?:index(?:\\.html?)?)?)?$', 'i');
    const pathMatch = location.pathname.match(pathMatcher);
    const pathLang = pathMatch ? pathMatch[1].toLowerCase() : null;
    const queryLang = new URLSearchParams(location.search).get('lang');
    const language = validLang(pathLang) ? pathLang : validLang(queryLang) ? queryLang : null;
    const anchor = ['#games','#studio','#contact','#main'].includes(location.hash) ? location.hash : null;
    // www and GitHub's original address must also land on the public apex domain.
    // Pass a language hint once across origins; the destination removes it instantly.
    if (location.hostname !== 'azbygames.com') {
      location.replace('https://azbygames.com/' + (language ? '?lang=' + encodeURIComponent(language) : ''));
      return { language:null, anchor:null, redirected:true };
    }
    if (location.pathname !== '/' || location.search || location.hash) {
      history.replaceState(history.state,'','/');
    }
    return { language, anchor, redirected:false };
  }
  // Events are delegated; repeated language changes do not register duplicate listeners.
  document.addEventListener('change', event => {
    if (event.target && event.target.id === 'language') {
      const newLang = event.target.value;
      if (validLang(newLang)) {
        storeSet(langStorage,newLang);
        const switchLanguage = () => applyLang(newLang,true);
        // Native View Transitions are progressive enhancement only. The site
        // remains functional in Safari/Firefox without the API.
        if (document.startViewTransition && !prefersReduce.matches) {
          document.startViewTransition(switchLanguage);
        } else {
          switchLanguage();
        }
      }
    }
  });
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button');
    if (button && button.classList.contains('theme-toggle')) {
      const nextTheme = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme',nextTheme);
      storeSet(themeStorage,nextTheme);
      refreshTheme();
      return;
    }
    if (button && button.id === 'menu-toggle') {
      const menu = document.getElementById('nav-links');
      if (!menu) return;
      const expanded = menu.classList.toggle('open');
      button.setAttribute('aria-expanded',String(expanded));
      button.textContent = expanded ? '×' : '☰';
      return;
    }
    const link = event.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      if (href === '/' || (href && href.startsWith('#'))) {
        event.preventDefault();
        closeMenu();
        const element = href === '/' ? document.getElementById('main') : document.getElementById(href.slice(1));
        if (element) element.scrollIntoView({behavior:prefersReduce.matches?'instant':'smooth',block:'start'});
        else window.scrollTo({top:0,behavior:prefersReduce.matches?'instant':'smooth'});
        // Anchor navigation is virtual: the address bar stays azbygames.com.
        if (['azbygames.com','www.azbygames.com','azbygames.github.io'].includes(location.hostname)) {
          history.replaceState(null,'','/');
        }
      } else if (link.closest('#nav-links')) {
        closeMenu();
      }
    } else if (!event.target.closest('.nav-shell')) {
      closeMenu();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const menu = document.getElementById('nav-links');
      if (menu && menu.classList.contains('open')) {
        closeMenu();
        document.getElementById('menu-toggle')?.focus();
      }
    }
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'contact-form') return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = String(data.get('subject') || '').trim();
    const sender = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const body = 'Name: ' + sender + '\nEmail: ' + email + '\n\n' + message + '\n\n— AzbyGames website';
    const status = document.getElementById('form-status');
    if (status) status.textContent = form.dataset.prepared || 'Your email app will open. Please send it there.';
    // GitHub Pages is static. This prepares an email; it intentionally never claims successful delivery.
    const mailto = 'mailto:contact@azbygames.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  });
  // Subtle cursor response on desktop. Never runs for touch devices or reduced-motion users.
  document.addEventListener('pointermove', event => {
    if (prefersReduce.matches || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const area = event.target instanceof Element ? event.target.closest('.hero-art') : null;
    if (!area) return;
    cancelAnimationFrame(motionFrame);
    const {clientX,clientY} = event;
    motionFrame = requestAnimationFrame(() => {
      if (!area.isConnected) return;
      const rect = area.getBoundingClientRect();
      const dx = Math.max(-1,Math.min(1,(clientX - (rect.left+rect.width/2))/(rect.width/2)));
      const dy = Math.max(-1,Math.min(1,(clientY - (rect.top+rect.height/2))/(rect.height/2)));
      area.querySelector('.visual-card')?.style.setProperty('--tilt-x',(-dy*3.4).toFixed(2)+'deg');
      area.querySelector('.visual-card')?.style.setProperty('--tilt-y',(dx*3.4).toFixed(2)+'deg');
    });
  },{passive:true});
  document.addEventListener('pointerout', event => {
    const area = event.target instanceof Element ? event.target.closest('.hero-art') : null;
    if (!area || (event.relatedTarget instanceof Node && area.contains(event.relatedTarget))) return;
    const card = area.querySelector('.visual-card');
    if (card) { card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y'); }
  });
  if (prefersDark.addEventListener) prefersDark.addEventListener('change',refreshTheme);
  else if (prefersDark.addListener) prefersDark.addListener(refreshTheme);
  if (prefersReduce.addEventListener) prefersReduce.addEventListener('change',prepareReveal);
  try {
    const savedTheme = storeGet(themeStorage);
    if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme',savedTheme);
    const route = normalizeUrl();
    if (route.redirected) return;
    const savedLang = storeGet(langStorage);
    if (route.language) storeSet(langStorage,route.language);
    applyLang(route.language || (validLang(savedLang) ? savedLang : browserLang()));
    if (route.anchor) {
      // Honor old deep links without leaving a #fragment in the URL.
      requestAnimationFrame(() => document.getElementById(route.anchor.slice(1))?.scrollIntoView({block:'start',behavior:'instant'}));
    }
  } catch (error) {
    console.error('AzbyGames initialization error:',error);
    root.classList.remove('js-motion');
    injectThemeButton();
  }
})();
