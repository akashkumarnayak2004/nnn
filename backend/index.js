import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';
import DB from './db/db.js';
import courseRoutes from './routes/course.route.js';
import userRoutes from './routes/user.router.js';
import adminRoutes from './routes/admin.routes.js';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser';

const app =express();
dotenv.config();
const corsOptions = {
  origin: "https://courseapp-chi.vercel.app", // Replace with your frontend URL
  optionsSuccessStatus: 200,       // For legacy browser support
  credentials: true,               // Allow cookies to be sent
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const PORT = process.env.PORT || 3000;
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cookieParser())
// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.cloud_name , 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret,
});
// Database connection
DB();
app.use('/api/v1/course', courseRoutes);
app.use("/api/v1/user",userRoutes);
 app.use("/api/v1/admin",adminRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})
