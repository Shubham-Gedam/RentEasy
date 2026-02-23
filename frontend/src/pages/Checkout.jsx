import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto py-20 px-6 text-left">
      <h1 className="text-4xl font-black italic mb-8">Confirm Order<span className="text-blue-600">.</span></h1>
      <div className="space-y-6 bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400">Delivery Address</label>
          <textarea className="w-full bg-gray-50 rounded-2xl p-4 mt-2 outline-none focus:ring-2 focus:ring-blue-600" rows="3" placeholder="Enter your full address..."></textarea>
        </div>
        <div className="p-6 bg-blue-50 rounded-[30px]">
          <p className="text-sm font-bold text-blue-600">Estimated Delivery: Tomorrow, 11 AM</p>
        </div>
        <button 
          onClick={() => {
            alert("Order Placed! 🎉");
            navigate('/rentals');
          }}
          className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-blue-600 transition-all"
        >
          Pay & Start Renting
        </button>
      </div>
    </div>
  );
};

export default Checkout;