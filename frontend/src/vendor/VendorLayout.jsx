import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  Wrench,
  ArrowLeft,
} from "lucide-react";

const VendorLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Overview",
      path: "/vendor/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "My Products",
      path: "/vendor/products",
      icon: <Package size={20} />,
    },
    { name: "Rentals", path: "/vendor/rentals", icon: <RefreshCw size={20} /> },
    {
      name: "Maintenance",
      path: "/vendor/maintenance",
      icon: <Wrench size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 font-bold mb-10 hover:text-black transition-all"
          >
            <ArrowLeft size={18} /> Exit Dashboard
          </Link>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50">
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] font-black uppercase opacity-50 mb-1 tracking-widest">
              Vendor Pro
            </p>
            <p className="text-xs font-bold leading-tight">
              Your account is verified. ✅
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
