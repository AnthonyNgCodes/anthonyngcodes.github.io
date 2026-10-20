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

document.querySelectorAll('.project-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.project-slide')];
  const track = carousel.querySelector('.project-carousel-track');
  const counter = carousel.querySelector('.carousel-count');
  let current = 0;
  function showSlide(next) {
    current = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
      const video = slide.querySelector('video');
      if (video) {
        if (active) video.play().catch(() => {});
        else video.pause();
      }
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
  }
  carousel.querySelector('.carousel-prev').addEventListener('click', () => showSlide(current - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => showSlide(current + 1));
  carousel.addEventListener('keydown', event => {
    if (event.target.closest('video')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
});

// Expand project media in an accessible, animated viewer.
const projectMedia = [...document.querySelectorAll('.project-card img, .project-card video')];
if (projectMedia.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'media-viewer';
  viewer.setAttribute('aria-label', 'Expanded project media');
  viewer.innerHTML = '<div class="media-viewer-panel"><div class="media-viewer-toolbar"><p class="media-viewer-title"></p><button type="button" class="media-viewer-close" aria-label="Close expanded media">×</button></div><div class="media-viewer-stage"></div><div class="media-viewer-navigation"><button type="button" class="media-viewer-prev" aria-label="Previous media">←</button><span class="media-viewer-count" aria-live="polite" aria-atomic="true"></span><button type="button" class="media-viewer-next" aria-label="Next media">→</button></div></div>';
  document.body.append(viewer);
  const stage = viewer.querySelector('.media-viewer-stage');
  const title = viewer.querySelector('.media-viewer-title');
  const counter = viewer.querySelector('.media-viewer-count');
  const navigation = viewer.querySelector('.media-viewer-navigation');
  const closeButton = viewer.querySelector('.media-viewer-close');
  let items = [];
  let index = 0;
  let returnFocus;
  let previousOverflow;
  let pausedVideos = [];

  function renderMedia(next) {
    stage.querySelector('video')?.pause();
    index = (next + items.length) % items.length;
    const source = items[index];
    const media = source.cloneNode(true);
    media.removeAttribute('class');
    media.removeAttribute('style');
    media.removeAttribute('tabindex');
    media.removeAttribute('role');
    media.removeAttribute('loading');
    if (media.tagName === 'VIDEO') {
      media.controls = true;
      media.muted = true;
      media.autoplay = true;
      media.addEventListener('loadedmetadata', () => {
        media.currentTime = source.currentTime;
        media.play().catch(() => {});
      }, { once: true });
    } else {
      media.removeAttribute('aria-label');
    }
    stage.replaceChildren(media);
    counter.textContent = `${index + 1} / ${items.length}`;
    navigation.hidden = items.length < 2;
  }

  function openMedia(source, trigger) {
    const card = source.closest('.project-card');
    items = [...card.querySelectorAll('img, video')];
    returnFocus = trigger;
    const origin = source.getBoundingClientRect();
    title.textContent = card.querySelector('h2').textContent;
    pausedVideos = projectMedia.filter(media => media.tagName === 'VIDEO' && !media.paused);
    pausedVideos.forEach(video => video.pause());
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    renderMedia(items.indexOf(source));
    viewer.showModal();
    closeButton.focus({ preventScroll: true });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const destination = stage.getBoundingClientRect();
      stage.animate([
        { transform: `translate(${origin.left + origin.width / 2 - destination.left - destination.width / 2}px, ${origin.top + origin.height / 2 - destination.top - destination.height / 2}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`, opacity: 0.4 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 }
      ], { duration: 280, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    }
  }

  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === stage || event.target.classList.contains('media-viewer-panel')) viewer.close();
  });
  viewer.addEventListener('close', () => {
    stage.querySelector('video')?.pause();
    stage.replaceChildren();
    document.body.style.overflow = previousOverflow;
    pausedVideos.forEach(video => video.play().catch(() => {}));
    returnFocus?.focus({ preventScroll: true });
  });
  viewer.querySelector('.media-viewer-prev').addEventListener('click', () => renderMedia(index - 1));
  viewer.querySelector('.media-viewer-next').addEventListener('click', () => renderMedia(index + 1));
  viewer.addEventListener('keydown', event => {
    if (event.target.closest('video')) return;
    if (items.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      renderMedia(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  projectMedia.forEach(media => {
    if (media.tagName === 'IMG') {
      media.tabIndex = 0;
      media.setAttribute('role', 'button');
      media.setAttribute('aria-label', `Expand image: ${media.alt}`);
      media.addEventListener('click', () => openMedia(media, media));
      media.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openMedia(media, media);
        }
      });
    } else {
      const expand = document.createElement('button');
      expand.type = 'button';
      expand.className = 'project-expand-video';
      expand.textContent = 'Expand video';
      expand.setAttribute('aria-label', 'Expand video');
      expand.title = 'Expand video';
      media.parentElement.classList.add('has-expand-video');
      media.parentElement.append(expand);
      expand.addEventListener('click', () => openMedia(media, expand));
      media.addEventListener('click', event => {
        const bounds = media.getBoundingClientRect();
        // Leave the native video control bar available for playback controls.
        if (!media.controls || event.clientY < bounds.bottom - 48) {
          event.preventDefault();
          openMedia(media, expand);
        }
      });
    }
  });
}

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
