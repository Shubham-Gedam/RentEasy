import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore'; // <--- Ye import add karo
import { 
  Search, 
  ShoppingCart, 
  LayoutDashboard, 
  UserCircle, 
  LogOut,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const { user, setRole } = useAuthStore();
  const cart = useCartStore((state) => state.cart); // <--- Cart state lo
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">R</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
            Rent<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* Dynamic Search Bar */}
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text" 
            placeholder="Search furniture, appliances..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all text-sm font-medium"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Role Toggle Switch */}
          <div className="hidden lg:flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setRole('user')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${user.role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => setRole('vendor')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${user.role === 'vendor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              Vendor
            </button>
          </div>

          <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
            {user.role === 'user' ? (
              <>
                <Link to="/rentals" className={`text-sm font-bold transition-colors ${isActive('/rentals') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
                  My Rentals
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                  <ShoppingCart size={22} />
                  {/* DYNAMIC CART COUNT: Sirf tab dikhega jab cart mein item honge */}
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white animate-in zoom-in">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Link 
                to="/vendor/dashboard" 
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}

            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 pr-2 rounded-full transition-all">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                JD
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;