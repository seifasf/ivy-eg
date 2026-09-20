export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initAnimations() {
  const animationsEnabled =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--animations-enabled'), 10) === 1;

  if (!animationsEnabled || prefersReducedMotion()) {
    document.documentElement.classList.remove('animations-enabled');
    return;
  }

  document.documentElement.classList.add('animations-enabled');

  const staggered = document.querySelectorAll('[data-animate-stagger]');
  staggered.forEach((container) => {
    const children = container.querySelectorAll('[data-animate]');
    children.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.12}s`;
    });
  });
}

export function observeReveal(selector = '[data-reveal]') {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
}
