import { Activity, AlertTriangle, Users, Map as MapIcon, Settings, Search, Bell, Menu, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#020202] text-white font-helvetica flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] hidden md:flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-bold tracking-tight">Impact Hub</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Overview</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium">
            <Activity size={18} />
            <span className="text-sm">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <AlertTriangle size={18} />
            <span className="text-sm">Incidents</span>
            <span className="ml-auto bg-red-500/20 text-red-400 text-xs py-0.5 px-2 rounded-full">3</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <MapIcon size={18} />
            <span className="text-sm">Live Map</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <Users size={18} />
            <span className="text-sm">Volunteers</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search incidents, resources..." 
                className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-300 w-64 transition-all focus:w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white/20" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1 tracking-tight">Command Center</h1>
                <p className="text-sm text-gray-400">Real-time resource allocation and incident tracking.</p>
              </div>
              <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                <AlertTriangle size={16} />
                Report Incident
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Active Incidents", value: "12", trend: "+2", color: "text-red-400", bg: "bg-red-500/10" },
                { label: "Volunteers Deployed", value: "348", trend: "+45", color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Avg Response Time", value: "8.4m", trend: "-1.2m", color: "text-green-400", bg: "bg-green-500/10" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="text-sm text-gray-400 mb-2 font-medium">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                      {stat.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Live Incidents Table */}
              <div className="xl:col-span-2 glass-panel rounded-xl border border-white/5 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <h2 className="font-semibold tracking-tight">Live Incidents</h2>
                  <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">View All</button>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-gray-500 bg-white/[0.02] border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Location</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Type</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Status</th>
                        <th className="px-6 py-4 font-medium tracking-wide uppercase">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-white">Sector 7 North</td>
                        <td className="px-6 py-4 text-gray-400">Medical Emergency</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-yellow-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                            Dispatching
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-semibold tracking-wide">CRITICAL</span></td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-white">Downtown Clinic</td>
                        <td className="px-6 py-4 text-gray-400">Supply Shortage</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-blue-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            In Transit
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-xs font-semibold tracking-wide">HIGH</span></td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-medium text-white">Westside Shelter</td>
                        <td className="px-6 py-4 text-gray-400">Food Delivery</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-green-400 font-medium">
                            <CheckCircle2 size={14} />
                            Resolved
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-semibold tracking-wide">NORMAL</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mock Map / AI Insights */}
              <div className="glass-panel rounded-xl border border-white/5 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                  <h2 className="font-semibold tracking-tight">AI Predictor Map</h2>
                </div>
                <div className="flex-1 relative min-h-[300px] bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                  
                  {/* Grid overlay for tech feel */}
                  <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)] border border-white/5 rounded-full w-[150%] h-[150%] -top-1/4 -left-1/4" />
                  
                  {/* Floating Map UI */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-xl">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-gray-400 font-medium">Predicted Hotspot</span>
                      <span className="text-red-400 font-bold">94% Confidence</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-[94%] h-full" />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-3 text-center">AI analysis based on historical patterns</p>
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
