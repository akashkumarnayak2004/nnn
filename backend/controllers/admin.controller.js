

import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";




export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const schema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    schema.parse({ firstName, lastName, email, password });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin" // ✅ explicitly set
    });

    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role }, // ✅ role included
      config.JWT_ADMIN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const { password: _, ...adminWithoutPassword } = admin._doc;

    res.status(200).json({
      message: "Admin login successful",
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async(req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in user controller", error);
        res.status(500).json({ message: "Internal server error" });
    }

}