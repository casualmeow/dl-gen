import { ReactNode } from 'react';
import { AuthContext } from 'features/auth/';
import { useProvideAuth } from 'features/auth/';

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useProvideAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
