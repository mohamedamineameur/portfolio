import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext.tsx";
import { UIProvider } from "./UIContext.tsx";
import { ThemeProvider } from "./ThemeContext.tsx";
import { LanguageProvider } from "./LanguageContext.tsx";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UIProvider>{children}</UIProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
