"use client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { SyncButton } from "@/components/SyncButton";
import { Mail, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { AlertUI } from "@/lib/types/ui/alertDetail";
import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "@/components/Loader";

export default function AlertLogs() {
  const supabase = createClient();
  const [loading, setIsloading] = useState(true);

  const [alerts, setAlerts] = useState<AlertUI[]>();

  const fetchAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select(
          `*,incidents(
              monitors (
              name
              )
            )`
        )
        .order("sent_at", { ascending: false });
      setAlerts(data as AlertUI[]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <Loader />
      </div>
    );
  }

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
            <SyncButton onSync={() => fetchAlerts()} />
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-3 animate-fade-up opacity-0 delay-100">
          {alerts?.map((alert, index) => (
            <div
              key={alert.id}
              className="floating-card p-4 animate-fade-up opacity-0"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="font-medium text-sm flex-1">
                  {alert.incidents.monitors.name}
                </span>
                {alert.success ? (
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
                  <span>{alert.channel}</span>
                </div>
                <span>{alert.sent_at}</span>
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
                    Monitor
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
                {alerts?.map((alert, index) => (
                  <tr
                    key={alert.id}
                    className={cn(
                      "hover:bg-secondary/30 transition-colors",
                      "animate-fade-up opacity-0"
                    )}
                    style={{ animationDelay: `${150 + index * 50}ms` }}
                  >
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className="font-medium text-sm">
                        {alert.incidents.monitors.name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{alert.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      {alert.success ? (
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
                      {formatDistanceToNow(new Date(alert.sent_at), {
                        addSuffix: true,
                      })}
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
