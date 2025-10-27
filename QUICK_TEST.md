# 🚀 Quick Testing Guide - IVY E-Commerce

## ✅ Servers Status
- **Backend:** http://localhost:5001
- **Frontend:** http://localhost:5174 (or 5173)
- **MongoDB:** Atlas Cloud (Connected)

---

## 🔐 STEP 1: Create Admin Account (FIRST TIME ONLY)

**Use Thunder Client or Postman:**

```
POST http://localhost:5001/api/admin/signup
Content-Type: application/json

{
  "fullName": "IVY Admin",
  "email": "admin@ivy.eg",
  "phone": "+20 100 000 0000",
  "password": "IVY@2025"
}
```

**✅ Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "xxx",
    "fullName": "IVY Admin",
    "email": "admin@ivy.eg",
    "phone": "+20 100 000 0000"
  }
}
```

**📝 SAVE THIS TOKEN!** You'll need it for Step 2.

---

## 🚢 STEP 2: Initialize Shipping (FIRST TIME ONLY)

```
POST http://localhost:5001/api/governorate-shipping/initialize
Authorization: Bearer YOUR_TOKEN_FROM_STEP_1
```

**✅ Expected:** Creates all 27 Egyptian governorates with shipping fees

---

## 🎯 STEP 3: Login to Admin Dashboard

1. Open: **http://localhost:5174/admin/login**
2. Login with:
   - **Email:** admin@ivy.eg
   - **Password:** IVY@2025
3. Click **Sign In**

**✅ You should see the Dashboard!**

---

## 📦 STEP 4: Test Adding Products

1. Click **Products** in sidebar
2. Click **Add Product** button
3. Fill in the form:

   **Basic Info:**
   - Name: `Premium T-Shirt`
   - Category: `T-Shirts`
   - Description: `High quality cotton t-shirt for everyday wear`

   **Pricing:**
   - Price: `299`
   - Discount: `10`
   - Discount Type: `Percentage`

   **Stock by Size:**
   - S: `10`
   - M: `20`
   - L: `30`
   - XL: `15`

   **Images:**
   - Click "Add Image"
   - Paste URL: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400`
   - (Can add more images)

   **Active:** ✅ Checked

4. Click **Add Product**

**✅ Product should appear in the list!**

### Add More Products (Optional):
Repeat with:
- `Sports Hoodie` - Category: `Hoodies` - Price: `599`
- `Casual Jacket` - Category: `Jackets` - Price: `799`

---

## 🛒 STEP 5: Test Making an Order

**Option A: Via API (Postman/Thunder Client)**

```
POST http://localhost:5001/api/checkout
Content-Type: application/json

{
  "userInfo": {
    "name": "Ahmed Mohamed",
    "phone": "+20 100 123 4567",
    "email": "customer@test.com",
    "country": "Egypt",
    "governorate": "Cairo",
    "address": "123 Test Street, Nasr City",
    "apartment": "Apt 5",
    "notes": "Please call before delivery"
  },
  "items": [
    {
      "productId": "PASTE_YOUR_PRODUCT_ID_HERE",
      "title": "Premium T-Shirt",
      "price": 299,
      "mainImage": "test.jpg",
      "quantity": 2,
      "size": "M"
    }
  ],
  "paymentMethod": "cash-on-delivery",
  "total": 598,
  "shippingFee": 50,
  "promoCode": ""
}
```

**How to get Product ID:**
- Go to Products page in admin
- Open browser DevTools (F12)
- Look at the product data (or check MongoDB)

**Option B: Via Public Frontend (If products are connected)**
1. Go to http://localhost:5174/products
2. Add product to cart
3. Go to checkout
4. Fill in details
5. Complete order

---

## 🎟️ STEP 6: Test Promo Codes

1. Go to **Promo Codes** page
2. Click **Create Promo Code**
3. Fill in:
   - Code: `SUMMER20`
   - Discount Type: `Percentage`
   - Discount Value: `20`
   - Min Order Value: `500`
   - Max Usage: `100`
   - Expiry Date: (Future date)
   - Active: ✅
4. Click **Create Code**

**Test validation:**
```
POST http://localhost:5001/api/promocodes/validate
Content-Type: application/json

{
  "code": "SUMMER20",
  "orderTotal": 600
}
```

**✅ Should return discount amount**

---

## 📊 STEP 7: Test Dashboard Features

### Update Shipping Fees:
1. Go to **Dashboard**
2. Scroll to "Shipping Fees by Governorate"
3. Find "Cairo" (shows 50 EGP)
4. Click "Edit"
5. Change to `60`
6. Click ✓
7. Should show "Saved!" message

### View Statistics:
- Total Orders: Should show your test orders
- Total Products: Should show products you added
- Active Promo Codes: Should show 1
- Total Revenue: Should calculate from delivered orders

---

## 📋 STEP 8: Test Order Management

1. Go to **Orders** page
2. Should see your test order(s)
3. Click **View Details** on an order
4. Check all info displays correctly

**Test Status Update:**
1. Change status dropdown from "pending" to "processing"
2. Status should update with color change

**Test Shipping Fee Update:**
1. Edit shipping fee field
2. Change from 50 to 60
3. Should update successfully

---

## ✅ Quick Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 5174
- [ ] Admin account created
- [ ] Shipping fees initialized
- [ ] Can login to admin dashboard
- [ ] Dashboard loads with stats
- [ ] Can add products (with images via URL)
- [ ] Can create promo codes
- [ ] Can create orders (via API)
- [ ] Can view orders in admin
- [ ] Can update order status
- [ ] Can update shipping fees in dashboard
- [ ] No console errors (F12 in browser)

---

## 🐛 Quick Troubleshooting

### Can't Login?
- Check browser console (F12) for errors
- Verify admin account created (Step 1)
- Backend must be running on port 5001

### Products Not Showing?
- Check if you added products in admin
- Look for errors in browser console
- Verify backend API calls working

### Orders Not Appearing?
- Must create orders via API first (Step 5)
- Refresh the Orders page
- Check backend logs for errors

### Shipping Fees Not Loading?
- Must run initialize endpoint (Step 2)
- Refresh dashboard
- Check backend response

---

## 🎉 Testing Complete!

If all steps work, your integration is **100% successful!**

**What Works:**
✅ JWT Authentication
✅ Dashboard Statistics
✅ Products Management (URL images)
✅ Orders Management
✅ Promo Codes System
✅ Governorate Shipping (27 governorates)

**Next Steps:**
- Add file upload for product images
- Connect public frontend to products
- Test checkout flow with promo codes
- Deploy to production!

---

**Need Help?**
- Check browser console (F12)
- Check backend terminal logs
- All error messages are detailed

**Ready to launch IVY! 🚀**

