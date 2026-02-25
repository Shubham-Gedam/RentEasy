import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../apis/axiosInstance';

const Register = () => {
  // 1. Data structure ko backend ke hisab se rakha hai
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. Data format karna: Postman wala structure yahan banao
    const payload = {
      email: formData.email,
      fullname: {
        firstname: formData.firstname,
        lastname: formData.lastname
      },
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await axiosInstance.post('/auth/register', payload);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      console.log(err.response?.data); // Debugging ke liye best hai
      alert(err.response?.data?.message || "Registration failed. Check console.");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
        <h2 className="text-3xl font-black mb-2 text-center text-blue-600">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join RentEase and start renting today.</p>
        
        <div className="space-y-4">
          {/* First Name & Last Name (Side by Side) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
              <input 
                name="firstname"
                type="text" 
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John"
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
              <input 
                name="lastname"
                type="text" 
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Doe"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="john@example.com"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">I am a...</label>
            <select 
              name="role"
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="user">Renter (Customer)</option>
              <option value="vendor">Vendor (Lister)</option>
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 mt-4 shadow-lg shadow-blue-200">
            Create Free Account
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;