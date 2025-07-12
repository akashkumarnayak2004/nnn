import React, { useState } from "react";
import Coursecreate from "./Coursecreate";
import Ourcourses from "./Ourcourses";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin"); // or sessionStorage, based on usage
    navigate("/"); // go to home page after logout
  };

  const handleHomeClick = () => {
    navigate("/"); // go to home page
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome to the admin dashboard. Here you can manage courses, view statistics, and more.
            </p>
          </div>
        );
      case "create":
        return <Coursecreate />;
      case "courses":
        return <Ourcourses />;
      default:
        return <h2 className="text-xl text-gray-500">Select an option</h2>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        {/* Home -> navigate to user home page */}
        <button
          onClick={handleHomeClick}
          className="block w-full text-left p-2 rounded hover:bg-gray-700"
        >
          Home Page
        </button>

        {/* Dashboard Home */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "dashboard" ? "bg-gray-700" : ""
          }`}
        >
          Dashboard
        </button>

        {/* Create Course */}
        <button
          onClick={() => setActiveTab("create")}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "create" ? "bg-gray-700" : ""
          }`}
        >
          Create Course
        </button>

        {/* All Courses */}
        <button
          onClick={() => setActiveTab("courses")}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "courses" ? "bg-gray-700" : ""
          }`}
        >
          All Courses
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="block w-full text-left p-2 mt-8 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
