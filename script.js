'use strict';
document.documentElement.classList.add('js');
const palettes = document.querySelectorAll('[data-palette]');
function setPalette(theme, updateUrl = true) {
  theme = theme === 'yellow' ? 'yellow' : 'cream';
  document.documentElement.dataset.theme = theme;
  palettes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.palette === theme)));
  document.querySelector('meta[name="theme-color"]').content = theme === 'yellow' ? '#FFFFFF' : '#F5F4EB';
  if (updateUrl) { const url = new URL(location.href); url.searchParams.set('theme', theme); history.replaceState({}, '', url); }
}
setPalette(new URLSearchParams(location.search).get('theme'), false);
palettes.forEach(button => button.addEventListener('click', () => setPalette(button.dataset.palette)));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('active'); observer.unobserve(entry.target);} }), {threshold: .2});
document.querySelectorAll('.draw').forEach(arrow => observer.observe(arrow));
const galleryButton = document.querySelector('[data-gallery]');
galleryButton.setAttribute('aria-expanded', 'false');
galleryButton.addEventListener('click', () => {const notes = document.querySelector('.build-notes');notes.hidden = !notes.hidden;galleryButton.setAttribute('aria-expanded', String(!notes.hidden));galleryButton.innerHTML = notes.hidden ? 'See the build notes <span aria-hidden="true">↗</span>' : 'Close the build notes <span aria-hidden="true">−</span>';});
const dialog = document.querySelector('#booking-dialog');
document.querySelectorAll('.booking').forEach(button => button.addEventListener('click', () => {const url = window.SAIF_CONFIG?.bookingUrl; if (url && /^https:\/\/(calendly\.com|cal\.com)\//.test(url)) {location.assign(url);} else {dialog.showModal();}}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();}});
document.querySelector('.run-example').addEventListener('click', () => {const demo = document.querySelector('.agent-demo');demo.classList.remove('replaying');void demo.offsetWidth;demo.classList.add('replaying');});
