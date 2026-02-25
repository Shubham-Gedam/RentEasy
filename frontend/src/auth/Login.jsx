import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import axiosInstance from '../apis/axiosInstance';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        const token = response.data.token || response.data.accessToken;
        if (token) {
          localStorage.setItem('token', token);
        }
        toast.success(`Welcome back, ${response.data.user.fullname?.firstname || 'User'}! 👋`);
        navigate('/'); 
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid Credentials!";
      toast.error(errorMsg);
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200 rotate-12">
            <span className="text-white font-black text-3xl italic">R</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">
            Welcome Back<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">Rent premium lifestyle, effortlessly.</p>
        </div>

        {/* Card Section */}
        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-2xl shadow-gray-100/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-gray-900'} text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95`}
            >
              {loading ? "Verifying..." : "Sign In"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-bold">
              New here? <Link to="/register" className="text-blue-600 cursor-pointer hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;