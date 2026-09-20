# 🔐 Google OAuth Setup Guide

## Overview
The IVY e-commerce website now supports Google OAuth authentication, allowing users to sign in with their Google account and track their order history.

---

## 🚀 Features

1. **Google Sign-In** - Users can sign in with their Google account
2. **Order History** - Users can view all their past orders
3. **User Profile** - User information displayed in header
4. **Automatic Order Linking** - Orders are automatically linked to user accounts

---

## 📋 Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services**)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5174` (development)
   - `http://localhost:5173` (alternative dev port)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Add authorized redirect URIs:
   - `http://localhost:5174` (development)
   - Your production domain
8. Copy the **Client ID**

### 2. Configure Frontend

Create or update `.env` file in the frontend root:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 3. Backend Configuration

The backend automatically handles Google OAuth authentication. No additional configuration needed.

---

## 🎯 How It Works

### User Flow

1. **User clicks "Sign in with Google"** in the header
2. **Google OAuth popup** appears
3. **User selects Google account** and grants permissions
4. **Frontend receives JWT token** from Google
5. **Frontend sends user data to backend** (`/api/users/google-auth`)
6. **Backend creates/updates user** and returns JWT token
7. **User is logged in** and can view order history

### Order Linking

- When a user is **logged in** and places an order, the order is automatically linked to their account
- Users can view all their orders in the **"Track Orders"** page
- Orders placed **without login** are not linked (guest checkout still works)

---

## 📁 Files Modified/Created

### Backend

1. **`model/user.model.js`**
   - Added `googleId` field
   - Made `password` optional (for Google OAuth users)
   - Added `picture` field

2. **`model/checkout.model.js`**
   - Added `userId` field to link orders to users

3. **`controllers/user.controller.js`**
   - Added `googleAuth()` function
   - Added `getUserOrders()` function

4. **`controllers/checkout.controller.js`**
   - Updated to save `userId` when user is logged in

5. **`routes/user.route.js`**
   - Added `/google-auth` endpoint
   - Added `/orders/my-orders` endpoint

### Frontend

1. **`src/context/UserContext.jsx`** (NEW)
   - Manages user authentication state
   - Handles Google OAuth login
   - Stores user token and data

2. **`src/pages/TrackOrders.jsx`** (NEW)
   - Displays user's order history
   - Shows order details, status, items

3. **`src/pages/TrackOrders.css`** (NEW)
   - Styles for Track Orders page

4. **`src/components/Header.jsx`**
   - Added Google Sign-In button
   - Added user menu with profile and logout
   - Shows user avatar when logged in

5. **`src/components/Header.css`**
   - Added styles for user menu

6. **`src/pages/Checkout.jsx`**
   - Updated to send `userId` when user is logged in

7. **`src/services/api.js`**
   - Added `userAPI` with Google auth and orders endpoints
   - Updated `apiCall` to use user token

8. **`src/App.jsx`**
   - Wrapped app with `GoogleOAuthProvider`
   - Added `UserProvider`
   - Added `/track-orders` route

---

## 🔧 API Endpoints

### POST `/api/users/google-auth`
Authenticate user with Google OAuth data.

**Request Body:**
```json
{
  "googleId": "123456789",
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://..."
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "fullName": "John Doe",
    "email": "user@gmail.com",
    "phone": "",
    "picture": "https://..."
  }
}
```

### GET `/api/users/orders/my-orders`
Get all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <user-token>
```

**Response:**
```json
[
  {
    "_id": "order-id",
    "userId": "user-id",
    "userInfo": {...},
    "items": [...],
    "total": 500,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 🎨 User Interface

### Header
- **Not Logged In:** Shows "Sign in with Google" button
- **Logged In:** Shows user avatar with dropdown menu
  - User name and email
  - "My Orders" link
  - "Sign Out" button

### Track Orders Page
- Shows all user orders
- Order details include:
  - Order ID
  - Date
  - Status (with icons)
  - Items with images
  - Total amount
  - Delivery address

---

## ✅ Testing

1. **Start Backend:**
   ```bash
   cd /Users/mac/Desktop/ivy-backend1
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd /Users/mac/Documents/GitHub/ivy-eg
   npm run dev
   ```

3. **Test Google Sign-In:**
   - Click "Sign in with Google" in header
   - Select Google account
   - Verify user menu appears

4. **Test Order History:**
   - Place an order while logged in
   - Go to "My Orders" or "/track-orders"
   - Verify order appears in list

---

## 🔒 Security Notes

- Google OAuth tokens are handled securely by Google
- User JWT tokens are stored in `localStorage`
- Backend validates tokens on protected routes
- User data is only accessible to the authenticated user

---

## 📝 Environment Variables

### Frontend `.env`
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001
```

---

## 🐛 Troubleshooting

### Google Sign-In Not Working
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify authorized origins in Google Console match your domain
- Check browser console for errors

### Orders Not Showing
- Ensure user is logged in when placing order
- Check that backend is running
- Verify JWT token is being sent in requests

### User Menu Not Appearing
- Check that `UserProvider` wraps the app
- Verify `useUser` hook is being used correctly
- Check browser console for errors

---

**Last Updated:** Google OAuth integration complete ✅

