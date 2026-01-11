import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SyncButtonProps {
  onSync?: () => void;
  className?: string;
}

export function SyncButton({ onSync, className }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSync?.();
    setIsSyncing(false);
    toast.success("Data synced successfully");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className={cn(
        "gap-2 glass-card border-border/40 hover:bg-secondary/50",
        className
      )}
    >
      <RefreshCw className={cn(
        "h-4 w-4 transition-transform duration-500",
        isSyncing && "animate-spin"
      )} />
      <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync"}</span>
    </Button>
  );
}
