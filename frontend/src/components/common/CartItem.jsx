import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import useCartStore from '../../store/cartStore';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCartStore();

  return (
    <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-gray-100 mb-4 transition-all hover:shadow-lg hover:shadow-gray-100">
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50">
        <img src={item.imageUrl || item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.category}</p>
      </div>

      <div className="text-right mr-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase">Monthly Rent</p>
        <p className="text-xl font-black text-gray-900">₹{item.rent || item.baseRent}</p>
      </div>

      <button 
        onClick={() => removeFromCart(item.id)}
        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;