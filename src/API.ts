// API.ts
import axios from 'axios';
import type { User, UsersResponse } from './types';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
});

export const fetchUsers = async (): Promise<UsersResponse> => {
  const { data } = await api.get('/users');
  return {
    users: data,
    total: data.length,
  };
};

export const fetchUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};