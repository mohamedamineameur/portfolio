import { createContext, useContext, useState, ReactNode } from "react";
import { apiClient } from "../config/api.js";
import type { User } from "../types/api.js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ user: User | null }>("/api/auth/me");
      const u = response.data.user ?? null;
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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
