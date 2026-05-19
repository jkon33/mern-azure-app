import axios from 'axios';

// Auto-detect backend URL based on environment
const getBackendURL = () => {
  // Production (Vercel) - use your Render backend
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-app-backend.onrender.com/api'; // Will update after Render deploy
  }
  // Development (local)
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBackendURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;