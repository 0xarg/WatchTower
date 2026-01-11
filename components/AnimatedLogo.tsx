import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedLogo({ className, size = "md" }: AnimatedLogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-14 w-14"
  };

  const pathSizes = {
    sm: { height: 16, viewBox: "0 0 32 16" },
    md: { height: 18, viewBox: "0 0 36 18" },
    lg: { height: 28, viewBox: "0 0 56 28" }
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-xl bg-foreground shadow-lg overflow-hidden",
      sizes[size],
      className
    )}>
      <svg 
        viewBox={pathSizes[size].viewBox}
        className="heartbeat-line"
        style={{ height: pathSizes[size].height }}
      >
        <path
          d="M0,9 L6,9 L9,3 L12,15 L15,6 L18,12 L21,9 L36,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-background heartbeat-path"
        />
      </svg>
    </div>
  );
}
