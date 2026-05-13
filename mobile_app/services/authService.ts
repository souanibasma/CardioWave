import apiClient from './apiClient';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
};

export const authService = {
  login: async (payload: LoginPayload) => {
    // Adjust endpoint as needed; placeholder uses /auth/login
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },
  // Add more auth methods (logout, refresh token) as needed
};