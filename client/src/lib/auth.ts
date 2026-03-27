import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="http://localhost:3001/api/auth">
      {children}
    </SessionProvider>
  );
}