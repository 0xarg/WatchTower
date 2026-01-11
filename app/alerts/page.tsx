"use client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { SyncButton } from "@/components/SyncButton";
import { Mail, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockAlertLogs = [
  {
    id: "1",
    incident: "Documentation - Down",
    channel: "Email",
    success: true,
    sentAt: "Jan 4, 2025 10:23",
  },
  {
    id: "2",
    incident: "Production API - Down",
    channel: "Email",
    success: true,
    sentAt: "Dec 28, 2024 14:32",
  },
  {
    id: "3",
    incident: "Production API - Recovered",
    channel: "Email",
    success: true,
    sentAt: "Dec 28, 2024 14:35",
  },
  {
    id: "4",
    incident: "Production API - Down",
    channel: "Email",
    success: false,
    sentAt: "Dec 25, 2024 09:15",
  },
  {
    id: "5",
    incident: "Production API - Recovered",
    channel: "Email",
    success: true,
    sentAt: "Dec 25, 2024 09:18",
  },
  {
    id: "6",
    incident: "Marketing Website - Down",
    channel: "Email",
    success: true,
    sentAt: "Dec 20, 2024 16:45",
  },
  {
    id: "7",
    incident: "Marketing Website - Recovered",
    channel: "Email",
    success: true,
    sentAt: "Dec 20, 2024 16:52",
  },
];

export default function AlertLogs() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-up opacity-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Alert Logs
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Track all notification deliveries
            </p>
          </div>
          <div className="animate-fade-up opacity-0 delay-100">
            <SyncButton />
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-3 animate-fade-up opacity-0 delay-100">
          {mockAlertLogs.map((log, index) => (
            <div
              key={log.id}
              className="floating-card p-4 animate-fade-up opacity-0"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="font-medium text-sm flex-1">
                  {log.incident}
                </span>
                {log.success ? (
                  <Badge variant="success" className="gap-1 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    Sent
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1 shrink-0">
                    <XCircle className="h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{log.channel}</span>
                </div>
                <span>{log.sentAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block animate-fade-up opacity-0 floating-card overflow-hidden delay-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Incident
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Channel
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mockAlertLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={cn(
                      "hover:bg-secondary/30 transition-colors",
                      "animate-fade-up opacity-0"
                    )}
                    style={{ animationDelay: `${150 + index * 50}ms` }}
                  >
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className="font-medium text-sm">
                        {log.incident}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{log.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      {log.success ? (
                        <Badge variant="success" className="gap-1.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Sent
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1.5">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-sm text-muted-foreground">
                      {log.sentAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
