import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/util';

const Purchases = () => {
  const [purchase, setPurchases] = useState([]);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    setIsLoggedin(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success('Logout successful!');
      setIsLoggedin(false);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      if (!token) {
        toast.error("Please login to view purchases");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchased`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchases(response.data.purchasedCourses);
        toast.success("Purchases loaded!");
      } catch (error) {
        toast.error('Failed to load purchases: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const activeClass = (path) =>
    location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-200';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-5 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate('/')} className={`px-4 py-2 rounded text-left ${activeClass('/')}`}>Home</button>
          <button onClick={() => navigate('/courses')} className={`px-4 py-2 rounded text-left ${activeClass('/courses')}`}>Courses</button>
          <button onClick={() => navigate('/purchases')} className={`px-4 py-2 rounded text-left ${activeClass('/purchases')}`}>Purchases</button>
          {/* <button onClick={() => navigate('/settings')} className={`px-4 py-2 rounded text-left ${activeClass('/settings')}`}>Settings</button> */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-white text-gray hover:bg-red-600 mt-4 text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Purchased Courses</h1>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading your purchases...</p>
        ) : purchase.length === 0 ? (
          <p className="text-center text-gray-600">You haven't purchased any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {purchase.map((item) => (
              <div
                key={item.courseId}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={item.course?.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={item.course?.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-1">{item.course?.title}</h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.course?.description}</p>
                  <div className="text-gray-800 font-medium">₹{item.course?.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Purchases;
