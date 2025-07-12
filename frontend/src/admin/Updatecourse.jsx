import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/util";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
      const course = res.data.course;
      setForm({
        title: course.title,
        description: course.description,
        price: course.price,
        image: null,
      });
    } catch (err) {
      toast.error("Failed to fetch course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.put(`http://localhost:4001/api/v1/course/update/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("admin"))?.token || ""}`,
        },
      });

      toast.success("Course updated!");
      navigate("/admin/ourcourses");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">Update Course</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">New Image (optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
