import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, confirmBooking } = useCartStore();
  
  // Form handling (sirf UI ke liye, par logic real hai)
  const [loading, setLoading] = useState(false);

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.rent) || Number(item.baseRent) || 0), 0);
  const deposit = cart.reduce((acc, item) => acc + (Number(item.deposit) || 1500), 0);

  const handleFinalOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    // 2 second ka fake loading taaki premium feel aaye
    setTimeout(() => {
      confirmBooking(); // Store mein Cart khali hoga aur Rentals mein data jayega
      setLoading(false);
      alert("Order Placed Successfully! 🚀");
      navigate('/rentals'); // Seedha rentals page pe bhej do
    }, 1500);
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
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-black">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-black italic tracking-tighter mb-10 uppercase">Shipping Info<span className="text-blue-600">.</span></h1>
            
            <form onSubmit={handleFinalOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" placeholder="Full Name" className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" />
                <input required type="tel" placeholder="Phone Number" className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <textarea required placeholder="Delivery Address" className="w-full bg-white border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 h-32"></textarea>
              
              <div className="bg-white border border-gray-100 p-6 rounded-[32px] flex items-center gap-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CreditCard /></div>
                 <div>
                   <p className="font-bold">Cash on Delivery / Pay on Setup</p>
                   <p className="text-xs text-gray-400">Zero upfront payment for your trust.</p>
                 </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className={`w-full py-5 rounded-[24px] font-black text-lg transition-all ${loading ? 'bg-gray-400' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-2xl'}`}
              >
                {loading ? 'Processing...' : `Confirm Order - ₹${subtotal + deposit}`}
              </button>
            </form>
          </div>

          {/* Sticky Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 sticky top-24 shadow-sm">
              <h3 className="font-black italic uppercase text-xs tracking-widest mb-8 text-gray-400">Your Order</h3>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center font-bold">
                    <span className="text-gray-600">{item.name}</span>
                    <span>₹{item.rent || item.baseRent}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed pt-6 space-y-3">
                <div className="flex justify-between text-sm font-bold"><span className="text-gray-400">Monthly Rent</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-sm font-bold"><span className="text-gray-400">Refundable Deposit</span><span>₹{deposit}</span></div>
                <div className="flex justify-between text-2xl font-black italic pt-4"><span>Total Bill</span><span className="text-blue-600">₹{subtotal + deposit}</span></div>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-green-600 uppercase">
                <ShieldCheck size={14} /> 7-Day Free Replacement Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;