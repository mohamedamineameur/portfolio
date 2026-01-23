import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
        {children}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg">{subtitle}</p>
      )}
    </div>
  );
}
