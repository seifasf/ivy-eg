class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
    this._loaded = false;
  }

  connectedCallback() {
    if (this._loaded) return;
    const url = this.dataset.url;
    if (!url) return;

    if (this.querySelector('.product-card, .related-products__empty')) {
      this._loaded = true;
      return;
    }

    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const section = doc.querySelector('.shopify-section') || doc.body;
        const content = section.querySelector('product-recommendations') || section;
        if (content?.innerHTML.trim()) {
          this.innerHTML = content.innerHTML;
          this._loaded = true;
        } else {
          this.remove();
        }
      })
      .catch(() => {
        this.remove();
      });
  }
}

if (!customElements.get('product-recommendations')) {
  customElements.define('product-recommendations', ProductRecommendations);
}
