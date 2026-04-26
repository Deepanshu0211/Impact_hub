"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, CheckCircle2, Clock, Users, Flame, Layers } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

// Geocode cache
const geocodeCache: Record<string, [number, number]> = {};

async function geocodeLocation(location: string): Promise<[number, number] | null> {
  const key = location.toLowerCase().trim();
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ", India")}&format=json&limit=1`,
      { headers: { 'User-Agent': 'ImpactHub/1.0' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[key] = coords;
      return coords;
    }
  } catch (e) {
    console.warn('Geocoding failed for:', location);
  }
  return null;
}

function getCoords(location: string, lat?: number, lng?: number, index?: number): [number, number] {
  if (lat && lng && lat !== 0 && lng !== 0) return [lat, lng];
  const key = (location || "").toLowerCase().trim();
  if (geocodeCache[key]) {
    const c = geocodeCache[key];
    const j = (index || 0) * 0.003;
    return [c[0] + j, c[1] + j];
  }
  // Fallback
  const idx = index || 0;
  return [22.0 + ((idx * 7 + 3) % 20) * 0.3, 78.0 + ((idx * 11 + 5) % 20) * 0.3];
}

// Map component
function MapInner({ incidents, filter, selectedIncident, setSelectedIncident }: {
  incidents: any[];
  filter: string;
  selectedIncident: string | null;
  setSelectedIncident: (id: string | null) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [L, setL] = useState<any>(null);
  const [geocodeDone, setGeocodeDone] = useState(0);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let isMounted = true;
    import("leaflet").then((leaflet) => {
      if (!isMounted) return;
      const Ld = leaflet.default;
      setL(Ld);
      Ld.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      import("leaflet/dist/leaflet.css");
      
      const container = mapContainerRef.current!;
      if ((container as any)._leaflet_id) {
        return;
      }

      const map = Ld.map(container, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });
      Ld.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });
    
    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Geocode all incidents whenever they change
  useEffect(() => {
    if (!incidents.length) return;
    let cancelled = false;
    async function doGeocode() {
      for (const inc of incidents) {
        if (!inc.lat && !inc.lng) {
          await geocodeLocation(inc.location);
          await new Promise(r => setTimeout(r, 1000)); // Throttling
        }
      }
      if (!cancelled) setGeocodeDone(d => d + 1);
    }
    doGeocode();
    return () => { cancelled = true; };
  }, [incidents]);

  // Place markers
  useEffect(() => {
    if (!mapReady || !L || !mapRef.current) return;
    const map = mapRef.current;

    // Clear
    map.eachLayer((layer: any) => {
      if (layer._isIncidentMarker) map.removeLayer(layer);
    });

    const filtered = filter === "all" ? incidents : incidents.filter(i => i.priority === filter);
    const heatPoints: [number, number, number][] = [];

    filtered.forEach((inc, i) => {
      const [lat, lng] = getCoords(inc.location, inc.lat, inc.lng, i);
      const intensity = inc.priority === "CRITICAL" ? 1.0 : inc.priority === "HIGH" ? 0.7 : 0.4;
      heatPoints.push([lat, lng, intensity]);

      const color = inc.priority === "CRITICAL" ? "#b91c1c" : inc.priority === "HIGH" ? "#b45309" : "#15803d";
      const fillColor = inc.priority === "CRITICAL" ? "#dc2626" : inc.priority === "HIGH" ? "#d97706" : "#22c55e";
      const radius = inc.priority === "CRITICAL" ? 10 : inc.priority === "HIGH" ? 7 : 5;

      const marker = L.circleMarker([lat, lng], {
        radius,
        color,
        fillColor,
        fillOpacity: inc.priority === "CRITICAL" ? 0.85 : 0.65,
        weight: 2,
      });
      marker._isIncidentMarker = true;

      // Build volunteer HTML for popup
      const deployedVols = inc.deployed_volunteers || [];
      const volHtml = deployedVols.length > 0 
        ? `<div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
            <div style="font-size: 10px; color: #818cf8; margin-bottom: 4px;">🛡️ Deployed Volunteers (${deployedVols.length}):</div>
            ${deployedVols.map((v: any) => `<div style="font-size: 10px; color: #a1a1aa; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
              ${v.avatar_url ? `<img src="${v.avatar_url}" style="width:14px; height:14px; border-radius:50%; border: 1px solid rgba(255,255,255,0.2);" />` : '<div style="width:14px; height:14px; border-radius:50%; background: rgba(255,255,255,0.15);"></div>'}
              ${v.name || 'Volunteer'}
            </div>`).join('')}
           </div>` 
        : '';

      const popupContent = `
        <div style="font-family: 'Helvetica Neue', sans-serif; color: #fff; min-width: 200px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${inc.location}</div>
          <div style="font-size: 11px; color: #a1a1aa; margin-bottom: 4px;">${inc.type || 'General'}</div>
          ${inc.ngo_name ? `<div style="font-size: 10px; color: #818cf8; margin-bottom: 6px;">📋 Reported by: ${inc.ngo_name}</div>` : ''}
          <div style="display: flex; gap: 8px; font-size: 10px; color: #71717a;">
            <span>👥 ${inc.affected || 'Unknown'} affected</span>
            <span style="padding: 1px 6px; border-radius: 4px; background: ${inc.priority === 'CRITICAL' ? 'rgba(220,38,38,0.25)' : inc.priority === 'HIGH' ? 'rgba(217,119,6,0.25)' : 'rgba(34,197,94,0.25)'}; font-weight: 700; color: ${inc.priority === 'CRITICAL' ? '#f87171' : inc.priority === 'HIGH' ? '#fbbf24' : '#4ade80'}; letter-spacing: 0.05em;">
              ${inc.priority}
            </span>
          </div>
          ${inc.description ? `<div style="font-size: 11px; color: #a1a1aa; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">${inc.description}</div>` : ''}
          ${volHtml}
        </div>
      `;

      marker.bindPopup(popupContent, { className: "dark-popup", closeButton: true, maxWidth: 280 });
      marker.on("mouseover", function (this: any) { this.openPopup(); });
      marker.on("mouseout", function (this: any) { this.closePopup(); });
      marker.on("click", () => setSelectedIncident(inc.id));
      marker.addTo(map);
    });

    // Heatmap circles
    heatPoints.forEach(([lat, lng, intensity]) => {
      const heatColor = intensity >= 0.9 ? "#dc2626" : intensity >= 0.6 ? "#d97706" : "#22c55e";
      const heatCircle = L.circle([lat, lng], {
        radius: 15000 * intensity,
        color: "transparent",
        fillColor: heatColor,
        fillOpacity: 0.06 * intensity,
        weight: 0,
      });
      heatCircle._isIncidentMarker = true;
      heatCircle.addTo(map);
    });

    // Fit bounds
    if (filtered.length > 0) {
      const bounds = filtered.map((inc: any, i: number) => getCoords(inc.location, inc.lat, inc.lng, i));
      try { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 }); } catch {}
    }
  }, [mapReady, incidents, filter, L, geocodeDone]);

  return <div ref={mapContainerRef} className="absolute inset-0" style={{ background: "#09090b" }} />;
}

export default function LiveMapPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchIncidents();
    const channel = supabase
      .channel('public:incidents_map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchIncidents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => {
        fetchIncidents();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const fetchIncidents = async () => {
    // Fetch incidents with missions and volunteer profiles
    const { data, error } = await supabase
      .from('incidents')
      .select('*, missions(id, volunteer_id, status, profiles(*))')
      .order('created_at', { ascending: false });

    if (error) { console.error('Failed to fetch incidents:', error); return; }
    if (!data) return;

    // Fetch NGO names separately
    const creatorIds = [...new Set(data.filter(d => d.created_by).map(d => d.created_by))];
    let ngoMap: Record<string, string> = {};
    if (creatorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, metadata')
        .in('id', creatorIds);
      if (profiles) {
        profiles.forEach((p: any) => { ngoMap[p.id] = p.metadata?.orgName || p.name || 'Unknown NGO'; });
      }
    }

    const mapped = data.map((inc: any) => ({
      ...inc,
      ngo_name: inc.created_by ? (ngoMap[inc.created_by] || null) : null,
      deployed_volunteers: (inc.missions || [])
        .filter((m: any) => m.status !== 'Completed')
        .map((m: any) => ({
          id: m.volunteer_id,
          name: m.profiles?.metadata?.full_name || m.profiles?.name || m.profiles?.metadata?.orgName || 'Volunteer',
          avatar_url: m.profiles?.avatar_url || null,
        }))
    }));
    setIncidents(mapped);
  };

  const filtered = filter === "all" ? incidents : incidents.filter(i => i.priority === filter);

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
    <DashboardLayout role="admin">
      {/* Use fixed height that accounts for header (56px) and bottom nav (~80px) */}
      <div className="flex" style={{ height: 'calc(100vh - 56px - 80px)' }}>
        {/* Map Area */}
        <div className="flex-1 relative bg-background overflow-hidden font-helvetica">
          <MapInner
            incidents={incidents}
            filter={filter}
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
          />

          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 flex gap-2 z-[1000]">
            {[
              { l: "Processing", v: incidents.filter(i => i.status === "Processing" || i.status === "Active").length },
              { l: "Dispatched", v: incidents.filter(i => i.status === "In Transit").length },
              { l: "Resolved", v: incidents.filter(i => i.status === "Resolved").length }
            ].map(s => (
              <div key={s.l} className="bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg px-3 py-2 text-center">
                <div className="text-sm font-bold">{s.v}</div>
                <div className="text-[9px] text-accent-dim">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Toggle sidebar button (mobile) */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-4 right-4 z-[1000] sm:hidden bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg px-3 py-2 text-xs font-bold"
          >
            {showSidebar ? "Hide" : "Feed"}
          </button>

          {/* Heatmap Legend — positioned above bottom nav */}
          <div className="absolute bottom-4 left-4 z-[1000] flex gap-3">
            <div className="bg-background/80 backdrop-blur-md border border-foreground/10 rounded-lg p-3 text-xs space-y-1.5">
              <div className="text-accent-dim font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Flame size={10} /> Heatmap Legend
              </div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.5)]" /> Critical</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /> Normal</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-80' : 'w-0 overflow-hidden'} transition-all duration-300 border-l border-foreground/[0.06] flex flex-col bg-background/50 backdrop-blur-md`}>
          <div className="p-4 border-b border-foreground/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold tracking-tight text-sm">Incident Feed</h2>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-foreground/[0.04] border border-foreground/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold tracking-wider">LIVE</span>
              </div>
            </div>
            <div className="flex gap-1">
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
              <div className="p-5 text-center text-xs text-accent-dim">
                <MapPin size={24} className="mx-auto mb-2 opacity-20" />
                No incidents to display.
              </div>
            ) : (
              filtered.map(inc => (
                <button key={inc.id} onClick={() => setSelectedIncident(inc.id)}
                  className={`w-full text-left p-4 hover:bg-foreground/[0.02] transition-colors ${selectedIncident === inc.id ? "bg-foreground/[0.04]" : ""}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{inc.location}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      inc.priority === "CRITICAL" ? "bg-red-500/15 text-red-400 border-red-500/25" :
                      inc.priority === "HIGH" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
                      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    }`}>{inc.priority}</span>
                  </div>
                  <div className="text-xs text-accent-dim mb-1">{inc.type}</div>
                  {inc.ngo_name && <div className="text-[10px] text-indigo-400 mb-1">📋 {inc.ngo_name}</div>}
                  
                  {/* Deployed volunteers */}
                  {inc.deployed_volunteers && inc.deployed_volunteers.length > 0 && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex -space-x-1.5">
                        {inc.deployed_volunteers.slice(0, 3).map((v: any, vi: number) => (
                          v.avatar_url ? (
                            <img key={vi} src={v.avatar_url} alt="" className="w-4 h-4 rounded-full border border-background" />
                          ) : (
                            <div key={vi} className="w-4 h-4 rounded-full bg-indigo-500/30 border border-background" />
                          )
                        ))}
                      </div>
                      <span className="text-[9px] text-indigo-400 font-medium">
                        {inc.deployed_volunteers.length} deployed
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-accent-dim">
                    {inc.status === "Processing" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />Processing</>}
                    {inc.status === "Active" && <><div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />Active</>}
                    {inc.status === "In Transit" && <><Clock size={10} />Dispatched</>}
                    {inc.status === "Resolved" && <><CheckCircle2 size={10} />Resolved</>}
                    <span className="ml-auto">{inc.affected} affected</span>
                  </div>
                  <div className="text-[9px] text-accent-dim mt-1">{getTimeAgo(inc.created_at)}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: rgba(9, 9, 11, 0.92) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
          color: #f4f4f5 !important;
        }
        .dark-popup .leaflet-popup-tip {
          background: rgba(9, 9, 11, 0.92) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .dark-popup .leaflet-popup-close-button {
          color: #a1a1aa !important;
          font-size: 16px !important;
        }
        .dark-popup .leaflet-popup-close-button:hover {
          color: #fff !important;
        }
        .leaflet-control-attribution {
          background: rgba(9, 9, 11, 0.7) !important;
          color: #555 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #666 !important;
        }
        .leaflet-control-zoom a {
          background: rgba(9, 9, 11, 0.85) !important;
          color: #f4f4f5 !important;
          border-color: var(--glass-border) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30, 30, 35, 0.9) !important;
        }
      `}</style>
    </DashboardLayout>
  );
}
