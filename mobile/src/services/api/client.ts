import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/services/storage';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token expired - could trigger logout
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
