// src/components/ui/Badge.tsx
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline" | "accent" | "success" | "warning" | "destructive";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "secondary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors select-none";
    
    const variants = {
      primary: "bg-primary/10 text-primary border-primary/20",
      secondary: "bg-secondary text-secondary-foreground border-border",
      outline: "text-foreground border-border bg-transparent",
      accent: "bg-accent/10 text-accent border-accent/20",
      success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20"
    };

    const variantClass = variants[variant] || "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantClass} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
