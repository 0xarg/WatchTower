"use client";
import {
  ArrowRight,
  Zap,
  Bell,
  Shield,
  CheckCircle2,
  Clock,
  BarChart3,
  Eye,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { useRouter } from "next/navigation";

// Main features - displayed as premium cards
const mainFeatures = [
  {
    type: "detection",
    icon: Zap,
    badge: "Live Data",
    title: "Instant Detection",
    description:
      "Checks run every 60 seconds across global locations. Be the first to know when issues arise.",
  },
  {
    type: "alerts",
    title: "Alerts Sent",
    value: "2.4K",
    subtitle: "Delivery Rate",
    percentage: "99.8%",
  },
];

// Secondary features - 3 column grid
const secondaryFeatures = [
  {
    icon: Globe,
    title: "Status Pages",
    description:
      "Beautiful public status pages to keep your users informed and build trust.",
  },
  {
    icon: BarChart3,
    title: "Response Analytics",
    description:
      "Track response times and identify performance bottlenecks early.",
  },
  {
    icon: Shield,
    title: "Incident History",
    description:
      "Complete incident timeline with root cause analysis and resolution tracking.",
  },
];

export default function Index() {
  const router = useRouter();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToStats = () => {
    document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background page-gradient overflow-x-hidden">
      {/* Floating Header - Glass morphism */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
        <nav className="flex items-center justify-between sm:justify-start gap-1 px-2 py-2 rounded-2xl sm:rounded-full glass-nav">
          <div className="flex items-center gap-2 pl-2 sm:pl-3 pr-2 sm:pr-4">
            <AnimatedLogo size="sm" />
            <span className="font-semibold tracking-tight">WatchTower</span>
          </div>
          <div className="hidden md:flex items-center gap-1 px-2">
            <button
              onClick={scrollToFeatures}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              Features
            </button>
            {/* <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              Pricing
            </button> */}
            <button
              onClick={scrollToStats}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              Stats
            </button>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full px-4 sm:px-5 h-9 btn-glow"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        {/* Subtle radial gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-sm mb-6 sm:mb-8 animate-fade-up opacity-0">
            <div className="h-2 w-2 rounded-full bg-success pulse-dot" />
            <span className="text-sm font-medium">All Systems Operational</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-3 sm:mb-4 animate-fade-up opacity-0 delay-100">
            Website uptime that
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif italic text-muted-foreground mb-6 sm:mb-8 animate-fade-up opacity-0 delay-200">
            <span className="relative inline-block">
              never sleeps.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-accent/40"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q50,0 100,8 T200,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up opacity-0 delay-300 px-4">
            Monitor your websites around the clock. Get instant alerts the
            moment something goes wrong. Keep your users happy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up opacity-0 delay-400">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto rounded-full px-8 h-12 text-base gap-2 btn-glow shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Monitoring
              <ArrowRight className="h-4 w-4" />
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/status")}
              className="w-full sm:w-auto rounded-full px-8 h-12 text-base glass-card border-border/40 hover:bg-secondary/50"
            >
              View Demo
            </Button> */}
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 animate-fade-up opacity-0"
            style={{ animationDelay: "500ms" }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>2 minute setup</span>
            </div>
          </div>

          {/* Scroll indicator - subtle fade animation */}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative animate-fade-up opacity-0">
            {/* Browser mockup */}
            <div className="glass-card overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-card/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    watchtower.app/dashboard
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
                  Live
                </div>
              </div>

              {/* Dashboard content mock */}
              <div className="p-4 sm:p-6 bg-card/30">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  {[
                    {
                      label: "Total Monitors",
                      value: "24",
                      color: "text-foreground",
                    },
                    { label: "Up", value: "22", color: "text-success" },
                    { label: "Down", value: "2", color: "text-destructive" },
                    {
                      label: "Avg Response",
                      value: "142ms",
                      color: "text-foreground",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="glass-card p-4 animate-fade-up opacity-0"
                      style={{ animationDelay: `${600 + i * 100}ms` }}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-semibold ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mini table */}
                <div
                  className="glass-card overflow-hidden animate-fade-up opacity-0"
                  style={{ animationDelay: "1000ms" }}
                >
                  <div className="p-3 border-b border-border/30 flex items-center justify-between">
                    <span className="text-sm font-medium">Monitors</span>
                    <span className="text-xs text-muted-foreground">
                      Last checked: 12s ago
                    </span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {[
                      { name: "api.example.com", status: "up", time: "89ms" },
                      {
                        name: "dashboard.example.com",
                        status: "up",
                        time: "156ms",
                      },
                      { name: "docs.example.com", status: "down", time: "—" },
                    ].map((monitor, i) => (
                      <div
                        key={i}
                        className="px-3 py-2.5 flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              monitor.status === "up"
                                ? "bg-success"
                                : "bg-destructive"
                            }`}
                          />
                          <span>{monitor.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {monitor.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent cards */}
            <div className="absolute -right-4 top-1/4 hidden xl:block animate-float">
              <div className="glass-card glass-card-hover px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="font-semibold">99.98%</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -left-4 bottom-1/4 hidden xl:block animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="glass-card glass-card-hover px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Response</p>
                  <p className="font-semibold">142ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium cards matching screenshot */}
      <section id="features" className="py-20 sm:py-28 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 animate-fade-up opacity-0">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up opacity-0 delay-100">
              Simple, powerful tools to keep your websites running perfectly.
            </p>
          </div>

          {/* Main feature cards - 2 column layout like screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Detection Card - Larger */}
            <div className="lg:col-span-3 premium-feature-card p-6 sm:p-8 animate-fade-up opacity-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container">
                  <Zap className="h-5 w-5 text-foreground" />
                </div>
                <span className="live-badge">Live Data</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                Instant Detection
              </h3>
              <p className="text-muted-foreground mb-8">
                Checks run every 60 seconds across global locations. Be the
                first to know when issues arise.
              </p>
              {/* Animated bar chart visualization */}
              <div className="flex items-end gap-2 h-24">
                {[0.3, 0.4, 0.5, 0.45, 0.55, 0.6, 0.7, 0.75, 0.85, 1].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-muted animate-bar"
                      style={{
                        height: `${height * 100}%`,
                        animationDelay: `${i * 100}ms`,
                        backgroundColor:
                          i === 9 ? "hsl(var(--success))" : undefined,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Alerts Card - Dark variant */}
            <div className="lg:col-span-2 dark-feature-card p-6 sm:p-8 animate-fade-up opacity-0 delay-100">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-xl bg-background/10 flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success pulse-dot" />
                  <span className="text-sm opacity-70">Active</span>
                </div>
              </div>
              <p className="text-4xl sm:text-5xl font-semibold mb-1">2.4K</p>
              <p className="opacity-60 mb-8">Alerts Sent</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-60">Delivery Rate</span>
                  <span className="text-sm text-success font-medium">
                    99.8%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-background/10 overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: "99.8%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary features - 3 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {secondaryFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="premium-feature-card p-6 sm:p-8 animate-fade-up opacity-0"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="icon-container mb-6">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 sm:p-12 animate-fade-up opacity-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Uptime Monitored", value: "99.99%" },
                { label: "Checks Daily", value: "1M+" },
                { label: "Global Locations", value: "12" },
                { label: "Avg Response", value: "<200ms" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedLogo
            size="lg"
            className="mx-auto mb-8 animate-fade-up opacity-0 shadow-xl"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-4 animate-fade-up opacity-0 delay-100">
            Ready to start
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-muted-foreground mb-6 sm:mb-8 animate-fade-up opacity-0 delay-200">
            monitoring?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 animate-fade-up opacity-0 delay-300 px-4">
            Join thousands of teams who trust WatchTower to keep their websites
            running smoothly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up opacity-0 delay-400">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto rounded-full px-8 h-12 text-base btn-glow shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/status")}
              className="w-full sm:w-auto rounded-full px-8 h-12 text-base glass-card border-border/40"
            >
              View Status Page
            </Button> */}
          </div>
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-sm text-muted-foreground animate-fade-up opacity-0"
            style={{ animationDelay: "500ms" }}
          >
            <span>Free to start</span>
            <span className="hidden sm:inline">•</span>
            <span>No credit card required</span>
            <span className="hidden sm:inline">•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 group"
            >
              <AnimatedLogo
                size="md"
                className="group-hover:shadow-xl transition-shadow"
              />
              <span className="font-semibold tracking-tight">WatchTower</span>
            </button>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <button
                onClick={scrollToFeatures}
                className="hover:text-foreground transition-colors"
              >
                Features
              </button>
              <a href="#" className="hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Blog
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 WatchTower. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
