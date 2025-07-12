import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const Signup = async(req, res) => {
    const {firstName, lastName, email, password} = req.body;


    // Validate input using zod
    const userSchema = z.object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long")
    });
    // Validate the request body
    try {
        userSchema.parse({ firstName, lastName, email, password });
    } catch (error) {
        return res.status(400).json({ message: error.errors[0].message });
    }
   
    try {
        if (typeof password !== "string") {
  return res.status(400).json({ message: "Password must be a string" });
}
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
          const hashedPassword= await bcrypt.hash(password, 10);
        const newUser = new User({firstName, lastName, email, password:hashedPassword});
        await newUser.save();
        res.status(201).json({ message: "User signed up successfully", user: newUser });
    } catch (error) {
    res.status(500).json({ message: "Internal server error" });
        console.log("Error in user controller", error);    
    }
    

}

export const login = async(req,res)=>{
    const {email, password} = req.body;
    try {
        const userexist = await User.findOne({ email });
        if (!userexist) {
            return res.status(400).json({ message: "User does not exist" });
        }   
        const isPasswordValid = await bcrypt.compare(password, userexist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credential" });
        }
        const token = jwt.sign({
            id:userexist._id,
   
        }, config.JWT_SECRET, { expiresIn: "300d" });
        res.cookie("token",token);
       

        res.status(200).json({ message: "Login successful", user: userexist, token });
        
    } catch (error) {
     console.log("Error in user controller", error);

        return res.status(500).json({ message: "Internal server error" });
    }

}

export const logout = async(req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in user controller", error);
        res.status(500).json({ message: "Internal server error" });
    }

}
// export const getPurchasedCourses = async (req, res) => {
//     const userId = req.user.id;
//     try {
//      const purchasedCourse = await Purchase.find({userId});
//      let purchasedCourses = [];
//      for (let i = 0; i < purchasedCourse.length; i++) {
//         purchasedCourses.push(purchasedCourse[i].courseId);
    
//      }
//          const courseData = await Course.find({_id: { $in: purchasedCourses }});
//      res.status(200).json({
//         purchasedCourses, courseData
//      });
//     } catch (error) {
//         console.error("Error fetching purchased courses:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }

    
// }
export const getPurchasedCourses = async (req, res) => {
    const userId = req.user.id;

    try {
        const purchases = await Purchase.find({ userId });

        const purchasedCourses = await Promise.all(
            purchases.map(async (purchase) => {
                const course = await Course.findById(purchase.courseId);
                return {
                    purchaseId: purchase._id,
                    userId: purchase.userId,
                    courseId: purchase.courseId,
                    purchasedAt: purchase.createdAt,
                    course: course
                };
            })
        );

        res.status(200).json({ purchasedCourses });

    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
