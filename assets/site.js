const links = [...document.querySelectorAll('.toc nav a')];
const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateContents(){ const threshold=(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+2; let active=sections[0]; for(const section of sections){if(section.getBoundingClientRect().top<=threshold) active=section;} if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2) active=sections.at(-1); for(const a of links){const selected=a.getAttribute('href')===`#${active?.id}`;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
if(sections.length){addEventListener('scroll',updateContents,{passive:true});addEventListener('scrollend',updateContents);addEventListener('resize',updateContents);updateContents();}

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
