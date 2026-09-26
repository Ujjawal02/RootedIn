import React from 'react'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../components/common/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'

import Home from '../pages/user/Home'
import ShowTree from '../pages/user/ShowTree'
import CartItem from '../pages/user/CartItem'
import Sponsor from '../pages/user/Sponsor'
import MyTree from '../pages/user/MyTree'

import NewTree from '../pages/admin/NewTree'
import UpdateTree from '../pages/admin/UpdateTree'
import DeletedTrees from '../pages/admin/DeletedTrees'
import PendingReq from '../pages/admin/PendingReq'
import AssignedSponsorships from '../pages/admin/AssignedSponsorships'

import FarmerAssignedTrees from '../pages/farmer/FarmerAssignedTrees'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public — Navbar/Footer show, no login required */}
        <Route path='/' element={<Home />} />
        <Route path='/trees/:id' element={<ShowTree />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        {/* User-only */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path='/cart' element={<CartItem />} />
          <Route path='/sponsor' element={<Sponsor />} />
          <Route path='/myTree' element={<MyTree />} />
        </Route>

        {/* Admin-only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path='/newTree' element={<NewTree />} />
          <Route path='/trees/update/:id' element={<UpdateTree />} />
          <Route path='/deleted' element={<DeletedTrees />} />
          <Route path='/pending' element={<PendingReq />} />
          <Route path='/assigned' element={<AssignedSponsorships />} />
        </Route>

        {/* Farmer-only */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route path='/farmer/assigned' element={<FarmerAssignedTrees />} />
        </Route>

        <Route path='*' element={<h1>404 Page Not Found</h1>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes