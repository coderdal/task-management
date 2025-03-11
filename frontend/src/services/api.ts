import axios from 'axios';
import type { AuthResponse, CreateTaskInput, LoginCredentials, Task, UpdateTaskInput, User, SignupCredentials } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// isteğe token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },
  signup: async (credentials: SignupCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/signup', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data.user;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const tasks = {
  getAll: async (params?: { status?: string; assignedTo?: string }) => {
    const { data } = await api.get<Task[]>('/tasks', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },
  create: async (task: CreateTaskInput) => {
    const { data } = await api.post<Task>('/tasks', task);
    return data;
  },
  update: async (id: string, task: UpdateTaskInput) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, task);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

export const users = {
  getAll: async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
};

export default api; 