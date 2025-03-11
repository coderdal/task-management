import { createContext, useContext, useEffect, useState } from 'react';
import type { User, SignupCredentials } from '../types';
import { auth } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (tcid: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await auth.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (tcid: string, password: string) => {
    const { user } = await auth.login({ tcid, password });
    setUser(user);
  };

  const signup = async (credentials: SignupCredentials) => {
    const { user } = await auth.signup(credentials);
    setUser(user);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 