import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const { cart, removeFromCart, confirmBooking } = useCartStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.rent) || Number(item.baseRent) || 0), 0);
  const totalDeposit = cart.reduce((acc, item) => acc + (Number(item.deposit) || 1500), 0);

  const handleCheckout = () => {
    confirmBooking();
    alert("Booking Confirmed! 🎉 Check your My Rentals section.");
    navigate('/rentals');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-left">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter italic">Bag is empty.</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-12 italic uppercase">Review Bag<span className="text-blue-600">.</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-[32px] flex items-center gap-6 group hover:shadow-xl transition-all">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.imageUrl || item.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                  <p className="text-xl font-black text-gray-900 mt-2">₹{item.rent || item.baseRent}<span className="text-xs text-gray-400">/mo</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 sticky top-24">
              <h3 className="text-xl font-black mb-6 uppercase italic">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-bold text-gray-500"><span>Rent</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between font-bold text-gray-500"><span>Deposit</span><span>₹{totalDeposit}</span></div>
                <div className="flex justify-between font-black text-gray-900 text-2xl border-t border-dashed pt-4"><span>Total</span><span>₹{subtotal + totalDeposit}</span></div>
              </div>
              <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100">
                Confirm Booking <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;