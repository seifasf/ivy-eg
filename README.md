# IVY - Premium E-commerce for Sporty Men

A high-end, modern e-commerce website targeting premium sporty men (A, B, S class). Built with React, featuring a sleek dark theme with electric blue and gold accents.

## 🎯 Target Audience
- **Demographic**: Athletic, sporty men
- **Class**: Premium (A, B, S class)
- **Style**: Modern, sophisticated, performance-oriented

## ✨ Features

- 🎨 **Premium Dark Design** - Sleek black theme with electric blue and gold accents
- ⚡ **Smooth Animations** - High-performance transitions and effects
- 🛍️ **Shopping Cart** - Full cart functionality with state management
- 📧 **Email Notifications** - Order confirmation emails via EmailJS
- 🇪🇬 **Egypt-Ready** - All Egyptian governorates for checkout
- 📱 **Fully Responsive** - Perfect on all devices
- 🎮 **Interactive Product Showcase** - Dynamic product display with smooth transitions

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The site will be available at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📧 Email Setup (Optional)

To enable order confirmation emails:

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Set up an email service (Gmail recommended)
3. Create an email template with these variables:
   - `{{customer_name}}`
   - `{{customer_email}}`
   - `{{customer_phone}}`
   - `{{governorate}}`
   - `{{city}}`
   - `{{address}}`
   - `{{order_items}}`
   - `{{order_total}}`
   - `{{order_date}}`
   - `{{notes}}`

4. Update `/src/services/emailService.js` with your credentials:
   ```javascript
   const EMAILJS_CONFIG = {
     serviceId: 'YOUR_SERVICE_ID',
     templateId: 'YOUR_TEMPLATE_ID',
     publicKey: 'YOUR_PUBLIC_KEY'
   }
   ```

### Email Template Example

```
Subject: Order Confirmation - IVY

Hello {{customer_name}},

Thank you for your order! Your order will reach you as fast as possible!

ORDER DETAILS:
{{order_items}}

TOTAL: {{order_total}}

DELIVERY ADDRESS:
{{address}}, {{city}}, {{governorate}}
Phone: {{customer_phone}}

We'll contact you shortly to confirm delivery details.

Best regards,
The IVY Team
```

## 🎨 Design System

### Colors
- **Midnight Black**: `#0d0d0d` - Primary background
- **Charcoal**: `#1a1a1a` - Secondary background
- **Electric Blue**: `#00d4ff` - Primary accent
- **Neon Blue**: `#00aaff` - Secondary accent
- **Gold**: `#fbbf24` - Premium accent
- **Amber**: `#f59e0b` - Premium highlight

### Typography
- **Headings**: Rajdhani (Bold, Sport-inspired)
- **Body**: Inter (Clean, Modern)

## 📁 Project Structure

```
ivy-eg/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation header
│   │   ├── Footer.jsx         # Site footer
│   │   └── Cart.jsx           # Shopping cart sidebar
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Products.jsx       # Product catalog
│   │   ├── Contact.jsx        # Contact form
│   │   └── Checkout.jsx       # Checkout process
│   ├── context/
│   │   └── CartContext.jsx    # Cart state management
│   ├── services/
│   │   └── emailService.js    # Email functionality
│   └── App.jsx                # Main app component
├── package.json
└── vite.config.js
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **React Icons** - Icon library
- **EmailJS** - Email service integration
- **CSS3** - Styling with animations

## 🌟 Key Features

### Shopping Cart
- Add/remove items
- Quantity management
- Persistent storage (localStorage)
- Real-time total calculation
- Smooth animations

### Checkout
- Full customer information form
- Egyptian governorate selection
- Phone number validation (Egyptian format)
- Email confirmation
- Order success screen

### Product Showcase
- Auto-rotating product display
- Manual navigation
- Smooth 3D transitions
- Icon-based product representation
- Quick view modal

## 📱 Pages

1. **Home** - Hero section with product showcase
2. **Products** - Full catalog with category filtering
3. **Contact** - Contact form with business information
4. **Checkout** - Complete order process

## 🔧 Development

### Adding New Products

Edit `/src/pages/Products.jsx`:

```javascript
const allProducts = [
  {
    id: 1,
    name: "Product Name",
    description: "Description",
    price: "$299",
    category: "Category",
    icon: IconComponent  // From react-icons/io5
  },
  // Add more products...
]
```

### Customizing Colors

Edit `/src/index.css` CSS variables:

```css
:root {
  --midnight: #0d0d0d;
  --electric-blue: #00d4ff;
  --gold: #fbbf24;
  /* etc... */
}
```

## 📄 License

Copyright © 2025 IVY. All rights reserved.

## 🤝 Support

For issues or questions, contact: ivyforhelp@gmail.com

---

**Built with precision for the modern athletic gentleman.** 💪⚡
