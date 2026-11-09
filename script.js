'use strict';

const params = new URLSearchParams(location.search);
const paletteButtons = document.querySelectorAll('[data-palette]');
const pageLinks = document.querySelectorAll('[data-page]');

function applyPalette(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === 'yellow' ? '#FFFFFF' : '#F5F4EB';

  for (const button of paletteButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.palette === theme));
  }
  for (const link of pageLinks) {
    const url = new URL(link.href);
    url.searchParams.set('theme', theme);
    link.href = url.href;
  }
}

applyPalette(params.get('theme') === 'yellow' ? 'yellow' : 'cream');
for (const button of paletteButtons) {
  button.addEventListener('click', () => {
    const theme = button.dataset.palette;
    const url = new URL(location.href);
    url.searchParams.set('theme', theme);
    history.replaceState(null, '', url);
    applyPalette(theme);
  });
}

// Preserve the links shared before the portfolio was split into pages.
if (document.body.dataset.section === 'home') {
  const legacyPages = new Map([
    ['#work', 'work.html'],
    ['#smart-hotel', 'work.html'],
    ['#backend', 'work.html'],
    ['#ai', 'work.html'],
    ['#about', 'about.html'],
    ['#contact', 'contact.html'],
  ]);
  const page = legacyPages.get(location.hash);
  if (page) location.replace(page + location.search + location.hash);
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.replace('pending', 'active');
      observer.unobserve(entry.target);
    }
  }, { threshold: .18 });

  for (const drawing of document.querySelectorAll('.draw')) {
    drawing.classList.add('pending');
    observer.observe(drawing);
  }
}

const dialog = document.querySelector('#booking-dialog');
const bookingUrl = window.SAIF_CONFIG?.bookingUrl;
for (const link of document.querySelectorAll('.booking')) {
  if (bookingUrl && /^https:\/\/(calendly\.com|cal\.com)\//.test(bookingUrl)) {
    link.href = bookingUrl;
  } else if (typeof dialog?.showModal === 'function') {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      dialog.showModal();
      event.preventDefault();
    });
  }
}

document.querySelector('[data-replay]')?.addEventListener('click', () => {
  const demo = document.querySelector('.agent-demo');
  demo.classList.remove('replaying');
  void demo.offsetWidth;
  demo.classList.add('replaying');
});
