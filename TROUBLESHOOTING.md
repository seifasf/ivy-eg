# 🔧 Troubleshooting: Data Not Retrieved from Database

## Quick Diagnosis

I've added **comprehensive logging** to help identify the issue. Check your browser console for detailed logs.

---

## 🔍 Step-by-Step Diagnosis

### 1. **Check Browser Console**

Open your browser's Developer Tools (F12) and check the Console tab. You should see logs like:

```
[API Call] GET http://localhost:5001/api/products
[API Response] 200 OK for /products
[API Success] /products: 5 items
[Products] Received data: [...]
```

**What to look for:**
- ❌ **Network errors** → Backend not running or wrong URL
- ❌ **404 errors** → Wrong endpoint
- ❌ **CORS errors** → Backend CORS not configured
- ❌ **500 errors** → Backend/database issue
- ❌ **Timeout errors** → Backend not responding

### 2. **Check Backend is Running**

```bash
# Check if backend is running
curl http://localhost:5001/api/products

# Should return JSON data or an error message
```

**If backend is not running:**
```bash
cd /Users/mac/Desktop/ivy-backend1
npm start
```

### 3. **Check API URL Configuration**

The frontend uses:
- Default: `http://localhost:5001/api`
- Can be overridden with `.env` file

**Create `.env` file in frontend root:**
```env
VITE_API_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001
```

### 4. **Clear Cache**

The cache might be returning stale/empty data. Use the debug utility:

**In browser console:**
```javascript
// Clear all cache
window.debugCache.clearAllCache()

// Check API health
window.debugCache.checkAPIHealth()
```

Or manually:
```javascript
localStorage.clear()
location.reload()
```

### 5. **Check Database Connection**

Verify backend is connected to MongoDB:

**Backend console should show:**
```
Connected to MongoDB - IVY Database
```

**If not connected:**
- Check `.env` file in backend
- Verify `MONGO_URL` is correct
- Check MongoDB is running/accessible

### 6. **Check CORS Configuration**

Backend should allow frontend origin. Check `ivy-backend1/index.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    // ... your frontend URL
  ],
  credentials: true
}))
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Network error" or "Failed to fetch"

**Cause:** Backend not running or wrong URL

**Solution:**
1. Start backend: `cd /Users/mac/Desktop/ivy-backend1 && npm start`
2. Verify backend URL in frontend `.env`
3. Check backend is listening on port 5001

### Issue 2: "404 Not Found"

**Cause:** Wrong API endpoint

**Solution:**
- Check endpoint matches backend routes
- Products: `/api/products` (not `/api/products/public`)
- Verify backend routes in `ivy-backend1/routes/`

### Issue 3: "CORS error"

**Cause:** Backend not allowing frontend origin

**Solution:**
1. Add your frontend URL to backend CORS config
2. Restart backend server

### Issue 4: Empty array returned

**Cause:** Database is empty or query returns no results

**Solution:**
1. Check database has data:
   ```bash
   # Use MongoDB Compass or CLI
   # Verify products collection has documents
   ```
2. Check backend controller is querying correctly
3. Verify `inStock` filter (products page only shows in-stock items)

### Issue 5: Cache returning old data

**Cause:** Cache has stale data

**Solution:**
```javascript
// In browser console
window.debugCache.clearAllCache()
location.reload()
```

### Issue 6: "Request timeout"

**Cause:** Backend taking too long or not responding

**Solution:**
1. Check backend logs for errors
2. Verify database connection
3. Check backend is not stuck processing

---

## 🔧 Debug Tools Added

### Console Logging

All API calls now log:
- Request URL and method
- Response status
- Data received
- Errors with details

### Debug Utilities

Available in browser console:

```javascript
// Clear all cache
window.debugCache.clearAllCache()

// Check API health
window.debugCache.checkAPIHealth()
  .then(result => console.log('API Health:', result))
```

---

## 📋 Verification Checklist

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Backend shows "Connected to MongoDB"
- [ ] Frontend can reach backend (check Network tab)
- [ ] No CORS errors in console
- [ ] API endpoints return data (test with curl or Postman)
- [ ] Database has data (check MongoDB)
- [ ] Cache cleared (use debug utility)
- [ ] Console shows API logs (check for errors)

---

## 🚀 Quick Fix Commands

```bash
# 1. Start Backend
cd /Users/mac/Desktop/ivy-backend1
npm start

# 2. In another terminal, start Frontend
cd /Users/mac/Documents/GitHub/ivy-eg
npm run dev

# 3. In browser console, clear cache
window.debugCache.clearAllCache()
location.reload()
```

---

## 📞 Still Not Working?

1. **Check browser console** for specific error messages
2. **Check backend console** for errors
3. **Test API directly:**
   ```bash
   curl http://localhost:5001/api/products
   ```
4. **Verify database connection** in backend logs
5. **Check Network tab** in browser DevTools for failed requests

---

**The detailed console logs will help identify exactly where the issue is!**

