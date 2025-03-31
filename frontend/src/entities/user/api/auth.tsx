import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, getCurrentUser, UserResponse } from 'shared/api/supabase';

// Types for authentication
export interface User extends UserResponse {
  username: string;
  email?: string;
  full_name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// Helper functions for authentication using Supabase
export const fetchToken = async (email: string, password: string): Promise<string> => {
  try {
    // signIn function in supabase.ts already makes a call to /auth/login endpoint
    // which returns the access_token from our FastAPI backend
    const token = await signIn(email, password);
    return token || '';
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to authenticate');
  }
};

export const fetchUser = async (token: string): Promise<User> => {
  try {
    // The token is already being used by the apiClient interceptor in supabase.ts
    // We just need to call getCurrentUser which will use the token from localStorage
    // or we can set it temporarily if it's not yet in localStorage
    const currentToken = localStorage.getItem('auth_token');
    if (!currentToken && token) {
      // Temporarily set the token for this request
      localStorage.setItem('auth_token', token);
    }
    
    const user = await getCurrentUser();
    
    // Clean up if we temporarily set the token
    if (!currentToken && token) {
      localStorage.removeItem('auth_token');
    }
    
    if (!user) {
      throw new Error('Failed to fetch user data');
    }
    return user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user data');
  }
};

// Create authentication context
type AuthContextType = AuthState | undefined;
export const AuthContext = createContext<AuthContextType>(undefined);

// Authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          // Token might be expired or invalid
          console.error('Error fetching user data:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
          setError('Session expired. Please login again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Get token from backend through the signIn function
      const newToken = await fetchToken(email, password);
      if (!newToken) {
        throw new Error('Authentication failed: No token received');
      }
      
      // Store token first so it can be used for the user data request
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      
      // Fetch user data with the new token
      const userData = await fetchUser(newToken);
      setUser(userData);
      
      return true;
    } catch (err) {
      // Clean up any token that might have been set
      localStorage.removeItem('auth_token');
      setToken(null);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Call the backend logout endpoint
      await signOut();
      // Clean up local state regardless of backend response
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } catch (err) {
      // Even if the backend logout fails, we still want to clear local state
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      // Set error for user feedback
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthState = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    error,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication in components
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};