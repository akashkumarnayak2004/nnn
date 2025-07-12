
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Courses from './pages/Courses'
import Buy from './pages/Buy'
import Purchases from './pages/Purchases'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import Coursecreate from './admin/Coursecreate'
import Updatecourse from './admin/Updatecourse'
import Ourcourses from './admin/Ourcourses'

const App = () => {
  return (
  <>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/purchases" element={<Purchases />} />
    <Route path="/buy/:courseId" element={<Buy />} />
    <Route path="/courses" element={<Courses />} />

    <Route path="/admin/signup" element={<AdminSignup />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/createcourse" element={<Coursecreate />} />
    <Route path="/admin/ourcourses" element={<Ourcourses />} />
    
    <Route path="/admin/updatecourse/:courseId" element={<Updatecourse />} />

    {/* Catch-all route for 404 */}

    <Route path="*" element={<h1 className="text-3xl text-center mt-10">404 Not Found</h1>} />

  </Routes>
  <Toaster/>
  </>
  )
}

export default App