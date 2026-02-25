import axios from 'axios';

const axiosInstance = axios.create({
  // Backend URL + Prefix
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, // Cookies aur Session ke liye zaroori hai
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;