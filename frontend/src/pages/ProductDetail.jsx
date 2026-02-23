import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductStore();

  const addToCart = useCartStore((state) => state.addToCart);

  // Find product from store
  const product = products.find((p) => p.id === Number(id));

  if (!product)
    return (
      <div className="p-20 text-center font-bold text-2xl">
        Product not found!
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold transition-all"
      >
        <ChevronLeft size={20} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Product Image */}
        <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-gray-100 group">
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit mb-4">
            {product.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-black text-blue-600">
              ₹{product.rent || product.baseRent}
            </span>
            <span className="text-lg text-gray-400 font-medium">/ month</span>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            Premium quality {product.name.toLowerCase()} for your home. Why pay
            full price when you can enjoy luxury with zero commitment? Free
            delivery and installation included.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              Free Maintenance
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <RotateCcw size={20} />
              </div>
              Easy Returns
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
              Rent Now
            </button>
            <button
              onClick={() => {
                addToCart(product);
                alert("Item added to bag! 🛒");
              }}
              className="flex-1 bg-white border-2 border-gray-100 py-5 rounded-[24px] font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Add to Cart
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
            <CreditCard size={16} /> Refundable Security Deposit: ₹
            {product.deposit || "1500"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
