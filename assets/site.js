const menu = document.querySelector('.project-menu');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); menu.classList.toggle('dismissed', !open); });
menu?.addEventListener('pointerenter', () => menu.classList.remove('dismissed'));
menu?.addEventListener('focusout', event => { if (!menu.contains(event.relatedTarget)) { menu.classList.remove('dismissed','open'); toggle?.setAttribute('aria-expanded','false'); } });
document.addEventListener('click', event => { if (!menu?.contains(event.target)) { menu?.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu?.classList.remove('open'); menu?.classList.add('dismissed'); toggle?.setAttribute('aria-expanded','false'); if(menu?.contains(document.activeElement)) (toggle ?? menu.querySelector('.project-control a'))?.focus(); } });
const links = [...document.querySelectorAll('.toc nav a')];
const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateContents(){ let active=sections[0]; for(const section of sections){if(section.getBoundingClientRect().top<=160) active=section;} if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2) active=sections.at(-1); for(const a of links){const selected=a.getAttribute('href')===`#${active?.id}`;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
if(sections.length){addEventListener('scroll',updateContents,{passive:true});updateContents();}

const colorButtons = [...document.querySelectorAll('[data-accent]')].filter(el => el.tagName === 'BUTTON');
const modeButton = document.querySelector('.mode-toggle');
function syncAppearance() {
  colorButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accent === document.documentElement.dataset.accent)));
  modeButton?.setAttribute('aria-pressed', String(document.documentElement.dataset.mode === 'dark'));
}
function savePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }
colorButtons.forEach(button => button.addEventListener('click', () => {
  document.documentElement.dataset.accent = button.dataset.accent;
  savePreference('portfolio-accent', button.dataset.accent);
  syncAppearance();
}));
modeButton?.addEventListener('click', () => {
  const mode = document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.mode = mode;
  savePreference('portfolio-mode', mode);
  syncAppearance();
});
syncAppearance();
