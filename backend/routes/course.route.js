import express from 'express';
import { buyCourses, courseDetails, CreateCourse, deleteCourse, getAllCourses,  updateCourse } from '../controllers/course.controllers.js';
import  {authMiddleware}  from '../middelware/user.middelware.js';
import { adminMiddleware } from '../middelware/admin.middelware.js';


const router = express.Router();
router.post("/create",adminMiddleware,CreateCourse);
router.put("/update/:courseId",adminMiddleware,updateCourse);
router.delete("/delete/:courseId",adminMiddleware,deleteCourse);
router.get("/courses",getAllCourses);
router.get("/:courseId",courseDetails); 
router.post("/buy/:courseId",authMiddleware,buyCourses);



export default router;