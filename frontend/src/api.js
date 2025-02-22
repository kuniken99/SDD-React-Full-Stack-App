import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Define the default API path if VITE_API_URL is not set in the environment
const apiUrl = "/choreo-apis/sdddjangoreact/backend/v1";  // Modify to your actual path if needed

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || apiUrl,  // Use VITE_API_URL or fallback to the apiUrl defined
});

// Add an interceptor to include the Authorization token in the request headers
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem(ACCESS_TOKEN);
    
    // If token is present, set it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the config object after modification
    return config;
  },
  (error) => {
    // Return the error in case the request fails
    return Promise.reject(error);
  }
);

export default api;
