import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import TrackOrders from './pages/TrackOrders'

// Admin imports
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Orders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import PromoCodes from './pages/admin/PromoCodes'
import Settings from './pages/admin/Settings'

import './App.css'

// Google OAuth Client ID - Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AdminProvider>
          <UserProvider>
            <CartProvider>
          <Routes>
            {/* Public Routes with Header & Footer */}
            <Route path="/" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/products" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <Products />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <Contact />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/cart" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <CartPage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/checkout" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <Checkout />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/track-orders" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  <TrackOrders />
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes (No Header/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="promocodes" element={<PromoCodes />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
            </CartProvider>
          </UserProvider>
        </AdminProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App

