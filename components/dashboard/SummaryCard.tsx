"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "success" | "destructive" | "warning";
  delay?: number;
}

const iconBgStyles = {
  default: "bg-secondary",
  success: "bg-success/10",
  destructive: "bg-destructive/10",
  warning: "bg-warning/10",
};

const iconColorStyles = {
  default: "text-foreground",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning",
};

export function SummaryCard({
  title,
  value,
  icon,
  variant = "default",
  delay = 0,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "floating-card floating-card-hover p-4 sm:p-5 lg:p-6",
        "animate-fade-up opacity-0"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "rounded-lg sm:rounded-xl p-2 sm:p-2.5 lg:p-3 transition-transform duration-300 shrink-0",
            iconBgStyles[variant]
          )}
        >
          <div className={iconColorStyles[variant]}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
