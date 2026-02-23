import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart'; // 1. Pehle import karo
// import VendorDashboard from '../pages/vendor/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      
      {/* 2. YE WALI LINE ADD KARO */}
      <Route path="/cart" element={<Cart />} /> 
      
      {/* <Route path="/vendor/dashboard" element={<VendorDashboard />} /> */}
    </Routes>
  );
};

export default AppRoutes;