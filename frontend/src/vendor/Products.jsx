import React, { useState, useEffect } from 'react';
import vendorApi from '../apis/vendorApi';
import productApi from '../apis/productApi';
import { Plus, Trash2, X, Loader2, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. Model ke fields ke saath exact match kiya
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'Furniture', // Capital 'F' as per your Enum
    monthlyRent: '', 
    securityDeposit: '',
    totalStock: '1',
    city: '',
    description: '', 
    image: null 
  });

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await vendorApi.getVendorProducts(); 
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Products load nahi ho paye!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, pakka delete karna hai?")) return;
    try {
      await productApi.deleteProduct(id);
      toast.success("Item hat gaya!");
      setProducts(products.filter(item => item._id !== id));
    } catch (err) {
      toast.error("Delete fail ho gaya!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Saare fields append karo
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("monthlyRent", formData.monthlyRent);
    data.append("securityDeposit", formData.securityDeposit);
    data.append("totalStock", formData.totalStock);
    data.append("city", formData.city);
    data.append("description", formData.description);
    if (formData.image) data.append("images", formData.image); 

    try {
      await productApi.createProduct(data);
      toast.success("Product Publish Ho Gaya! 🚀");
      setIsModalOpen(false);
      // Reset form
      setFormData({ name: '', category: 'Furniture', monthlyRent: '', securityDeposit: '', totalStock: '1', city: '', description: '', image: null });
      fetchMyProducts(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Kuch locha ho gaya!");
    }
  };

  return (
    <div className="p-10 text-left">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
          Inventory<span className="text-blue-600">.</span>
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Rent/mo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(item => (
                <tr key={item._id} className="hover:bg-gray-50/30 transition-all">
                  <td className="px-8 py-6 flex items-center gap-4 font-bold text-gray-900">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/150'} 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm" 
                    /> 
                    {item.name}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-500 uppercase text-center">{item.category}</td>
                  <td className="px-8 py-6 text-right font-black text-blue-600">₹{item.monthlyRent}</td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => handleDelete(item._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Isko Form Fields ke saath update kiya */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full p-10 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
             <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black italic">List Item</h2>
               <button onClick={() => setIsModalOpen(false)}><X /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Product Name</label>
                  <input required value={formData.name} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Category</label>
                      <select value={formData.category} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                        onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Furniture">Furniture</option>
                        <option value="Appliance">Appliance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">City</label>
                      <input required value={formData.city} placeholder="Mumbai" className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                        onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Monthly Rent</label>
                      <input required type="number" value={formData.monthlyRent} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                        onChange={e => setFormData({...formData, monthlyRent: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Security Deposit</label>
                      <input required type="number" value={formData.securityDeposit} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                        onChange={e => setFormData({...formData, securityDeposit: e.target.value})} />
                    </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Total Stock</label>
                  <input required type="number" value={formData.totalStock} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                    onChange={e => setFormData({...formData, totalStock: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Description</label>
                  <textarea value={formData.description} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                    onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Product Image</label>
                  <input type="file" accept="image/*" required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" 
                    onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                </div>

                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black hover:bg-gray-900 transition-all">
                  Publish Now
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;