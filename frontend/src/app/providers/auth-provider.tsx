import { ReactNode } from 'react';
import { AuthProvider as AuthContextProvider } from 'entities/user/api/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};
