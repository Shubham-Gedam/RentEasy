import React, { useState } from 'react';
import useProductStore from '../store/productStore';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';

const VendorProducts = () => {
  const { products, addProduct, removeProduct } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Furniture', rent: '', deposit: '', imageUrl: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({ ...formData, id: Date.now(), rent: Number(formData.rent), deposit: Number(formData.deposit) });
    setIsModalOpen(false);
    setFormData({ name: '', category: 'Furniture', rent: '', deposit: '', imageUrl: '' });
  };

  return (
    <div className="p-10 text-left">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Inventory<span className="text-blue-600">.</span></h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100">
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Rent</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/30 transition-all">
                <td className="px-8 py-6 flex items-center gap-4 font-bold text-gray-900">
                  <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" /> {item.name}
                </td>
                <td className="px-8 py-6 text-sm font-bold text-gray-500">{item.category}</td>
                <td className="px-8 py-6 text-right font-black text-blue-600">₹{item.rent}</td>
                <td className="px-8 py-6 text-center">
                  <button onClick={() => removeProduct(item.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Modal Logic Re-used Here */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full p-10 shadow-2xl animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black italic">List Item</h2>
               <button onClick={() => setIsModalOpen(false)}><X /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <input required placeholder="Name" className="w-full bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
                <select className="w-full bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Furniture</option><option>Appliances</option><option>Fitness</option>
                </select>
                <input required type="number" placeholder="Rent" className="w-full bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, rent: e.target.value})} />
                <input required type="url" placeholder="Image URL" className="w-full bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black">Publish Now</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;