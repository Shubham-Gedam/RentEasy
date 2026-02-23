import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart'; // 1. Pehle import karo
import VendorDashboard from '../vendor/Dashboard';
import MyRentals from '../pages/MyRentals'
// import Login from '../auth/Login'
import  CheckCheck  from '../pages/Checkout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      
      {/* 2. YE WALI LINE ADD KARO */}
      <Route path="/cart" element={<Cart />} /> 
      
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/rentals" element={<MyRentals />} />

      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/checkout" element={<CheckCheck />} />
    </Routes>
  );
};

export default AppRoutes;