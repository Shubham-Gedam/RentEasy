import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, RefreshCcw, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../apis/axiosInstance'; 

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch User's Rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/rentals/my-rentals');
        // Backend response structure ke hisaab se data set karo
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

  // ✅ 2. Handle Maintenance/Damage Issue (Postman Structure Match)
  const handleReportIssue = async (rentalId) => {
    const issue = prompt("Describe the problem: (e.g. AC not cooling properly)");
    
    if (!issue) return;

    try {
      // 💡 Bilkul wahi payload jo tune Postman mein pass kiya tha
      await axiosInstance.post('/maintenance', {
        rentalId: rentalId,
        issueDescription: issue, // Postman key match
        priority: "HIGH"         // Defaulting to HIGH as per your test
      });
      
      toast.success("Issue report ho gaya! Maintenance team jald hi check karegi.");
    } catch (err) {
      console.error("Maintenance API Error:", err);
      toast.error("Issue report fail ho gaya! Check console.");
    }
  };

  // 3. Handle Return Request
  const handleReturn = async (id, name) => {
    if (window.confirm(`Kya aap sach mein ${name} wapas karna chahte hain?`)) {
      try {
        await axiosInstance.put(`/rentals/return/${id}`);
        toast.success("Return Request Raised! 🚛");
        
        // UI Update: Status ko instantly badal do
        setRentals(prev => 
          prev.map(rental => rental.id === id ? { ...rental, status: 'RETURN_REQUESTED' } : rental)
        );
      } catch (err) {
        toast.error("Return request fail ho gayi!");
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (rentals.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
        <Package size={80} className="text-gray-200 mb-6" />
        <h2 className="text-3xl font-black italic text-gray-400 uppercase tracking-tighter text-gray-300">
          Empty Fleet<span className="text-blue-600">.</span>
        </h2>
        <p className="text-gray-400 mt-2 font-medium">Aapne abhi tak kuch bhi rent nahi kiya hai.</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-[25px] font-black hover:bg-black transition-all shadow-lg shadow-blue-100 uppercase text-xs tracking-widest"
        >
          Explore Catalog
        </button>
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
          <div key={item.id} className="bg-white border border-gray-100 rounded-[40px] p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between shadow-sm hover:shadow-xl transition-all gap-8">
            
            {/* PRODUCT INFO SECTION */}
            <div className="flex items-center gap-8 flex-1">
              <div className="w-32 h-32 rounded-[30px] overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-inner">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                  alt={item.productName}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    item.status === 'ACTIVE' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-gray-50 text-gray-500 border-gray-100'
                  }`}>
                    ● {item.status}
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12}/> {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none">{item.productName}</h3>
                <p className="text-4xl font-black text-blue-600 mt-4 tracking-tighter">₹{item.totalAmount}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-auto">
              {/* ⚠️ REPORT ISSUE BUTTON */}
              <button 
                onClick={() => handleReportIssue(item.id)}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-600 hover:text-white shadow-sm"
              >
                <AlertTriangle size={14} /> Report Issue
              </button>

              {/* 🚛 RETURN BUTTON */}
              <button 
                onClick={() => handleReturn(item.id, item.productName)}
                disabled={item.status === 'COMPLETED' || item.status === 'RETURN_REQUESTED'}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  (item.status === 'COMPLETED' || item.status === 'RETURN_REQUESTED')
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent'
                  : 'bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white shadow-sm'
                }`}
              >
                <RefreshCcw size={14} className={item.status === 'RETURN_REQUESTED' ? 'animate-spin' : ''} /> 
                {item.status === 'RETURN_REQUESTED' ? 'Processing' : 'Return'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* RENTAL POLICY INFO */}
      <div className="mt-16 p-10 bg-gray-950 rounded-[45px] shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <ShieldAlert className="text-blue-500 flex-shrink-0 z-10" size={40} />
        <div className="z-10 text-center md:text-left">
          <h4 className="font-black text-white uppercase text-xs tracking-[0.3em]">Fleet Security & Policy</h4>
          <p className="text-sm text-gray-400 mt-2 italic max-w-2xl font-medium">
            Damage hone par security deposit se deduction ho sakta hai. Pick-up scheduling ke liye hamari team 24 ghante mein aapko call karegi.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <Package size={200} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default MyRentals;