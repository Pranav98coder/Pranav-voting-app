// src/app/utils/api.js (make sure this is a client component if using app router)
"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "/", // Replace with your actual backend URL
  withCredentials: true, // Important for sending cookies/JWT with every request
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to Unauthorized access (401 status)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized request, redirecting to sign in page.");
      // This forces the browser to navigate to the home page (which could be the login page)
      window.location.href = "/";
    }
    return Promise.reject(error); // Delegate other errors back to your components
  }
);

export default api; // Export the configured instance
