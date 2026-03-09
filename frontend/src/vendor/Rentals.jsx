import React, { useEffect, useState } from 'react'; // useState add kiya
import vendorApi from '../apis/vendorApi';
import { Check, X, User, Package, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Rentals = () => {
  // 1. Local state define ki (Zustand store ki ab zaroorat nahi yahan)
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Requests from Backend
  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await vendorApi.getVendorRentals(); 
      // Ensure backend provides res.data.rentals
      setRentals(res.data.rentals || []);
    } catch (err) {
      err
      toast.error("Requests load nahi ho payi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  // 3. Update Status Logic
  const handleStatusUpdate = async (id, status) => {
    try {
      // Backend call to update status
      await vendorApi.updateDelivery(id);
      
      toast.success(`Order ${status} successfully!`);
      
      // Local UI update: Status badal do bina page refresh kiye
      setRentals(prev => 
        prev.map(order => order._id === id ? { ...order, status } : order)
      );
    } catch (err) {
      err
      toast.error("Status update fail ho gaya!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-10 text-left min-h-screen bg-[#f8f9fa]">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
            Order Requests<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage incoming rental bookings and delivery status.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Total Volume</span>
            <span className="text-2xl font-black text-gray-900">{rentals.length} Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rentals.length > 0 ? (
          rentals.map((order) => (
            <div key={order._id} className="bg-white rounded-[40px] border border-gray-100 p-8 flex flex-col lg:flex-row items-center justify-between group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
              
              {/* Left: Product & Customer Info */}
              <div className="flex items-center gap-8">
                <div className="relative">
                    {/* Backend field 'images' handle kiya */}
                    <img src={order.product?.images?.[0]?.url || order.image} className="w-24 h-24 rounded-32px object-cover shadow-lg" alt="" />
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-gray-50 text-blue-600">
                        <Package size={16} />
                    </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                      order.status === 'Accepted' || order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                      'bg-orange-100 text-orange-600 animate-pulse'
                    }`}>
                      ● {order.status || 'Pending Verification'}
                    </span>
                    <span className="text-gray-300 font-bold text-xs tracking-widest uppercase">ID: #{order._id.toString().slice(-6)}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{order.product?.name || "Rental Item"}</h3>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><User size={12}/></div>
                        <span>Customer: {order.user?.name || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center"><Clock size={12}/></div>
                        <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions & Price */}
              <div className="mt-8 lg:mt-0 flex items-center gap-10">
                <div className="text-right">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Monthly Payout</p>
                    <p className="text-3xl font-black text-gray-900 leading-none">₹{order.totalAmount || order.rent}</p>
                </div>

                <div className="flex gap-3">
                  {(!order.status || order.status === 'pending') ? (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'Accepted')}
                        className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-gray-200 active:scale-90"
                        title="Accept Order"
                      >
                        <Check size={24} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'Rejected')}
                        className="bg-white text-gray-400 border border-gray-100 p-4 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                        title="Reject Order"
                      >
                        <X size={24} strokeWidth={3} />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100">
                        <ShieldCheck size={18} className={order.status === 'Accepted' || order.status === 'delivered' ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 uppercase">{order.status}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white rounded-[50px] p-32 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-6">
                <Clock size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-300 italic uppercase tracking-tighter">No Pending Requests</h2>
            <p className="text-gray-400 mt-2 font-medium max-w-xs italic">Jab koi customer aapka saaman book karega, wo yahan approval ke liye dikhega.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;