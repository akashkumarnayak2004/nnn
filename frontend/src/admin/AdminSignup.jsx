import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/util';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Admin Form submitted:', form);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`, // Make sure this endpoint exists in your backend
        form,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Admin Signup successful:', response.data);
      toast.success('Admin account created!');
      navigate('/admin/login'); // Adjust path as needed
    } catch (error) {
      console.error('Admin Signup error:', error.response?.data || error.message);
      toast.error('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      {/* Navbar */}
      <header className="bg-transparent backdrop-blur-md py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate('/')}
        >
          CourseHub
        </div>
        <div className="space-x-2 sm:space-x-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate('/admin/signup')}
            className="px-4 py-2 text-sm font-medium text-blue-500 bg-white rounded hover:bg-gray-100 transition"
          >
            Join as Admin
          </button>
        </div>
      </header>

      {/* Signup Form */}
      <div className="pt-32 flex items-center justify-center px-4">
        <div className="bg-gray-900 bg-opacity-60 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Admin Signup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              Signup as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
