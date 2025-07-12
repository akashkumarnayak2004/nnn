import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET= process.env.JWT_SECRET;
const JWT_ADMIN_SECRET= process.env.JWT_ADMIN_SECRET
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export default {
    JWT_SECRET,
    JWT_ADMIN_SECRET,
    STRIPE_SECRET_KEY
}