"use client";
import { useCallback, useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Bell,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Alert Logs", href: "/alerts", icon: Bell },
  // { name: "Status Page", href: "/status", icon: Globe },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return (
    <>
      {/* Mobile Header - Floating glass nav matching desktop style */}
      <header className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <nav className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl glass-card shadow-lg">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 group"
          >
            <AnimatedLogo
              size="sm"
              className="group-hover:scale-105 transition-all duration-300"
            />
            <span className="font-semibold tracking-tight text-sm">
              WatchTower
            </span>
          </button>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl h-9 w-9 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <div className="relative">
                {mobileOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </div>
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Premium sheet */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 right-0 bottom-0 z-50 w-80 mobile-nav-sheet",
          "transform transition-transform duration-500 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile header inside sheet */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/30">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname.startsWith("/monitor"));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                  "animate-slide-up opacity-0",
                  isActive
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/30">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar - Glass morphism */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 z-40 w-60 glass-card flex-col overflow-hidden">
        {/* Subtle glow accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/30">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
          >
            <AnimatedLogo
              size="md"
              className="group-hover:scale-105 transition-all duration-300"
            />
            <span className="text-lg font-semibold tracking-tight">
              WatchTower
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname.startsWith("/monitor"));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  "animate-slide-up opacity-0 group relative overflow-hidden",
                  isActive
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <item.icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Theme Toggle */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive group"
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
