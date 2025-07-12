import axios from 'axios'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/util';



const Home = () => {
  const [courses, setcourses] = useState([])
  const [isLoggedin, setisLoggedin] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('user');
    if (token) {
      setisLoggedin(true);
    }else {
      setisLoggedin(false); 
    }
  },[]);

  const handleLogout = async()=>{
    try {
     const response= await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true, // include this if backend sets cookies (e.g., JWT in cookie)
      }); 
      console.log("Logout successful" , response.data);
      toast.success('Logout successful!');
      setisLoggedin(false);
      
    } catch (error) {
      console.log("Error logging out:", error);
      toast.error('Logout failed: ' + (error.response?.data?.message || error.message));
      // Handle logout error (e.g., show a toast or alert)
      
    }
  }

useEffect(()=>{
    const fetchcourses = async ()=>{
    try {
     const response =  await  axios.get(`${BACKEND_URL}/course/courses`,{
      withCredentials: true,
     }
     );
     console.log("Fetched courses:", response.data.courses);
     setcourses(response.data.courses);
        
    } catch (error) {
        console.log("Error fetching courses:", error);
        
    }
}
    fetchcourses()

},[])

 var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 text-white">
      {/* Header */}
      <header className="bg-transparent backdrop-blur-md py-4  flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate('/')}
        >
          CourseHub
        </div>

      <div className="space-x-2 sm:space-x-4">
  {!isLoggedin ? (
    <>
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/signup')}
        className="px-4 py-2 text-sm font-medium text-blue-500 bg-white rounded hover:bg-gray-100 transition"
      >
        Signup
      </button>
    </>
  ) : (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  )}
</div>

      </header>

      {/* Hero Section */}
      <section className="min-h-[35vh] flex flex-col items-center justify-center text-center px-4 pt-32 sm:pt-36">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">CourseHub</h1>
        <div className="space-x-0 space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row">
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Explore Courses
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-blue-700 transition"
          >
            Course Videos
          </button>
        </div>
      </section>

      {/* Courses Slider */}
     <section className='p-10'>
 <Slider {...settings}>
  {
    courses.map((course)=>(
      <div key={course._id} className="p-4 ">
        <div className='relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105'>
          <div className='bg-gray-800 rounded-lg overflow-hidden shadow-lg'>
           <img className='h-32 w-full object-contain' src={course.image?.url} alt={course.title} />

            <div className='p-6 text-center'>
              <h2 className='text-xl font-bold text-white'>{course.title}</h2>
              <button className='mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'>Enroll Now</button>
            </div>
          </div>
        </div>
      </div>
    ))
  }
        
      </Slider>
      
     </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Site Name & Description */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">CourseHub</h2>
            <p className="text-sm mt-2 text-gray-300">
              Empowering learners through accessible and high-quality online education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/courses" className="hover:underline">
                  Courses
                </a>
              </li>
              <li>
                <a href="/videos" className="hover:underline">
                  Course Videos
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:underline">
                  Signup
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact</h3>
            <p className="text-sm text-gray-300">Email: support@coursehub.com</p>
            <p className="text-sm text-gray-300">Phone: +91 9876543210</p>
            <p className="text-sm text-gray-300 mt-2">Address: Bhubaneswar, India</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CourseHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home
