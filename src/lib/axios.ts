import axios from 'axios';
import { env } from '../config/env';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: env.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { data: { session } } = await supabase.auth.refreshSession();
      
      if (session?.access_token) {
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export { api };