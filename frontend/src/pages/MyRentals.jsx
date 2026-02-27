import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, RefreshCcw, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../apis/axiosInstance'; // 👈 Sahi instance use karo

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        // 💡 API Call to backend
        const res = await axiosInstance.get('/rentals/my-rentals');
        console.log("Backend Response:", res.data);
        
        // 💡 Data map karo
        setRentals(res.data.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Rental data load nahi ho paya!");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleReturn = async (id, name) => {
    if (window.confirm(`Kya aap sach mein ${name} wapas karna chahte hain?`)) {
      try {
        await axiosInstance.put(`/rentals/return/${id}`);
        toast.success("Return Request Raised! 🚛");
        // Update UI
        setRentals(prev => 
          prev.map(rental => rental.id === id ? { ...rental, status: 'COMPLETED' } : rental)
        );
      } catch (err) {
        toast.error("Return request fail ho gayi!");
      }
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40}/></div>;

  if (rentals.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
        <Package size={80} className="text-gray-200 mb-6" />
        <h2 className="text-3xl font-black italic text-gray-400 uppercase tracking-tighter">Koi Rentals Nahi Hain</h2>
        <button onClick={() => navigate('/')} className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-3xl font-black hover:bg-gray-900 transition-all">Start Renting</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      <h1 className="text-5xl font-black italic tracking-tighter uppercase text-gray-950 mb-10">
        My Fleet<span className="text-blue-600">.</span>
      </h1>
      
      <div className="grid grid-cols-1 gap-8">
        {rentals.map((item) => (
          // 💡 FIXED: 'key' prop ab unique hai
          <div key={item.id} className="bg-white border border-gray-100 rounded-[30px] p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between shadow-sm hover:shadow-xl transition-all gap-6">
            
            <div className="flex items-center gap-6 flex-1">
              <div className="w-28 h-28 rounded-[24px] overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-cover" 
                  alt={item.productName}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    ● {item.status}
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12}/> {item.startDate} - {item.endDate}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-950 tracking-tight">{item.productName}</h3>
                <p className="text-3xl font-black text-gray-900 mt-3">₹{item.totalAmount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-3">
              <button 
                onClick={() => handleReturn(item.id, item.productName)}
                disabled={item.status === 'COMPLETED'}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  item.status === 'COMPLETED' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-red-600 border border-red-100 hover:bg-red-50'
                }`}
              >
                <RefreshCcw size={16} /> Return
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Policy Box */}
      <div className="mt-12 p-8 bg-orange-50 rounded-[32px] border border-orange-100 flex items-start gap-4">
        <ShieldAlert className="text-orange-500 flex-shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-bold text-orange-900 uppercase text-xs tracking-widest">Rental Policy</h4>
          <p className="text-sm text-orange-800/80 mt-1 italic">Pick-up charge ₹299/- lagega.</p>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;