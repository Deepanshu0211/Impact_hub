"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { MapPin, Filter, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LiveMapPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchIncidents();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('public:incidents_map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, payload => {
        fetchIncidents();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchIncidents = async () => {
    const { data } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      // Add mock x, y for visual placement if missing
      const processed = data.map((inc, i) => ({
        ...inc,
        // Deterministic pseudo-random placement for demo based on index if no real lat/lng
        x: inc.x || 20 + ((i * 17) % 60), 
        y: inc.y || 20 + ((i * 23) % 60)
      }));
      setIncidents(processed);
    }
  };

  const filtered = filter === "all" ? incidents : incidents.filter(i => i.priority === filter);

  return (
    <DashboardLayout role="admin">
      <div className="flex h-[calc(100vh-56px)]">
        {/* Map Area */}
        <div className="flex-1 relative bg-background overflow-hidden font-helvetica">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)]" />

          {/* Sector Labels */}
          {["Sector 1", "Sector 3", "Sector 5", "Sector 7", "Sector 9"].map((s, i) => (
            <div key={s} className="absolute text-[9px] text-gray-700 font-mono tracking-widest uppercase" style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 2) * 5}%` }}>{s}</div>
          ))}

          {/* Incident Markers */}
          {filtered.map((inc) => (
            <motion.button
              key={inc.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSelectedIncident(selectedIncident === inc.id ? null : inc.id)}
              className="absolute z-10 group"
              style={{ left: `${inc.x}%`, top: `${inc.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {/* Pulse ring for active */}
              {inc.status === "Processing" && (
                <motion.div animate={{ scale: [1, 2.5], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${inc.priority === "CRITICAL" ? "bg-foreground" : "bg-gray-400"}`} style={{ width: 24, height: 24, left: -4, top: -4 }}
                />
              )}
              <div className={`relative w-4 h-4 rounded-full border-2 shadow-lg transition-all ${
                inc.priority === "CRITICAL" ? "bg-foreground border-foreground shadow-[0_0_15px_rgba(255,255,255,0.5)]" :
                inc.priority === "HIGH" ? "bg-gray-300 border-gray-300 shadow-[0_0_10px_rgba(200,200,200,0.3)]" :
                "bg-gray-500 border-gray-500"
              } ${selectedIncident === inc.id ? "scale-150" : "group-hover:scale-125"}`} />

              {/* Tooltip */}
              {selectedIncident === inc.id && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md border border-foreground/15 rounded-lg p-3 whitespace-nowrap z-20 min-w-[180px]">
                  <div className="text-xs font-bold text-foreground mb-1">{inc.location}</div>
                  <div className="text-[10px] text-accent-muted mb-2">{inc.type}</div>
                  <div className="flex items-center gap-3 text-[10px] text-accent-dim">
                    <span className="flex items-center gap-1"><Users size={10} />{inc.affected}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      inc.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20" : "bg-foreground/[0.06] text-gray-300 border-foreground/10"
                    }`}>{inc.priority}</span>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg p-3 text-[10px] space-y-2">
            <div className="text-accent-dim font-bold uppercase tracking-wider mb-1">Priority</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-foreground shadow-[0_0_6px_rgba(255,255,255,0.5)]" /> Critical</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-300" /> High</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-500" /> Normal</div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            {[
              { l: "Processing", v: incidents.filter(i => i.status === "Processing").length }, 
              { l: "Dispatched", v: incidents.filter(i => i.status === "In Transit").length }, 
              { l: "Resolved", v: incidents.filter(i => i.status === "Resolved").length }
            ].map(s => (
              <div key={s.l} className="bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg px-3 py-2 text-center">
                <div className="text-sm font-bold">{s.v}</div>
                <div className="text-[9px] text-accent-dim">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-80 border-l border-foreground/[0.06] bg-background flex flex-col shrink-0 hidden lg:flex font-helvetica">
          <div className="p-4 border-b border-foreground/[0.06]">
            <h2 className="font-semibold tracking-tight text-sm mb-3">Live Incident Feed</h2>
            <div className="flex gap-1.5">
              {["all", "CRITICAL", "HIGH", "NORMAL"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium capitalize transition-all ${filter === f ? "bg-foreground text-background" : "text-accent-dim hover:text-foreground bg-foreground/[0.03]"}`}>
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <div className="p-5 text-center text-xs text-accent-dim">No incidents to display.</div>
            ) : (
              filtered.map(inc => (
                <button key={inc.id} onClick={() => setSelectedIncident(inc.id)}
                  className={`w-full text-left p-4 hover:bg-foreground/[0.02] transition-colors ${selectedIncident === inc.id ? "bg-foreground/[0.04]" : ""}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{inc.location}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      inc.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20" :
                      inc.priority === "HIGH" ? "bg-foreground/[0.06] text-gray-300 border-foreground/10" :
                      "bg-foreground/[0.03] text-accent-dim border-foreground/[0.06]"
                    }`}>{inc.priority}</span>
                  </div>
                  <div className="text-xs text-accent-dim mb-1.5">{inc.type}</div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    {inc.status === "Processing" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />Processing</>}
                    {inc.status === "In Transit" && <><Clock size={10} />Dispatched</>}
                    {inc.status === "Resolved" && <><CheckCircle2 size={10} />Resolved</>}
                    <span className="ml-auto">{inc.affected} affected</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
