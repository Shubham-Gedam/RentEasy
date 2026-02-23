import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, ChevronRight } from 'lucide-react';
import useCartStore from '../store/cartStore';

const MyRentals = () => {
  const { rentals } = useCartStore();
  const navigate = useNavigate();

  if (!rentals || rentals.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center text-left">
        <Package size={60} className="text-gray-200 mb-6" />
        <h2 className="text-3xl font-black text-gray-900 mb-2 italic tracking-tighter">No Active Rentals.</h2>
        <button onClick={() => navigate('/')} className="mt-6 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">Start Renting</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-left">
      <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase mb-12">Active Rentals<span className="text-blue-600">.</span></h1>
      <div className="space-y-6">
        {rentals.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="bg-white border border-gray-100 rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-all">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 relative">
              <img src={item.imageUrl || item.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/20 rounded-2xl"></div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Live</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] font-black text-gray-400 uppercase">Rent</p><p className="font-bold">₹{item.rent || item.baseRent}/mo</p></div>
                <div><p className="text-[10px] font-black text-gray-400 uppercase">Next Billing</p><p className="font-bold text-blue-600">April 2024</p></div>
              </div>
            </div>
            <button className="bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-all"><ChevronRight /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;