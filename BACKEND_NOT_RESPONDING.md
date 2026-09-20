# 🔴 Backend Not Responding - Fix Guide

## Problem

**Backend process is running** but **not responding** to API requests.

**Symptoms:**
- API calls are made but no response
- Requests hang/timeout
- No response logs in console

---

## ✅ Quick Fix

### Step 1: Check Backend Terminal

**Look at your backend terminal/console** where you ran `npm start`. You should see:

**✅ If MongoDB Connected:**
```
🔄 Attempting to connect to MongoDB...
✅ Connected to MongoDB - IVY Database
📊 Database: ivy
IVY Backend Server is running on port 5001
```

**❌ If MongoDB Not Connected:**
```
🔄 Attempting to connect to MongoDB...
❌ MongoDB connection error: [error message]
💡 Please check:
   1. MongoDB Atlas Network Access - Add your IP or 0.0.0.0/0
   2. Database user password is correct
   3. Connection string in .env file
   4. Internet connection is working
```

### Step 2: Restart Backend Properly

**Stop the backend:**
```bash
# Find and kill backend process
pkill -f "node index.js"
pkill -f "nodemon"
```

**Start backend:**
```bash
cd /Users/mac/Desktop/ivy-backend1
npm start
```

**Watch the console** for MongoDB connection status.

### Step 3: Fix MongoDB Connection

**If MongoDB is not connecting:**

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Network Access** → Add IP `0.0.0.0/0` (or your IP)
3. **Wait 1-2 minutes**
4. **Restart backend**

### Step 4: Test Backend

**Test health endpoint:**
```bash
curl http://localhost:5001/api/health
```

**Should return:**
```json
{
  "status": "ok",
  "server": "running",
  "mongodb": "connected",
  "timestamp": "..."
}
```

**If MongoDB is disconnected:**
```json
{
  "status": "ok",
  "server": "running",
  "mongodb": "disconnected",
  "timestamp": "..."
}
```

---

## 🔍 Diagnosis

### Check 1: Is Backend Running?

```bash
ps aux | grep "node index.js"
```

**Should show:** Process running

### Check 2: Is Backend Listening?

```bash
lsof -i :5001
```

**Should show:** Process listening on port 5001

### Check 3: Can Backend Respond?

```bash
curl http://localhost:5001/
```

**Should return:** JSON with status

### Check 4: MongoDB Status

**Check backend console** for MongoDB connection message.

---

## 🚨 Common Issues

### Issue 1: Backend Stuck on MongoDB Connection

**Symptom:** Backend starts but hangs, no "Server running" message

**Solution:**
- Fix MongoDB connection (whitelist IP)
- Or add timeout/error handling

### Issue 2: Multiple Backend Processes

**Symptom:** Multiple node processes running

**Solution:**
```bash
pkill -f "node index.js"
pkill -f "nodemon"
# Then restart
```

### Issue 3: Port Already in Use

**Symptom:** Backend won't start, port error

**Solution:**
```bash
lsof -ti:5001 | xargs kill -9
# Then restart
```

---

## 📋 What I Added

1. **Health check endpoint:** `/api/health` - Shows server and MongoDB status
2. **Better root endpoint:** Returns JSON with connection status
3. **Improved MongoDB logging:** Shows detailed connection status

---

## ✅ Verification

After fixing, you should see in **backend console:**
```
✅ Connected to MongoDB - IVY Database
IVY Backend Server is running on port 5001
```

And in **browser console:**
```
[API Call] GET http://localhost:5001/api/dashboard/stats
[API Response] 200 OK for /dashboard/stats
[API Success] /dashboard/stats: totalOrders, pendingOrders, ...
```

---

**Check your backend terminal to see the MongoDB connection status!**

