
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51QqIAYG1zbBVIkA7TSbD73LE5XJ51jcphxFXrY4cPBpK3i5Gp0ritZYy33JqUvUs8hRUL8YtUhv9WQYGlI08be81004icMGmSX");

createRoot(document.getElementById('root')).render(

 <Elements stripe={stripePromise}>
           <BrowserRouter>
           <App />
        </BrowserRouter>
            
          </Elements>

   
)
