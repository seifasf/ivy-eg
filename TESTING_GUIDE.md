# 🧪 IVY E-Commerce - Complete Testing Guide

## ✅ Pre-Testing Checklist

### 1. Backend Server Running
- [ ] Backend running on **http://localhost:5001**
- [ ] MongoDB connected successfully
- [ ] Console shows: "IVY Backend Server is running on port 5001"
- [ ] Console shows: "Connected to MongoDB - IVY Database"

### 2. Frontend Server Running  
- [ ] Frontend running on **http://localhost:5174**
- [ ] No build errors in terminal
- [ ] Browser opens successfully

---

## 🔐 Step 1: Create Admin Account (ONE TIME ONLY)

**Option A: Using Thunder Client / Postman**
```
POST http://localhost:5001/api/admin/signup
Content-Type: application/json

Body:
{
  "fullName": "Admin User",
  "email": "admin@ivy.eg",
  "phone": "+20 100 000 0000",
  "password": "IVY@2025"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "Admin User",
    "email": "admin@ivy.eg",
    "phone": "+20 100 000 0000"
  }
}
```

**✅ Save the token!** You'll need it for the next step.

---

## 🚢 Step 2: Initialize Shipping Fees (ONE TIME ONLY)

**Using Thunder Client / Postman**
```
POST http://localhost:5001/api/governorate-shipping/initialize
Authorization: Bearer YOUR_TOKEN_FROM_STEP_1
```

**Expected Response:**
```json
{
  "message": "Governorate shipping fees initialized successfully",
  "count": 27
}
```

This creates all 27 Egyptian governorates with default shipping fees.

---

## 🎯 Step 3: Test Admin Login

1. Open browser: **http://localhost:5174/admin/login**
2. Enter credentials:
   - **Email:** admin@ivy.eg
   - **Password:** IVY@2025
3. Click **Sign In**

**✅ Expected:** You should be redirected to `/admin/dashboard`

**❌ If it fails:**
- Check browser console (F12) for errors
- Check backend terminal for errors
- Verify admin account was created (Step 1)
- Make sure backend is running on port 5001

---

## 📊 Step 4: Test Dashboard

**What to Check:**
- [ ] Dashboard loads without errors
- [ ] Statistics cards show (may be 0 initially):
  - Total Orders: 0
  - Pending Orders: 0
  - Total Revenue: 0 EGP
  - Total Products: 0
  - Active Promo Codes: 0
  - Total Customers: 0
- [ ] Recent Orders section shows "No orders found" (empty state)
- [ ] **Shipping Fees by Governorate** section shows all 27 governorates
- [ ] Each governorate shows a fee (50-140 EGP)

**Test Shipping Fee Update:**
1. Find "Cairo" (should show 50 EGP)
2. Click "Edit"
3. Change to 60
4. Click ✓ (checkmark)
5. Should show "Saved!" message
6. Fee should update to 60 EGP

**✅ Expected:** Dashboard loads, shows empty stats, shipping fees editable

**❌ If it fails:**
- Check browser console for API errors
- Verify governorate shipping was initialized (Step 2)

---

## 📦 Step 5: Test Products Management

Go to **Products** page from sidebar.

### Test 1: View Empty State
- [ ] Should show "No products found"
- [ ] Should show "Add Your First Product" button

### Test 2: Create a Product
1. Click "Add Product" button
2. Fill in form:
   - **Name:** Premium T-Shirt
   - **Category:** T-Shirts
   - **Description:** High quality cotton t-shirt
   - **Price:** 299
   - **Discount:** 10 (optional)
   - **Discount Type:** Percentage
   - **Stock by Size:**
     - S: 10
     - M: 20
     - L: 30
     - XL: 15
   - **Images:** Click "Add Image" and enter a URL:
     - Example: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400`
   - **Active:** ✅ Checked
3. Click "Add Product"

**⚠️ NOTE:** Image upload with files is available but requires FormData implementation. For testing, we can use image URLs for now.

**✅ Expected:** Product appears in the list with image, pricing, and stock info

### Test 3: Edit Product
1. Click "Edit" on the product
2. Change name to "Premium Cotton T-Shirt"
3. Change price to 349
4. Click "Update Product"

**✅ Expected:** Product updates successfully

### Test 4: Delete Product
1. Click "Delete" on the product
2. Confirm deletion
3. Product should be removed

**❌ If products fail:**
- Image upload requires multipart/form-data
- For now, test without images or use URLs
- Check backend console for errors

---

## 🛒 Step 6: Test Orders Management

Go to **Orders** page from sidebar.

### Test 1: View Empty State
- [ ] Should show "No orders found"
- [ ] Search and filter should be visible

### Test 2: Create Test Order (via Backend API)
**Using Thunder Client / Postman:**
```
POST http://localhost:5001/api/checkout
Content-Type: application/json

