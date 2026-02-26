import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useProductStore from "../../store/productStore";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useModalStore from "../../store/useModalStore"; 

import {
  Search,
  ShoppingCart,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Package,
  PlusCircle
} from "lucide-react";

const Navbar = () => {
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const { user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const openPostAd = useModalStore((state) => state.openPostAd); // 👈 Modal open function
  
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
            Rent<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* Dynamic Search Bar */}
        <div className="flex-1 max-w-xl relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
            size={18}
          />
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search furniture, appliances..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all text-sm font-medium"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Role-Based Links Section */}
              <div className="flex items-center gap-6 border-r pr-6 border-gray-100">
                {user?.role === "vendor" ? (
                  // ✅ Vendor Specific Links
                  <>
                    <Link
                      to="/vendor/dashboard"
                      className={`flex items-center gap-2 text-sm font-bold transition-all ${isActive("/vendor/dashboard") ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    
                    {/* 👇 "Post Ad" now triggers the Modal instead of navigation */}
                    <button
                      onClick={openPostAd}
                      className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
                    >
                      <PlusCircle size={14} />
                      Post Ad
                    </button>
                  </>
                ) : (
                  // ✅ Customer Specific Links
                  <>
                    <Link
                      to="/rentals"
                      className={`text-sm font-bold transition-colors ${isActive("/rentals") ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      My Rentals
                    </Link>
                    <Link
                      to="/cart"
                      className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <ShoppingCart size={22} />
                      {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white animate-in zoom-in">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 pr-2 rounded-full transition-all">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                    {user?.fullname?.firstname ? (
                      user.fullname.firstname.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:rotate-180 transition-transform"
                  />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-[24px] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden p-2 translate-y-2 group-hover:translate-y-0">
                  <div className="p-4 border-b border-gray-50 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                            {user?.role}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : 'User'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                    >
                      <UserIcon size={16} className="text-gray-400" />
                      View Profile
                    </Link>
                    
                    {user?.role === 'user' && (
                        <Link
                          to="/rentals"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <Package size={16} className="text-gray-400" />
                          My Orders
                        </Link>
                    )}
                  </div>

                  <hr className="my-2 border-gray-50" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Logged Out Flow */
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-900 transition-all shadow-lg shadow-blue-100">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;