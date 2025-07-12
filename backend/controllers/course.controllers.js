import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from "../models/purchase.model.js";
import Stripe from 'stripe';
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log("Stripe initialized with secret key:", config.STRIPE_SECRET_KEY);






export const  CreateCourse = async (req, res)=>{
    const adminId= req.admin.id;
const {title , description,  price} = req.body;
try {
    if (!title || !description  || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.files.image;
    if (!image) {
        return res.status(400).json({ message: "Image is required" });
    }
    const allowedTypes = [ 'image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({ message: "Invalid image type" });
    }
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
    if (!cloud_response) {
        return res.status(500).json({ message: "Image upload failed" });
    }
const courseData ={
    title,
    description,
    price,
    image:{
        public_id: cloud_response.public_id,
        url: cloud_response.url
    },
  creatorId: adminId,
}

const course = await Course.create(courseData);
   res.status(201).json({
        message: "Course created successfully",course
    });
    
} catch (error) {
    console.error(error);
    res.status(500).json({
        message: " error creating course",
        error: error.message
    });
}
};

export const updateCourse = async (req, res) => {
  const adminId = req.admin.id; // ✅ fix destructure
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    // Optional: Handle image update
    if (req.files?.image) {
      const image = req.files.image;
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({ message: "Invalid image type" });
      }

      const uploaded = await cloudinary.uploader.upload(image.tempFilePath);
      course.image = {
        public_id: uploaded.public_id,
        url: uploaded.url
      };
    }

    // Update other fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (price) course.price = price;

    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });

  } catch (error) {
    console.log("Error in updateCourse:", error);
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.admin.id; // ✅ fix destructure
  const { courseId } = req.params;

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    // ✅ Optional: Delete from Cloudinary
    if (course.image?.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }

    await Course.deleteOne({ _id: courseId });

    res.status(200).json({ message: "Course deleted successfully" });

  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};



export const getAllCourses = async (req, res) => {
    try {
        const course = await Course.find({});
        res.status(200).json({
            message: "Courses fetched successfully",
            courses: course
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


export const courseDetails = async (req, res) => {
    const {courseId} = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
        message: "Course details fetched successfully",
        course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Error fetching course details",
        error: error.message
    });
  }

}



// export const buyCourses = async (req, res) => {
//    const userId = req.user.id;
//     const {courseId} = req.params;
//     // if (!userId || !courseId) {
//     //     return res.status(400).json({ message: "User ID and Course ID are required" });
//     // }
//     try {
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         const existingPurchase = await Purchase.findOne({ userId, courseId });
//         if (existingPurchase) { 
//             return res.status(400).json({ message: "You have already purchased this course" });
//         }
//        //stripe payment 
//        const amount = course.price * 100; // Convert to cents
//         const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//         const newPurchase = new Purchase({
//             userId,
//             courseId,
//             clientSecret: paymentIntent.client_secret,
//             course,
//         });
//         await newPurchase.save();
//         res.status(200).json({  
//             message: "Course purchased successfully",
//             purchase: newPurchase
//         });
      



        
//     } catch (error) {
//         console.log("Error in buyCourses:", error);
//         res.status(500).json({ message: "Error processing course purchase" });
//         console.error(error);
//     }
// }

export const buyCourses = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Check if already purchased
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ message: "You have already purchased this course" });
    }

    // ✅ 3. Create Stripe payment intent using course price
    const amountInPaise =course.price; // Stripe requires amount in smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "usd",
     payment_method_types: ['card'],
    
    });

    // ✅ 4. Save purchase
    const newPurchase = new Purchase({
      userId,
      courseId,
      
    });

    await newPurchase.save();

    res.status(200).json({
      message: "Course purchased successfully",
      purchase: newPurchase,
      clientSecret: paymentIntent.client_secret,
      course,
    });

  } catch (error) {
    console.log("Error in buyCourses:", error);
    res.status(500).json({ message: "Error processing course purchase", error: error.message });
  }
};
