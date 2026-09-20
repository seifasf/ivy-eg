function initSlideshow(root) {
  const track = root.querySelector('[data-slideshow-track]');
  const slides = root.querySelectorAll('[data-slideshow-slide]');
  if (!track || slides.length < 2) return;

  let index = 0;
  const autoplay = root.dataset.autoplay === 'true';
  const interval = parseInt(root.dataset.autoplaySpeed, 10) || 5000;

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    root.querySelectorAll('[data-slideshow-dot]').forEach((dot, di) => {
      dot.classList.toggle('is-active', di === index);
      dot.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  };

  root.querySelector('[data-slideshow-prev]')?.addEventListener('click', () => goTo(index - 1));
  root.querySelector('[data-slideshow-next]')?.addEventListener('click', () => goTo(index + 1));
  root.querySelectorAll('[data-slideshow-dot]').forEach((dot, di) => {
    dot.addEventListener('click', () => goTo(di));
  });

  let timer;
  const start = () => {
    if (!autoplay) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), interval);
  };
  const stop = () => clearInterval(timer);

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  start();
  goTo(0);
}

function initCountdown(root) {
  const end = root.dataset.endDate;
  if (!end) return;

  const endTime = Date.parse(end);
  if (Number.isNaN(endTime)) return;

  const units = {
    days: root.querySelector('[data-countdown-days]'),
    hours: root.querySelector('[data-countdown-hours]'),
    minutes: root.querySelector('[data-countdown-minutes]'),
    seconds: root.querySelector('[data-countdown-seconds]'),
  };

  const tick = () => {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      root.classList.add('is-expired');
      return false;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (units.days) units.days.textContent = String(d).padStart(2, '0');
    if (units.hours) units.hours.textContent = String(h).padStart(2, '0');
    if (units.minutes) units.minutes.textContent = String(m).padStart(2, '0');
    if (units.seconds) units.seconds.textContent = String(s).padStart(2, '0');
    return true;
  };

  if (!tick()) return;
  const id = setInterval(() => {
    if (!tick()) clearInterval(id);
  }, 1000);
}

function initCollapsible(root) {
  root.querySelectorAll('[data-collapsible-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('[data-collapsible-item]');
      const open = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}

function initMarquee(root) {
  const track = root.querySelector('[data-marquee-track]');
  if (!track || track.dataset.duplicated === 'true') return;
  track.innerHTML += track.innerHTML;
  track.dataset.duplicated = 'true';
}

function initSectionHome() {
  document.querySelectorAll('[data-slideshow]').forEach(initSlideshow);
  document.querySelectorAll('[data-countdown]').forEach(initCountdown);
  document.querySelectorAll('[data-collapsible]').forEach(initCollapsible);
  document.querySelectorAll('[data-marquee]').forEach(initMarquee);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSectionHome);
} else {
  initSectionHome();
}

document.addEventListener('shopify:section:load', initSectionHome);