Body:
{
  "userInfo": {
    "name": "Test Customer",
    "phone": "+20 100 123 4567",
    "email": "customer@test.com",
    "country": "Egypt",
    "governorate": "Cairo",
    "address": "123 Test Street",
    "apartment": "Apt 5"
  },
  "items": [
    {
      "productId": "673d5f8e9a1b2c3d4e5f6789",
      "title": "Test Product",
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

### Test 3: View Order
1. Refresh Orders page
2. Should see 1 order in the list
3. Click "View Details"
4. Check all information displays correctly

### Test 4: Update Order Status
1. Change status from "pending" to "processing"
2. Status should update with color change

### Test 5: Update Shipping Fee
1. Edit shipping fee from 50 to 60
2. Should update successfully

**✅ Expected:** Orders display, status updates, shipping fee editable

---

## 🎟️ Step 7: Test Promo Codes

Go to **Promo Codes** page from sidebar.

### Test 1: View Empty State
- [ ] Should show "No promo codes yet"
- [ ] Should show "Create Your First Promo Code" button

### Test 2: Create Promo Code
1. Click "Create Promo Code"
2. Fill in form:
   - **Code:** SUMMER20
   - **Discount Type:** Percentage
   - **Discount Value:** 20
   - **Min Order Value:** 500
   - **Max Usage:** 100
   - **Expiry Date:** (Select future date)
   - **Active:** ✅ Checked
3. Should see preview appear
4. Click "Create Code"

**✅ Expected:** Promo code appears in list with:
- Code badge: SUMMER20
- Status: Active (green)
- Discount: 20% OFF
- Min Order: 500 EGP
- Usage: 0 / 100 (with progress bar)

### Test 3: Edit Promo Code
1. Click edit icon
2. Change discount to 25
3. Update successfully

### Test 4: Toggle Active/Inactive
1. Click eye icon (active/inactive toggle)
2. Should change to inactive
3. Click again to reactivate

### Test 5: Delete Promo Code
1. Click delete icon
2. Confirm deletion

**✅ Expected:** All CRUD operations work smoothly

---

## 🧪 Step 8: Test Public Frontend

### Test Products Page
1. Go to **http://localhost:5174/products**
2. Should show "No Products Available - Coming Soon"
   (Until you add products via admin)

### Test Contact Form
1. Go to **http://localhost:5174/contact**
2. Fill in form and submit
3. Should show success message

### Test Cart
1. Go to **http://localhost:5174/cart**
2. Should show empty cart
3. "Return to Home" button should work

---

## ✅ Full Integration Test

### End-to-End Scenario:

1. **Admin creates product:**
   - Login to admin
   - Add product with images, pricing, stock

2. **Admin creates promo code:**
   - Create "FIRSTORDER" - 50 EGP off
   - Min order: 200 EGP

3. **Admin sets shipping fees:**
   - Update Cairo to 50 EGP
   - Update Alexandria to 75 EGP

4. **Customer places order (via API):**
   - Add product to cart
   - Apply promo code "FIRSTORDER"
   - Select Cairo governorate
   - Complete checkout

5. **Admin manages order:**
   - View new order in admin
   - Update status to "processing"
   - Adjust shipping fee if needed

6. **Check dashboard stats:**
   - Total orders: 1
   - Pending orders: 0
   - Total revenue: (order amount)
   - Active promo codes: 1
   - Promo code usage: 1 / (max usage)

---

## 🐛 Common Issues & Fixes

### Issue: Can't login
**Fix:**
- Verify admin account created (Step 1)
- Check email/password match exactly
- Look at browser console (F12) for error messages
- Backend must be running on port 5001

### Issue: Dashboard stats are all 0
**Solution:** This is normal! Stats will populate as you add:
- Products
- Orders
- Promo codes

### Issue: Shipping fees not showing
**Fix:**
- Run initialize endpoint (Step 2)
- Check backend response
- Refresh admin page

### Issue: "CORS error" in browser console
**Fix:**
- Backend CORS is configured for localhost:3000 and localhost:5174
- Should work automatically
- If not, check backend `index.js` CORS settings

### Issue: "401 Unauthorized"
**Fix:**
- Token expired (valid for 7 days)
- Logout and login again
- Check `localStorage.adminToken` in browser DevTools

### Issue: Images not uploading
**Solution:**
- Current implementation uses image URLs
- For file upload, need to implement FormData in frontend
- Can add this feature next

---

## 📊 Expected Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | ✅ Should work | JWT authentication |
| Dashboard Stats | ✅ Shows 0 initially | Populates with data |
| Shipping Fees | ✅ All 27 governorates | Editable inline |
| Products CRUD | ⚠️ URLs only | File upload needs FormData |
| Orders Management | ✅ Full CRUD | Test via API first |
| Promo Codes | ✅ Full CRUD | Validation works |
| Public Frontend | ⏳ Shows empty | Needs products |

---

## 🎉 Success Criteria

You can consider the integration **successful** if:

- ✅ Admin can login with backend credentials
- ✅ Dashboard loads and shows statistics (even if 0)
- ✅ All 27 governorate shipping fees display and are editable
- ✅ Can create/view/edit/delete promo codes
- ✅ Can view orders (once created via API)
- ✅ Can update order status and shipping fees
- ✅ No console errors (except expected "no data" scenarios)

---

## 📝 Next Steps After Testing

Once basic testing is complete:

1. **Implement Image Upload:**
   - Update Products.jsx to use FormData
   - Test file uploads
   
2. **Public Checkout Integration:**
   - Update Checkout.jsx to use backend API
   - Test promo code validation
   - Test shipping fee calculation

3. **Connect Public Products:**
   - Fetch products from backend
   - Display in products page
   - Enable add to cart

4. **Production Deployment:**
   - Update CORS for production URL
   - Set environment variables
   - Deploy backend and frontend

---

**Ready to test! Start with Step 1 if you haven't created an admin account yet. 🚀**

