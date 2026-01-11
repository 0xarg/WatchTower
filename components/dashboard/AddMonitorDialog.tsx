"use client";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AddMonitorDialogProps {
  onAdd: (monitor: {
    name: string;
    url: string;
    interval: number;
    timeout: number;
    isPaused: boolean;
  }) => void;
}

export function AddMonitorDialog({ onAdd }: AddMonitorDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(60);
  const [timeout, setTimeout] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const supabase = createClient();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    try {
      new URL(url);
    } catch {
      newErrors.url = "Please enter a valid URL";
    }

    if (interval < 60) {
      newErrors.interval = "Interval must be at least 60 seconds";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(name);
    console.log(url);
    // if (!validate()) return;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      // console.log(monitorAdd);
      if (!user || userError) {
        alert("not auhtenticated");
        throw new Error("Not authenticated");
      }
      const { error } = await supabase.from("monitors").insert({
        user_id: user.id,
        name: name,
        url: url,
        interval_seconds: interval,
        timeout_seconds: timeout,
        is_paused: isPaused,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      alert("Error creating monitor");
      console.log(error);
    }

    onAdd({ name, url, interval, timeout, isPaused });
    setOpen(false);
    setName("");
    setUrl("");
    setInterval(60);
    setTimeout(30);
    setIsPaused(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full sm:w-auto rounded-xl">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Monitor</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto floating-card border-0">
        <DialogHeader>
          <DialogTitle>Add New Monitor</DialogTitle>
          <DialogDescription>
            Create a new monitor to track your website's uptime.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Monitor Name</Label>
            <Input
              id="name"
              placeholder="My Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
            {errors.name && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-xl"
            />
            {errors.url && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.url}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-sm">
                Check Interval (s)
              </Label>
              <Input
                id="interval"
                type="number"
                min={60}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="rounded-xl"
              />
              {errors.interval && (
                <p className="text-xs text-destructive">{errors.interval}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout" className="text-sm">
                Timeout (s)
              </Label>
              <Input
                id="timeout"
                type="number"
                min={1}
                value={timeout}
                onChange={(e) => setTimeout(Number(e.target.value))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 sm:p-4">
            <div className="space-y-0.5 min-w-0">
              <Label htmlFor="paused" className="text-sm">
                Start Paused
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Won't check until resumed
              </p>
            </div>
            <Switch
              id="paused"
              checked={isPaused}
              onCheckedChange={setIsPaused}
              className="ml-3 shrink-0"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl w-full sm:w-auto">
              Create Monitor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
