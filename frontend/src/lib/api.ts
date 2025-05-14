import axios, { AxiosRequestConfig } from 'axios';
import { mockApi } from './mockApi';

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = false; // Toggle this to switch between mock and real API

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

interface RequestData {
  [key: string]: unknown;
}

interface ApiResponse<T = unknown> {
  data: T;
}

// Create a wrapper that uses mock data when enabled
const apiWrapper = {
  post: async (url: string, data: RequestData): Promise<ApiResponse> => {
    // if (USE_MOCK) {
    //   return mockApi.post(url, data);
    // }
    return api.post(url, data);
  },
  get: async (url: string): Promise<ApiResponse> => {
    if (USE_MOCK) {
      return mockApi.get(url);
    }
    return api.get(url);
  },
  put: async (url: string, data: RequestData): Promise<ApiResponse> => {
    if (USE_MOCK) {
      return mockApi.put(url, data);
    }
    return api.put(url, data);
  },
  delete: async (url: string): Promise<ApiResponse> => {
    if (USE_MOCK) {
      return mockApi.delete(url);
    }
    return api.delete(url);
  }
};

export default apiWrapper; 