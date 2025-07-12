import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/util";

const Ourcourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/courses`);
      setCourses(res.data.courses);
    } catch (err) {
      toast.error("Failed to load courses.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

try{await axios.delete(`${BACKEND_URL}/course/delete/${id}`, {
  headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("admin"))?.token || ""}`,
  },
});

   
      toast.success("Course deleted successfully");
      fetchCourses(); // refresh course list
    } catch (err) {
      console.log("Error deleting course:", err);
      toast.error("Failed to delete course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        All Courses
      </h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No courses available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative"
            >
              {course.image && (
                <img
                  src={
                    course.image?.url ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{course.description}</p>
                <p className="mt-3 font-bold text-indigo-600 text-sm">₹{course.price}</p>

                {/* Buttons */}
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => navigate(`/admin/updatecourse/${course._id}`)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ourcourses;
