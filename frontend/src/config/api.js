const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://stockmarket-dashboard-api.onrender.com'
  : 'https://stockmarket-dashboard-api.onrender.com';

export default API_BASE_URL; 