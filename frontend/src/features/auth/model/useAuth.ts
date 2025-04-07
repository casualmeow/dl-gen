import { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthContextType } from './authContext';
import { authApi } from '../api/authApi';
import { User } from 'entities/user';

export function useProvideAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      const { token, userId, name, email: userEmail } = res.data;
      localStorage.setItem('auth_token', token);
      setUser({ id: userId, name, email: userEmail });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.register(name, email, password);
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const res = await authApi.getCurrentUser();
      setUser(res.data);
      return res.data;
    } catch {
      localStorage.removeItem('auth_token');
      setUser(null);
      return null;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
