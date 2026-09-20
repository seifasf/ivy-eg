function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function renderSection(html, selector) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const incoming = parsed.querySelector(selector);
  const target = document.querySelector(selector);
  if (incoming && target) {
    target.innerHTML = incoming.innerHTML;
  }
}

async function fetchCollection(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Collection update failed');
  return res.text();
}

function buildUrl(form) {
  const formData = new FormData(form);
  const params = new URLSearchParams(formData);
  const base = form.getAttribute('action') || window.location.pathname;
  const url = new URL(base, window.location.origin);
  url.search = params.toString();
  return url.toString();
}

export function initFacets() {
  const facetForm = document.querySelector('[data-facets-form]');
  const productGrid = document.querySelector('[data-product-grid]');
  if (!facetForm || !productGrid) return;

  const onSubmit = debounce(async () => {
    const url = buildUrl(facetForm);
    window.history.replaceState({}, '', url);
    facetForm.classList.add('is-loading');

    try {
      const html = await fetchCollection(url);
      renderSection(html, '[data-product-grid]');
      renderSection(html, '[data-facets-form]');
      renderSection(html, '[data-collection-count]');
      document.dispatchEvent(new CustomEvent('facets:updated'));
    } catch (e) {
      console.error(e);
    } finally {
      facetForm.classList.remove('is-loading');
    }
  }, 400);

  facetForm.addEventListener('input', onSubmit);
  facetForm.addEventListener('change', onSubmit);
  facetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmit();
    document.querySelector('[data-facets-drawer]')?.classList.remove('is-open');
    document.querySelector('[data-facets-overlay]')?.classList.remove('is-visible');
  });

  document.querySelector('[data-facets-clear]')?.addEventListener('click', (e) => {
    e.preventDefault();
    facetForm.reset();
    onSubmit();
  });

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-facets-drawer-toggle]');
    const drawer = document.querySelector('[data-facets-drawer]');
    const overlay = document.querySelector('[data-facets-overlay]');
    if (!toggle || !drawer) return;
    e.preventDefault();
    const open = drawer.classList.toggle('is-open');
    overlay?.classList.toggle('is-visible', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  document.querySelectorAll('[data-view-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.viewToggle;
      document.querySelectorAll('[data-view-toggle]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      productGrid.dataset.view = view;
      productGrid.classList.toggle('grid--list', view === 'list');
    });
  });
}
