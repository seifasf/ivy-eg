# Backend Integration Guide

## Status: Ready for Integration ✅

All dummy data has been removed from the admin dashboard. The frontend is now ready to connect to your backend API.

---

## What I Did

### 1. Removed All Mock Data
- ✅ Dashboard: Removed mock stats and recent orders
- ✅ Orders: Removed mock orders array
- ✅ Products: Removed mock products
- ✅ Promo Codes: Removed mock promo codes
- ✅ All pages now show empty states until connected to backend

### 2. Created API Service Layer
**File:** `src/services/api.js`

This centralizes all API calls with:
- Base URL configuration
- Authentication token handling
- Error handling
- Organized endpoints for all features

---

## Backend Requirements

### Expected API Endpoints

#### Authentication
```
POST /api/admin/login
  Body: { email, password }
  Response: { token, user: { name, email } }

POST /api/admin/logout
  Headers: { Authorization: Bearer <token> }

GET /api/admin/me
  Headers: { Authorization: Bearer <token> }
  Response: { name, email, role }
```

#### Dashboard
```
GET /api/admin/stats
  Response: {
    totalOrders: number,
    pendingOrders: number,
    totalRevenue: number,
    totalProducts: number,
    activePromoCodes: number,
    totalCustomers: number
  }

GET /api/admin/recent-orders
  Response: [{
    id: string,
    customer: string,
    items: number,
    total: number,
    status: string,
    date: string
  }]
```

#### Orders
```
GET /api/admin/orders
  Response: [Order]

GET /api/admin/orders/:id
  Response: Order

PATCH /api/admin/orders/:id/status
  Body: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }

DELETE /api/admin/orders/:id
```

**Order Object:**
```javascript
{
  id: string,
  customer: {
    name: string,
    email: string,
    phone: string,
    address: string,
    governorate: string
  },
  products: [{
    name: string,
    quantity: number,
    price: number,
    selectedSize?: string
  }],
  total: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentMethod: 'Cash on Delivery' | 'Telda' | 'InstaPay',
  promoCode?: string,
  date: string,
  createdAt: string
}
```

#### Products
```
GET /api/admin/products
  Response: [Product]

POST /api/admin/products
  Body: Product

PATCH /api/admin/products/:id
  Body: Partial<Product>

DELETE /api/admin/products/:id

PATCH /api/admin/products/:id/toggle-active
```

**Product Object:**
```javascript
{
  id: string | number,
  name: string,
  description: string,
  price: number,
  discount: number,
  discountType: 'percentage' | 'fixed',
  category: string,
  stock: {
    S: number,
    M: number,
    L: number,
    XL: number
  },
  images: string[],
  active: boolean,
  createdAt?: string,
  updatedAt?: string
}
```

#### Promo Codes
```
GET /api/admin/promo-codes
  Response: [PromoCode]

POST /api/admin/promo-codes
  Body: PromoCode

PATCH /api/admin/promo-codes/:id
  Body: Partial<PromoCode>

DELETE /api/admin/promo-codes/:id

PATCH /api/admin/promo-codes/:id/toggle-active

POST /api/promo-codes/validate (Public)
  Body: { code: string, orderTotal: number }
  Response: { valid: boolean, discount: number }
```

**PromoCode Object:**
```javascript
{
  id: string | number,
  code: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  minOrderValue: number,
  maxUsage: number,
  currentUsage: number,
  expiryDate: string,
  active: boolean,
  createdAt?: string
}
```

#### Settings
```
GET /api/admin/settings
  Response: {
    shipping: {
      baseShippingFee: number,
      freeShippingThreshold: number,
      egyptGovernoratesFees: { [governorate: string]: number }
    },
    store: {
      storeName: string,
      email: string,
      phone: string
    },
    email: {
      serviceId: string,
      templateId: string,
      publicKey: string
    }
  }

PATCH /api/admin/settings/shipping
  Body: { baseShippingFee?, freeShippingThreshold?, egyptGovernoratesFees? }

PATCH /api/admin/settings/store
  Body: { storeName?, email?, phone? }

PATCH /api/admin/settings/email
  Body: { serviceId?, templateId?, publicKey? }

GET /api/admin/settings/shipping-fees
  Response: { [governorate: string]: number }

PATCH /api/admin/settings/shipping-fees
  Body: { governorate: string, fee: number }
```

#### Public Endpoints (Frontend)
```
GET /api/products
  Response: [Product] (only active products)

GET /api/products/:id

GET /api/products/category/:category

POST /api/orders (Checkout)
  Body: {
    customer: { name, email, phone, address, governorate },
    products: [{ productId, quantity, selectedSize, price }],
    total: number,
    paymentMethod: string,
    promoCode?: string
  }

POST /api/contact
  Body: { name, email, message }
```

---

## Egyptian Governorates List

Your backend should support these 27 governorates:
```javascript
[
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia',
  'Dakahlia', 'Beheira', 'Gharbia', 'Monufia', 'Kafr El Sheikh',
  'Damietta', 'Port Said', 'Ismailia', 'Suez', 'North Sinai',
  'South Sinai', 'Minya', 'Asyut', 'Sohag', 'Qena',
  'Luxor', 'Aswan', 'Red Sea', 'New Valley', 'Matrouh',
  'Fayoum', 'Beni Suef'
]
```

---

## Environment Variables

Create a `.env` file in the frontend root:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

Update based on your backend URL.

---

## Next Steps

1. **Add your backend folder to the workspace**
2. **I will read and analyze the backend structure**
3. **I will update the API service to match your endpoints**
4. **I will integrate all frontend pages with the backend**
5. **I will add any missing backend endpoints if needed**
6. **I will test the complete integration**

---

## Current Frontend Structure

```
src/
├── services/
│   └── api.js (Ready for your backend)
├── context/
│   ├── AdminContext.jsx (Auth management)
│   └── CartContext.jsx (Cart state)
├── pages/
│   ├── admin/
│   │   ├── Dashboard.jsx (Empty, waiting for API)
│   │   ├── Orders.jsx (Empty, waiting for API)
│   │   ├── Products.jsx (Empty, waiting for API)
│   │   ├── PromoCodes.jsx (Empty, waiting for API)
│   │   └── Settings.jsx (Empty, waiting for API)
│   ├── Home.jsx
│   ├── Products.jsx (Public products page)
│   ├── Contact.jsx
│   ├── CartPage.jsx
│   └── Checkout.jsx
└── components/
    ├── Header.jsx
    ├── Footer.jsx
    └── admin/ (Admin components)
```

---

## Ready to Integrate! 🚀

Once you add the backend folder to the workspace, I will:
- Analyze the backend structure and routes
- Match the API calls to your endpoints
- Add any missing backend functionality
- Connect everything seamlessly
- Test the full integration

**Waiting for your backend folder...**

