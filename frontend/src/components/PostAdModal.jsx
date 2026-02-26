import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import productApi from '../apis/productApi';
import useModalStore from '../store/useModalStore';

const PostAdModal = ({ refreshData }) => {
  const { isPostAdOpen, closePostAd } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Furniture', monthlyRent: '', securityDeposit: '', totalStock: '1', city: '', description: '', image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') data.append("images", formData.image);
      else data.append(key, formData[key]);
    });

    try {
      await productApi.createProduct(data);
      toast.success("Product Live! 🚀");
      setFormData({ name: '', category: 'Furniture', monthlyRent: '', securityDeposit: '', totalStock: '1', city: '', description: '', image: null });
      closePostAd();
      if (refreshData) refreshData(); 
    } catch (err) {
      toast.error("Publishing fail ho gayi!");
    } finally { setIsSubmitting(false); }
  };

  if (!isPostAdOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePostAd}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-300 text-left">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">List New Item</h2>
          <button onClick={closePostAd}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required placeholder="Product Name" className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600" 
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-gray-50 rounded-2xl p-4 outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="Furniture">Furniture</option>
              <option value="Appliance">Appliance</option>
            </select>
            <input required placeholder="City" className="bg-gray-50 rounded-2xl p-4 outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Rent/mo" className="bg-gray-50 rounded-2xl p-4 outline-none" value={formData.monthlyRent} onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})} />
            <input required type="number" placeholder="Deposit" className="bg-gray-50 rounded-2xl p-4 outline-none" value={formData.securityDeposit} onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})} />
          </div>

          <input type="file" accept="image/*" className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
          
          <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black hover:bg-gray-900 transition-all flex justify-center items-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAdModal;