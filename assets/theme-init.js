// Apply saved preferences before styles load to avoid flashing the wrong theme.
(() => {
  let accent = 'orange';
  let mode = 'light';
  try {
    accent = localStorage.getItem('portfolio-accent') || accent;
    mode = localStorage.getItem('portfolio-mode') || mode;
  } catch { /* The controls also work when browser storage is unavailable. */ }
  document.documentElement.dataset.accent = accent === 'gold' ? 'gold' : 'orange';
  document.documentElement.dataset.mode = mode === 'dark' ? 'dark' : 'light';
})();
