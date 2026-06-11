"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Smartphone, Code2, Globe, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function SMSFallbackSection() {
  // Step 0: Idle, 1: Phone, 2: Terminal, 3: Map
  const [step, setStep] = useState<number>(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => setStep(0);

  return (
    <section id="sms-pipeline" className="relative w-full h-[80vh] min-h-[700px] overflow-hidden bg-background text-foreground flex items-center justify-center border-y border-foreground/5">
      
      {/* --- BACKGROUND MORPHING STAGES --- */}

      {/* Stage 0 & 1: Phone Background */}
      <AnimatePresence>
        {(step === 0 || step === 1) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: -10 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            style={{ willChange: "transform, opacity, filter" }}
            className={`absolute inset-0 z-0 flex items-center pointer-events-none opacity-60 blur-[8px] ${step === 1 ? 'justify-end pr-[15%]' : 'justify-center'}`}
          >
            {/* Massive Realistic 3D iPhone */}
            <div className="relative w-[380px] h-[780px] rounded-[55px] p-[10px] bg-gradient-to-br from-[#5a5a5a] via-[#1a1a1a] to-[#4a4a4a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_10px_rgba(0,0,0,0.8),0_40px_100px_rgba(0,0,0,0.6)] ring-1 ring-black/50 perspective-[2000px]">
              
              {/* Hardware Buttons */}
              <div className="absolute top-[130px] -left-[3px] w-[3px] h-[30px] bg-gradient-to-b from-[#666] to-[#222] rounded-l-md shadow-[-1px_0_1px_rgba(255,255,255,0.3)_inset]" />
              <div className="absolute top-[180px] -left-[3px] w-[3px] h-[60px] bg-gradient-to-b from-[#666] to-[#222] rounded-l-md shadow-[-1px_0_1px_rgba(255,255,255,0.3)_inset]" />
              <div className="absolute top-[250px] -left-[3px] w-[3px] h-[60px] bg-gradient-to-b from-[#666] to-[#222] rounded-l-md shadow-[-1px_0_1px_rgba(255,255,255,0.3)_inset]" />
              <div className="absolute top-[200px] -right-[3px] w-[3px] h-[80px] bg-gradient-to-b from-[#666] to-[#222] rounded-r-md shadow-[1px_0_1px_rgba(255,255,255,0.3)_inset]" />

              {/* Screen Content */}
              <div className="relative w-full h-full rounded-[45px] overflow-hidden bg-black border-[4px] border-black">
                {/* Wallpaper */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-black" />
                
                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-14 flex justify-between items-center px-8 z-20 text-white drop-shadow-md">
                  <div className="text-[14px] font-bold mt-2">12:00</div>
                  <div className="flex items-center gap-[6px] mt-2">
                    <div className="flex items-end gap-[1.5px] h-[12px]">
                      <div className="w-[3px] h-[40%] bg-white rounded-sm opacity-30" />
                      <div className="w-[3px] h-[60%] bg-white rounded-sm opacity-30" />
                      <div className="w-[3px] h-[80%] bg-white rounded-sm opacity-30" />
                      <div className="w-[3px] h-[100%] bg-white rounded-sm opacity-30" />
                    </div>
                    <div className="w-[26px] h-[13px] border border-white/50 rounded-[4px] p-[1px] relative flex items-center">
                      <div className="bg-red-500 h-full rounded-[2px] w-[15%]" />
                      <div className="absolute -right-[4px] w-[2px] h-[5px] bg-white/50 rounded-r-sm" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-4 inset-x-0 flex justify-center z-30">
                  <div className="bg-black w-[130px] h-[36px] rounded-[18px] flex items-center justify-between px-3 shadow-2xl">
                    <div className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-700 opacity-60" />
                    <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222]" />
                  </div>
                </div>
                
                {/* Mock UI inside phone */}
                <div className="absolute top-24 inset-x-4 flex flex-col gap-4">
                  <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/10" />
                  <div className="w-full h-32 bg-white/5 rounded-2xl border border-white/10" />
                  <div className="w-full h-16 bg-white/5 rounded-2xl border border-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2: Terminal Background */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(6px)" }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            style={{ willChange: "transform, opacity, filter" }}
            className="absolute inset-0 z-0 flex items-center justify-start pl-[5%] pointer-events-none opacity-80"
          >
            {/* High-Fidelity Editor Silhouette */}
            <div className="w-[70vw] h-[70vh] rounded-[24px] bg-[#000000]/80 border-[2px] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
              <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 p-8 opacity-20">
                <div className="w-3/4 h-4 bg-white/20 rounded mb-4" />
                <div className="w-1/2 h-4 bg-white/20 rounded mb-4" />
                <div className="w-2/3 h-4 bg-white/20 rounded mb-4" />
                <div className="w-full h-4 bg-white/20 rounded mb-4" />
                <div className="w-5/6 h-4 bg-white/20 rounded mb-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: Tactical Radar Background */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-80 overflow-hidden"
          >
            {/* Massive Tactical Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
            
            {/* Animated Sonar Rings */}
            <div className="relative flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 4], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: i * 1.33, ease: "linear" }}
                  className="absolute w-[400px] h-[400px] rounded-full border-[2px] border-red-500/30"
                />
              ))}
              <div className="w-[400px] h-[400px] rounded-full border border-red-500/20 bg-red-500/5 shadow-[0_0_100px_rgba(239,68,68,0.2)_inset]" />
            </div>

            {/* Glowing Map Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-90" />
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- FOREGROUND VISUAL STAGES --- */}

      {/* Stage 0: Idle Pulse */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mt-10"
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute w-24 h-24 rounded-full border border-blue-500/50 bg-blue-500/10"
              />
              <motion.div 
                animate={{ scale: [1, 4], opacity: [0.2, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute w-24 h-24 rounded-full border border-blue-500/30"
              />
              <div className="w-16 h-16 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <Smartphone className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-8 text-blue-400/60 font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
              Local Node Scanning for SMS...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 1: Incoming SMS (Positioned Right) */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ willChange: "transform, opacity" }}
            className="absolute z-30 right-[10%] lg:right-[20%] top-[40%]"
          >
            <div className="bg-blue-500/90 backdrop-blur-xl text-white p-6 rounded-3xl rounded-br-none shadow-[0_20px_40px_rgba(59,130,246,0.3)] border border-white/20 max-w-[320px]">
              <div className="text-xs font-semibold tracking-widest text-blue-100/80 mb-3 uppercase flex items-center gap-2 border-b border-white/20 pb-2">
                <Smartphone size={14} />
                To: 08604227760
              </div>
              <div className="font-medium text-xl leading-snug">
                <span className="font-bold bg-white/20 px-2 rounded mr-1">SOS</span> Trapped in Sector 4. Flooding is severe. We need a boat rescue for 3 families.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2: The Editor (Positioned Left) */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            style={{ willChange: "transform, opacity" }}
            className="absolute z-30 left-[5%] lg:left-[15%] top-[30%] w-full max-w-[500px]"
          >
            <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-sm">
              <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 text-white/40 text-xs flex items-center gap-2">
                  <Code2 size={14} />
                  gemma-parser.ts
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40">
                  <span className="text-purple-400">const</span> <span className="text-blue-400">payload</span> = <span className="text-green-400">"SOS Trapped in Sector 4..."</span>;
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/40">
                  <span className="text-purple-400">const</span> <span className="text-blue-400">data</span> = <span className="text-yellow-400">await</span> <span className="text-blue-300">GemmaAI</span>.<span className="text-yellow-200">parse</span>(payload);
                </motion.div>

                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 1 }} className="overflow-hidden">
                  <span className="text-white/40">console.</span><span className="text-yellow-200">log</span><span className="text-white/40">(</span>data<span className="text-white/40">)</span>;
                  <pre className="mt-3 p-4 bg-black/50 rounded-lg text-white/80 leading-loose border border-white/5 text-xs">
                    {`{
  `}
                    <span className="text-blue-300">"location"</span>: <span className="text-green-400">"Sector 4"</span>,
                    {`
  `}
                    <span className="text-blue-300">"priority"</span>: <span className="text-red-400">"CRITICAL"</span>,
                    {`
  `}
                    <span className="text-blue-300">"hazard"</span>: <span className="text-green-400">"Flooding"</span>,
                    {`
  `}
                    <span className="text-blue-300">"resources"</span>: [<span className="text-green-400">"Boat Rescue"</span>]
                    {`
}`}
                  </pre>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: The Map Drop (Positioned Right) */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{ willChange: "transform, opacity" }}
            className="absolute z-30 flex flex-col items-center right-[15%] lg:right-[25%] top-[35%]"
          >
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: -100, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bg-background/80 backdrop-blur-xl border border-foreground/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Globe size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Incident Logged</div>
                <div className="text-xs text-foreground/60">Sector 4 • Rescue Requested</div>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/20"
              />
              <MapPin size={64} className="text-red-500 drop-shadow-[0_10px_20px_rgba(239,68,68,0.5)] relative z-10" fill="currentColor" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- EXPLANATION CARDS (Alternating Left/Right) --- */}

      {/* Explanation 1 (Left) */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="absolute z-40 left-[5%] lg:left-[15%] top-[40%] max-w-sm"
          >
            <div className="bg-background/70 backdrop-blur-3xl border border-foreground/10 p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-tight">Offline Intercept</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                No Wi-Fi? No problem. The user sends a standard SMS to our dedicated fallback number. Even if the cellular data grid is entirely down, the text penetrates.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation 2 (Right) */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="absolute z-40 right-[5%] lg:right-[15%] top-[40%] max-w-sm"
          >
            <div className="bg-background/70 backdrop-blur-3xl border border-foreground/10 p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-tight">Local AI Engine</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                Our custom local Gemma AI instantly intercepts the payload. Within milliseconds, it parses the unstructured text to extract location, hazard type, and critical needs.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation 3 (Left) */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="absolute z-40 left-[5%] lg:left-[15%] top-[40%] max-w-sm"
          >
            <div className="bg-background/70 backdrop-blur-3xl border border-foreground/10 p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-tight">The Live Sync</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                The structured JSON data is beamed directly to the live heatmap. First responders immediately see the new pin drop, enabling rapid dispatch without a single drop of internet.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- STATIC OVERLAYS & TITLE --- */}
      
      <AnimatePresence>
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 text-center z-40 w-full px-6 pointer-events-none"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-background/50 mb-6 text-xs font-semibold text-foreground/70 tracking-widest backdrop-blur-md">
              <Navigation size={14} />
              The SMS Pipeline
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
              Disaster Doesn't Wait for Wi-Fi.
            </h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto leading-relaxed">
              Experience how our Local AI intercepts offline SMS messages, parses the raw data using Gemma, and automatically plots critical resources onto the live heatmap.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE CINEMATIC STEPPER (Bottom Console) --- */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[650px]"
      >
        <div className="bg-background/60 backdrop-blur-3xl border border-foreground/10 p-3 rounded-[1.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 ring-1 ring-white/5">
          
          {/* Previous Button */}
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold tracking-wide transition-all duration-300 text-sm
              ${step > 0 
                ? "bg-foreground/5 text-foreground hover:bg-foreground/10 active:scale-95" 
                : "text-transparent pointer-events-none"}`}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {/* Stepper Dots & Label */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${step === i ? 'bg-foreground scale-125' : step > i ? 'bg-foreground/50' : 'bg-foreground/10'}`} 
                />
              ))}
            </div>
            <div className="font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
              {step === 0 ? "AWAITING TRIGGER" : `PHASE ${step} OF 3`}
            </div>
          </div>

          {/* Next Button */}
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 text-sm
                ${step === 0 
                  ? "bg-foreground text-background shadow-lg hover:scale-[1.02] active:scale-95" 
                  : "bg-foreground text-background hover:scale-[1.02] active:scale-95"}`}
            >
              {step === 0 ? "INITIATE PIPELINE" : "NEXT STEP"} <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={reset}
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 text-sm bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30 active:scale-95"
            >
              <CheckCircle2 size={16} /> FINISH
            </button>
          )}

        </div>
      </motion.div>

    </section>
  );
}
