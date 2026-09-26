// src/layouts/UserLayout.jsx
import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 container py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AdminLayout