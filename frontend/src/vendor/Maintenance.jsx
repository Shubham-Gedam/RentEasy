import React, { useState, useEffect } from "react";
import { Loader2, Wrench, CheckCircle2, User } from "lucide-react";
import vendorApi from "../apis/vendorApi";
import { toast } from "react-toastify";

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Data Fetch Karne ke liye
  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const res = await vendorApi.getMaintenance();
      // Backend controller mein humne key 'requests' rakhi hai
      setLogs(res.data.requests || []);
    } catch (err) {
      toast.error("Logs load nahi ho paye!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Status Update Karne ke liye function
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Iska api method vendorApi.js mein add karna padega
      await vendorApi.updateMaintenanceStatus(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchMaintenanceData(); // List refresh karo
    } catch (err) {
      toast.error("Status update fail ho gaya!");
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );

  return (
    <div className="p-8 text-left min-h-screen bg-[#fcfcfd]">
      <h1 className="text-4xl font-black italic mb-10 uppercase tracking-tighter">
        Maintenance Logs<span className="text-orange-500">.</span>
      </h1>

      {logs.length === 0 ? (
        <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[45px] p-20 flex flex-col items-center justify-center text-center">
          <CheckCircle2 size={32} className="text-orange-500 mb-4" />
          <h3 className="text-xl font-black text-orange-900 uppercase italic">
            All Items are Healthy!
          </h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                {/* Product Image */}
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center overflow-hidden">
                  {log.rental?.product?.images?.[0] ? (
                    <img
                      src={log.rental.product.images[0]}
                      className="w-full h-full object-cover"
                      alt="product"
                    />
                  ) : (
                    <Wrench size={24} />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {log.rental?.product?.name || "Unknown Product"}
                  </h4>

                  <p className="text-gray-500 font-bold text-sm mt-1 italic">
                    Issue:{" "}
                    <span className="text-red-500">
                      "{log.issueDescription}"
                    </span>
                  </p>

                  {/* Reported By Section - Only keep the fixed version */}
                  <div className="flex items-center gap-2 mt-2 text-blue-600">
                    <User size={12} />
                    <p className="text-[11px] font-black uppercase">
                      Reported By:{" "}
                      {log.user?.firstname
                        ? `${log.user.firstname} ${log.user.lastname || ""}`
                        : "Customer"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="mt-6 md:mt-0 flex flex-col items-end gap-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Update Status
                </p>
                <select
                  className="bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-xs font-black uppercase outline-none focus:border-orange-500 transition-all cursor-pointer"
                  value={log.status}
                  onChange={(e) => handleStatusUpdate(log._id, e.target.value)}
                >
                  <option value="PENDING">Pending ⏳</option>
                  <option value="IN_PROGRESS">In Progress 🛠️</option>
                  <option value="RESOLVED">Resolved ✅</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Maintenance;
