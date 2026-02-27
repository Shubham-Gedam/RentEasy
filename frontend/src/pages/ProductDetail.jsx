import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Loader2,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import axiosInstance from "../apis/axiosInstance";
import { toast } from "react-toastify"; // 💡 Toast for alerts

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  // 🔄 Backend se product mangwana
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Product load nahi hua!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  // 💡 FUNCTION: Rent Now handling
  const handleRentNow = () => {
    // Yahan check kar sakte ho agar user logged in hai ya nahi
    // Agar nahi hai, toh login page pe bhejo
    
    // Sab sahi hai toh checkout page pe details leke jao
    navigate(`/checkout/${product._id}`); 
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found!</h2>
        <button onClick={() => navigate("/")} className="text-blue-600 font-bold underline">
          Go back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 text-left">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold transition-all"
      >
        <ChevronLeft size={20} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Product Image */}
        <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-gray-100 group h-[500px]">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/600'}
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
              ₹{product.monthlyRent}
            </span>
            <span className="text-lg text-gray-400 font-medium">/ month</span>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            {product.description || `Premium quality ${product.name} for your home.`}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleRentNow} // 💡 UPDATED: onClick added
              className="flex-1 bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
            >
              Rent Now
            </button>
            <button
              onClick={() => {
                addToCart(product);
                toast.success("Item added to bag! 🛒");
              }}
              className="flex-1 bg-white border-2 border-gray-100 py-5 rounded-[24px] font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;