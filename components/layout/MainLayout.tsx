"use client";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background page-gradient">
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />

      <Sidebar />
      <main className="lg:pl-72 pt-20 lg:pt-0 relative">
        <div className="min-h-screen p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
