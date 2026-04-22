"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function LiveDemoSection() {
  const [step, setStep] = useState(0);
  const textToType = "500 people need water in Sector 7";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const runSequence = async () => {
      // 1. Typing effect
      for (let i = 0; i <= textToType.length; i++) {
        await new Promise(r => setTimeout(r, 50));
        setTypedText(textToType.substring(0, i));
      }

      // 2. Wait a bit then show processing
      await new Promise(r => setTimeout(r, 800));
      setStep(1);

      // 3. Processing animation
      await new Promise(r => setTimeout(r, 2000));
      setStep(2);

      // 4. Show results
      await new Promise(r => setTimeout(r, 1000));
      setStep(3); // Trigger map pulse
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && step === 0 && typedText === "") {
          runSequence();
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById("demo-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [step, typedText]);

  return (
    <section id="demo-section" className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_60%)]" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] mb-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
            <Sparkles size={12} className="text-indigo-400" />
            Live Demo
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] mb-3 leading-tight">
            Watch Magic{" "}
            <span className="text-gradient-hero font-serif italic font-light">Happen.</span>
          </h2>
          <p className="text-base text-gray-400">
            From raw text to actionable intelligence in milliseconds.
          </p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)] shimmer-border">
          {/* Mac-like Header */}
          <div className="h-11 bg-white/[0.03] border-b border-white/[0.04] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.4)]" />
            <div className="mx-auto text-[11px] text-gray-500 font-mono tracking-wider">agent_core_v2.sh</div>
          </div>

          <div className="p-7 font-mono text-sm grid md:grid-cols-2 gap-6 min-h-[380px]">
            {/* Left Side - Input & Processing */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-2 text-xs">
                  <Terminal size={14} />
                  <span>Incoming Report (Field Node)</span>
                </div>
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4 text-gray-300 min-h-[52px] flex items-center">
                  <span className="text-indigo-500 mr-2">{">"}</span>
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1.5 h-4 bg-indigo-400 ml-1 rounded-sm"
                  />
                </div>
              </div>

              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-violet-400 text-xs">
                      <Cpu size={14} className={step === 1 ? "animate-spin" : ""} />
                      <span>{step === 1 ? "NLP Engine Processing..." : "Entity Extraction Complete"}</span>
                      {step >= 2 && <CheckCircle2 size={14} className="text-emerald-400" />}
                    </div>

                    {step >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/30 border border-white/[0.06] rounded-xl p-4 space-y-2.5 text-xs"
                      >
                        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-white font-medium">Sector 7</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                          <span className="text-gray-500">Resource:</span>
                          <span className="text-indigo-400 font-semibold">Water (2500L Req)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                          <span className="text-gray-500">Priority:</span>
                          <span className="text-rose-400 flex items-center gap-1 font-semibold"><AlertTriangle size={12}/>HIGH</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Available Vols:</span>
                          <span className="text-emerald-400 font-semibold">18 Nearby</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side - Map / Heatmap Result */}
            <div className="relative bg-black/20 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center">
              {/* Map grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />

              {!step ? (
                <div className="text-gray-600 font-mono text-[11px] text-center z-10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
                  Awaiting data stream...
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {step >= 3 && (
                      <>
                        {/* Map lines rendering animation */}
                        <motion.svg className="absolute inset-0 w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <motion.path
                            d="M 50 150 Q 150 50 250 200 T 400 100"
                            fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="2"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                          />
                        </motion.svg>

                        {/* Pulsing Heatmap Marker */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute w-24 h-24 bg-rose-500 rounded-full blur-xl"
                          />
                          <div className="relative w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                          <div className="mt-2 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-lg text-[9px] text-rose-200 backdrop-blur-sm whitespace-nowrap font-mono tracking-wider">
                            SECTOR 7 — WATER REQ
                          </div>
                        </motion.div>

                        {/* Dispatch confirmation */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-4 py-2 rounded-xl text-[11px] flex items-center gap-2 backdrop-blur-md whitespace-nowrap font-medium"
                        >
                          <CheckCircle2 size={13} />
                          Dispatched 18 Volunteers
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
