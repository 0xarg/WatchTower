"use client";

import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Pause,
  Play,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MonitorDetail } from "@/lib/types/ui/monitorDetail";

// Mock data
const mockMonitor = {
  id: "1",
  name: "Production API",
  url: "https://api.example.com",
  status: "up" as const,
  interval: 60,
  isPaused: false,
};

const mockChecxks = [
  {
    id: "1",
    time: "2 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 145,
    error: null,
  },
  {
    id: "2",
    time: "3 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 152,
    error: null,
  },
  {
    id: "3",
    time: "4 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 138,
    error: null,
  },
  {
    id: "4",
    time: "5 min ago",
    status: "down",
    httpCode: 503,
    responseTime: 0,
    error: "Service Unavailable",
  },
  {
    id: "5",
    time: "6 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 167,
    error: null,
  },
  {
    id: "6",
    time: "7 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 143,
    error: null,
  },
  {
    id: "7",
    time: "8 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 155,
    error: null,
  },
  {
    id: "8",
    time: "9 min ago",
    status: "up",
    httpCode: 200,
    responseTime: 149,
    error: null,
  },
];

const mockIncidents = [
  {
    id: "1",
    status: "resolved",
    startedAt: "Dec 28, 2024 14:32",
    resolvedAt: "Dec 28, 2024 14:35",
    duration: "3 min",
  },
  {
    id: "2",
    status: "resolved",
    startedAt: "Dec 25, 2024 09:15",
    resolvedAt: "Dec 25, 2024 09:18",
    duration: "3 min",
  },
];

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function MonitorDetails({ params }: PageProps) {
  const router = useRouter();
  const [monitor, setMonitor] = useState<MonitorDetail>();
  const [loading, setIsloading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(monitor?.name);
  const [editUrl, setEditUrl] = useState(monitor?.url);
  const [editInterval, setEditInterval] = useState(monitor?.interval_seconds);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    const { id } = await params;
    try {
      const { data, error } = await supabase
        .from("monitors")
        .select(
          `*,
    check_results (
      id,
      status,
      status_code,
      response_time_ms,
      created_at
    ),
    incidents (
      id,
      started_at,
      resolved_at,
      is_open,
      alerts (
        id,
        channel,
        sent_at
      )
    )`
        )
        .eq("id", id) // Replace with actual ID
        .order("created_at", {
          referencedTable: "check_results",
          ascending: false,
        })

        .limit(50, { foreignTable: "check_results" }) // vital for performance!
        .single();

      console.log(data);
      setMonitor(data);
      if (error) throw error;
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }, []);

  // const handleTogglePause = () => {
  //   setMonitor((prev) => ({ ...prev, isPaused: !prev?.is_paused }));
  // };

  const handleDelete = () => {
    router.push("/dashboard");
  };

  // const handleEdit = () => {
  //   setMonitor((prev) => ({
  //     ...prev,
  //     name: editName,
  //     url: editUrl,
  //     interval: editInterval,
  //   }));
  //   setEditDialogOpen(false);
  // };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-5xl">
        {/* Header */}
        <div className="animate-fade-up opacity-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="mt-0.5 sm:mt-1 rounded-xl shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0",
                      monitor?.check_results[0].status! === "up"
                        ? "bg-success pulse-dot"
                        : "bg-destructive pulse-dot"
                    )}
                  />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight truncate">
                    {monitor?.name}
                  </h1>
                  <Badge
                    variant={
                      monitor?.check_results[0].status! === "up" ? "up" : "down"
                    }
                    className="shrink-0"
                  >
                    {monitor?.check_results[0].status! === "up"
                      ? "Operational"
                      : "Down"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-muted-foreground">
                  <a
                    href={monitor?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-none"
                  >
                    <span className="truncate">{monitor?.url}</span>
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  </a>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Every {monitor?.interval_seconds}s
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-10 sm:ml-0">
              <Button
                variant="outline"
                // onClick={handleTogglePause}
                className="gap-2 rounded-xl text-xs sm:text-sm"
                size="sm"
              >
                {monitor?.is_paused ? (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                )}
              </Button>

              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="floating-card border-0 mx-4 sm:mx-auto max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Monitor</DialogTitle>
                    <DialogDescription>
                      Update your monitor configuration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-url">URL</Label>
                      <Input
                        id="edit-url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-interval">
                        Check Interval (seconds)
                      </Label>
                      <Input
                        id="edit-interval"
                        type="number"
                        value={editInterval}
                        onChange={(e) =>
                          setEditInterval(Number(e.target.value))
                        }
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditDialogOpen(false)}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      // onClick={handleEdit}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="floating-card border-0 mx-4 sm:mx-auto max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete Monitor</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this monitor? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Recent Checks */}
        <div className="animate-fade-up opacity-0 delay-100">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
            Recent Checks
          </h2>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {monitor?.check_results.slice(0, 5).map((check) => (
              <div key={check.id} className="floating-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {check.created_at}
                  </span>
                  {check.status === "up" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge
                    variant={
                      check.status_code === 200 ? "success" : "destructive"
                    }
                  >
                    {check.status_code}
                  </Badge>
                  <span className="font-medium">
                    {check.response_time_ms > 0
                      ? `${check.response_time_ms}ms`
                      : "—"}
                  </span>
                </div>
                {check.error && (
                  <p className="text-xs text-destructive mt-2">{check.error}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block floating-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Time
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      HTTP Code
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Response
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {monitor?.check_results.map((check) => (
                    <tr
                      key={check.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-4 text-sm">
                        {check.created_at}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        {check.status === "up" ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <Badge
                          variant={
                            check.status_code === 200
                              ? "success"
                              : "destructive"
                          }
                        >
                          {check.status_code}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-medium">
                        {check.response_time_ms > 0
                          ? `${check.response_time_ms}ms`
                          : "—"}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm text-muted-foreground">
                        {check.error || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Incidents */}
        <div className="animate-fade-up opacity-0 delay-200">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5">
            Incidents
          </h2>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {monitor?.incidents.map((incident) => (
              <div key={incident.id} className="floating-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={incident.is_open ? "open" : "resolved"}>
                    {incident.is_open ? "Open" : "Resolved"}
                  </Badge>
                  <span className="text-sm font-medium">{3}</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>{incident.started_at}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <span>{incident.resolved_at || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block floating-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Started At
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Resolved At
                    </th>
                    <th className="px-4 sm:px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {monitor?.incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-4">
                        <Badge variant={incident.is_open ? "open" : "resolved"}>
                          {incident.is_open ? "Open" : "Resolved"}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm">
                        {incident.started_at}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm">
                        {incident.resolved_at || "—"}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-medium">
                        {3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
