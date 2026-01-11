import axios from 'axios';

// export const API_URL = 'https://sukoon-perfumes.com';
export const API_URL = process.env.Node_env === 'production' ? 'https://sukoon-perfumes.com' : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة التوكن تلقائياً لو موجود
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;