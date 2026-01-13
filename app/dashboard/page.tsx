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

const initialMonitors: Monitor[] = [
  {
    id: "1",
    name: "Production API",
    url: "https://api.example.com",
    status: "up",
    lastChecked: "2 min ago",
    avgResponseTime: 145,
    isPaused: false,
  },
  {
    id: "2",
    name: "Marketing Website",
    url: "https://www.example.com",
    status: "up",
    lastChecked: "1 min ago",
    avgResponseTime: 312,
    isPaused: false,
  },
  {
    id: "3",
    name: "Documentation",
    url: "https://docs.example.com",
    status: "down",
    lastChecked: "Just now",
    avgResponseTime: 0,
    isPaused: false,
  },
  {
    id: "4",
    name: "Staging Server",
    url: "https://staging.example.com",
    status: "up",
    lastChecked: "3 min ago",
    avgResponseTime: 234,
    isPaused: true,
  },
];
const INITIAL_MONITOR = {
  id: "",
  name: "",
  url: "",
  interval_seconds: 0,
  timeout_seconds: 0,
  is_paused: false,
};

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
  const [monitorAdd, setMonitorAdd] = useState<AddMonitor>(INITIAL_MONITOR);
  const fetchMonitors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("monitor_dashboard_stats")
        .select("*");
      if (error) {
        throw error;
      }
      console.log(data);
      setMonitors(mapToUI(data));
    } catch (error) {
      console.log(error);
      alert("error getting monitors");
    }
  }, []);

  const handlePause = useCallback(async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("monitors")
        .update({
          is_paused: status,
        })
        .eq("id", id);
      await fetchMonitors();
      if (error) {
        throw error;
      }
    } catch (error) {
      alert("Error updating status");
      console.error(error);
    }
  }, []);

  const handleEditMonitor = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("monitors")
        .update({
          name: monitorAdd.name,
          url: monitorAdd.url,
          interval_seconds: monitorAdd.interval_seconds,
          timeout_seconds: monitorAdd.timeout_seconds,
          is_paused: monitorAdd.is_paused,
        })
        .eq("id", monitorAdd.id);
    } catch (error) {
      alert("Error editing monitor");
      console.log(error);
    }
  }, [monitorAdd, fetchMonitors]);

  const handleCheckStatus = useCallback(async () => {
    try {
      const res = await axios.post("/api/worker/checks", {
        headers: {
          "x-watchtower-secret": process.env.WORKER_SECRET,
        },
      });
      console.log(res.data);
      alert(res.data.message);
      await fetchMonitors();
    } catch (error) {
      alert("error checking status");
      console.log(error);
    }
  }, []);

  const handleAddMjonitor = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log(monitorAdd);
      if (!user || userError) {
        alert("not auhtenticated");
        throw new Error("Not authenticated");
      }
      const { error } = await supabase.from("monitors").insert({
        user_id: user.id,
        name: monitorAdd?.name,
        url: monitorAdd?.url,
        interval_seconds: monitorAdd?.interval_seconds,
        timeout_seconds: monitorAdd?.timeout_seconds,
        is_paused: false,
      });
      if (error) {
        throw error;
      }
      await fetchMonitors();
    } catch (error) {
      alert("Error creating monitor");
      console.log(error);
    }
  }, [supabase, fetchMonitors, monitorAdd]);

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
      console.log(isPaused);
      try {
        const { data, error } = await supabase
          .from("monitors")
          .update({
            is_paused: isPaused,
          })
          .eq("id", id)
          .select();
        console.log(data);
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
    const newMonitor: Monitor = {
      id: String(Date.now()),
      name: monitor.name,
      url: monitor.url,
      status: "up",
      lastChecked: "Just now",
      avgResponseTime: 0,
      isPaused: monitor.isPaused,
    };
    setMonitors((prev) => [newMonitor, ...prev]);
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

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
            <SyncButton />
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
