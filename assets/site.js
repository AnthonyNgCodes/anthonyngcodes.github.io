const links = [...document.querySelectorAll('.toc nav a')];
const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
// Enhance home page headings while leaving the content readable without JavaScript.
const sectionToggles = new Map();
document.querySelectorAll('.page-layout main .section-heading, .page-layout main .subsection-heading').forEach(heading => {
  const container = heading.parentElement;
  const title = heading.matches('.section-heading') ? heading.querySelector('h2') : heading;
  const content = document.createElement('div');
  content.id = `${container.id}-content`;
  content.className = 'section-content';
  while (heading.nextSibling) content.append(heading.nextSibling);
  container.append(content);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'section-toggle';
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-controls', content.id);
  while (title.firstChild) button.append(title.firstChild);
  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('class', 'section-chevron');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.setAttribute('focusable', 'false');
  chevron.setAttribute('aria-hidden', 'true');
  const chevronPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  chevronPath.setAttribute('d', 'm6 9 6 6 6-6');
  chevron.append(chevronPath);
  button.append(chevron);
  title.append(button);

  let slideAnimation;
  const setExpanded = (expanded, animate = false) => {
    const startHeight = content.getBoundingClientRect().height;
    slideAnimation?.cancel();
    button.setAttribute('aria-expanded', String(expanded));
    content.inert = !expanded;
    container.classList.toggle('is-collapsed', !expanded);
    const finish = () => {
      content.hidden = !expanded;
      content.style.overflow = '';
      slideAnimation = undefined;
      updateContents();
    };
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    content.hidden = false;
    const endHeight = expanded ? content.getBoundingClientRect().height : 0;
    content.style.overflow = 'hidden';
    slideAnimation = content.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 240, easing: 'cubic-bezier(.25, .1, .25, 1)' }
    );
    slideAnimation.onfinish = finish;
  };
  sectionToggles.set(container, setExpanded);
  button.addEventListener('click', () => {
    setExpanded(button.getAttribute('aria-expanded') !== 'true', true);
    updateContents();
  });
});

function revealSection(hash) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  for (const [container, setExpanded] of sectionToggles) {
    if (container === target || container.contains(target)) setExpanded(true);
  }
}
links.forEach(link => link.addEventListener('click', () => revealSection(link.hash)));
addEventListener('hashchange', () => revealSection(location.hash));
revealSection(location.hash);
function updateContents(){ const visibleSections=sections.filter(section=>!section.closest('[hidden]')); const threshold=(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+2; let active=visibleSections[0]; for(const section of visibleSections){if(section.getBoundingClientRect().top<=threshold) active=section;} if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2) active=visibleSections.at(-1); for(const a of links){const selected=a.getAttribute('href')===`#${active?.id}`;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
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

// Bring each page into view with the same gentle motion as its sections.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.header, main, .toc, footer').forEach(element => {
    element.animate([
      { transform: 'translateY(-18px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ], {
      duration: 320,
      easing: 'cubic-bezier(.25, .1, .25, 1)'
    });
  });
}

// Match the welcome shower to the active page.
const pageEmojis = {
  'index.html': '🤿',
  'projects.html': '⚙️',
  'research.html': '🦿',
  'fun.html': '🐵'
};
const activePage = document.querySelector('.top-nav a[aria-current="page"]');
const showerEmoji = pageEmojis[activePage?.getAttribute('href').split('/').pop()];
if (showerEmoji && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const shower = document.createElement('div');
  shower.className = 'emoji-shower';
  shower.setAttribute('aria-hidden', 'true');
  document.body.append(shower);
  const falls = Array.from({ length: 28 }, () => {
    const emoji = document.createElement('span');
    emoji.className = 'shower-emoji';
    emoji.textContent = showerEmoji;
    emoji.style.left = `${Math.random() * 100}%`;
    emoji.style.fontSize = `${24 + Math.random() * 20}px`;
    shower.append(emoji);
    const drift = Math.random() * 120 - 60;
    const rotation = Math.random() * 100 - 50;
    const fall = emoji.animate([
      { transform: `translate(-50%, -60px) rotate(${rotation}deg)`, opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { opacity: 1, offset: 0.8 },
      { transform: `translate(calc(-50% + ${drift}px), calc(100dvh + 60px)) rotate(${rotation + 180}deg)`, opacity: 0 }
    ], {
      duration: 2200 + Math.random() * 1000,
      delay: Math.random() * 900,
      easing: 'ease-in',
      fill: 'both'
    });
    return fall.finished;
  });
  Promise.allSettled(falls).then(() => shower.remove());
}
