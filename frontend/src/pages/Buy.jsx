
// export default Buy;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import  {BACKEND_URL}  from '/utils/util.js';

const Buy = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();

  // ✅ Fetch course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to load course");
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to purchase the course");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      return;
    }

    setIsLoading(true);

    try {
      const { data: paymentIntentRes } = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const clientSecret = paymentIntentRes.clientSecret;

      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.user?.firstName || "Student",
            email: user?.user?.email || "student@example.com",
          },
        },
      });

      if (error) {
        toast.error("Payment failed: " + error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success("Payment successful!");
        navigate('/purchases');
      }

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Purchased " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">{course?.title || "Buy Course"}</h2>
        <p className="text-gray-600 mb-4 text-center">{course?.description || "Loading description..."}</p>

        <form onSubmit={handlePurchase}>
          <CardElement className="p-3 border rounded mb-4" />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={!stripe || isLoading}
          >
            {isLoading
              ? "Processing..."
              : course?.price
              ? `Pay ₹${course.price}`
              : "Loading Course..."}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy;
