import { initCartDrawer, addToCart, refreshCart } from './cart.js';
import { initFacets } from './facets.js';
import { initPredictiveSearch } from './predictive-search.js';
import { initMediaGallery } from './media-gallery.js';
import { initVariantPicker, initStickyAtc } from './variant-picker.js';
import { initAnimations, observeReveal, prefersReducedMotion } from './animations.js';
import './recommendations.js';

const RECENTLY_VIEWED_KEY = 'ivy_recently_viewed';
const RECENTLY_VIEWED_MAX = 8;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(product) {
  if (!product?.id) return;
  const entry = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    url: product.url,
    featured_image: product.featured_image,
  };
  let list = getRecentlyViewed().filter((p) => p.id !== entry.id);
  list.unshift(entry);
  list = list.slice(0, RECENTLY_VIEWED_MAX);
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch {
    /* storage full or private mode */
  }
}

function initHeader() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileMenu() {
  const drawer = document.querySelector('[data-menu-drawer]');
  const overlay = document.querySelector('[data-menu-overlay]');
  if (!drawer) return;

  const open = () => {
    drawer.classList.add('is-open');
    overlay?.classList.add('is-visible');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-menu-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  document.querySelectorAll('[data-menu-close]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  overlay?.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initProductForms() {
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      const cartType = getComputedStyle(document.documentElement).getPropertyValue('--cart-type').trim();
      if (cartType !== 'drawer') return;

      e.preventDefault();
      const submit = form.querySelector('[type="submit"]');
      submit?.setAttribute('aria-busy', 'true');

      try {
        const formData = new FormData(form);
        await addToCart(formData);
      } catch (err) {
        console.error(err);
        form.submit();
      } finally {
        submit?.removeAttribute('aria-busy');
      }
    });
  });
}

function initShareButtons() {
  document.querySelectorAll('[data-share]').forEach((block) => {
    const trigger = block.querySelector('[data-share-trigger]');
    const panel = block.querySelector('[data-share-panel]');
    const input = block.querySelector('[data-share-input]');
    const copyBtn = block.querySelector('[data-share-copy]');
    const success = block.querySelector('[data-share-success]');

    trigger?.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(input.value);
        success?.classList.remove('visually-hidden');
        setTimeout(() => success?.classList.add('visually-hidden'), 2000);
      } catch {
        input.select();
        document.execCommand('copy');
      }
    });
  });
}

function trackRecentlyViewedProduct() {
  const dataEl = document.querySelector('[data-recently-viewed-product]');
  if (!dataEl) return;
  try {
    const product = JSON.parse(dataEl.textContent);
    pushRecentlyViewed(product);
  } catch {
    /* ignore */
  }
}

function exposeThemeApi() {
  window.IVY = {
    getRecentlyViewed,
    pushRecentlyViewed,
    refreshCart,
    prefersReducedMotion,
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  observeReveal();
  initHeader();
  initMobileMenu();
  initCartDrawer();
  initFacets();
  initPredictiveSearch();
  initMediaGallery();
  initVariantPicker();
  initStickyAtc();
  initProductForms();
  initShareButtons();
  trackRecentlyViewedProduct();
  exposeThemeApi();
});
