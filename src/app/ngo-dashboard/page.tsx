"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { AlertTriangle, FileText, MapPin, Clock, CheckCircle2, Upload, Send, TrendingUp, Activity, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NGODashboard() {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchIncidents();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, payload => {
        fetchIncidents();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setIncidents(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    
    setIsSubmitting(true);
    
    // 1. Get user
    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. Submit to our AI Analysis API first
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reportText })
      });
      
      const aiData = await response.json();
      
      // 3. Save to Supabase
      const { data, error } = await supabase.from('incidents').insert([{
        created_by: user?.id,
        location: aiData.location || "Unknown",
        type: aiData.resource_needed || "General Support",
        priority: aiData.priority?.toUpperCase() || "NORMAL",
        status: 'Processing',
        affected: aiData.affected_count || "Unknown",
        description: reportText
      }]);
      
      if (!error) {
        setSubmitted(true);
        setReportText("");
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto font-helvetica">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">NGO Command Center</h1>
            <p className="text-sm text-accent-dim">Submit reports, track needs, manage resource allocation.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-accent-dim">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            System Online (Live DB)
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Reports", value: incidents.length.toString(), icon: FileText, trend: "Live Tracking" },
            { label: "Processing", value: incidents.filter(i => i.status === 'Processing').length.toString(), icon: Cpu, trend: "AI analyzing" },
            { label: "Volunteers Active", value: "156", icon: Activity, trend: "+12 online" },
            { label: "Avg Response", value: "6.2m", icon: Clock, trend: "-1.8m faster" },
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
              <div className="text-[11px] text-gray-600">{stat.trend}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid xl:grid-cols-5 gap-6">
          {/* Report Submission Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 p-6 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2 tracking-tight">
              <Upload size={16} className="text-accent-muted" />
              Submit Field Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] text-accent-dim uppercase tracking-wider mb-1.5 font-medium">Report Description</label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g., 500 people need water in Sector 7, infrastructure damaged..."
                  className="w-full h-24 px-4 py-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-foreground/15 resize-none transition-all"
                />
              </div>

              {/* Image Upload Area */}
              <div className="border border-dashed border-foreground/[0.08] rounded-xl p-4 text-center hover:border-foreground/15 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-gray-600 mb-2" />
                <p className="text-xs text-accent-dim">Drop image for AI damage analysis</p>
                <p className="text-[10px] text-gray-600 mt-1">PNG, JPG up to 10MB</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !reportText.trim()}
                className="w-full h-11 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-4 h-4 border-2 border-background/20 border-t-black rounded-full" />
                ) : submitted ? (
                  <><CheckCircle2 size={16} /> Report Logged & Analyzed</>
                ) : (
                  <><Send size={14} /> AI Analyze & Submit</>
                )}
              </button>
            </form>

            {/* AI Processing Indicator */}
            <div className="mt-4 p-3 rounded-lg bg-foreground/[0.02] border border-foreground/[0.04]">
              <div className="flex items-center gap-2 text-xs text-accent-dim mb-2">
                <Cpu size={12} className="animate-spin" />
                <span>AI Processing Engine</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-2">Reports are automatically parsed by Gemini to extract location, needs, and priority.</p>
            </div>
          </motion.div>

          {/* Active Needs Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-foreground/[0.04] flex justify-between items-center">
              <h2 className="font-semibold tracking-tight flex items-center gap-2">
                <AlertTriangle size={16} className="text-accent-muted" />
                Active Needs Feed
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-accent-dim font-mono">LIVE DATABASE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              </div>
            </div>

            <div className="flex-1 overflow-auto min-h-[300px]">
              {loading ? (
                 <div className="h-full flex items-center justify-center text-accent-dim text-sm">Loading live data...</div>
              ) : incidents.length === 0 ? (
                 <div className="h-full flex items-center justify-center text-accent-dim text-sm">No incidents reported yet.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-gray-600 bg-foreground/[0.01] border-b border-foreground/[0.04] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-medium">Location</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Priority</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Affected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {incidents.map((need) => (
                      <tr key={need.id} className="hover:bg-foreground/[0.02] transition-colors cursor-pointer">
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground text-sm">{need.location}</div>
                          <div className="text-[10px] text-gray-600 mt-0.5">{getTimeAgo(need.created_at)}</div>
                        </td>
                        <td className="px-5 py-4 text-accent-muted text-sm">{need.type}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${
                            need.priority === "CRITICAL" ? "bg-foreground/10 text-foreground border-foreground/20" :
                            need.priority === "HIGH" ? "bg-foreground/[0.06] text-gray-300 border-foreground/10" :
                            "bg-foreground/[0.03] text-accent-dim border-foreground/[0.06]"
                          }`}>
                            {need.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-sm font-medium">
                            {need.status === "Processing" && <><Cpu size={12} className="animate-spin text-accent-muted" /><span className="text-accent-muted">Processing</span></>}
                            {need.status === "Dispatched" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" /><span className="text-gray-300">Dispatched</span></>}
                            {need.status === "Resolved" && <><CheckCircle2 size={13} className="text-accent-dim" /><span className="text-accent-dim">Resolved</span></>}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-accent-muted font-mono text-sm">{need.affected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
