import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Define the default API path if VITE_API_URL is not set in the environment
const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; 

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

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  return api.post("/api/update-profile-picture/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// Fetch artist information
export const getArtistInfo = () => {
  return api.get('/api/artist/info/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching artist info:', error);
      throw error;
    });
};

// Fetch artist training sessions
export const getArtistTrainingSessions = () => {
  return api.get('/api/artist/training-sessions/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching artist training sessions:', error);
      throw error;
    });
};

// Fetch artist injuries
export const getArtistInjuries = () => {
  return api.get('/api/artist/injuries/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching artist injuries:', error);
      throw error;
    });
};

// Fetch artist club activities
export const getArtistClubActivities = () => {
  return api.get('/api/artist/club-activities/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching artist club activities:', error);
      throw error;
    });
};

// Fetch all injuries (Coach/Director)
export const getAllInjuries = () => {
  return api.get('/api/coach/director/injuries/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching all injuries:', error);
      throw error;
    });
};

// Add a new injury (Coach only)
export const addInjury = (data) => {
  return api.post('/api/coach/add-injury/', data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding injury:', error);
      throw error;
    });
};

// Add a new training session (Coach only)
export const addTrainingSession = (data) => {
  return api.post('/api/coach/add-training-session/', data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding training session:', error);
      throw error;
    });
};

// Mark artist attendance (Coach only)
export const markAttendance = (data) => {
  return api.post('/api/coach/mark-attendance/', data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error marking attendance:', error);
      throw error;
    });
};

// Create a new club activity (Coach/Director)
export const createClubActivity = (data) => {
  return api.post('/api/coach/director/create-club-activity/', data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error creating club activity:', error);
      throw error;
    });
};

export const getCoachDashboard = () => {
  return api.get('/api/coach/dashboard/')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching coach dashboard:', error);
      throw error;
    });
};

export default api;
