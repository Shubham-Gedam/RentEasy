import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, RefreshCcw, ShieldAlert } from 'lucide-react';
import useCartStore from '../store/cartStore';

const MyRentals = () => {
  const { rentals, returnProduct } = useCartStore();
  const navigate = useNavigate();

  const handleReturn = (id, name) => {
    if (window.confirm(`Kya aap sach mein ${name} wapas karna chahte hain? Refund process start ho jayega.`)) {
      returnProduct(id);
      alert("Return Request Raised! 🚛 Humara agent 24 ghante mein pick-up ke liye aayega.");
    }
  };

  if (rentals.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <Package size={60} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black italic text-gray-400 uppercase tracking-tighter">No Active Rentals</h2>
        <button onClick={() => navigate('/')} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">Start Renting</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 text-left">
      <h1 className="text-4xl font-black italic tracking-tighter mb-10 uppercase">My Active Fleet<span className="text-blue-600">.</span></h1>
      
      <div className="grid grid-cols-1 gap-6">
        {rentals.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[24px] overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.imageUrl || item.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Since: {new Date().toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                <p className="text-gray-500 font-bold italic mt-1">Rent: ₹{item.rent || item.baseRent}/mo</p>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex gap-4">
              {/* Return Button */}
              <button 
                onClick={() => handleReturn(item.id, item.name)}
                className="flex items-center gap-2 bg-gray-50 text-gray-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100"
              >
                <RefreshCcw size={16} /> Return Item
              </button>
              
              <button className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100">
                Download Agreement
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-orange-50 rounded-[32px] border border-orange-100 flex items-start gap-4">
        <ShieldAlert className="text-orange-500 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-orange-900 uppercase text-xs tracking-widest">Rental Policy</h4>
          <p className="text-sm text-orange-800/70 mt-1 italic">Agar aap product ko delivery ke waqt wapas karte hain, toh full deposit refund hoga. Pick-up charge ₹299/- lagega.</p>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;