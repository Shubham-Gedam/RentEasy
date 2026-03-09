import React, { useState, useEffect } from 'react';
import { 
  Package, 
  IndianRupee, 
  ShoppingBag, 
  Loader2, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  History
} from 'lucide-react';
import vendorApi from '../apis/vendorApi';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Parallel fetch for speed
      const [pRes, rRes, mRes] = await Promise.all([
        vendorApi.getMyProducts(),
        vendorApi.getVendorOrders(),
        vendorApi.getMaintenance() // Ensure this exists in your vendorApi.js
      ]);

      setProducts(pRes.data.products || []);
      setRentals(rRes.data.rentals || []);
      setMaintenance(mRes.data.maintenance || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelivery = async (id) => {
    try {
      await vendorApi.updateDelivery(id);
      toast.success("Product Delivered! 🚚");
      fetchData();
    } catch (err) {
      toast.error("Delivery update fail ho gaya!");
    }
  };

  const handleDamage = async (id) => {
  const desc = prompt("Damage ka description likho:");
  if (!desc) return;
  try {
    // API call mein description object pass karo
    await vendorApi.reportDamage(id, desc); 
    toast.warning("Damage Reported! ⚠️");
    fetchData();
  } catch (err) {
    toast.error("Error reporting damage.");
  }
};
  // 💰 Logic: 15% platform commission cut
  const grossRevenue = rentals.reduce((a, b) => a + (b.totalAmount || 0), 0);
  const netEarnings = Math.floor(grossRevenue * 0.85);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fcfcfd]">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mb-2 mx-auto" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#fcfcfd] min-h-screen text-left">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Vendor Control<span className="text-blue-600">.</span>
        </h1>
        <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Live Status</span>
            <span className="text-green-500 font-bold text-xs uppercase flex items-center gap-1 justify-end">● Connected</span>
        </div>
      </div>

      {/* 📊 STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Package size={24} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Live Inventory</p>
          <h2 className="text-5xl font-black tracking-tighter text-gray-950">{products.length}</h2>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-purple-200 transition-all">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <ShoppingBag size={24} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Rentals</p>
          <h2 className="text-5xl font-black tracking-tighter text-gray-950">{rentals.length}</h2>
        </div>

        <div className="bg-gray-950 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <TrendingUp className="text-blue-400 mb-4" size={32} />
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Net Revenue (15% Cut)</p>
            <h2 className="text-5xl font-black tracking-tighter">₹{netEarnings.toLocaleString()}</h2>
            <p className="text-[9px] text-blue-400 mt-2 font-bold italic uppercase tracking-widest">Gross: ₹{grossRevenue.toLocaleString()}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <IndianRupee size={150} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 🚛 OPERATIONS DESK */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Operations Desk</h3>
          {rentals.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[30px]">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No active orders right now.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {rentals.map((order) => (
                <div key={order._id} className="p-6 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[35px] flex items-center justify-between transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl border flex items-center justify-center font-black text-blue-600 shadow-sm overflow-hidden p-1">
                      {order.product?.images?.[0] ? (
                        <img src={order.product.images[0]} className="w-full h-full object-cover rounded-xl" alt="prod" />
                      ) : (
                        <Package className="text-gray-200" size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-950 text-lg leading-tight mb-1">{order.product?.name}</p>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status !== 'DELIVERED' && (
                      <button 
                        onClick={() => handleDelivery(order._id)}
                        className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-100"
                        title="Mark Delivered"
                      >
                        <Truck size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDamage(order._id)}
                      className="bg-white border border-red-100 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Report Damage"
                    >
                      <AlertTriangle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📦 INVENTORY & MAINTENANCE */}
        <div className="space-y-10">
            {/* Inventory Health */}
            <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Inventory Health</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(0, 4).map((p) => (
                        <div key={p._id} className="p-4 bg-white border border-gray-100 rounded-3xl flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 border flex flex-col items-center justify-center">
                                <span className="font-black text-xs text-gray-950">{p.availableStock}</span>
                            </div>
                            <div className="truncate">
                                <p className="font-black text-[12px] truncate leading-tight uppercase tracking-tight">{p.name}</p>
                                <div className="flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${p.availableStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase">In Stock</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance/Issues Alert */}
            <div className="bg-orange-50/50 p-8 rounded-[45px] border border-orange-100">
                <div className="flex items-center gap-2 mb-6">
                    <History size={20} className="text-orange-600" />
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Maintenance Logs</h3>
                </div>
                {maintenance.length === 0 ? (
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest italic">No pending issues reported.</p>
                ) : (
                    <div className="space-y-3">
                        {maintenance.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                                <p className="text-[11px] font-bold text-gray-700 truncate w-2/3">{item.issueDescription}</p>
                                <span className="text-[8px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-black uppercase">{item.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;