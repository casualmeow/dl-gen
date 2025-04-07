import { api } from 'entities/user';
import { User } from 'entities/user';

interface TokenResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<TokenResponse>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  getCurrentUser: () => api.get<User>('/auth/me'),
};
