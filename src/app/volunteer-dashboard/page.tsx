"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, Star, ArrowRight, Zap, Trophy, Target, Heart } from "lucide-react";
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

    // Fetch My Active Missions (Wait, we join incidents with missions for display)
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">Volunteer Mission Control</h1>
            <p className="text-sm text-accent-dim">Accept missions, track your impact, help communities.</p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
            {(["available", "busy", "offline"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                  status === s
                    ? "bg-foreground text-background"
                    : "text-accent-dim hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              className="p-5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] hover:border-foreground/[0.1] transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-accent-dim font-medium uppercase tracking-wider">{stat.label}</span>
                <stat.icon size={15} className="text-gray-600 group-hover:text-accent-muted transition-colors" />
              </div>
              <div className="text-2xl font-bold tracking-tight mb-1">{stat.value}</div>
              <div className="text-[11px] text-gray-600">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid xl:grid-cols-5 gap-6">
          {/* Active Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 space-y-4"
          >
            <h2 className="font-semibold tracking-tight flex items-center gap-2 text-sm">
              <Target size={15} className="text-accent-muted" />
              Active Assignments
              <span className="ml-auto text-[10px] text-gray-600 font-mono">{activeAssignments.length} ACTIVE</span>
            </h2>

            {loading ? (
              <div className="p-5 text-center text-xs text-accent-dim">Loading assignments...</div>
            ) : activeAssignments.length === 0 ? (
              <div className="p-5 text-center text-xs text-accent-dim bg-foreground/[0.02] rounded-xl border border-foreground/[0.06]">
                You have no active missions.
              </div>
            ) : (
              activeAssignments.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-5 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] hover:border-foreground/[0.1] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-sm text-foreground">{a.incident?.location || "Unknown"}</div>
                      <div className="text-xs text-accent-dim mt-0.5">{a.incident?.type || "Mission"}</div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-accent-muted bg-foreground/[0.05] px-2 py-0.5 rounded border border-foreground/[0.06]">
                      {a.status}
                    </span>
                  </div>

                  {/* Complete Button */}
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => completeMission(a.id, a.incident_id)}
                      className="w-full py-2 rounded border border-foreground/20 hover:bg-foreground/10 text-xs font-semibold flex justify-center items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 size={14} /> Mark Completed
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
            className="xl:col-span-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] overflow-hidden flex flex-col"
            id="missions"
          >
            <div className="p-5 border-b border-foreground/[0.04] flex justify-between items-center">
              <h2 className="font-semibold tracking-tight flex items-center gap-2">
                <Zap size={15} className="text-accent-muted" />
                Live Incidents
              </h2>
              <span className="text-[10px] text-accent-dim font-mono">LIVE DATABASE</span>
            </div>

            <div className="flex-1 divide-y divide-white/[0.03]">
              {loading ? (
                <div className="p-10 text-center text-sm text-accent-dim">Loading missions...</div>
              ) : availableMissions.length === 0 ? (
                 <div className="p-10 text-center text-sm text-accent-dim">No active incidents available.</div>
              ) : (
                availableMissions.map((mission) => (
                  <div key={mission.id} className="p-5 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{mission.location}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${
                            mission.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20" :
                            mission.priority === "HIGH" ? "bg-foreground/[0.06] text-gray-300 border-foreground/10" :
                            "bg-foreground/[0.03] text-accent-dim border-foreground/[0.06]"
                          }`}>
                            {mission.priority}
                          </span>
                        </div>
                        <div className="text-xs text-accent-dim mb-2">{mission.type}</div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-600">
                          <span className="flex items-center gap-1"><Clock size={11} />Reported: {getTimeAgo(mission.created_at)}</span>
                          <span>{mission.affected} affected</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAccept(mission.id)}
                        disabled={acceptedMission === mission.id || mission.status === 'In Transit'}
                        className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.95] ${
                          acceptedMission === mission.id
                            ? "bg-foreground/10 text-foreground border border-foreground/20"
                            : mission.status === 'In Transit' 
                            ? "bg-foreground/[0.05] text-accent-dim cursor-not-allowed border border-foreground/[0.05]"
                            : "bg-foreground text-background hover:bg-gray-200"
                        }`}
                      >
                        {acceptedMission === mission.id ? (
                          <><CheckCircle2 size={13} /> Accepted</>
                        ) : mission.status === 'In Transit' ? (
                          <>Dispatched</>
                        ) : (
                          <><ArrowRight size={13} /> Accept</>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
