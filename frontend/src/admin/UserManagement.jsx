import React, { useState, useEffect } from "react";
import { Trash2, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";
import adminApi from "../../apis/adminApi"; // Tera admin api file
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers(); // GET /api/admin/users
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Users load nahi ho paye!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      // PUT /api/admin/users/:id/block
      await adminApi.toggleUserBlock(id, { isBlocked: currentStatus }); 
      toast.success(currentStatus ? "User Unblocked!" : "User Blocked!");
      fetchUsers();
    } catch (err) {
      toast.error("Action fail ho gaya!");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      // PUT /api/admin/users/:id/role
      await adminApi.updateUserRole(id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("Role change fail!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic animate-pulse">Fetching Users Box...</div>;

  return (
    <div className="bg-white rounded-[45px] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
              <td className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                    {user.fullname.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-black uppercase italic text-sm">{user.fullname}</p>
                    <p className="text-xs text-gray-400 font-bold">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <select 
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="bg-gray-100 border-none rounded-lg px-3 py-1 text-[10px] font-black uppercase outline-none focus:ring-2 ring-orange-500 cursor-pointer"
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-8 text-xs font-black uppercase">
                {user.isActive ? (
                  <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={14}/> Active</span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1"><ShieldAlert size={14}/> Blocked</span>
                )}
              </td>
              <td className="p-8 text-right">
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => handleToggleBlock(user._id, !user.isActive)}
                    className={`p-3 rounded-xl transition-all ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                  >
                    <UserCog size={16} />
                  </button>
                  <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;