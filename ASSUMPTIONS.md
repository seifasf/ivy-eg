# Assumptions — IVY Shopify Theme

Logged during A→Z theme build from the React source of truth.

1. **Theme root**: All Shopify theme files live in `/theme` so the existing Vite app stays intact.
2. **Visual source of truth**: Live CSS/components override README marketing language (no electric blue/gold accents in code — monochrome black/white).
3. **Font**: Keep Inter to match the current storefront (design-system exception).
4. **Cart type**: Default to **drawer** with a full cart page as fallback; announcement bar + free-shipping threshold configurable in theme settings.
5. **Currency**: EGP-first for Egypt; Markets / multi-currency via Shopify (no hardcoded currency symbols in Liquid — always `money` filters).
6. **Payments**: Surface Shopify Payment Button + COD via Shopify payment settings; theme shows `payment_type_svg_tag` icons only.
7. **Auth**: Shopify customer accounts (not Google OAuth from the React app).
8. **Products**: React app had empty catalogs; theme sections degrade gracefully with placeholders / empty states matching “Coming Soon” tone.
9. **Logo**: Copy `IVY-03.png` into `theme/assets/ivy-logo.png` as default; merchants can replace via theme settings.
10. **Arabic**: Full `ar.json` + logical CSS (`margin-inline`, `padding-inline`, `inset-inline`) and `dir` from `request.locale`.
11. **Reviews / Instagram**: Provide `@app` blocks and a static “gallery” section with image blocks (no forced third-party apps).
12. **Infinite scroll**: Optional setting on collection; default is numbered pagination for accessibility/SEO.
13. **3D / video**: Product media uses native Shopify media types (`image`, `video`, `external_video`, `model`).
14. **Theme check**: Target Shopify CLI Theme Check; fix all errors/warnings before considering done.
15. **No build step**: Plain CSS + ES-module JS served from `assets/`.
16. **Newsletter**: Uses Shopify `{% form 'customer' %}` (email marketing consent).
17. **Size guide**: Product block with richtext / page link, not a separate app.
18. **Recently viewed**: `localStorage` + section; no backend.
19. **Bundle/upsell**: Complementary products via Shopify recommendations API + optional block product pickers.
20. **Password page**: Matches brand dark aesthetic for launch.
