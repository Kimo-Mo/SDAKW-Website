import axios from 'axios';

import { redirectToLoginBrowser } from '@/lib/auth/navigation';

function getBaseURL(): string {
  if (typeof window === 'undefined') {
    // Server-side execution (SSR in Next.js Server Components / prefetching)
    return (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api/v1'
    ).replace(/\/+$/, '');
  }
  // Client-side execution (browser)
  return (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/+$/, '');
}

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 15_000,
});

// Attach Bearer token from localStorage as fallback for browsers that block third-party cookies (e.g. iOS Safari ITP)
apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    config.baseURL = getBaseURL();
  } else {
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      const requestUrl = error.config?.url || '';
      if (!requestUrl.endsWith('/auth/login') && !requestUrl.endsWith('/auth/change-password')) {
        redirectToLoginBrowser();
      }
    }
    return Promise.reject(error);
  }
);
