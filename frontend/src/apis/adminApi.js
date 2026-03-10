import axiosInstance from "./axiosInstance"; 

const adminApi = {
  // 1. Dashboard Summary (Revenue, Users count, etc.)
  getDashboardSummary: () => axiosInstance.get("/admin/reports/summary"),

  // 2. User Management
  getAllUsers: (role = "") => axiosInstance.get(`/admin/users${role ? `?role=${role}` : ""}`),
  updateUserRole: (id, data) => axiosInstance.put(`/admin/users/${id}/role`, data),
  toggleUserBlock: (id, data) => axiosInstance.put(`/admin/users/${id}/block`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),

  // 3. Rentals Monitoring
  getAllRentals: () => axiosInstance.get("/admin/rentals"),
  getRentalDetails: (id) => axiosInstance.get(`/admin/rentals/${id}`),

  // 4. Maintenance (Sab vendors ka data ek saath)
  getAllMaintenance: (status = "") => 
    axiosInstance.get(`/admin/maintenance${status ? `?status=${status}` : ""}`),

  // 5. Damages
  getAllDamages: () => axiosInstance.get("/admin/damages"),
  resolveDamage: (rentalId, data) => axiosInstance.put(`/admin/damages/${rentalId}/resolve`, data),
};

export default adminApi;