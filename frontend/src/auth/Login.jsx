import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200 rotate-12">
            <span className="text-white font-black text-3xl italic">R</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Welcome Back<span className="text-blue-600">.</span></h1>
          <p className="text-gray-400 font-medium mt-2">Rent premium lifestyle, effortlessly.</p>
        </div>

        {/* Card */}
        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-2xl shadow-gray-100/50">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="email" placeholder="name@example.com" className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium" />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95">
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-bold">
              New here? <span className="text-blue-600 cursor-pointer hover:underline">Create an account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;