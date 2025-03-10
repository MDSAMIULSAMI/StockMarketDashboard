const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://stockmarket-dashboard-api.onrender.com'
  : 'http://localhost:8000';

export default API_BASE_URL; 