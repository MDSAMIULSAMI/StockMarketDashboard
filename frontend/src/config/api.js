const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://stockmarket-dashboard-api.onrender.com'
    : 'http://localhost:8000');

export const API_ENDPOINTS = {
  STOCKS: `${API_BASE_URL}/api/stocks/`
};

export default API_BASE_URL; 