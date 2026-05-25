// src/components/ui/Button.tsx
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    // 기본 테일윈드 스타일 클래스 구성
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] cursor-pointer";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground",
      ghost: "hover:bg-secondary/60 hover:text-secondary-foreground",
      link: "text-primary underline-offset-4 hover:underline active:scale-100 bg-transparent p-0 rounded-none"
    };

    const sizes = {
      sm: "h-9 px-3.5 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-7 text-base",
      icon: "h-10 w-10 p-0 rounded-xl"
    };

    const variantClass = variants[variant] || "";
    const sizeClass = sizes[size] || "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
