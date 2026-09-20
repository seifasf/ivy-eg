# IVY Design Spec (Source → Shopify Theme)

Extracted from the existing React storefront (`src/`) so the Shopify Online Store 2.0 theme matches brand and UX.

## Brand

| Token | Value |
|--------|--------|
| Name | **IVY** |
| Tagline | Your Everyday Wingman |
| Audience | Premium sporty men (A/B/S), Egypt-ready |
| Tone | Confident, minimal, uppercase accents, sparse copy |
| Logo | `IMGs/IVY-03.png` (white / inverted on black) |
| Social | Instagram `@ivywear.eg`, TikTok `@ivywear.eg`, Linktree `linktr.ee/ivyeg` |

## Design tokens

### Color

| Token | Hex | Use |
|--------|-----|-----|
| `--color-background` | `#000000` | Page background |
| `--color-surface` | `#0a0a0a` | Section / elevated bg |
| `--color-surface-2` | `#1a1a1a` | Cards, panels |
| `--color-foreground` | `#ffffff` | Primary text / icons |
| `--color-foreground-muted` | `#b0b0b0` | Secondary text |
| `--color-border` | `#333333` | Dividers, card borders |
| `--color-border-subtle` | `rgba(255,255,255,0.1)` | Header / soft borders |
| `--color-button` | `#ffffff` | Primary button fill |
| `--color-button-text` | `#000000` | Primary button text |
| `--color-button-outline` | `#ffffff` | Ghost / outline buttons |
| `--color-success` | `#4ade80` | In stock |
| `--color-warning` | `#fbbf24` | Low stock |
| `--color-error` | `#ff4757` | Errors / sale accents |

Accent in the live app is high-contrast black/white (not blue/gold despite README marketing copy). Theme follows **actual CSS**: monochrome premium.

### Typography

| Token | Value |
|--------|--------|
| Font family | Inter (400/500/600/700) via Shopify font picker + Google fallback |
| Body size | `1rem` / line-height `1.6` |
| Nav | `0.9rem`, weight 600, uppercase, letter-spacing `2px` |
| Section title | `2–2.5rem`, weight 700 |
| Hero slogan | `1–1.5rem`, uppercase, letter-spacing `0.3rem` |
| Price | `1.15–2rem`, weight 700 |

### Spacing & layout

| Token | Value |
|--------|--------|
| Page max | `1200px` content / `1600px` header |
| Section padding | `4–6rem` desktop, `2–2.5rem` mobile |
| Header offset | `~110px` desktop, `~88–92px` mobile |
| Gap scale | `0.5 / 0.75 / 1 / 1.5 / 2 / 2.5 / 3rem` |
| Container pad | `1.25–3rem` horizontal |

### Radii & shadows

| Token | Value |
|--------|--------|
| Radius sm | `4px` (buttons secondary, arrows) |
| Radius md | `8px` (cards, inputs) |
| Radius lg | `12px` (panels, empty states) |
| Radius pill | `50px` / `9999px` (hero CTA, contact outline) |
| Radius circle | `50%` (cart icon, social) |
| Shadow header scrolled | `0 4px 20px rgba(0,0,0,0.5)` |
| Shadow CTA | `0 10px 30px rgba(255,255,255,0.1)` |
| Backdrop | `blur(10px)` on fixed header |

### Breakpoints

| Name | Max-width |
|------|-----------|
| xs | `375px` |
| sm | `480px` |
| md | `768px` |
| lg | `968px` |
| xl | `1024px` |

Mobile-first CSS; major layout switch at `768px` (hamburger) and `968px` (nav density).

## Screens & components

### Header
- Fixed, translucent black + blur, border-bottom subtle white
- Desktop: left nav (Home, Products) · center logo · right nav (Contact) + account + cart
- Scroll > 50px: tighter padding, stronger bg, smaller logo
- Cart: circular/square outline icon + white badge count
- Mobile: hamburger | logo | cart; slide-in drawer (75% / max 320px) with numbered links

### Hero
- Full viewport minus header; radial soft highlight; large logo; slogan with hairline rules; pill “Explore Collection” CTA (fill → invert on hover)

### Featured products
- Centered title + muted subtitle
- Showcase carousel (arrows + pill indicators) OR empty “Coming Soon” panel
- Card: surface-2, border, centered media, name, description, price, primary + secondary actions

### Contact strip / page
- Dark panels, icon boxes (white fill / black icon), outline social circles, pill/square CTAs
- Form: dark inputs, white submit

### Cart
- Line items on surface-2 cards; empty state circular icon well; uppercase return CTA
- Quantity steppers; sticky summary on larger screens

### Footer
- Centered logo, slogan, social icons, “Contact Us” pill outline, copyright

### Motion
- `fadeInScale`, `fadeInUp` on hero (1.2s, staggered)
- Hover: `translateY(-2/-3px)`, letter-spacing widen on nav, fill invert on buttons
- Drawer: `cubic-bezier(0.4, 0, 0.2, 1)` 0.3s
- Respect `prefers-reduced-motion`

### Icons
- Heroicons-style outline (cart, menu, mail, user, arrows)
- Brand socials: Instagram, TikTok, Linktree

## Copy bank (EN defaults)

- Slogan: Your Everyday Wingman  
- Hero CTA: Explore Collection  
- Featured: Featured Products / Handpicked selections for the discerning individual  
- Contact: Get In Touch / Have questions? We're here to help you find what you need. / Send Us a Message / Contact Us  
- Empty products: No Products Available / Coming Soon  
- Empty cart: (return home CTA pattern)

Arabic (`ar`) locale mirrors all strings; `dir="rtl"` via Shopify locale / Markets.

## Theme mapping (high level)

| Source UX | Theme section / snippet |
|-----------|-------------------------|
| Header + mobile menu | `header`, `header-drawer` |
| Hero | `hero`, `slideshow`, `video-hero` |
| Featured showcase | `featured-collection`, `featured-product` |
| Contact block | `rich-text`, `newsletter`, `contact-form` page |
| Footer | `footer` |
| Products grid | `main-collection`, `product-card` |
| Cart page / drawer | `main-cart`, `cart-drawer` |
| Checkout notes / COD | cart note + payment icons + dynamic checkout |

## File tree plan

```
theme/
  layout/          theme.liquid, password.liquid
  templates/       JSON templates (index, product, collection, cart, …)
  templates/customers/
  sections/        ~40 merchant sections
  snippets/        product-card, price, icons, breadcrumbs, …
  assets/          base.css, components, theme.js (ES modules)
  config/          settings_schema.json, settings_data.json
  locales/         en.default.json, ar.json (+ schema locales)
```
