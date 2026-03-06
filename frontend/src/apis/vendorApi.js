import axiosInstance from './axiosInstance';

const vendorApi = {
    // 1. Vendor ke apne products dekhne ke liye
    getMyProducts: () => axiosInstance.get('/vendor/products'),

    // 2. IMPORTANT: Vendor ke orders/rentals fetch karne ke liye 
    // (Check karna backend mein iski route bani hai ya nahi)
    getVendorOrders: () => axiosInstance.get('/vendor/rentals'), 

    // 3. Delivery status update karne ke liye
    // Tere backend route: /vendor/rental/:id/delivery
    updateDelivery: (id) => axiosInstance.put(`/vendor/rental/${id}/delivery`),

    // 4. Damage report karne ke liye
    // Tere backend route: /vendor/rental/:id/damage
    reportDamage: (id, description) => 
        axiosInstance.put(`/vendor/rental/${id}/damage`, { description }),

    // 5. Maintenance records
    getMaintenance: () => axiosInstance.get('/vendor/maintenance'),
};

export default vendorApi;