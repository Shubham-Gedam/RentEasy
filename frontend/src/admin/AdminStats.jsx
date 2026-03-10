import React from 'react';
import { DollarSign, Zap, Wrench, Package, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        {React.cloneElement(icon, { className: color })}
      </div>
      <span className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
        LIVE <ArrowUpRight size={10} />
      </span>
    </div>
    
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{title}</p>
      <h3 className="text-4xl font-black italic tracking-tighter uppercase">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 mt-2 italic">{subtitle}</p>
    </div>
  </div>
);

const AdminStats = ({ stats }) => {
  // Backend se jo data aa raha hai uski mapping
  const data = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <DollarSign size={24} />,
      color: "text-green-600",
      subtitle: "Paid transactions only"
    },
    {
      title: "Active Rentals",
      value: stats?.activeRentals || 0,
      icon: <Zap size={24} />,
      color: "text-blue-600",
      subtitle: "Currently with customers"
    },
    {
      title: "Pending Repairs",
      value: stats?.pendingMaintenance || 0,
      icon: <Wrench size={24} />,
      color: "text-orange-600",
      subtitle: "Requires vendor attention"
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockProducts || 0,
      icon: <Package size={24} />,
      color: "text-red-600",
      subtitle: "Items below 2 units"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
};

export default AdminStats;