import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

// Toggle switch sound - short, satisfying click
const TOGGLE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio on mount
  useEffect(() => {
    audioRef.current = new Audio(TOGGLE_SOUND_URL);
    audioRef.current.volume = 0.3;
    audioRef.current.load();
  }, []);

  const playToggleSound = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch {
      // Ignore audio errors
    }
  }, []);

  const handleThemeChange = useCallback(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    
    playToggleSound();
    setIsAnimating(true);

    // Create the expanding circle overlay
    if (overlayRef.current) {
      overlayRef.current.style.backgroundColor = nextTheme === "dark" ? "hsl(220, 20%, 6%)" : "hsl(40, 20%, 98%)";
      overlayRef.current.style.animation = "none";
      overlayRef.current.offsetHeight; // Trigger reflow
      overlayRef.current.style.animation = "themeExpand 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    }

    // Set theme slightly after animation starts
    setTimeout(() => {
      setTheme(nextTheme);
    }, 200);

    // Remove overlay after animation
    setTimeout(() => {
      setIsAnimating(false);
      if (overlayRef.current) {
        overlayRef.current.style.animation = "none";
      }
    }, 500);
  }, [resolvedTheme, setTheme, playToggleSound]);

  return (
    <>
      {/* Theme transition overlay */}
      {isAnimating && (
        <div
          ref={overlayRef}
          className="theme-transition-overlay"
          style={{
            clipPath: "circle(0% at 100% 0%)",
          }}
        />
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeChange}
        className="relative rounded-xl h-9 w-9 overflow-hidden group"
        disabled={isAnimating}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}