import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";



// Layouts
// import MainLayout from "../vendor/";
import VendorLayout from "../vendor/VendorLayout";

// Pages
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import MyRentals from "../pages/MyRentals";
import CheckCheck from "../pages/Checkout";

// Vendor Pages
import VendorDashboard from "../vendor/Dashboard";
import Products from "../vendor/Products";
import Rentals from "../vendor/Rentals";
import Maintenance from "../vendor/Maintenance";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
  return (
    <Routes>
      {/* 🏠 CUSTOMER FLOW (Wrapped in MainLayout) */}
      <Route >
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rentals" element={<MyRentals />} />
        <Route path="/checkout" element={<CheckCheck />} />
      </Route>

      {/* 🏢 VENDOR FLOW (Wrapped in VendorLayout + Protected) */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRole="vendor">
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        {/* 'index' matlab jab user sirf /vendor pe jaye */}
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="maintenance" element={<Maintenance />} />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;