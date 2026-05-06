// StripeWrapper.js
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Use your Stripe publishable key here (demo key for test only)
const stripePromise = loadStripe("pk_test_51N9...your_test_key_here");

const StripeWrapper = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeWrapper;
