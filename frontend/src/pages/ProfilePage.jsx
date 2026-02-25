import React from 'react';
import useAuthStore from '../store/authStore';
import { User, Mail, Shield, Package, MapPin, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#fcfcfd] pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
            Account <span className="text-blue-600">Settings.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage your profile and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 text-center">
              <div className="relative inline-block group">
                <div className="w-32 h-32 bg-blue-100 rounded-[35px] flex items-center justify-center text-blue-700 text-4xl font-black border-4 border-white shadow-lg overflow-hidden">
                  {user?.fullname?.firstname?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-1 right-1 bg-gray-900 text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="mt-6 text-xl font-bold text-gray-900">
                {user?.fullname?.firstname} {user?.fullname?.lastname}
              </h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{user?.role}</p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 p-6 rounded-[40px] text-white">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Activity</p>
                <Package size={20} className="text-blue-400" />
              </div>
              <p className="text-2xl font-black">12 <span className="text-sm font-normal text-gray-400">Rentals</span></p>
            </div>
          </div>

          {/* Right Column: Detailed Settings */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-2xl shadow-gray-100/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><User size={20}/></div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">First Name</label>
                    <input readOnly value={user?.fullname?.firstname || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-800 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Last Name</label>
                    <input readOnly value={user?.fullname?.lastname || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-800 outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input readOnly value={user?.email || ''} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-gray-800 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-2xl shadow-gray-100/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Shield size={20}/></div>
                  <h3 className="text-xl font-bold text-gray-900">Security</h3>
                </div>
                <button className="text-blue-600 font-bold text-sm hover:underline">Change Password</button>
              </div>
              
              <div className="p-5 bg-gray-50 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">🔐</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400 font-medium">Keep your account extra secure</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;