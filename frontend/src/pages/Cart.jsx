import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Plus, Minus, MoveLeft } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const { cart, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.rent || item.baseRent || 0), 0);
  const totalDeposit = cart.reduce((acc, item) => acc + (item.deposit || 1500), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Bag is empty.</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Upgrade your lifestyle today by adding premium rentals.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-105 transition-all">
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Review Bag</h1>
            <p className="text-gray-500 font-medium">{cart.length} Premium items selected</p>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-5 py-3 rounded-2xl hover:bg-blue-100 transition-all">
            <Plus size={18} /> Add More
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Product List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-[32px] flex items-center gap-6 group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="w-32 h-32 rounded-[24px] overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.imageUrl || item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.category}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.name}</h3>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <button className="text-gray-400 hover:text-black transition-colors"><Minus size={16}/></button>
                        <span className="font-bold text-sm px-2">01</span>
                        <button className="text-gray-400 hover:text-black transition-colors"><Plus size={16}/></button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Monthly</p>
                      <p className="text-xl font-black text-gray-900">₹{item.rent || item.baseRent}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary: Sidebar Style */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-gray-900 mb-8">Summary</h3>
                
                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-400">Monthly Rent Total</span>
                    <span className="text-gray-900 font-black">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-400">Total Security Deposit</span>
                    <span className="text-gray-900 font-black">₹{totalDeposit}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-green-600">
                    <span>Delivery & Installation</span>
                    <span className="uppercase text-[10px] bg-green-50 px-2 py-1 rounded-md">Free</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Due Today</p>
                      <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{subtotal + totalDeposit}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold max-w-[100px] text-right">Includes refundable deposit</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100 group">
                  Confirm Booking <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="mt-6 flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                    <ShieldCheck className="text-blue-600 mt-1" size={20} />
                    <p className="text-[11px] text-gray-500 font-semibold leading-snug">
                        By proceeding, you agree to our Rental Agreement and the 100% money-back guarantee on security deposits.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;