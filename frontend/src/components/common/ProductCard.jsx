import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden">
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs font-medium mb-4 italic">Free maintenance included</p>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Starts at</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">₹{product.rent || product.baseRent}</span>
                <span className="text-sm font-medium text-gray-400">/mo</span>
              </div>
            </div>
            
            <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-90 transition-all duration-500">
              <Plus size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;