"use client";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        throw error;
      }

      // Update this route to redirect to an authenticated route. The user already has an active session.
    } catch (error: unknown) {
      alert(error);
      console.log(error);
    } finally {
    }
  };

  //   const handleGoogleLogin = () => {
  //     router.push("/dashboard");
  //   };

  return (
    <div className="min-h-screen bg-background page-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      {/* Grid background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Theme toggle in corner */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-sm animate-scale-in opacity-0 relative">
        {/* Login Card */}
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle glow accent at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {/* Logo and header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground mb-5 sm:mb-6 shadow-xl">
              <Activity className="h-7 w-7 text-background" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to continue to WatchTower
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-3 h-12 text-base font-medium rounded-xl glass-card border-border/40 hover:bg-secondary/50 relative overflow-hidden group"
            onClick={() => handleLogin()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg className="h-5 w-5 relative z-10" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="relative z-10">Continue with Google</span>
          </Button>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
            By continuing, you agree to our{" "}
            <a href="#" className="text-foreground hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-foreground hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
