const CART_SECTION_ID = 'cart-drawer';

function formatMoney(cents, format) {
  if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
    return Shopify.formatMoney(cents, format || window.theme?.moneyFormat);
  }
  return (cents / 100).toFixed(2);
}

async function fetchCart() {
  const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`);
  if (!res.ok) throw new Error('Cart fetch failed');
  return res.json();
}

async function cartChange(body) {
  const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/change.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

function updateFreeShippingBar(cart) {
  const bar = document.querySelector('[data-free-shipping-bar]');
  if (!bar) return;

  const threshold = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--free-shipping-threshold'), 10);
  const showBar = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--show-free-shipping-bar'), 10) === 1;
  if (!showBar || !threshold) {
    bar.hidden = true;
    return;
  }

  const total = cart.total_price;
  const fill = bar.querySelector('[data-free-shipping-fill]');
  const message = bar.querySelector('[data-free-shipping-message]');
  const percent = Math.min(100, (total / threshold) * 100);

  if (fill) fill.style.inlineSize = `${percent}%`;

  if (message) {
    if (total >= threshold) {
      message.textContent = message.dataset.qualified || message.textContent;
      message.dataset.state = 'qualified';
    } else {
      const remaining = threshold - total;
      const template = message.dataset.remainingTemplate;
      if (template) {
        message.textContent = template.replace('__AMOUNT__', formatMoney(remaining));
      }
      message.dataset.state = 'remaining';
    }
  }

  bar.hidden = false;
}

function updateCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    el.hidden = count < 1;
    el.setAttribute('aria-label', count.toString());
  });
}

function renderCartDrawer(cart) {
  const container = document.querySelector('[data-cart-drawer-items]');
  const empty = document.querySelector('[data-cart-drawer-empty]');
  const footer = document.querySelector('[data-cart-drawer-footer]');
  const subtotal = document.querySelector('[data-cart-subtotal]');

  if (!container) return;

  updateCartCount(cart.item_count);
  updateFreeShippingBar(cart);

  if (subtotal) {
    subtotal.textContent = formatMoney(cart.total_price);
  }

  if (cart.item_count === 0) {
    container.innerHTML = '';
    if (empty) empty.hidden = false;
    if (footer) footer.hidden = true;
    return;
  }

  if (empty) empty.hidden = true;
  if (footer) footer.hidden = false;

  container.innerHTML = cart.items
    .map(
      (item) => `
    <div class="cart-drawer__item" data-cart-item data-key="${item.key}">
      <div class="cart-drawer__item-media">
        ${
          item.image
            ? `<img src="${item.image}&width=160" alt="${item.title.replace(/"/g, '&quot;')}" class="cart-drawer__item-image" loading="lazy" width="80" height="80">`
            : ''
        }
      </div>
      <div class="cart-drawer__item-details">
        <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
        ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : ''}
        <p class="cart-drawer__item-price">${formatMoney(item.final_line_price)}</p>
        <div class="cart-drawer__item-actions">
          <div class="quantity" data-quantity>
            <button type="button" class="quantity__button" data-quantity-minus aria-label="−"><span aria-hidden="true">−</span></button>
            <input type="number" class="quantity__input" value="${item.quantity}" min="0" data-quantity-input data-line-key="${item.key}" aria-label="${document.querySelector('[data-cart-quantity-label]')?.textContent || ''}">
            <button type="button" class="quantity__button" data-quantity-plus aria-label="+"><span aria-hidden="true">+</span></button>
          </div>
          <button type="button" class="cart-drawer__remove" data-remove-line="${item.key}">${document.querySelector('[data-cart-remove-label]')?.textContent || ''}</button>
        </div>
      </div>
    </div>`
    )
    .join('');
}

export async function refreshCart() {
  try {
    const cart = await fetchCart();
    renderCartDrawer(cart);
    return cart;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function changeLine(key, quantity) {
  const cart = await cartChange({ id: key, quantity });
  renderCartDrawer(cart);
  return cart;
}

function openDrawer() {
  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-drawer-overlay]');
  if (!drawer) return;
  drawer.classList.add('is-open');
  overlay?.classList.add('is-visible');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  trapFocus(drawer);
}

function closeDrawer() {
  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-drawer-overlay]');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  overlay?.classList.remove('is-visible');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function trapFocus(element) {
  const focusable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first?.focus();

  element.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    },
    { once: true }
  );
}

export function initCartDrawer() {
  const cartType = getComputedStyle(document.documentElement).getPropertyValue('--cart-type').trim();
  if (cartType === 'page') return;

  document.querySelectorAll('[data-cart-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      refreshCart().then(() => openDrawer());
    });
  });

  document.querySelectorAll('[data-cart-drawer-close]').forEach((btn) => {
    btn.addEventListener('click', closeDrawer);
  });

  document.querySelector('[data-cart-drawer-overlay]')?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  document.addEventListener('click', async (e) => {
    const minus = e.target.closest('[data-quantity-minus]');
    const plus = e.target.closest('[data-quantity-plus]');
    const remove = e.target.closest('[data-remove-line]');
    const input = e.target.closest('[data-quantity-input]');

    if (remove) {
      e.preventDefault();
      await changeLine(remove.dataset.removeLine, 0);
      return;
    }

    if (minus || plus) {
      e.preventDefault();
      const wrap = e.target.closest('[data-cart-item]');
      const field = wrap?.querySelector('[data-quantity-input]');
      if (!field) return;
      let qty = parseInt(field.value, 10) || 0;
      qty = minus ? Math.max(0, qty - 1) : qty + 1;
      field.value = qty;
      await changeLine(field.dataset.lineKey, qty);
      return;
    }

    if (input && e.type === 'change') {
      const qty = Math.max(0, parseInt(input.value, 10) || 0);
      await changeLine(input.dataset.lineKey, qty);
    }
  });

  document.addEventListener(
    'change',
    async (e) => {
      const input = e.target.closest('[data-quantity-input]');
      if (!input) return;
      const qty = Math.max(0, parseInt(input.value, 10) || 0);
      await changeLine(input.dataset.lineKey, qty);
    },
    true
  );

  document.addEventListener('cart:refresh', () => refreshCart());
  document.addEventListener('cart:open', () => {
    refreshCart().then(() => openDrawer());
  });

  refreshCart();
}

export async function addToCart(formData) {
  const root = window.Shopify?.routes?.root || '/';
  const res = await fetch(`${root}cart/add.js`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData instanceof FormData ? formData : JSON.stringify(formData),
  });
  if (!res.ok) throw await res.json();
  const cart = await refreshCart();
  document.dispatchEvent(new CustomEvent('cart:open'));
  return cart;
}

export { CART_SECTION_ID };
