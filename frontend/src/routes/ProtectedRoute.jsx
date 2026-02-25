import React, { useState } from 'react';
import { Package, IndianRupee, Image as ImageIcon, Tag, PlusCircle } from 'lucide-react';
import axiosInstance from '../apis/axiosInstance';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    category: 'furniture', // Default
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kyunki image bhejni hai, toh FormData use karna padega
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('pricePerDay', formData.pricePerDay);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      await axiosInstance.post('/products/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.log(err);
      
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-gray-100 border border-gray-100">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
          <PlusCircle className="text-blue-600" /> List New Item
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Product Name</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input name="name" onChange={handleChange} required className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="e.g. Luxury Sofa" />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Price Per Day</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input name="pricePerDay" type="number" onChange={handleChange} required className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="500" />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Description</label>
            <textarea name="description" onChange={handleChange} rows="3" className="w-full bg-gray-50 rounded-2xl py-3 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="Describe your item..."></textarea>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <select name="category" onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-gray-600 appearance-none">
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="appliances">Appliances</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Product Image</label>
            <div className="relative">
              <input type="file" onChange={handleImageChange} className="hidden" id="img-upload" accept="image/*" />
              <label htmlFor="img-upload" className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl py-2 px-4 flex items-center justify-center gap-2 text-blue-600 font-bold cursor-pointer hover:bg-blue-100 transition-all">
                <ImageIcon size={18} /> {formData.image ? formData.image.name : "Upload Photo"}
              </label>
            </div>
          </div>

          <button className="md:col-span-2 w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-gray-200">
            Publish Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;