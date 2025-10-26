import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'

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

function App() {
  return (
    <Router>
      <AdminProvider>
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
      </AdminProvider>
    </Router>
  )
}

export default App

