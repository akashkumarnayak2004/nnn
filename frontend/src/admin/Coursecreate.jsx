import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/util";

const Coursecreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

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

    if (!form.title || !form.description || !form.price || !form.image) {
      toast.error("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("image", form.image);

    try {
      const response = await axios.post(
       `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
       Authorization: `Bearer ${JSON.parse(localStorage.getItem("admin"))?.token || ""}`,

       

          },
        }
      );
      toast.success("Course created successfully!");
      setForm({ title: "", description: "", price: "", image: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Course creation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Create New Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Course description"
              rows={4}
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Course price"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default Coursecreate;
