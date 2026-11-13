(()=>{'use strict';
const supported=['en','tr','es','zh','hi','ar','pt','fr','ru','bn','ja','de'];
const storageKey='azbygames-language-v4';
const root=document.documentElement;
const dict=window.AZBY_TRANSLATIONS||{};
function storedLanguage(){try{return localStorage.getItem(storageKey)}catch(e){return null}}
function browserLanguage(){const prefs=navigator.languages?.length?navigator.languages:[navigator.language||'en'];for(const item of prefs){const code=item.toLowerCase().split('-')[0];if(supported.includes(code))return code}return'en'}
function updateMeta(selector,value){const node=document.querySelector(selector);if(node)node.setAttribute('content',value)}
function startApp(){
 const pref=storedLanguage();
 const initial=supported.includes(pref)?pref:browserLanguage();
 const lang=supported.includes(initial)&&dict[initial]?initial:'en';
 applyLanguage(lang);
}
const themeStorageKey='azbygames-theme';
const darkQuery=window.matchMedia('(prefers-color-scheme: dark)');
function effectiveDark(){const t=root.getAttribute('data-theme');return t==='dark'||(t!=='light'&&darkQuery.matches)}
function updateThemeColor(){const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=effectiveDark()?'#191b20':'#f7f7f5'}
function installThemeControl(lang){
 const nav=document.querySelector('.nav');if(!nav)return;
 const labels={en:'Switch color theme',tr:'Renk temasını değiştir',es:'Cambiar tema',zh:'切换主题',hi:'थीम बदलें',ar:'تغيير المظهر',pt:'Alterar tema',fr:'Changer de thème',ru:'Сменить тему',bn:'থিম পরিবর্তন',ja:'テーマを切り替える',de:'Farbschema wechseln'};
 const button=document.createElement('button');button.type='button';button.className='theme-toggle';button.setAttribute('aria-label',labels[lang]||labels.en);button.title=labels[lang]||labels.en;
 button.innerHTML=effectiveDark()?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/></svg>';
 button.addEventListener('click',()=>{const mode=effectiveDark()?'light':'dark';root.setAttribute('data-theme',mode);try{localStorage.setItem(themeStorageKey,mode)}catch(e){}updateThemeColor();installThemeControl(lang)});
 const old=nav.querySelector('.theme-toggle');if(old)old.replaceWith(button);else nav.appendChild(button);
}
if(darkQuery.addEventListener)darkQuery.addEventListener('change',()=>{updateThemeColor();const btn=document.querySelector('.theme-toggle');if(btn)installThemeControl(root.lang||'en')});
function applyLanguage(lang){
 if(!dict[lang])lang='en';
 const data=dict[lang];
 // Replace translated markup without changing the URL. External scripts in templates are not re-executed.
 document.body.innerHTML=data.body;
 root.lang=lang;root.dir=data.dir||'ltr';
 updateThemeColor();
 document.title=data.title;
 updateMeta('meta[name="description"]',data.description);
 updateMeta('meta[property="og:title"]',data.title);
 updateMeta('meta[property="og:description"]',data.description);
 updateMeta('meta[name="twitter:title"]',data.title);
 updateMeta('meta[name="twitter:description"]',data.description);
 updateMeta('meta[property="og:locale"]',lang==='en'?'en_US':lang==='tr'?'tr_TR':lang);
 installThemeControl(lang);
 const selector=document.getElementById('language');
 if(selector){selector.value=lang;selector.addEventListener('change',()=>{
 const selected=selector.value;
 try{localStorage.setItem(storageKey,selected)}catch(e){}
 const hash=location.hash;const scrollY=window.scrollY;
 applyLanguage(selected);
 if(hash&&document.getElementById(hash.slice(1)))document.getElementById(hash.slice(1)).scrollIntoView();else window.scrollTo(0,scrollY);
 })}
 const menu=document.getElementById('nav-links');const toggle=document.getElementById('menu-toggle');
 if(toggle&&menu){toggle.addEventListener('click',()=>{const opened=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.textContent=opened?'×':'☰'});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';toggle.focus()}})}
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 const form=document.getElementById('contact-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const subject=String(d.get('subject')||'').trim();const body='Name: '+String(d.get('name')||'').trim()+'\nEmail: '+String(d.get('email')||'').trim()+'\n\n'+String(d.get('message')||'').trim()+'\n\n— AzbyGames Website';const url='mailto:contact@azbygames.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);const status=document.getElementById('form-status');if(status)status.textContent=form.dataset.prepared||'Please send it from your email app.';location.href=url});
 // Apply reveal animation only when supported and respecting accessibility preferences.
 root.classList.remove('js-motion');
 if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.add('js-motion');const ob=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}},{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>ob.observe(e))}
 root.classList.remove('i18n-pending');
}
try{startApp()}catch(e){console.error('AzbyGames language setup failed:',e);root.classList.remove('i18n-pending')}
})();