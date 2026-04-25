"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = role === "ngo" ? ngoLinks : role === "volunteer" ? volunteerLinks : adminLinks;
  const roleLabel = role === "ngo" ? "NGO" : role === "volunteer" ? "Volunteer" : "Admin";
  const roleColor = "bg-foreground/10 text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground font-helvetica flex flex-col overflow-hidden relative">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-foreground/[0.06] bg-background/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <div className="w-1.5 h-1.5 bg-background rounded-sm" />
            </div>
            <span className="font-bold tracking-tight text-sm hidden sm:block">Impact Hub</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-foreground/[0.08] ml-2" />
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
          <button
            onClick={handleSignOut}
            className="text-accent-dim hover:text-foreground hover:bg-foreground/[0.04] p-1.5 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-24">
        <div className="flex-1 overflow-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-foreground/[0.02] blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-none">
        <div className="bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-[15px] shadow-2xl p-2 flex items-center justify-around pointer-events-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label + link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-foreground bg-foreground/[0.08]"
                    : "text-accent-dim hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
                title={link.label}
              >
                <link.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] font-medium hidden sm:block">{link.label}</span>
              </Link>
            );
          })}
          <div className="w-px h-8 bg-foreground/10 mx-1" />
          <Link
            href="/settings"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
              pathname === "/settings"
                ? "text-foreground bg-foreground/[0.08]"
                : "text-accent-dim hover:text-foreground hover:bg-foreground/[0.04]"
            }`}
            title="Settings"
          >
            <Settings size={20} strokeWidth={pathname === "/settings" ? 2 : 1.5} />
            <span className="text-[9px] font-medium hidden sm:block">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
