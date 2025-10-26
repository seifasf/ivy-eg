import React, { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { 
  HiHome, 
  HiShoppingBag, 
  HiShoppingCart, 
  HiTag, 
  HiCog, 
  HiLogout,
  HiMenu,
  HiX,
  HiUser
} from 'react-icons/hi'
import './AdminLayout.css'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, adminUser } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: HiHome, label: 'Dashboard' },
    { path: '/admin/orders', icon: HiShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: HiShoppingBag, label: 'Products' },
    { path: '/admin/promocodes', icon: HiTag, label: 'Promo Codes' },
    { path: '/admin/settings', icon: HiCog, label: 'Settings' },
  ]

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button className="admin-mobile-menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        <div className="admin-mobile-logo">
          <img src="/IMGs/IVY-03.png" alt="IVY Admin" />
        </div>
        <button className="admin-mobile-logout" onClick={handleLogout}>
          <HiLogout size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/IMGs/IVY-03.png" alt="IVY Admin" className="admin-sidebar-logo" />
          <h2 className="admin-sidebar-title">IVY Admin</h2>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <HiUser size={20} />
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{adminUser?.name || 'Admin'}</p>
              <p className="admin-user-email">{adminUser?.email || ''}</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <HiLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

