"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, ReactNode } from "react";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster as Sonner, Toaster } from "./ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
