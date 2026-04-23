"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertTriangle, BrainCircuit, Users, MapPin, Clock, Check, Trash2 } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  type: "alert" | "ai" | "volunteer" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "alert", title: "CRITICAL: Water crisis in Sector 7", body: "500 people require immediate water supply. AI has auto-prioritized and dispatched 18 volunteers.", time: "2 min ago", read: false },
  { id: 2, type: "ai", title: "AI Analysis Complete", body: "NLP engine processed 12 new field reports. 3 marked as CRITICAL, 5 as HIGH priority.", time: "8 min ago", read: false },
  { id: 3, type: "volunteer", title: "Volunteer Dispatch Confirmed", body: "Anita Sharma accepted mission at Downtown Clinic. ETA: 5 minutes.", time: "15 min ago", read: false },
  { id: 4, type: "system", title: "Heatmap Updated", body: "Live heatmap refreshed with 6 new incident markers across 4 sectors.", time: "22 min ago", read: true },
  { id: 5, type: "ai", title: "Vision Analysis: Infrastructure Damage", body: "Image from East Bridge Camp analyzed — HIGH severity, structural collapse detected. Confidence: 87%.", time: "35 min ago", read: true },
  { id: 6, type: "volunteer", title: "Mission Completed", body: "Raj Patel completed food distribution at Westside Shelter. 85 people served.", time: "1 hr ago", read: true },
  { id: 7, type: "alert", title: "New Incident Reported", body: "Medical emergency reported at North Station. Auto-routing nearest first-aid volunteers.", time: "1 hr ago", read: true },
  { id: 8, type: "system", title: "Weekly Report Generated", body: "Impact report for Week 8 is ready. 58 incidents resolved, 94.2% resolution rate.", time: "3 hr ago", read: true },
];

const typeConfig = {
  alert: { icon: AlertTriangle, color: "text-foreground", bg: "bg-foreground/10 border-foreground/20" },
  ai: { icon: BrainCircuit, color: "text-gray-300", bg: "bg-foreground/[0.06] border-foreground/10" },
  volunteer: { icon: Users, color: "text-accent-muted", bg: "bg-foreground/[0.04] border-foreground/[0.08]" },
  system: { icon: Bell, color: "text-accent-dim", bg: "bg-foreground/[0.03] border-foreground/[0.06]" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  const markRead = (id: number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const clearRead = () => setNotifications(n => n.filter(x => !x.read));
  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-xs font-bold">{unreadCount}</span>
              )}
            </h1>
            <p className="text-sm text-accent-dim mt-0.5">Real-time alerts from AI, volunteers, and incidents.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="px-3 py-1.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] text-xs text-accent-muted hover:text-foreground transition-colors flex items-center gap-1.5">
              <Check size={12} /> Mark All Read
            </button>
            <button onClick={clearRead} className="px-3 py-1.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] text-xs text-accent-muted hover:text-foreground transition-colors flex items-center gap-1.5">
              <Trash2 size={12} /> Clear Read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {["all", "alert", "ai", "volunteer", "system"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${filter === f ? "bg-foreground text-background" : "text-accent-dim hover:text-foreground bg-foreground/[0.03] border border-foreground/[0.06]"}`}>
              {f === "ai" ? "AI" : f}
              {f !== "all" && <span className="ml-1 text-[10px] opacity-60">({notifications.filter(n => n.type === f).length})</span>}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications to show.</p>
            </div>
          ) : (
            filtered.map((n, i) => {
              const cfg = typeConfig[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => markRead(n.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                    n.read
                      ? "bg-foreground/[0.01] border-foreground/[0.04] hover:border-foreground/[0.08]"
                      : "bg-foreground/[0.03] border-foreground/[0.08] hover:border-foreground/15"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${cfg.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                      <cfg.icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-medium ${n.read ? "text-accent-muted" : "text-foreground"}`}>{n.title}</span>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />}
                      </div>
                      <p className="text-xs text-accent-dim leading-relaxed">{n.body}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-600">
                        <Clock size={10} /> {n.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
