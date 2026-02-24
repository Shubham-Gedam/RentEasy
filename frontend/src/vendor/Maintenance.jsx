import React from 'react';
import {  AlertCircle } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="p-8 text-left min-h-screen">
       <h1 className="text-3xl font-black italic mb-6 uppercase">Maintenance Logs</h1>
       <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-black text-orange-900">All Items are Healthy!</h3>
          <p className="text-orange-700/60 font-medium max-w-xs mt-2 italic text-sm">
            Jab kisi product mein issue aayega, wo yahan service ke liye list hoga.
          </p>
       </div>
    </div>
  )
}
export default Maintenance;