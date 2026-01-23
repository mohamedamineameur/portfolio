import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../config/api.js";
import type { User } from "../types/api.js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await apiClient.get("/api/auth/me");
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post("/api/auth/login", { email, password });
    setUser(response.data.user);
  };

  const logout = async (): Promise<void> => {
    await apiClient.post("/api/auth/logout");
    setUser(null);
  };

  const register = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post("/api/auth/register", { email, password });
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
