# IVY Shopify Theme (Online Store 2.0)

Monochrome black/white theme for **IVY** — premium sporty menswear, Egypt-ready with English and Arabic locales.

## Requirements

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) 3.x
- A Shopify store (development or production)
- Node.js 18+ (for CLI)

## Quick start

```bash
cd theme
shopify theme dev --store YOUR-STORE.myshopify.com
```

Open the preview URL from the CLI. Changes to Liquid, CSS, and JSON sync to the development theme.

## Push to Shopify

```bash
# Upload as unpublished theme
shopify theme push --unpublished --store YOUR-STORE.myshopify.com

# Or push to live (use with care)
shopify theme push --live --store YOUR-STORE.myshopify.com
```

## Project structure

| Path | Purpose |
|------|---------|
| `layout/` | `theme.liquid`, `password.liquid` |
| `templates/` | JSON templates (page, blog, customer, 404, password) |
| `sections/` | OS 2.0 sections including `main-*` templates |
| `snippets/` | Reusable partials (icons, cart, localization) |
| `assets/` | CSS, JS, logo |
| `locales/` | `en.default.json`, `ar.json`, schema translations |
| `config/` | Theme settings |

## Customize in admin

1. **Online Store → Themes → Customize**
2. Assign **Header** menu: Navigation → `main-menu` (or your menu)
3. **Footer**: add menu blocks, newsletter, slogan (default: *Your Everyday Wingman*)
4. **Theme settings**: logo, colors, social links, predictive search
5. **Pages**: assign templates **contact** or **faq** where needed
6. **Markets**: enable Arabic (`ar`) for RTL and `locales/ar.json`

## Page templates

| Template | Section | Use |
|----------|---------|-----|
| `page.json` | `main-page` | Generic content pages |
| `page.contact.json` | `main-page-contact` | Contact form + info sidebar |
| `page.faq.json` | `main-faq` | Collapsible FAQ blocks |
| `blog.json` / `article.json` | Blog grid & post | Journal |
| `404.json` | Branded 404 | Automatic |
| `password.json` | Launch password | Store password page |
| `customers/*.json` | Account flows | Login, register, orders, addresses |

Optional: `list-collections.json` for an all-collections landing page.

## Localization

- Storefront strings: `locales/en.default.json`, `locales/ar.json`
- Theme editor (schema) labels: `locales/en.default.schema.json`, `locales/ar.schema.json`
- Use `{{ 'key.path' | t }}` in Liquid; schema uses `t:sections...` keys

## Go-live checklist

### Theme & content
- [ ] `shopify theme push` (unpublished first), preview, then publish
- [ ] Logo & favicon in theme settings (`assets/ivy-logo.png` as interim)
- [ ] Header / footer menus assigned; announcement bar copy set
- [ ] Homepage sections populated (hero, featured collection, contact/newsletter)
- [ ] Contact page uses **contact** template; FAQ uses **faq** template
- [ ] Collection + product media, descriptions, and SEO titles filled
- [ ] Policies linked: Privacy, Refund, Shipping, Terms (Settings → Policies)

### Commerce
- [ ] Payments enabled (cards + **COD** if offering cash on delivery)
- [ ] Shipping zones/rates for Egypt (and Markets destinations)
- [ ] Taxes / Markets configured; currencies verified
- [ ] Free-shipping threshold in theme settings matches real offer
- [ ] Test add-to-cart → drawer → checkout → place **test order**

### Localization & apps
- [ ] Markets: Arabic (`ar`) enabled for RTL; review `locales/ar.json` copy
- [ ] Language / country selectors verified on storefront
- [ ] Reviews / Instagram apps installed into `@app` blocks if needed
- [ ] Analytics (Shopify + optional GA/Meta) and conversion tracking

### Launch hygiene
- [ ] Redirects for any old React URLs (`/products`, `/contact`, etc.)
- [ ] Password page disabled when going public
- [ ] Mobile + desktop Lighthouse pass; cart and search smoke-tested
- [ ] Social URLs: Instagram `@ivywear.eg`, TikTok `@ivywear.eg`, Linktree

## Design notes

- BEM-style classes (`site-header__`, `contact-panel__`, `customer-card`)
- Logical CSS properties (`margin-inline`, `padding-block`) for RTL
- Fixed header with mobile drawer; predictive search when enabled in settings
- Reference: repo root `DESIGN_SPEC.md`

## Support

Built for IVY Egypt. For Shopify platform docs see [shopify.dev/themes](https://shopify.dev/docs/storefronts/themes).
