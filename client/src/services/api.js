import axios from 'axios';

// IMPORTANT: Use your actual Render backend URL
// Replace this with your Render URL!
const BACKEND_URL = 'https://mern-azure-app-wsvo.onrender.com'; // ← CHANGE THIS!

// For local development
const getBaseURL = () => {
  // Check if we're in production (Vercel) or local
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  // Production - use your Render backend
  return `${BACKEND_URL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  error => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('📥 Response Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;