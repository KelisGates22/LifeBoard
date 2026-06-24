import axios from 'axios';
import type { JobApplication, LoginRequest, RegisterRequest, AuthResponse } from '../types';

const BASE_URL = 'http://localhost:5237/api';


const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>('/auth/register', data);

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>('/auth/login', data);

// Job application endpoints
export const getJobs = () =>
  api.get<JobApplication[]>('/jobapplications');

export const getJobById = (id: number) =>
  api.get<JobApplication>(`/jobapplications/${id}`);

export const createJob = (data: Omit<JobApplication, 'id' | 'userId' | 'updatedAt'>) =>
  api.post<JobApplication>('/jobapplications', data);

export const updateJob = (id: number, data: Partial<JobApplication>) =>
  api.put<JobApplication>(`/jobapplications/${id}`, data);

export const deleteJob = (id: number) =>
  api.delete(`/jobapplications/${id}`);