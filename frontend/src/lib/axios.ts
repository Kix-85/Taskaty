import axios from 'axios';
import { toast } from 'sonner';

// Get the base URL from environment variables
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';

      switch (status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/auth';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          toast.error('Resource not found');
          break;
        case 422:
          toast.error('Invalid data provided');
          break;
        case 429:
          toast.error('Too many requests. Please try again later');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(message);
      }
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('No response from server. Please check your connection.');
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      toast.error('Failed to send request');
      return Promise.reject(error);
    }
  }
);

export default api; 