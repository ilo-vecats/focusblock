import axios from 'axios';

// Ensure the API URL ends with /api
const getApiUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
  // Remove trailing slash and ensure /api is at the end
  const cleanUrl = url.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getApiUrl()
});

// Log the base URL in development to help debug
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', api.defaults.baseURL);
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor to log errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;