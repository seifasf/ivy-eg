# 🚀 IVY E-Commerce - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Start Backend (Terminal 1)
```bash
cd /Users/mac/Desktop/ivy-backend1
npm start
```
✅ Wait for: "IVY Backend Server is running on port 5001"  
✅ Wait for: "Connected to MongoDB - IVY Database"

---

### Step 2: Create Admin Account (One Time)
Use Postman, Thunder Client, or curl:

```bash
POST http://localhost:5001/api/admin/signup
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@ivy.eg",
  "phone": "+20 100 000 0000",
  "password": "IVY@2025"
}
```

**Response:** You'll get a token and user data. **Save the token!**

---

### Step 3: Initialize Shipping Fees (One Time)
```bash
POST http://localhost:5001/api/governorate-shipping/initialize
Authorization: Bearer YOUR_TOKEN_FROM_STEP_2
```

✅ This creates all 27 Egyptian governorates with default shipping fees.

---

### Step 4: Start Frontend (Terminal 2)
```bash
cd /Users/mac/Documents/GitHub/ivy-eg
npm run dev
```
✅ Opens on http://localhost:5174

---

### Step 5: Login to Admin Dashboard
1. Go to: **http://localhost:5174/admin/login**
2. Email: `admin@ivy.eg`
3. Password: `IVY@2025`
4. Click **Sign In**

---

## 🎯 What You Can Do Now

### ✅ Dashboard
- View statistics (orders, revenue, products, promo codes, customers)
- See recent orders
- **Manage shipping fees for all 27 governorates** ⭐

### ✅ Orders
- View all orders
- Update order status (pending → processing → shipped → delivered)
- Update shipping fees
- Delete orders

### ✅ Products
- Create products with images
- Edit products
- Delete products
- Toggle active/inactive

### ✅ Promo Codes ⭐ NEW
- Create discount codes (percentage or fixed amount)
- Set min order value, max usage, expiry date
- Toggle active/inactive
- Track usage

### ✅ Settings
- Store information
- Email configuration
- Shipping management

---

## 📝 Backend API Base URL

```
http://localhost:5001/api
```

**All admin endpoints require:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 🔑 Key Features Added

### 1. **Promo Codes System**
- Full CRUD operations
- Public validation endpoint for checkout
- Auto-tracks usage
- Validates expiry and min order

### 2. **Dashboard Statistics**
- Total orders & revenue
- Pending orders count
- Active promo codes
- Total products & customers

### 3. **Governorate Shipping**
- All 27 Egyptian governorates
- Custom fees per governorate
- Update individually or in bulk

### 4. **Enhanced Orders**
- 5 status options (pending, processing, shipped, delivered, cancelled)
- Shipping fee tracking
- Promo code tracking

---

## 🐛 Troubleshooting

### Backend won't start?
- Check MongoDB is running
- Verify `.env` file exists with `MONGO_URL`

### Frontend can't connect?
- Backend must be running on port 5001
- Check console for error messages

### Can't login?
- Make sure you created admin account (Step 2)
- Check email/password match exactly
- Look at browser console for errors

### Governorate shipping not showing?
- Run the initialize endpoint (Step 3)
- Check backend response for success

---

## 📂 Project Structure

```
ivy-backend1/                 (Backend)
├── model/
│   ├── promocode.model.js           ⭐ NEW
│   ├── governorate-shipping.model.js ⭐ NEW
│   └── checkout.model.js            ✏️ UPDATED
├── controllers/
│   ├── promocode.controller.js      ⭐ NEW
│   ├── dashboard.controller.js      ⭐ NEW
│   ├── governorate-shipping.controller.js ⭐ NEW
│   └── checkout.controller.js       ✏️ UPDATED
├── routes/
│   ├── promocode.route.js           ⭐ NEW
│   ├── dashboard.route.js           ⭐ NEW
│   ├── governorate-shipping.route.js ⭐ NEW
│   └── checkout.route.js            ✏️ UPDATED
└── middleware/
    └── promocode.validation.js      ⭐ NEW

ivy-eg/                       (Frontend)
├── src/
│   ├── services/
│   │   └── api.js                   ✏️ UPDATED
│   ├── context/
│   │   └── AdminContext.jsx         ✏️ UPDATED
│   └── pages/admin/
│       ├── Dashboard.jsx            ✏️ READY
│       ├── Orders.jsx               ✏️ READY
│       ├── Products.jsx             ✏️ READY
│       ├── PromoCodes.jsx           ✏️ READY
│       └── AdminLogin.jsx           ✏️ UPDATED
```

---

## ✅ Everything is Ready!

Your backend has been **fully extended** with:
- ✅ Promo codes system
- ✅ Dashboard statistics
- ✅ Governorate shipping (27 governorates)
- ✅ Enhanced order management
- ✅ JWT authentication
- ✅ All admin middleware protection

Your frontend is **integrated and ready** to:
- ✅ Authenticate with backend
- ✅ Manage all features
- ✅ Show real-time data

---

**Start building your IVY e-commerce empire! 🎉**

For detailed API documentation, see `INTEGRATION_COMPLETE.md` in both frontend and backend folders.

