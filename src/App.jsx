import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Page stylesheets share global class names, so they all load up front in this
// order; only the page JavaScript below is split out.
import './pages/Home.css'
import './pages/Products.css'
import './pages/Contact.css'
import './pages/CartPage.css'
import './pages/Checkout.css'
import './pages/TrackOrders.css'
import './components/admin/AdminLayout.css'
import './pages/admin/AdminLogin.css'
import './pages/admin/Dashboard.css'
import './pages/admin/Orders.css'
import './pages/admin/Products.css'
import './pages/admin/PromoCodes.css'
import './pages/admin/Settings.css'

// Loaded on demand so shoppers don't download checkout or admin code up front
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const TrackOrders = lazy(() => import('./pages/TrackOrders'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Orders = lazy(() => import('./pages/admin/Orders'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const PromoCodes = lazy(() => import('./pages/admin/PromoCodes'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))

const PageFallback = () => <div className="page-loading" aria-busy="true" />
const page = (element) => <Suspense fallback={<PageFallback />}>{element}</Suspense>

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
            <Route path="/products/:id" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  {page(<ProductDetail />)}
                </main>
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  {page(<Contact />)}
                </main>
                <Footer />
              </div>
            } />
            <Route path="/cart" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  {page(<CartPage />)}
                </main>
                <Footer />
              </div>
            } />
            <Route path="/checkout" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  {page(<Checkout />)}
                </main>
                <Footer />
              </div>
            } />
            <Route path="/track-orders" element={
              <div className="app">
                <Header />
                <main className="main-content">
                  {page(<TrackOrders />)}
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes (No Header/Footer) */}
            <Route path="/admin/login" element={page(<AdminLogin />)} />
            <Route path="/admin" element={
              <ProtectedRoute>
                {page(<AdminLayout />)}
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={page(<Dashboard />)} />
              <Route path="analytics" element={page(<Analytics />)} />
              <Route path="orders" element={page(<Orders />)} />
              <Route path="products" element={page(<AdminProducts />)} />
              <Route path="promocodes" element={page(<PromoCodes />)} />
              <Route path="settings" element={page(<Settings />)} />
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

