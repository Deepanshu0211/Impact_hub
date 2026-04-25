"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, FileText, MapPin, Clock, CheckCircle2, Upload, Send, TrendingUp, Activity, Cpu, Sparkles, BrainCircuit, XCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NGODashboard() {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [extractions, setExtractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    volunteersActive: "0",
    avgResponse: "0m",
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
    
    // Set up realtime subscriptions
    const channel = supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nlp_extractions' }, () => {
        fetchData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch incidents
    const { data: incData } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (incData) setIncidents(incData);

    // Fetch extractions for this user
    if (user) {
      const { data: extData } = await supabase
        .from('nlp_extractions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (extData) setExtractions(extData);
    }
    
    // Fetch stats
    const { data: activeMissions } = await supabase.from('missions').select('volunteer_id').neq('status', 'Completed');
    const volunteersActive = activeMissions ? new Set(activeMissions.map(m => m.volunteer_id)).size : 0;
    
    // Calculate avg response
    const { data: recentMissions } = await supabase
      .from('missions')
      .select('created_at, incident:incidents(created_at)')
      .order('created_at', { ascending: false })
      .limit(20);
    
    let avgResponseStr = "—";
    if (recentMissions && recentMissions.length > 0) {
      let total = 0;
      let count = 0;
      recentMissions.forEach((m: any) => {
        if (m.incident?.created_at && m.created_at) {
          const diff = (new Date(m.created_at).getTime() - new Date(m.incident.created_at).getTime()) / 60000;
          if (diff > 0 && diff < 1440) {
            total += diff;
            count++;
          }
        }
      });
      if (count > 0) avgResponseStr = `${(total / count).toFixed(1)}m`;
    }

    setStats({
      volunteersActive: volunteersActive.toString(),
      avgResponse: avgResponseStr,
    });
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // 1. Submit to our AI Analysis API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reportText })
      });
      
      const aiData = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setReportText("");
        setTimeout(() => setSubmitted(false), 3000);
        fetchData(); // Refresh immediately after submission
      } else {
        setSubmitError(aiData.error || aiData.details || "AI processing failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setSubmitError("Network error — check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteIncident = async (id: string) => {
    if (!confirm('Delete this incident? This action cannot be undone.')) return;
    // Delete associated missions first
    await supabase.from('missions').delete().eq('incident_id', id);
    // Delete the incident
    await supabase.from('incidents').delete().eq('id', id);
    // Refresh data
    fetchData();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <DashboardLayout role="ngo">
      <div className="p-6 md:p-8 max-w-7xl mx-auto font-helvetica space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">NGO Command Center</h1>
            <p className="text-sm text-accent-dim">Real-time resource allocation and automated AI report parsing.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-xs text-foreground font-medium shadow-lg backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            System Online
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {[
            { label: "Active Reports", value: incidents.length.toString(), icon: FileText, trend: "Live Tracking" },
            { label: "AI Processed", value: extractions.length.toString(), icon: BrainCircuit, trend: "Entities Extracted" },
            { label: "Volunteers Active", value: stats.volunteersActive, icon: Activity, trend: "Currently Deployed" },
            { label: "Avg Response", value: stats.avgResponse, icon: Clock, trend: "Time to Deploy" },
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
                <TrendingUp size={12} className="text-green-400" />
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-8 relative z-10">
          {/* LEFT COL: AI Form & Extractions */}
          <div className="xl:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.04] to-transparent border border-foreground/[0.08] shadow-2xl glass-panel relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-foreground/10 blur-[50px] rounded-full pointer-events-none" />
              <h2 className="font-semibold mb-5 flex items-center gap-2 tracking-tight text-lg">
                <BrainCircuit size={18} className="text-accent-muted" />
                AI Field Reporter
                <Sparkles size={14} className="text-foreground ml-auto" />
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Enter raw field data. e.g. '500 people need water in Sector 7 due to flooding...'"
                    className="w-full h-32 px-4 py-3 rounded-xl bg-background/50 backdrop-blur-md border border-foreground/[0.1] text-sm text-foreground placeholder:text-gray-500 focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/20 resize-none transition-all shadow-inner font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !reportText.trim()}
                  className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-4 h-4 border-2 border-background/20 border-t-black rounded-full" /> Processing with Gemini...</>
                  ) : submitted ? (
                    <><CheckCircle2 size={18} /> Analyzed & Logged</>
                  ) : (
                    <><Send size={16} className="group-hover:translate-x-1 transition-transform" /> Extract & Dispatch</>
                  )}
                </button>
              </form>

              {/* Error feedback */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2"
                  >
                    <XCircle size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-0.5">Analysis Failed</div>
                      {submitError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success feedback */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    Report analyzed by Gemini AI and logged to the incident feed.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* NLP Extractions Mini Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.06] glass-panel"
            >
              <h3 className="font-semibold text-sm tracking-tight mb-4 flex items-center justify-between">
                <span>Recent AI Extractions</span>
                <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded uppercase tracking-widest">Self</span>
              </h3>
              <div className="space-y-3">
                {extractions.length === 0 ? (
                  <div className="text-xs text-accent-dim text-center py-4">
                    <BrainCircuit size={20} className="mx-auto mb-2 opacity-20" />
                    No AI extractions yet. Submit a field report above.
                  </div>
                ) : (
                  extractions.map((ext) => (
                    <div key={ext.id} className="p-3 rounded-lg border border-foreground/[0.04] bg-background/50 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium">{ext.extracted_data?.location || "Unknown"}</span>
                        <span className="text-[9px] text-accent-muted">{getTimeAgo(ext.created_at)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-foreground/[0.06] text-[9px] font-mono text-gray-300">
                          {ext.extracted_data?.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${ext.extracted_data?.priority === 'CRITICAL' ? 'bg-foreground text-background' : 'bg-foreground/10 text-foreground'}`}>
                          {ext.extracted_data?.priority}
                        </span>
                        {ext.extracted_data?.confidence_score && (
                          <span className="px-1.5 py-0.5 rounded bg-foreground/[0.04] text-[9px] font-mono text-accent-dim">
                            {ext.extracted_data.confidence_score}% conf
                          </span>
                        )}
                      </div>
                      {ext.extracted_data?.summary && (
                        <div className="text-[10px] text-accent-dim line-clamp-2">{ext.extracted_data.summary}</div>
                      )}
                      <div className="text-[10px] text-accent-muted truncate">{ext.raw_text}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COL: Live Incidents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 rounded-2xl bg-gradient-to-b from-foreground/[0.03] to-background border border-foreground/[0.08] shadow-2xl overflow-hidden flex flex-col glass-panel"
          >
            <div className="p-6 border-b border-foreground/[0.06] flex justify-between items-center bg-foreground/[0.01]">
              <h2 className="font-semibold tracking-tight flex items-center gap-2 text-lg">
                <AlertTriangle size={18} className="text-accent-muted" />
                Network Intelligence Feed
              </h2>
              <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-foreground/10">
                <span className="text-[10px] text-foreground font-mono font-bold tracking-widest">LIVE DATA</span>
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {loading ? (
                 <div className="h-64 flex flex-col items-center justify-center text-accent-dim text-sm space-y-4">
                   <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                   <span>Syncing global network...</span>
                 </div>
              ) : incidents.length === 0 ? (
                 <div className="h-64 flex flex-col items-center justify-center text-accent-dim text-sm">
                   <MapPin size={32} className="opacity-20 mb-3" />
                   <span>No active incidents detected.</span>
                   <span className="text-[11px] text-gray-600 mt-1">Submit a field report to create one.</span>
                 </div>
              ) : (
                <div className="space-y-2">
                  {incidents.map((need, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={need.id} 
                      className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-foreground/[0.04] border border-transparent hover:border-foreground/[0.06] transition-all cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-bold text-foreground">{need.location}</div>
                          <span className="text-[10px] text-accent-muted">• {getTimeAgo(need.created_at)}</span>
                        </div>
                        <div className="text-sm text-accent-dim mb-2 line-clamp-1">{need.description}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider border ${
                            need.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20" :
                            need.priority === "HIGH" ? "bg-foreground/[0.06] text-gray-300 border-foreground/10" :
                            "bg-foreground/[0.03] text-accent-dim border-foreground/[0.06]"
                          }`}>
                            {need.priority}
                          </span>
                          <span className="px-2 py-1 rounded-md bg-foreground/[0.03] border border-foreground/[0.06] text-[10px] font-medium text-gray-400">
                            {need.type}
                          </span>
                          {need.affected && need.affected !== 'Unknown' && (
                            <span className="px-2 py-1 rounded-md bg-background border border-foreground/[0.04] text-[10px] font-mono text-accent-muted">
                              👥 {need.affected}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-background border border-foreground/10">
                          {need.status === "Processing" && <><Cpu size={12} className="animate-spin text-accent-muted" />Processing</>}
                          {need.status === "Dispatched" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />Dispatched</>}
                          {need.status === "Active" && <><Activity size={12} className="text-accent-muted" />Active</>}
                          {need.status === "In Transit" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />In Transit</>}
                          {need.status === "Resolved" && <><CheckCircle2 size={12} className="text-green-500" />Resolved</>}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteIncident(need.id); }}
                          className="flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                          title="Delete Incident"
                        >
                          <Trash2 size={11} /> Delete
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
