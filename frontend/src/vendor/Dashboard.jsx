import React, { useState } from 'react';
import useProductStore from '../store/productStore';
import { Plus, Package, IndianRupee, Trash2, LayoutGrid, List, X } from 'lucide-react';

const VendorDashboard = () => {
  // 1. Store se removeProduct bhi le lo
  const { products, addProduct, removeProduct } = useProductStore();
  
  // 2. Sirf ek hi state rakhte hain modal ke liye
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Furniture',
    rent: '',
    deposit: '',
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Unique ID generate karne ke liye Date.now()
    addProduct({ 
      ...formData, 
      id: Date.now(),
      rent: Number(formData.rent), 
      deposit: Number(formData.deposit) 
    });
    
    setIsModalOpen(false); // Modal close karo
    setFormData({ name: '', category: 'Furniture', rent: '', deposit: '', imageUrl: '' });
    alert("Product Listed Successfully! 🚀");
  };

  const totalRent = products.reduce((acc, curr) => acc + (Number(curr.rent) || Number(curr.baseRent) || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight text-left">Vendor Console</h1>
            <p className="text-gray-500 font-medium">Manage your rental inventory and earnings</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} // Fixed: ab sahi state call ho rahi hai
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={20} strokeWidth={3} /> List New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Active Listings</p>
            <h3 className="text-3xl font-black text-gray-900">{products.length}</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <IndianRupee size={24} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Estimated Monthly Rev</p>
            <h3 className="text-3xl font-black text-gray-900">₹{totalRent}</h3>
          </div>
          <div className="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl shadow-gray-200">
             <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-4">
              <List size={24} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pending Orders</p>
            <h3 className="text-3xl font-black">02</h3>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Live Inventory</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button className="p-2 bg-white rounded-md shadow-sm"><LayoutGrid size={16}/></button>
                <button className="p-2 text-gray-400"><List size={16}/></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Rent</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-left">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={item.imageUrl || item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <span className="font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">₹{item.rent || item.baseRent}</td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => removeProduct(item.id)} // Delete functionality
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-300 text-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">List New Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-500 mb-8 font-medium italic">Enter details to make your product live.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Ergonomic Office Chair"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Furniture</option>
                    <option>Appliances</option>
                    <option>Electronics</option>
                    <option>Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rent /mo</label>
                  <input 
                    required
                    type="number" 
                    placeholder="₹ 0.00"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.rent}
                    onChange={(e) => setFormData({...formData, rent: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Security Deposit</label>
                <input 
                  required
                  type="number" 
                  placeholder="₹ Refundable Amount"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.deposit}
                  onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                <input 
                  required
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-gray-900 shadow-xl shadow-blue-100 transition-all active:scale-95">
                  Confirm & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;