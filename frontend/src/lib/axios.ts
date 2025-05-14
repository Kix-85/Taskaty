import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request Interceptor from axios.ts:', config);
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    console.error('Request Error from axios.ts:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor from axios.ts:', response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("There is a fucking error", error.response.data.message)
      // Handle unauthorized access
      // window.location.href = '/auth';
    }
    console.error('Response Error from axios.ts:', error.response.data.message);
    return error
  }
);

export default api; 