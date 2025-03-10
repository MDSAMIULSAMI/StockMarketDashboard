const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:8000/'
  : 'https://stockmarket-dashboard-api.onrender.com';

export default API_BASE_URL; 