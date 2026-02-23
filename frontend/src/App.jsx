import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
// import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './auth/Login';
import Register from './auth/Register';

// User Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyRentals from './pages/MyRentals';
import MaintenanceRequest from './pages/MaintenanceRequest';

// Vendor Pages
import VendorDashboard from './vendor/Dashboard';
import AddProduct from './vendor/Products'; // Yahan aapka product form hoga

// Admin Pages
import AdminDashboard from './admin/Dashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar /> 

        <main className="grow container mx-auto px-4 py-8">
          <Routes>
            {/* Ab saare routes open hain, koi bhi kahin bhi ja sakta hai */}
            
            {/* General Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User & Order Routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/maintenance" element={<MaintenanceRequest />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/add-product" element={<AddProduct />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;