"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pause, Play, ExternalLink, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MonitorUI } from "@/lib/types/ui/monitors";

export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "down";
  lastChecked: string;
  avgResponseTime: number;
  isPaused: boolean;
}

interface MonitorTableProps {
  monitors: MonitorUI[];
  onPauseToggle: (id: string, status: boolean) => void;
}

export function MonitorTable({ monitors, onPauseToggle }: MonitorTableProps) {
  const router = useRouter();

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <>
      {/* Mobile Cards View */}
      <div
        className="sm:hidden space-y-3 animate-fade-up opacity-0"
        style={{ animationDelay: "200ms" }}
      >
        {monitors.map((monitor, index) => (
          <div
            key={monitor.id}
            className="floating-card p-4 animate-fade-up opacity-0"
            style={{ animationDelay: `${250 + index * 50}ms` }}
            onClick={() => router.push(`/monitor/${monitor.id}`)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shrink-0",
                    monitor.status === "up"
                      ? "bg-success pulse-dot"
                      : "bg-destructive pulse-dot"
                  )}
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{monitor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {truncateUrl(monitor.url)}
                  </p>
                </div>
              </div>
              <Badge
                variant={monitor.status === "up" ? "up" : "down"}
                className="shrink-0"
              >
                {monitor.status === "up" ? "Up" : "Down"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {monitor.lastChecked}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {monitor.avgResponseTime}ms
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPauseToggle(monitor.id, monitor.isPaused);
                  }}
                  className="h-7 w-7 rounded-lg"
                >
                  {monitor.isPaused ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div
        className="hidden sm:block floating-card overflow-hidden animate-fade-up opacity-0"
        style={{ animationDelay: "200ms" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Monitor
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Last Checked
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  Avg Response
                </th>
                <th className="px-4 lg:px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {monitors.map((monitor, index) => (
                <tr
                  key={monitor.id}
                  className={cn(
                    "group transition-colors duration-200 hover:bg-secondary/30",
                    "animate-fade-up opacity-0"
                  )}
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <td className="px-4 lg:px-6 py-4 lg:py-5">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div
                        className={cn(
                          "h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full shrink-0",
                          monitor.status === "up"
                            ? "bg-success pulse-dot"
                            : "bg-destructive pulse-dot"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm lg:text-base truncate">
                          {monitor.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground mt-0.5">
                          <span className="truncate max-w-[120px] lg:max-w-none">
                            {truncateUrl(monitor.url)}
                          </span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 lg:py-5">
                    <Badge variant={monitor.status === "up" ? "up" : "down"}>
                      {monitor.status === "up" ? "Operational" : "Down"}
                    </Badge>
                  </td>
                  <td className="px-4 lg:px-6 py-4 lg:py-5 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {monitor.lastChecked}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 lg:py-5 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {monitor.avgResponseTime}ms
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 lg:py-5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/monitor/${monitor.id}`)}
                        className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onPauseToggle(monitor.id, monitor.isPaused)
                        }
                        className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                      >
                        {monitor.isPaused ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
