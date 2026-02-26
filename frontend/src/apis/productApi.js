import axiosInstance from './axiosInstance';

const productApi = {
    getAllProducts: () => axiosInstance.get('/products'),

    // Backend route: /products/create
    createProduct: (formData) => axiosInstance.post('/products/create', formData),

    deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

    // Single product fetch karne ke liye (if needed)
    getSingleProduct: (id) => axiosInstance.get(`/products/${id}`),
};

export default productApi;