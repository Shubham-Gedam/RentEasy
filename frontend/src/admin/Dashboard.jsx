import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Wrench, 
  BarChart3, ShieldAlert, LogOut, Search, Bell
} from "lucide-react";
import AdminStats from "./AdminStats";
import UserManagement from "./UserManagement";
import adminApi from "../apis/adminApi";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Dashboard Summary Load karna (Route: /reports/summary)
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboardSummary();
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Dashboard stats load nahi ho paye!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const menuItems = [
    { id: "overview", name: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "users", name: "Users", icon: <Users size={20} /> },
    { id: "maintenance", name: "Maintenance", icon: <Wrench size={20} /> },
    { id: "rentals", name: "Rentals", icon: <BarChart3 size={20} /> },
    { id: "damages", name: "Damages", icon: <ShieldAlert size={20} /> },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black text-white font-black italic uppercase tracking-tighter text-2xl">
      Initializing Rune Control Room...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfcfd] text-[#1a1a1a]">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-black text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            Rune<span className="text-orange-500">.</span>
            <span className="block text-[10px] tracking-[0.3em] font-bold text-gray-500 mt-1 uppercase">Admin Panel</span>
          </h2>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all duration-300 ${
                activeTab === item.id 
                ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30 translate-x-2" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-red-500 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-12">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="relative w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search data, users, orders..." 
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold outline-none shadow-sm focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black italic">A</div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Root Admin</p>
                <p className="text-xs font-black uppercase tracking-tight">Master Control</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeTab === "overview" && stats && (
            <>
              <AdminStats stats={stats} />
              {/* Yahan hum charts bhi add kar sakte hain later */}
              <div className="mt-10 bg-orange-50 border-2 border-dashed border-orange-200 rounded-[45px] p-20 text-center">
                <p className="text-orange-900 font-black italic uppercase text-xl">Revenue Tracking & Analytics Module</p>
                <p className="text-orange-600/60 font-bold text-sm mt-2">Charts will be integrated with Razorpay data.</p>
              </div>
            </>
          )}

          {activeTab === "users" && <UserManagement />}
          
          {activeTab === "maintenance" && (
            <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
              <Wrench size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-black uppercase italic tracking-widest text-sm">Global Maintenance Logs Coming Soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;