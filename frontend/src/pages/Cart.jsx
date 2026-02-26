import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Cart = () => {
  // 1. removeFromCart ko _id ke saath use karenge
  const { cart, removeFromCart } = useCartStore(); 
  const navigate = useNavigate();

  // 2. Calculations using Backend Property Names
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.monthlyRent) || 0), 0);
  const totalDeposit = cart.reduce((acc, item) => acc + (Number(item.securityDeposit) || 0), 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-12 italic uppercase">
          Review Bag<span className="text-blue-600">.</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* List of Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              // 3. key={item._id} for MongoDB
              <div key={item._id} className="bg-white border border-gray-100 p-5 rounded-[32px] flex items-center gap-6 group hover:shadow-xl transition-all">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  {/* 4. item.images?.[0] for ImageKit URL */}
                  <img 
                    src={item.images?.[0] || 'https://via.placeholder.com/150'} 
                    className="w-full h-full object-cover" 
                    alt={item.name} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    {/* 5. removeFromCart(item._id) call */}
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {/* 6. item.monthlyRent display */}
                  <p className="text-xl font-black text-gray-900 mt-2">
                    ₹{item.monthlyRent}<span className="text-xs text-gray-400">/mo</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 sticky top-24 shadow-sm">
              <h3 className="text-xl font-black mb-6 uppercase italic text-left">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Monthly Rent</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Refundable Deposit</span><span>₹{totalDeposit}</span>
                </div>
                <div className="flex justify-between font-black text-gray-900 text-2xl border-t border-dashed pt-4">
                  <span>Total Due Now</span><span>₹{subtotal + totalDeposit}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout} 
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;