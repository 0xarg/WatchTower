"use client";
import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserDB } from "@/lib/types/database/user";

export default function Settings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [user, setUser] = useState<UserDB>();
  const router = useRouter();
  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user as UserDB);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-2xl">
        {/* Header */}
        <div className="animate-fade-up opacity-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Section */}
        <div className="floating-card p-5 sm:p-6 animate-fade-up opacity-0 delay-100">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-secondary flex items-center justify-center">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Account</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your account information
              </p>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 px-4 rounded-xl bg-secondary/30">
              <div>
                <Label className="text-sm sm:text-base font-medium">
                  Email
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2 rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="floating-card p-5 sm:p-6 animate-fade-up opacity-0 delay-200">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                Notifications
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Configure how you receive alerts
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label
                htmlFor="email-notifications"
                className="text-sm sm:text-base font-medium"
              >
                Email Notifications
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Receive alerts when your monitors go down
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
              className="ml-4 shrink-0"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
