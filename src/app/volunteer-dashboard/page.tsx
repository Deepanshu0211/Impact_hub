"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, Star, ArrowRight, Zap, Trophy, Target, Heart, Navigation2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VolunteerDashboard() {
  const [status, setStatus] = useState<"available" | "busy" | "offline">("available");
  const [acceptedMission, setAcceptedMission] = useState<string | null>(null);
  
  const [availableMissions, setAvailableMissions] = useState<any[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchData(user.id);
      }
    }
    
    init();

    // Set up realtime subscriptions
    const channel = supabase
      .channel('public:volunteer_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        if (user) fetchData(user.id);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => {
        if (user) fetchData(user.id);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchData = async (userId: string) => {
    // Fetch Active Incidents not yet resolved
    const { data: incidents } = await supabase
      .from('incidents')
      .select('*')
      .neq('status', 'Resolved')
      .order('created_at', { ascending: false });
      
    if (incidents) setAvailableMissions(incidents);

    // Fetch My Active Missions
    const { data: missions } = await supabase
      .from('missions')
      .select('*, incident:incidents(*)')
      .eq('volunteer_id', userId)
      .neq('status', 'Completed');
      
    if (missions) setActiveAssignments(missions);
    
    setLoading(false);
  };

  const handleAccept = async (incidentId: string) => {
    if (!user) return;
    setAcceptedMission(incidentId);
    
    // Create mission
    await supabase.from('missions').insert([{
      incident_id: incidentId,
      volunteer_id: user.id,
      status: 'In Progress'
    }]);

    // Update incident status
    await supabase.from('incidents').update({
      status: 'In Transit'
    }).eq('id', incidentId);
    
    setTimeout(() => {
      setAcceptedMission(null);
      fetchData(user.id);
    }, 1000);
  };
  
  const completeMission = async (missionId: string, incidentId: string) => {
    if (!user) return;
    
    // Mark mission completed
    await supabase.from('missions').update({
      status: 'Completed'
    }).eq('id', missionId);
    
    // Mark incident resolved
    await supabase.from('incidents').update({
      status: 'Resolved'
    }).eq('id', incidentId);
    
    fetchData(user.id);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <DashboardLayout role="volunteer">
      <div className="p-6 md:p-8 max-w-7xl mx-auto font-helvetica space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Volunteer Operations</h1>
            <p className="text-sm text-accent-dim">Accept missions, deploy resources, and track field impact.</p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] backdrop-blur-sm shadow-lg">
            {(["available", "busy", "offline"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all capitalize ${
                  status === s
                    ? "bg-foreground text-background shadow-md"
                    : "text-accent-dim hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {[
            { label: "Missions Complete", value: "47", icon: Trophy, sub: "This month" },
            { label: "People Helped", value: "2,340", icon: Heart, sub: "Total impact" },
            { label: "Hours Volunteered", value: "186", icon: Clock, sub: "This quarter" },
            { label: "Impact Score", value: "94", icon: Star, sub: "Top 5%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative p-6 rounded-2xl bg-gradient-to-b from-foreground/[0.04] to-foreground/[0.01] border border-foreground/[0.08] hover:border-foreground/[0.15] transition-all duration-300 group overflow-hidden glass-panel"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon size={48} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-accent-dim font-bold uppercase tracking-widest">{stat.label}</span>
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-foreground/10 group-hover:scale-110 transition-transform">
                  <stat.icon size={14} className="text-foreground" />
                </div>
              </div>
              <div className="text-4xl font-bold tracking-tight mb-2 drop-shadow-sm">{stat.value}</div>
              <div className="text-xs text-accent-muted font-medium flex items-center gap-1.5">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid xl:grid-cols-5 gap-8 relative z-10">
          {/* Active Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 space-y-4"
          >
            <h2 className="font-semibold tracking-tight flex items-center gap-2 text-lg">
              <Target size={18} className="text-accent-muted" />
              Active Deployments
              <span className="ml-auto text-[10px] text-foreground font-mono bg-foreground/10 px-2 py-0.5 rounded-full border border-foreground/20">{activeAssignments.length} ACTIVE</span>
            </h2>

            {loading ? (
              <div className="p-8 text-center text-xs text-accent-dim glass-panel rounded-2xl border border-foreground/[0.06]">Loading assignments...</div>
            ) : activeAssignments.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center text-xs text-accent-dim glass-panel rounded-2xl border border-foreground/[0.06]">
                <Navigation2 size={24} className="opacity-20 mb-3" />
                You have no active missions.<br/>Standby for deployment.
              </div>
            ) : (
              activeAssignments.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-foreground/[0.04] to-transparent border border-foreground/[0.08] shadow-lg glass-panel relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />
                  <div className="flex items-start justify-between mb-4 pl-2">
                    <div>
                      <div className="font-bold text-lg text-foreground mb-1 tracking-tight">{a.incident?.location || "Unknown"}</div>
                      <div className="text-xs text-accent-dim flex items-center gap-1.5">
                        <MapPin size={12} className="text-accent-muted" />
                        {a.incident?.type || "Mission"} • <span className="font-mono">{a.incident?.affected} affected</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                      {a.status}
                    </span>
                  </div>

                  {/* Complete Button */}
                  <div className="mt-5 flex gap-2 pl-2">
                    <button 
                      onClick={() => completeMission(a.id, a.incident_id)}
                      className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-gray-200 text-sm font-bold flex justify-center items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                    >
                      <CheckCircle2 size={16} /> Mark Mission Completed
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Available Missions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="xl:col-span-3 rounded-2xl bg-gradient-to-b from-foreground/[0.03] to-background border border-foreground/[0.08] shadow-2xl overflow-hidden flex flex-col glass-panel"
            id="missions"
          >
            <div className="p-6 border-b border-foreground/[0.06] flex justify-between items-center bg-foreground/[0.01]">
              <h2 className="font-semibold tracking-tight flex items-center gap-2 text-lg">
                <Zap size={18} className="text-yellow-500" />
                Live Network Incidents
              </h2>
              <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-foreground/10">
                <span className="text-[10px] text-foreground font-mono font-bold tracking-widest">LIVE DATA</span>
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {loading ? (
                <div className="p-10 flex flex-col items-center justify-center text-sm text-accent-dim space-y-4">
                  <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                  <span>Scanning local grid...</span>
                </div>
              ) : availableMissions.length === 0 ? (
                 <div className="p-10 flex flex-col items-center justify-center text-sm text-accent-dim">
                   <Zap size={32} className="opacity-20 mb-3" />
                   No active incidents in your sector.
                 </div>
              ) : (
                <div className="space-y-2">
                  {availableMissions.map((mission, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={mission.id} 
                      className="group p-5 rounded-xl hover:bg-foreground/[0.04] border border-transparent hover:border-foreground/[0.06] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-foreground text-lg">{mission.location}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider border ${
                              mission.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" :
                              mission.priority === "HIGH" ? "bg-foreground/[0.06] text-gray-300 border-foreground/10" :
                              "bg-foreground/[0.03] text-accent-dim border-foreground/[0.06]"
                            }`}>
                              {mission.priority}
                            </span>
                          </div>
                          <div className="text-sm text-accent-dim mb-3 line-clamp-1">{mission.description || mission.type}</div>
                          <div className="flex items-center gap-4 text-[11px] font-medium text-accent-muted bg-foreground/[0.02] inline-flex px-3 py-1.5 rounded-lg border border-foreground/[0.04]">
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {getTimeAgo(mission.created_at)}</span>
                            <span className="w-px h-3 bg-foreground/10" />
                            <span className="font-mono">👥 {mission.affected} affected</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAccept(mission.id)}
                          disabled={acceptedMission === mission.id || mission.status === 'In Transit'}
                          className={`shrink-0 h-11 px-6 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-[0.95] ${
                            acceptedMission === mission.id
                              ? "bg-foreground/10 text-foreground border border-foreground/20"
                              : mission.status === 'In Transit' 
                              ? "bg-foreground/[0.05] text-accent-dim cursor-not-allowed border border-foreground/[0.05]"
                              : "bg-foreground text-background hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105"
                          }`}
                        >
                          {acceptedMission === mission.id ? (
                            <><CheckCircle2 size={16} /> Deploying</>
                          ) : mission.status === 'In Transit' ? (
                            <>Dispatched</>
                          ) : (
                            <>Deploy <ArrowRight size={16} /></>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
