function debounce(fn, wait = 280) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function initPredictiveSearch() {
  const enabled =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--predictive-search-enabled'), 10) === 1;
  if (!enabled) return;

  document.querySelectorAll('[data-predictive-search]').forEach((root) => {
    const input = root.querySelector('[data-predictive-search-input]');
    const results = root.querySelector('[data-predictive-search-results]');
    const form = root.querySelector('form');

    if (!input || !results) return;

    let activeIndex = -1;

    const close = () => {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    };

    const open = () => {
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };

    const render = (data) => {
      const products = data.resources?.results?.products || [];
      if (!products.length) {
        results.innerHTML = `<p class="predictive-search__empty">${results.dataset.emptyText || ''}</p>`;
        open();
        return;
      }

      const productsTitle = results.dataset.productsTitle || '';
      results.innerHTML = `
        <p class="predictive-search__group-title">${productsTitle}</p>
        <ul role="list">
          ${products
            .map(
              (p) => `
            <li>
              <a class="predictive-search__item" href="${p.url}" data-predictive-item>
                ${p.featured_image?.url ? `<img class="predictive-search__item-image" src="${p.featured_image.url}&width=120" alt="" width="48" height="48" loading="lazy">` : ''}
                <span>
                  <span class="predictive-search__item-title">${p.title}</span>
                  ${p.price ? `<span class="predictive-search__item-price">${p.price}</span>` : ''}
                </span>
              </a>
            </li>`
            )
            .join('')}
        </ul>
        <div class="predictive-search__footer">
          <a href="${form?.action || '/search'}?q=${encodeURIComponent(input.value)}" class="btn btn--secondary btn--pill">
            ${results.dataset.viewAll || ''}
          </a>
        </div>`;
      open();
    };

    const fetchResults = debounce(async () => {
      const q = input.value.trim();
      if (q.length < 2) {
        close();
        return;
      }

      results.innerHTML = `<div class="predictive-search__loading"><span class="loading-spinner"><svg class="loading-spinner__svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2" opacity="0.25"/><path d="M16 3a13 13 0 0113 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></div>`;
      open();

      try {
        const rootPath = window.Shopify?.routes?.root || '/';
        const url = `${rootPath}search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        render(data);
      } catch (e) {
        console.error(e);
        close();
      }
    });

    input.addEventListener('input', fetchResults);
    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) fetchResults();
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) close();
    });

    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('[data-predictive-item]');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach((el, i) => el.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'));
        items[activeIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach((el, i) => el.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'));
        items[activeIndex]?.focus();
      } else if (e.key === 'Escape') {
        close();
      }
    });
  });
}
