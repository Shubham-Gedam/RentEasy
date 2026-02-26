import React, { useState, useEffect } from 'react';
import { Package, IndianRupee, ShoppingBag, Loader2 } from 'lucide-react';
import vendorApi from '../apis/vendorApi';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dashboard.jsx ke andar ka fetchData function aise update karo:

const fetchData = async () => {
  try {
    setLoading(true);
    const [pRes, rRes] = await Promise.all([
      // 1. getVendorProducts ki jagah getMyProducts likho
      vendorApi.getMyProducts(), 
      
      // 2. getVendorOrders ki jagah bhi getMyProducts ya koi aur 
      // Agar rentals ke liye alag api nahi hai toh abhi ke liye isse hata do
      vendorApi.getMyProducts() 
    ]);

    setProducts(pRes.data.products || []);
    setRentals(rRes.data.rentals || []); // Backend check karna rentals bhej raha hai ya orders
  } catch (err) { 
    console.log("Fetch Error:", err); 
  } finally { 
    setLoading(false); 
  }
};
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-[#fcfcfd] min-h-screen text-left">
      <h1 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">
        Vendor Overview<span className="text-blue-600">.</span>
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
          <Package className="text-blue-600 mb-3" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Ads</p>
          <h2 className="text-4xl font-black">{products.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
          <ShoppingBag className="text-purple-600 mb-3" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
          <h2 className="text-4xl font-black">{rentals.length}</h2>
        </div>
        <div className="bg-gray-900 text-white p-6 rounded-[30px] shadow-xl">
          <IndianRupee className="text-blue-400 mb-3" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Earnings</p>
          <h2 className="text-4xl font-black text-white">₹{rentals.reduce((a, b) => a + (b.amount || 0), 0)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic mb-6 uppercase">Recent Bookings</h3>
          {rentals.length === 0 ? <p className="text-gray-400 italic py-10">No bookings yet.</p> : <p>Orders list here...</p>}
        </div>
        <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic mb-6 uppercase">My Inventory</h3>
          {products.length === 0 ? <p className="text-gray-400 italic py-10">No products listed.</p> : <p>Products list here...</p>}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;