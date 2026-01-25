import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative container mx-auto px-4 py-8 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"          
        />
        <div className="relative">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
