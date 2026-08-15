import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
});

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('uglost_auth');
  if (saved) {
    try {
      config.headers.Authorization = `Bearer ${JSON.parse(saved).token}`;
    } catch {
      /* ignore malformed auth */
    }
  }
  return config;
});

export default api;
