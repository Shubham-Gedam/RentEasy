import React, { useState, useEffect } from "react";
import { Wrench, Clock, CheckCircle, AlertCircle } from "lucide-react";
import adminApi from "../apis/adminApi";
import { toast } from "react-toastify";

const MaintenanceTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalMaintenance = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllMaintenance(); // Route: GET /api/admin/maintenance
      setRequests(res.data.requests);
    } catch (err) {
        console.log(err);
      toast.error("Maintenance logs fetch nahi ho paye!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalMaintenance();
  }, []);

  if (loading) return <div className="p-10 text-center font-black italic uppercase animate-pulse">Scanning Faulty Items...</div>;

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product & User</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vendor</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Issue</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
              <td className="p-6">
                <p className="font-black uppercase text-sm italic">{req.rental?.product?.name || "Unknown"}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase">By: {req.user?.fullname}</p>
              </td>
              <td className="p-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                   {req.rental?.product?.vendor?.name || "Global Vendor"}
                </span>
              </td>
              <td className="p-6">
                <p className="text-xs font-medium text-gray-600 italic">"{req.issueDescription}"</p>
              </td>
              <td className="p-6">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${
                  req.status === 'RESOLVED' ? 'text-green-500' : 'text-orange-500'
                }`}>
                  {req.status === 'RESOLVED' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                  {req.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;