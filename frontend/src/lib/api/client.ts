import axios from 'axios';

import { redirectToLoginBrowser } from '@/lib/auth/navigation';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || undefined,
  withCredentials: true,
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      if (!requestUrl.endsWith('/auth/login') && !requestUrl.endsWith('/auth/change-password')) {
        redirectToLoginBrowser();
      }
    }
    return Promise.reject(error);
  }
);
