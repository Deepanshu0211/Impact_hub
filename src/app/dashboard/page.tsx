import { Activity, AlertTriangle, Users, Map as MapIcon, Settings, Search, Bell, Menu, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-helvetica flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/[0.06] bg-background hidden md:flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-foreground/[0.06]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <div className="w-2 h-2 bg-background rounded-sm" />
            </div>
            <span className="font-bold tracking-tight">Impact Hub</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 mt-2">Overview</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-foreground/[0.06] text-foreground font-medium">
            <Activity size={18} />
            <span className="text-sm">Dashboard</span>
          </a>
          <Link href="/ngo-dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-muted hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
            <AlertTriangle size={18} />
            <span className="text-sm">NGO View</span>
          </Link>
          <Link href="/volunteer-dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-muted hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
            <Users size={18} />
            <span className="text-sm">Volunteer View</span>
          </Link>
          <Link href="/live-map" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-muted hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
            <MapIcon size={18} />
            <span className="text-sm">Live Map</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-foreground/[0.06]">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-muted hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-foreground/[0.06] bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-accent-muted hover:text-foreground">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="text" 
                placeholder="Search incidents, resources..." 
                className="pl-9 pr-4 py-1.5 bg-foreground/[0.03] border border-foreground/[0.06] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white/20 text-gray-300 w-64 transition-all focus:w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-accent-muted hover:text-foreground">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-foreground rounded-full animate-pulse" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 border border-foreground/20" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-foreground/[0.02] blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1 tracking-tight">Command Center</h1>
                <p className="text-sm text-accent-muted">Real-time resource allocation and incident tracking.</p>
              </div>
              <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/5">
                <AlertTriangle size={16} />
                Report Incident
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Active Incidents", value: "12", trend: "+2" },
                { label: "Volunteers Deployed", value: "348", trend: "+45" },
                { label: "Avg Response Time", value: "8.4m", trend: "-1.2m" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-xl p-6 border border-foreground/[0.06] relative overflow-hidden group hover:border-foreground/10 transition-colors">
                  <div className="text-sm text-accent-muted mb-2 font-medium">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-xs font-semibold px-2 py-1 rounded-full bg-foreground/[0.06] text-gray-300">
                      {stat.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Live Incidents Table */}
              <div className="xl:col-span-2 glass-panel rounded-xl border border-foreground/[0.06] overflow-hidden flex flex-col">
                <div className="p-5 border-b border-foreground/[0.04] flex justify-between items-center bg-foreground/[0.01]">
                  <h2 className="font-semibold tracking-tight">Live Incidents</h2>
                  <button className="text-xs font-medium text-accent-muted hover:text-foreground transition-colors">View All</button>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-accent-dim bg-foreground/[0.02] border-b border-foreground/[0.04]">
                      <tr>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Location</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Type</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Status</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      <tr className="hover:bg-foreground/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-foreground">Sector 7 North</td>
                        <td className="px-6 py-4 text-accent-muted">Medical Emergency</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-gray-300 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                            Dispatching
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-foreground/10 text-foreground border border-foreground/20 rounded-md text-xs font-semibold tracking-wide">CRITICAL</span></td>
                      </tr>
                      <tr className="hover:bg-foreground/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-foreground">Downtown Clinic</td>
                        <td className="px-6 py-4 text-accent-muted">Supply Shortage</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-accent-muted font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            In Transit
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-foreground/[0.06] text-gray-300 border border-foreground/10 rounded-md text-xs font-semibold tracking-wide">HIGH</span></td>
                      </tr>
                      <tr className="hover:bg-foreground/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-foreground">Westside Shelter</td>
                        <td className="px-6 py-4 text-accent-muted">Food Delivery</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-accent-dim font-medium">
                            <CheckCircle2 size={14} />
                            Resolved
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-foreground/[0.03] text-accent-dim border border-foreground/[0.06] rounded-md text-xs font-semibold tracking-wide">NORMAL</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mock Map / AI Insights */}
              <div className="glass-panel rounded-xl border border-foreground/[0.06] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-foreground/[0.04] bg-foreground/[0.01]">
                  <h2 className="font-semibold tracking-tight">AI Predictor Map</h2>
                </div>
                <div className="flex-1 relative min-h-[300px] bg-background overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-foreground/[0.08] rounded-full blur-3xl animate-pulse" />
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-foreground/[0.03] rounded-full blur-2xl" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg p-4 shadow-xl">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-accent-muted font-medium">Predicted Hotspot</span>
                      <span className="text-foreground font-bold">94% Confidence</span>
                    </div>
                    <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-400 to-white w-[94%] h-full" />
                    </div>
                    <p className="text-[10px] text-accent-dim mt-3 text-center">AI analysis based on historical patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
