import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import useProductStore from '../store/productStore';
import { Loader2 } from 'lucide-react';

const categories = ["All", "Furniture", "Appliance", "Electronics", "Fitness"];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { products, searchQuery, fetchProducts, loading } = useProductStore();

  // 1. 🔄 Backend se data fetch karne ka logic
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. 🔍 Combined Filter: Category + Search
  const filteredItems = products.filter((item) => {
    // Category Match (Case sensitive check)
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    
    // Search Match (Safe check with optional chaining)
    const name = item.name || "";
    const matchesSearch = name.toLowerCase().includes((searchQuery || "").toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-white pt-16 pb-12 px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            Don't Buy, <span className="text-blue-600 italic">Just Rent.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Premium furniture and appliances delivered to your doorstep.
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-md py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-gray-900 text-white shadow-xl scale-105' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-8 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
            <h3 className="text-xl font-bold text-gray-900">No matches found</h3>
            <p className="text-gray-400">Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;