"use client";
import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/SyncButton";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { IncidentUI } from "@/lib/types/ui/incidentDetail";
import { formatDistanceToNow } from "date-fns";

type FilterType = "all" | "open" | "resolved";

const mocksIncidents = [
  {
    id: "1",
    monitor: "Documentation",
    status: "open",
    startedAt: "Jan 4, 2025 10:23",
    resolvedAt: null,
    duration: "Ongoing",
  },
  {
    id: "2",
    monitor: "Production API",
    status: "resolved",
    startedAt: "Dec 28, 2024 14:32",
    resolvedAt: "Dec 28, 2024 14:35",
    duration: "3 min",
  },
  {
    id: "3",
    monitor: "Production API",
    status: "resolved",
    startedAt: "Dec 25, 2024 09:15",
    resolvedAt: "Dec 25, 2024 09:18",
    duration: "3 min",
  },
  {
    id: "4",
    monitor: "Marketing Website",
    status: "resolved",
    startedAt: "Dec 20, 2024 16:45",
    resolvedAt: "Dec 20, 2024 16:52",
    duration: "7 min",
  },
  {
    id: "5",
    monitor: "Staging Server",
    status: "resolved",
    startedAt: "Dec 15, 2024 08:00",
    resolvedAt: "Dec 15, 2024 08:12",
    duration: "12 min",
  },
];

export default function Incidents() {
  const supabase = createClient();
  const [incidents, setIncidents] = useState<IncidentUI[]>();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredIncidents = incidents?.filter((incident) => {
    if (filter === "all") return true;
    const status = incident.is_open ? "open" : "resolved";
    return status === filter;
  });

  const openCount = incidents?.filter((i) => i.is_open).length;
  const resolvedCount = incidents?.filter((i) => !i.is_open).length;

  const fetchIncidents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("incidents")
        .select(
          `*,monitors(
        id,name,url)`
        )
        .order("started_at", { ascending: false });
      console.log(data);
      setIncidents(data as IncidentUI[]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-up opacity-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Incidents
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              System-wide reliability overview
            </p>
          </div>
          <div className="animate-fade-up opacity-0 delay-100">
            <SyncButton />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 animate-fade-up opacity-0 delay-100">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="gap-2 rounded-full text-xs sm:text-sm"
          >
            All
            <span className="text-xs opacity-70 bg-background/20 px-1.5 py-0.5 rounded-full">
              {incidents?.length}
            </span>
          </Button>
          <Button
            variant={filter === "open" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("open")}
            className="gap-2 rounded-full text-xs sm:text-sm"
          >
            Open
            <span className="text-xs opacity-70 bg-background/20 px-1.5 py-0.5 rounded-full">
              {openCount}
            </span>
          </Button>
          <Button
            variant={filter === "resolved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("resolved")}
            className="gap-2 rounded-full text-xs sm:text-sm"
          >
            Resolved
            <span className="text-xs opacity-70 bg-background/20 px-1.5 py-0.5 rounded-full">
              {resolvedCount}
            </span>
          </Button>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-3 animate-fade-up opacity-0 delay-200">
          {filteredIncidents?.map((incident, index) => (
            <div
              key={incident.id}
              className="floating-card p-4 animate-fade-up opacity-0"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">
                  {incident.monitors.name}
                </span>
                <Badge variant={incident.is_open ? "open" : "resolved"}>
                  {incident.is_open ? "Open" : "Resolved"}
                </Badge>
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
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span
                    className={cn(
                      "font-medium",
                      incident.is_open && "text-warning"
                    )}
                  >
                    {"15 min"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block animate-fade-up opacity-0 floating-card overflow-hidden delay-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Monitor
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Started At
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Resolved At
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredIncidents?.map((incident, index) => (
                  <tr
                    key={incident.id}
                    className={cn(
                      "hover:bg-secondary/30 transition-colors",
                      "animate-fade-up opacity-0"
                    )}
                    style={{ animationDelay: `${250 + index * 50}ms` }}
                  >
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className="font-medium text-sm">
                        {incident.monitors.name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <Badge variant={incident.is_open ? "open" : "resolved"}>
                        {incident.is_open ? "Open" : "Resolved"}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.started_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-sm text-muted-foreground">
                      {incident.resolved_at
                        ? formatDistanceToNow(new Date(incident.resolved_at), {
                            addSuffix: true,
                          })
                        : "--"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          incident.is_open && "text-warning"
                        )}
                      >
                        {"15 min"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredIncidents?.length === 0 && (
          <div className="text-center py-12 sm:py-16 animate-fade-up opacity-0">
            <p className="text-muted-foreground">No incidents found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
