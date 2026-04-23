"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, Download, Trophy, Clock, Users, FileText, ArrowUpRight } from "lucide-react";

const weeklyData = [
  { week: "W1", resolved: 18, reported: 22 },
  { week: "W2", resolved: 25, reported: 28 },
  { week: "W3", resolved: 32, reported: 30 },
  { week: "W4", resolved: 41, reported: 38 },
  { week: "W5", resolved: 35, reported: 33 },
  { week: "W6", resolved: 48, reported: 45 },
  { week: "W7", resolved: 52, reported: 49 },
  { week: "W8", resolved: 58, reported: 54 },
];

const resourceTypes = [
  { type: "Water", pct: 35 },
  { type: "Medical", pct: 25 },
  { type: "Food", pct: 20 },
  { type: "Shelter", pct: 12 },
  { type: "Other", pct: 8 },
];

const responseTimes = [
  { month: "Jan", time: 14.2 },
  { month: "Feb", time: 12.5 },
  { month: "Mar", time: 10.1 },
  { month: "Apr", time: 8.4 },
];

const topVolunteers = [
  { rank: 1, name: "Anita Sharma", missions: 47, hours: 186, score: 98 },
  { rank: 2, name: "Raj Patel", missions: 42, hours: 168, score: 95 },
  { rank: 3, name: "Priya Singh", missions: 38, hours: 152, score: 94 },
  { rank: 4, name: "Arjun Mehta", missions: 35, hours: 140, score: 91 },
  { rank: 5, name: "Kavya Nair", missions: 31, hours: 124, score: 89 },
];

export default function ReportsPage() {
  const maxResolved = Math.max(...weeklyData.map(d => Math.max(d.resolved, d.reported)));

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">Impact Reports</h1>
            <p className="text-sm text-accent-dim">Analytics, trends, and performance metrics.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] text-xs font-medium text-accent-muted hover:text-foreground hover:border-foreground/15 transition-all">
              <Download size={14} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] text-xs font-medium text-accent-muted hover:text-foreground hover:border-foreground/15 transition-all">
              <FileText size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Incidents", value: "309", icon: BarChart3, trend: "+24% vs last month" },
            { label: "Resolution Rate", value: "94.2%", icon: TrendingDown, trend: "+3.1% improvement" },
            { label: "Avg Response", value: "8.4m", icon: Clock, trend: "-5.8m from baseline" },
            { label: "Active Volunteers", value: "348", icon: Users, trend: "+45 this week" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] hover:border-foreground/[0.1] transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-accent-dim font-medium">{s.label}</span>
                <s.icon size={15} className="text-gray-600 group-hover:text-accent-muted transition-colors" />
              </div>
              <div className="text-2xl font-bold tracking-tight mb-1">{s.value}</div>
              <div className="text-[11px] text-gray-600">{s.trend}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Incidents Over Time — Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="xl:col-span-2 p-6 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]">
            <h2 className="font-semibold mb-6 flex items-center gap-2 text-sm tracking-tight">
              <BarChart3 size={15} className="text-accent-muted" />Incidents Over Time
            </h2>
            <div className="flex items-end gap-3 h-48">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.reported / maxResolved) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                      className="flex-1 bg-foreground/[0.08] rounded-t" title={`Reported: ${d.reported}`} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.resolved / maxResolved) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.08 + 0.1 }}
                      className="flex-1 bg-foreground/30 rounded-t" title={`Resolved: ${d.resolved}`} />
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1">{d.week}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-accent-dim">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-foreground/[0.08]" />Reported</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-foreground/30" />Resolved</span>
            </div>
          </motion.div>

          {/* Resource Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]">
            <h2 className="font-semibold mb-6 text-sm tracking-tight">Resource Distribution</h2>
            <div className="space-y-4">
              {resourceTypes.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-accent-muted">{r.type}</span>
                    <span className="text-foreground font-mono">{r.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                      className="h-full rounded-full bg-gradient-to-r from-gray-500 to-white" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Response Time Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]">
            <h2 className="font-semibold mb-6 flex items-center gap-2 text-sm tracking-tight">
              <TrendingDown size={15} className="text-accent-muted" />Response Time Trend
            </h2>
            <div className="flex items-end gap-4 h-32">
              {responseTimes.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(r.time / 16) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="w-full bg-gradient-to-t from-white/20 to-white/5 rounded-t relative">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-accent-muted font-mono">{r.time}m</span>
                  </motion.div>
                  <span className="text-[10px] text-gray-600 mt-2">{r.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-foreground/[0.02] border border-foreground/[0.04] text-center">
              <span className="text-xs text-accent-muted">↓ 40.8% improvement since January</span>
            </div>
          </motion.div>

          {/* Top Volunteers Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="xl:col-span-2 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] overflow-hidden">
            <div className="p-5 border-b border-foreground/[0.04] flex justify-between items-center">
              <h2 className="font-semibold tracking-tight flex items-center gap-2 text-sm"><Trophy size={15} className="text-accent-muted" />Top Volunteers</h2>
              <button className="text-xs text-accent-dim hover:text-foreground flex items-center gap-1 transition-colors">View All <ArrowUpRight size={11} /></button>
            </div>
            <table className="w-full text-sm">
              <thead className="text-[10px] text-gray-600 bg-foreground/[0.01] border-b border-foreground/[0.04] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">#</th>
                  <th className="px-5 py-3 text-left font-medium">Volunteer</th>
                  <th className="px-5 py-3 text-left font-medium">Missions</th>
                  <th className="px-5 py-3 text-left font-medium">Hours</th>
                  <th className="px-5 py-3 text-left font-medium">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {topVolunteers.map(v => (
                  <tr key={v.rank} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-accent-dim">{v.rank}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 border border-foreground/10 flex items-center justify-center text-[10px] font-bold">{v.name.charAt(0)}</div>
                        <span className="font-medium">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-accent-muted font-mono">{v.missions}</td>
                    <td className="px-5 py-3.5 text-accent-muted font-mono">{v.hours}h</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-xs font-bold">{v.score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
