"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Monitors } from "@/lib/types/database/monitors";
import axios from "axios";
import React, { Suspense, useCallback, useEffect, useState } from "react";

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
const page = () => {
  const supabase = createClient();
  const [monitors, setMonitors] = useState<Monitors[]>([]);
  const [monitorAdd, setMonitorAdd] = useState<AddMonitor>(INITIAL_MONITOR);

  const fetchMonitors = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("monitors").select("*");
      if (error) {
        throw error;
      }
      setMonitors(data as Monitors[]);
    } catch (error) {
      console.log(error);
      alert("error getting monitors");
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("monitors").delete().eq("id", id);
        if (error) {
          throw error;
        }
        await fetchMonitors();
      } catch (error) {
        alert("Error deleting monitor");
        console.log(error);
      }
    },
    [fetchMonitors]
  );

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
      const res = await axios.post("/api/worker/checks");
      console.log(res.data);
      alert(res.data.message);
      await fetchMonitors();
    } catch (error) {
      alert("error checking status");
      console.log(error);
    }
  }, []);

  const handleAddMonitor = useCallback(async () => {
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

  useEffect(() => {
    const fetchUser = async () => {};

    fetchUser();
    fetchMonitors();
  }, []);

  return (
    <div className="flex  gap-12 justify-around items-start m-10">
      <div className="flex flex-col gap-2 items-start">
        <Button onClick={() => fetchMonitors()}>Sync</Button>
        <Button onClick={() => handleCheckStatus()}>Check Status</Button>
        <h2 className="font-bold text-2xl mb-4">Monitors</h2>
        <div className="flex flex-col p-4 gap-5">
          {monitors.map((monitor) => (
            <Card key={monitor.id}>
              <CardContent>
                <p>Id: {monitor.id}</p>
                <p>Name: {monitor.name}</p>
                <p>Url: {monitor.url}</p>
                <p>Timeout: {monitor.timeout_seconds}</p>
                <p>Interval: {monitor.interval_seconds}</p>
                <p>Is Paused: {monitor.is_paused ? "True" : "False"}</p>
                <p>
                  Last Checked: {new Date(monitor.last_checked_at).toString()}
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => handleDelete(monitor.id)}>
                    Delete
                  </Button>
                  {monitor.is_paused ? (
                    <Button onClick={() => handlePause(monitor.id, "false")}>
                      Contiue
                    </Button>
                  ) : (
                    <Button onClick={() => handlePause(monitor.id, "true")}>
                      Pause
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Add Monitor to Watch</h2>
        <div className="p-5 border border-neutral-400 rounded-xl flex flex-col items-start gap-5">
          <Label>ID</Label>
          <Input
            value={monitorAdd.id}
            onChange={(e) =>
              setMonitorAdd((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <Label>Name</Label>
          <Input
            value={monitorAdd.name}
            onChange={(e) =>
              setMonitorAdd((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Label>URL</Label>
          <Input
            type="url"
            value={monitorAdd.url}
            onChange={(e) =>
              setMonitorAdd((prev) => ({ ...prev, url: e.target.value }))
            }
          />
          <Label>Interval_seconds</Label>
          <Input
            value={monitorAdd.interval_seconds}
            type="number"
            onChange={(e) =>
              setMonitorAdd((prev) => ({
                ...prev,
                interval_seconds: Number(e.target.value),
              }))
            }
          />
          <Label>timeout_seconds</Label>
          <Input
            value={monitorAdd.timeout_seconds}
            type="number"
            onChange={(e) =>
              setMonitorAdd((prev) => ({
                ...prev,
                timeout_seconds: Number(e.target.value),
              }))
            }
          />

          <div className="flex justify-center gap-2 w-full">
            <Button onClick={() => handleAddMonitor()}>Add Monitor</Button>
            <Button onClick={() => handleEditMonitor()}>Edit Monitor</Button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default page;
