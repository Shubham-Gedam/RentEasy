import axiosInstance from './axiosInstance';

const MaintenanceApis = {
    // 1. User ke liye: Nayi Damage/Repair Request dalna
    // Backend: router.post("/", authMiddleware.protect, maintenanceController.createRequest)
    createRequest: (maintenanceData) => 
        axiosInstance.post('/maintenance', maintenanceData),

    // 2. User ke liye: Sirf apni requests dekhna
    // Backend: router.get("/my", authMiddleware.protect, maintenanceController.getUserRequests)
    getMyRequests: () => 
        axiosInstance.get('/maintenance/my'),

    // 3. Admin/Vendor ke liye: Sabhi users ki requests fetch karna
    // Backend: router.get("/", authMiddleware.protect, authMiddleware.authorizeRoles("admin", "vendor"), maintenanceController.getAllRequests)
    getAllRequests: () => 
        axiosInstance.get('/maintenance'),

    // 4. Admin/Vendor ke liye: Request status update karna (e.g., Pending to Resolved)
    // Backend: router.put("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin", "vendor"), maintenanceController.updateStatus)
    updateStatus: (id, status) => 
        axiosInstance.put(`/maintenance/${id}`, { status })
};

export default MaintenanceApis;