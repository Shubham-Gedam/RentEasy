import React, { useState, useEffect } from 'react';
import { Package, IndianRupee, ShoppingBag, Loader2, Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import vendorApi from '../apis/vendorApi';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Dono data parallel fetch karo
      const [pRes, rRes] = await Promise.all([
        vendorApi.getMyProducts(),
        vendorApi.getVendorOrders() // Iske liye backend route '/vendor/rentals' honi chahiye
      ]);

      setProducts(pRes.data.products || []);
      setRentals(rRes.data.rentals || []);
    } catch (err) {
      console.log("Fetch Error:", err);
      // toast.error("Data load nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 1. Mark as Delivered
  const handleDelivery = async (id) => {
    try {
      await vendorApi.updateDelivery(id);
      toast.success("Product Delivered! 🚚");
      fetchData(); // Refresh UI
    } catch (err) {
      toast.error("Delivery update fail ho gaya!");
    }
  };

  // ✅ 2. Report Damage
  const handleDamage = async (id) => {
    const desc = prompt("Damage ka description likho (e.g. Broken leg, Scratches):");
    if (!desc) return;
    try {
      await vendorApi.reportDamage(id, desc);
      toast.warning("Damage Reported! ⚠️");
      fetchData();
    } catch (err) {
      toast.error("Error reporting damage.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-[#fcfcfd] min-h-screen text-left">
      <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">
        Vendor Control<span className="text-blue-600">.</span>
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Package size={24} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Live Inventory</p>
          <h2 className="text-5xl font-black tracking-tighter">{products.length}</h2>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-purple-200 transition-all">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <ShoppingBag size={24} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Rentals</p>
          <h2 className="text-5xl font-black tracking-tighter">{rentals.length}</h2>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <IndianRupee className="text-blue-400 mb-4" size={32} />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Projected Revenue</p>
            <h2 className="text-5xl font-black tracking-tighter">₹{rentals.reduce((a, b) => a + (b.totalAmount || 0), 0)}</h2>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <IndianRupee size={150} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* RECENT BOOKINGS / ORDERS */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Operations Desk</h3>
          {rentals.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[30px]">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No active orders right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.map((order) => (
                <div key={order._id} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[30px] flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl border flex items-center justify-center font-black text-blue-600 shadow-sm overflow-hidden">
                      {order.product?.images?.[0] ? (
                        <img src={order.product.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        order.product?.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-950 text-lg leading-tight">{order.product?.name}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'
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

        {/* MY INVENTORY */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Inventory Health</h3>
          {products.length === 0 ? (
            <p className="text-gray-400 italic py-10">Empty stock.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p._id} className="p-4 bg-white border border-gray-100 rounded-3xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 border flex items-center justify-center font-bold text-xs text-gray-400">
                    {p.availableStock}
                  </div>
                  <div className="truncate">
                    <p className="font-black text-sm truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Stock Available</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;