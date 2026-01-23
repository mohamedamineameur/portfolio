import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext.tsx";
import { UIProvider } from "./UIContext.tsx";
import { ThemeProvider } from "./ThemeContext.tsx";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>{children}</UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
