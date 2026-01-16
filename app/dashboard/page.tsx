"use client";
import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { MonitorTable, Monitor } from "@/components/dashboard/MonitorTable";
import { AddMonitorDialog } from "@/components/dashboard/AddMonitorDialog";
import { SyncButton } from "@/components/SyncButton";
import { Activity, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";
import { MonitorDB } from "@/lib/types/database/monitors";
import { MonitorUI } from "@/lib/types/ui/monitors";
import { mapToUI } from "@/lib/mapToUI";
import { Loader } from "@/components/Loader";

export interface AddMonitor {
  id: string;
  name: string;
  url: string;
  interval_seconds: number;
  timeout_seconds: number;
  is_paused: boolean;
}

export default function Dashboard() {
  const [monitors, setMonitors] = useState<MonitorUI[]>([]);
  const supabase = createClient();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setIsloading] = useState(true);

  const fetchMonitors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("monitor_dashboard_stats")
        .select("*");
      if (error) {
        throw error;
      }
      setMonitors(mapToUI(data));
    } catch (error) {
      console.log(error);
      alert("error getting monitors");
    } finally {
      setIsloading(false);
    }
  }, []);

  const stats = {
    total: monitors.length,
    up: monitors.filter((m) => m.status === "up").length,
    down: monitors.filter((m) => m.status === "down").length,
    incidents: monitors.filter((m) => m.status === "down").length,
  };

  const handlePauseToggle = useCallback(
    async (id: string, status: boolean) => {
      const monitor = monitors.find((monitor) => monitor.id === id);
      if (!monitor) return;

      const isPaused = !status;
      setMonitors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isPaused: !m.isPaused } : m))
      );
      try {
        const { data, error } = await supabase
          .from("monitors")
          .update({
            is_paused: isPaused,
          })
          .eq("id", id)
          .select();
        if (error) {
          throw error;
        }
        if (data[0].is_paused !== isPaused) throw Error;
      } catch (error) {
        console.log(error);
        setMonitors((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isPaused: !m.isPaused } : m))
        );
      }
    },
    [monitors]
  );

  const handleAddMonitor = (monitor: {
    name: string;
    url: string;
    interval: number;
    timeout: number;
    isPaused: boolean;
  }) => {
    fetchMonitors();
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-up opacity-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Monitor your infrastructure at a glance
            </p>
          </div>
          <div className="flex items-center gap-2 animate-fade-up opacity-0 delay-100">
            <SyncButton onSync={() => fetchMonitors()} />
            <AddMonitorDialog onAdd={handleAddMonitor} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 lg:grid-cols-4">
          <SummaryCard
            title="Total Monitors"
            value={stats.total}
            icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
            delay={0}
          />
          <SummaryCard
            title="Operational"
            value={stats.up}
            icon={<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            variant="success"
            delay={50}
          />
          <SummaryCard
            title="Down"
            value={stats.down}
            icon={<XCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
            variant="destructive"
            delay={100}
          />
          <SummaryCard
            title="Open Incidents"
            value={stats.incidents}
            icon={<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />}
            variant="warning"
            delay={150}
          />
        </div>

        {/* Monitor Table */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 animate-fade-up opacity-0 delay-100">
            All Monitors
          </h2>
          <MonitorTable monitors={monitors} onPauseToggle={handlePauseToggle} />
        </div>
      </div>
    </MainLayout>
  );
}
