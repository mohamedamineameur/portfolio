import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  as?: "button" | "span" | "div";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  as = "button",
  ...props
}: ButtonProps) {
  const baseStyles = "min-touch-target font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-surface text-text-primary hover:bg-surface/80",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-text-primary hover:bg-surface",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const sharedClass = cn(baseStyles, variants[variant], sizes[size], className);

  if (as === "button") {
    return (
      <button className={sharedClass} {...props}>
        {children}
      </button>
    );
  }
  if (as === "span") {
    return <span className={sharedClass}>{children}</span>;
  }
  return <div className={sharedClass}>{children}</div>;
}
