import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true,
});

// Request Interceptor: Har request se pehle token check karega
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ya jis naam se tum save kar rahe ho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;