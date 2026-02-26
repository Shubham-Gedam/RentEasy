import axiosInstance from './axiosInstance';

const vendorApi = {
    // 1. Vendor ke apne products dekhne ke liye
    // Backend: router.get("/products", ...)
    getMyProducts: () => axiosInstance.get('/vendor/products'),

    // 2. Delivery status update karne ke liye
    // Backend: router.put("/rental/:id/delivery", ...)
    updateDeliveryStatus: (id, status) => 
        axiosInstance.put(`/vendor/rental/${id}/delivery`, { status }),

    // 3. Damage report karne ke liye
    // Backend: router.put("/rental/:id/damage", ...)
    reportDamage: (id, damageData) => 
        axiosInstance.put(`/vendor/rental/${id}/damage`, damageData),

    // 4. Maintenance records dekhne ke liye
    getMaintenance: () => axiosInstance.get('/vendor/maintenance'),
};

export default vendorApi;