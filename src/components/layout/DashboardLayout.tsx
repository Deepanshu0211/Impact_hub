"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, AlertTriangle, Users, Map as MapIcon, Settings,
  Search, Bell, Menu, X, BrainCircuit, BarChart3, LogOut,
  ChevronLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ngo" | "volunteer" | "admin";
}

const ngoLinks = [
  { href: "/ngo-dashboard", label: "Dashboard", icon: Activity },
  { href: "/ngo-dashboard", label: "Submit Report", icon: AlertTriangle, hash: "#submit" },
  { href: "/live-map", label: "Live Map", icon: MapIcon },
  { href: "/ai-engine", label: "AI Engine", icon: BrainCircuit },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const volunteerLinks = [
  { href: "/volunteer-dashboard", label: "Dashboard", icon: Activity },
  { href: "/volunteer-dashboard", label: "Missions", icon: MapIcon, hash: "#missions" },
  { href: "/live-map", label: "Live Map", icon: MapIcon },
  { href: "/ai-engine", label: "AI Engine", icon: BrainCircuit },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/live-map", label: "Live Map", icon: MapIcon },
  { href: "/ai-engine", label: "AI Engine", icon: BrainCircuit },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ngo-dashboard", label: "NGO View", icon: Users },
  { href: "/volunteer-dashboard", label: "Volunteer View", icon: Users },
];

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useState(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = role === "ngo" ? ngoLinks : role === "volunteer" ? volunteerLinks : adminLinks;
  const roleLabel = role === "ngo" ? "NGO" : role === "volunteer" ? "Volunteer" : "Admin";
  const roleColor = "bg-foreground/10 text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground font-helvetica flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 border-r border-foreground/[0.06] bg-background flex flex-col
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-foreground/[0.06]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <div className="w-2 h-2 bg-background rounded-sm" />
            </div>
            <span className="font-bold tracking-tight text-sm">Impact Hub</span>
          </Link>
          <button className="md:hidden text-accent-muted hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase text-center ${roleColor} border border-foreground/[0.08]`}>
            {roleLabel} Portal
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-[0.2em] mb-1">Navigation</div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label + link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-foreground/[0.08] text-foreground border border-foreground/[0.08]"
                    : "text-accent-dim hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-foreground/[0.06] space-y-0.5">
          <Link
            href="/notifications"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${pathname === "/notifications" ? "bg-foreground/[0.08] text-foreground border border-foreground/[0.08]" : "text-accent-dim hover:text-foreground hover:bg-foreground/[0.04]"}`}
          >
            <Bell size={17} strokeWidth={1.5} />
            <span>Notifications</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${pathname === "/settings" ? "bg-foreground/[0.08] text-foreground border border-foreground/[0.08]" : "text-accent-dim hover:text-foreground hover:bg-foreground/[0.04]"}`}
          >
            <Settings size={17} strokeWidth={1.5} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-dim hover:text-foreground hover:bg-foreground/[0.04] transition-all font-medium text-sm"
          >
            <LogOut size={17} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-foreground/[0.06] bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-accent-muted hover:text-foreground transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <Link href="/" className="text-accent-dim hover:text-foreground transition-colors hidden sm:flex items-center gap-1.5 text-xs">
              <ChevronLeft size={14} />
              Back to Home
            </Link>
            <div className="hidden sm:block h-4 w-px bg-foreground/[0.08]" />
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg text-sm focus:outline-none focus:border-foreground/20 text-gray-300 w-56 transition-all focus:w-72 placeholder:text-gray-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="relative text-accent-dim hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-foreground/[0.04]">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-foreground rounded-full animate-pulse" />
            </Link>
            <div className="h-4 w-px bg-foreground/[0.08]" />
            <div className="flex items-center gap-2">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full border border-foreground/20" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 border border-foreground/20" />
              )}
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-foreground">{user?.user_metadata?.full_name || roleLabel}</span>
                <span className="text-[9px] text-accent-dim uppercase tracking-widest">{roleLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto relative">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-foreground/[0.02] blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
