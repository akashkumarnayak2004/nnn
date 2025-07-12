import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Add this at the top
import { BACKEND_URL } from '../../utils/util';


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    setIsLoggedin(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
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

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleBuy = (courseId) => {
    if (!isLoggedin) {
      toast.error('Please login to buy a course.');
      return;
    }
    toast.success('Redirecting to payment...');
    console.log('Buy course:', courseId);
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Courses</h1>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg w-full sm:w-64 outline-none"
          />
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-600">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={course.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="text-gray-800 font-medium mb-4">₹{course.price}</div>
                  {isLoggedin ? (
  <Link
    to={`/buy/${course._id}`}
    className="mt-auto py-2 text-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
  >
    Buy Now
  </Link>
) : (
  <button
    disabled
    className="mt-auto py-2 rounded-md bg-gray-400 text-white font-semibold cursor-not-allowed"
  >
    Login to Buy
  </button>
)}

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
