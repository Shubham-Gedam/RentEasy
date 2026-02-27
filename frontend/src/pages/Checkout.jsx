import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import useCartStore from '../store/cartStore';
import axiosInstance from '../apis/axiosInstance'; // 💡 Backend Call
import { toast } from 'react-toastify'; // 💡 Toast Notification

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, confirmBooking } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  // 💡 State for form inputs
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // ✅ Calculation Fix: Using backend field names
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.monthlyRent) || 0), 0);
  const deposit = cart.reduce((acc, item) => acc + (Number(item.securityDeposit) || 0), 0);

  const handleFinalOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🛑 Validation: Check if address is filled
    if (!address.trim() || !phone.trim() || !name.trim()) {
      toast.error("Sabhi fields bharna zaroori hai!");
      setLoading(false);
      return;
    }

    try {
      // 💡 API Call to Backend to create rentals for each item
      for (const item of cart) {
        await axiosInstance.post('/rentals', {
          productId: item._id, 
          tenure: 6, // 💡 Default tenure, can be made dynamic
          deliveryDate: new Date().toISOString(), // 💡 Current date
          deliveryAddress: address, // 💡 From form state
        });
      }

      confirmBooking(); // 💡 Cart clear karega
      toast.success("Order Placed Successfully! 🚀");
      navigate('/rentals'); 
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error.response?.data?.message || "Order fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black italic">Bag is empty, nothing to checkout!</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl">Go Home</button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-16 px-8 text-left">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-black transition-colors">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-black italic tracking-tighter mb-10 uppercase">Shipping Info<span className="text-blue-600">.</span></h1>
            
            <form onSubmit={handleFinalOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  required 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 shadow-sm" 
                />
                <input 
                  required 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 shadow-sm" 
                />
              </div>
              <textarea 
                required 
                placeholder="Delivery Address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 h-32 shadow-sm"
              ></textarea>
              
              <div className="bg-white border border-gray-200 p-6 rounded-[32px] flex items-center gap-4 shadow-sm">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CreditCard /></div>
                 <div>
                   <p className="font-bold text-gray-900">Cash on Delivery / Pay on Setup</p>
                   <p className="text-xs text-gray-400 font-medium">Zero upfront payment for your trust.</p>
                 </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className={`w-full py-5 rounded-[24px] font-black text-lg transition-all flex justify-center items-center gap-3 ${loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-2xl shadow-blue-100'}`}
              >
                {loading ? <><Loader2 className="animate-spin" /> Processing...</> : `Confirm Order - ₹${subtotal + deposit}`}
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 sticky top-24 shadow-sm">
              <h3 className="font-black italic uppercase text-xs tracking-widest mb-8 text-gray-400">Your Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between items-center font-bold">
                    <span className="text-gray-600 truncate mr-4">{item.name}</span>
                    <span className="whitespace-nowrap text-gray-900">₹{item.monthlyRent}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">Monthly Rent Total</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">Refundable Deposit</span>
                  <span className="text-gray-900">₹{deposit}</span>
                </div>
                <div className="flex justify-between text-2xl font-black italic pt-4">
                  <span>Total Bill</span>
                  <span className="text-blue-600 font-black">₹{subtotal + deposit}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                <ShieldCheck size={14} strokeWidth={3} /> Verified Rent-Ease Assured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;