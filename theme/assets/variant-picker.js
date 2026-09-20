export function initVariantPicker() {
  document.querySelectorAll('[data-variant-picker]').forEach((picker) => {
    const productJson = picker.querySelector('[data-product-json]');
    if (!productJson) return;

    let product;
    try {
      product = JSON.parse(productJson.textContent);
    } catch {
      return;
    }

    const form = picker.closest('form') || document.querySelector('[data-product-form]');
    const idInput = form?.querySelector('[name="id"]');
    const priceEl = document.querySelector('[data-product-price]');
    const submitBtn = form?.querySelector('[type="submit"]');

    const getSelectedOptions = () => {
      const options = [];
      picker.querySelectorAll('[data-option-index]').forEach((field) => {
        if (field.tagName === 'SELECT') {
          options[parseInt(field.dataset.optionIndex, 10)] = field.value;
        } else if (field.checked) {
          options[parseInt(field.dataset.optionIndex, 10)] = field.value;
        }
      });
      return options;
    };

    const findVariant = () => {
      const selected = getSelectedOptions();
      return product.variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
    };

    const update = () => {
      const variant = findVariant();
      if (!variant) return;

      if (idInput) idInput.value = variant.id;

      if (priceEl) {
        const money = (cents) => {
          if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
            return Shopify.formatMoney(cents);
          }
          return (cents / 100).toFixed(2);
        };
        const priceContainer = priceEl.querySelector('.price__container') || priceEl;
        priceContainer.innerHTML = variant.compare_at_price > variant.price
          ? `<s class="price__compare">${money(variant.compare_at_price)}</s> <span class="price__regular">${money(variant.price)}</span>`
          : `<span class="price__regular">${money(variant.price)}</span>`;
      }

      if (submitBtn) {
        submitBtn.disabled = !variant.available;
        submitBtn.setAttribute('aria-disabled', variant.available ? 'false' : 'true');
      }

      picker.dispatchEvent(new CustomEvent('variant:change', { detail: { variant }, bubbles: true }));
    };

    picker.addEventListener('change', update);
    update();
  });
}

export function initStickyAtc() {
  const sticky = document.querySelector('[data-sticky-atc]');
  const mainForm = document.querySelector('[data-product-form]');
  if (!sticky || !mainForm) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      sticky.hidden = entry.isIntersecting;
      sticky.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
    },
    { threshold: 0, rootMargin: '0px 0px -20% 0px' }
  );

  observer.observe(mainForm);

  sticky.querySelector('[data-sticky-atc-button]')?.addEventListener('click', () => {
    mainForm.querySelector('[type="submit"]')?.click();
  });
}
