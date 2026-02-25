import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../apis/axiosInstance';
import { toast } from 'react-toastify'; // Import Toast
import { User, Mail, Lock, UserCheck, ArrowRight } from 'lucide-react'; // Icons for better UI

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      email: formData.email,
      fullname: {
        firstname: formData.firstname,
        lastname: formData.lastname
      },
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await axiosInstance.post('/auth/register', payload);
      
      // ✅ Professional Success Toast
      toast.success("Account created! Ab login karo bhai. 🎉");
      navigate('/login');
    } catch (err) {
      // ❌ Professional Error Toast
      const errorMsg = err.response?.data?.message || "Registration failed!";
      toast.error(errorMsg);
      console.error("Register Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">
            Join Rent<span className="text-blue-600">Ease.</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">Start your premium rental journey today.</p>
        </div>

        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-2xl shadow-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">First Name</label>
                <input 
                  name="firstname"
                  type="text" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                  placeholder="John"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Last Name</label>
                <input 
                  name="lastname"
                  type="text" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                  placeholder="Doe"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Join as</label>
              <select 
                name="role"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-bold text-gray-600 cursor-pointer appearance-none"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="user">Customer (I want to rent)</option>
                <option value="vendor">Vendor (I want to list items)</option>
              </select>
            </div>

            <button 
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-gray-900'} text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 mt-4`}
            >
              {loading ? "Creating..." : "Create Account"} <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-gray-400">
            Already a member? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;