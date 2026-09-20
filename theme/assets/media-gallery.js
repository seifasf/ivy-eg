export function initMediaGallery() {
  document.querySelectorAll('[data-media-gallery]').forEach((gallery) => {
    const slides = gallery.querySelectorAll('[data-media-slide]');
    const thumbs = gallery.querySelectorAll('[data-media-thumb]');
    const zoomBtn = gallery.querySelector('[data-media-zoom]');

    if (!slides.length) return;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.hidden = !active;
        slide.classList.toggle('product-media-gallery__slide--active', active);
      });
      thumbs.forEach((thumb, i) => {
        const active = parseInt(thumb.dataset.mediaIndex, 10) === index;
        thumb.setAttribute('aria-current', active ? 'true' : 'false');
        thumb.classList.toggle('product-media-gallery__thumb--active', active);
      });
    };

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(thumb.dataset.mediaIndex, 10);
        if (Number.isNaN(index)) return;
        showSlide(index);
      });
    });

    zoomBtn?.addEventListener('click', () => {
      const activeSlide = gallery.querySelector('[data-media-slide]:not([hidden])');
      const img = activeSlide?.querySelector('.product-media-gallery__image');
      if (!img?.src) return;
      window.open(img.src, '_blank', 'noopener,noreferrer');
    });
  });
}
