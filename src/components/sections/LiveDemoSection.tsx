"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, CheckCircle2, AlertTriangle } from "lucide-react";

export default function LiveDemoSection() {
  const [step, setStep] = useState(0);
  const textToType = "500 people need water in Sector 7";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    // Sequence logic
    let timeout: NodeJS.Timeout;

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
    <section id="demo-section" className="py-20 md:py-24 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Watch Magic <span className="font-serif italic font-light text-blue-400">Happen.</span>
          </h2>
          <p className="text-lg text-gray-400">
            From raw text to actionable intelligence in milliseconds.
          </p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
          {/* Mac-like Header */}
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <div className="mx-auto text-xs text-gray-500 font-mono">agent_core_v2.sh</div>
          </div>

          <div className="p-8 font-mono text-sm md:text-base grid md:grid-cols-2 gap-8 min-h-[400px]">
            {/* Left Side - Input & Processing */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Terminal size={16} />
                  <span>Incoming Report (Field Node)</span>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-lg p-4 text-gray-300 min-h-[60px] flex items-center">
                  <span className="text-blue-500 mr-2">{">"}</span>
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-white ml-1"
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
                    <div className="flex items-center gap-2 text-purple-400">
                      <Cpu size={16} className={step === 1 ? "animate-spin" : ""} />
                      <span>{step === 1 ? "NLP Engine Processing..." : "Entity Extraction Complete"}</span>
                    </div>

                    {step >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3 text-sm"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">Sector 7</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-gray-400">Resource:</span>
                          <span className="text-blue-400 font-semibold">Water (2500L Req)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-gray-400">Priority:</span>
                          <span className="text-red-400 flex items-center gap-1 font-semibold"><AlertTriangle size={14}/> HIGH</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Available Vols:</span>
                          <span className="text-green-400 font-semibold">18 Nearby</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side - Map / Heatmap Result */}
            <div className="relative bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Map grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
              
              {!step ? (
                <div className="text-gray-600 font-mono text-xs text-center z-10">Waiting for data...</div>
              ) : (
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {step >= 3 && (
                      <>
                        {/* Map lines rendering animation */}
                        <motion.svg className="absolute inset-0 w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <motion.path 
                            d="M 50 150 Q 150 50 250 200 T 400 100" 
                            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"
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
                            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute w-24 h-24 bg-red-500 rounded-full blur-xl"
                          />
                          <div className="relative w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(239,68,68,1)]" />
                          <div className="mt-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-[10px] text-red-200 backdrop-blur-sm whitespace-nowrap">
                            SECTOR 7 - WATER REQ
                          </div>
                        </motion.div>
                        
                        {/* Dispatch confirmation */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-xs flex items-center gap-2 backdrop-blur-md whitespace-nowrap"
                        >
                          <CheckCircle2 size={14} />
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
