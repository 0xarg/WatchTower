"use client";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SyncButton } from "@/components/SyncButton";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Loader } from "@/components/Loader";

const mockServices = [
  { name: "Production API", status: "up", uptime: "99.98%" },
  { name: "Marketing Website", status: "up", uptime: "99.95%" },
  { name: "Documentation", status: "down", uptime: "98.50%" },
  { name: "Staging Server", status: "up", uptime: "99.90%" },
];

export default function StatusPage() {
  const allUp = mockServices.every((s) => s.status === "up");
  const someDown = mockServices.some((s) => s.status === "down");

  // return (
  //   <div className="flex h-screen w-full justify-center items-center">
  //     <Loader />
  //   </div>
  // );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div className="animate-fade-up opacity-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
              Status Page
            </h1>
            <p className="text-muted-foreground">
              Real-time status of all your monitored services
            </p>
          </div>
          <div className="animate-fade-up opacity-0 delay-100">
            <SyncButton />
          </div>
        </div>

        {/* Overall Status */}
        <div className="mb-8 sm:mb-12 animate-fade-up opacity-0 delay-100">
          <div
            className={cn(
              "glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-4 w-4 rounded-full pulse-dot",
                  allUp
                    ? "bg-success"
                    : someDown
                    ? "bg-destructive"
                    : "bg-warning"
                )}
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {allUp
                    ? "All Systems Operational"
                    : someDown
                    ? "Partial Outage"
                    : "Degraded Performance"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: Just now
                </p>
              </div>
            </div>
            <Badge
              variant={allUp ? "up" : someDown ? "down" : "default"}
              className="text-sm px-4 py-1.5"
            >
              {allUp ? "Healthy" : someDown ? "Issues Detected" : "Degraded"}
            </Badge>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 animate-fade-up opacity-0 delay-200">
            Services
          </h3>
          {mockServices.map((service, index) => (
            <div
              key={service.name}
              className={cn(
                "flex items-center justify-between floating-card floating-card-hover p-4 sm:p-5",
                "animate-fade-up opacity-0"
              )}
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    service.status === "up"
                      ? "bg-success pulse-dot"
                      : "bg-destructive pulse-dot"
                  )}
                />
                <span className="font-medium text-sm sm:text-base">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                  {service.uptime} uptime
                </span>
                <Badge variant={service.status === "up" ? "up" : "down"}>
                  {service.status === "up" ? "Operational" : "Outage"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div
          className="mt-12 sm:mt-16 text-center animate-fade-up opacity-0"
          style={{ animationDelay: "400ms" }}
        >
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Monitored by WatchTower</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
