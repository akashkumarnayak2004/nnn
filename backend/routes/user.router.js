import express from 'express';
import { getPurchasedCourses, login, logout, Signup } from '../controllers/user.controller.js';
import { authMiddleware } from '../middelware/user.middelware.js';



const router = express.Router();

router.post("/signup",Signup);
router.post("/login",login);
router.get("/logout", logout);
router.get("/purchased",authMiddleware,getPurchasedCourses); // Uncomment if you want to use this route

export default router;