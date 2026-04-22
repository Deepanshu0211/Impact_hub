"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, FileText, MapPin, UserCheck, Activity } from "lucide-react";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const rotateY = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const rotateX = useTransform(smoothMouseY, [-1, 1], [20, -20]);

  // Parallax values for floating objects
  const obj1X = useTransform(smoothMouseX, [-1, 1], [-50, 50]);
  const obj1Y = useTransform(smoothMouseY, [-1, 1], [-50, 50]);
  const obj2X = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const obj2Y = useTransform(smoothMouseY, [-1, 1], [40, -40]);
  const obj3X = useTransform(smoothMouseX, [-1, 1], [-30, 30]);
  const obj3Y = useTransform(smoothMouseY, [-1, 1], [30, -30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Deep Cinematic Lighting */}
      <div className="absolute inset-0 z-[-9999] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#020202]">
        <div className="absolute top-[10%] left-[20%] w-[800px] h-[800px] opacity-40 bg-blue-600/30 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] opacity-30 bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />
      </div>

      {/* Floating 3D Objects (PS Context) */}
      <div 
        className="absolute inset-0 z-[-10] flex items-center justify-center pointer-events-none perspective-1000"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full absolute inset-0 max-w-7xl mx-auto"
        >
          {/* Object 1: Scattered Paper Report (Top Left) */}
          <motion.div 
            style={{ x: obj1X, y: obj1Y, translateZ: 100 }}
            animate={{ y: [-15, 15, -15], rotateZ: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] md:left-[15%] glass-panel p-6 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] w-48 rotate-[-12deg] bg-white/[0.03] backdrop-blur-xl"
          >
            <FileText className="text-gray-500 w-8 h-8 mb-4" />
            <div className="w-full h-2 bg-white/10 rounded mb-2" />
            <div className="w-3/4 h-2 bg-white/10 rounded mb-4" />
            <div className="text-[10px] text-red-400 font-mono tracking-widest">SCATTERED DATA</div>
          </motion.div>

          {/* Object 2: Map Pin / Urgent Need (Top Right) */}
          <motion.div 
            style={{ x: obj2X, y: obj2Y, translateZ: 150 }}
            animate={{ y: [15, -15, 15], rotateZ: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[25%] right-[5%] md:right-[15%] glass-panel p-6 rounded-2xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] w-56 rotate-[8deg] bg-black/40 backdrop-blur-xl flex flex-col items-center text-center"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 rounded-full" />
              <MapPin className="text-red-400 w-10 h-10 relative z-10 drop-shadow-lg" />
            </div>
            <div className="text-sm font-bold text-white mb-1">Sector 7 Crisis</div>
            <div className="text-[10px] text-red-400 font-mono tracking-widest">URGENT LOCAL NEED</div>
          </motion.div>

          {/* Object 3: Volunteer Match (Bottom Center/Right) */}
          <motion.div 
            style={{ x: obj3X, y: obj3Y, translateZ: 200 }}
            animate={{ y: [-10, 10, -10], rotateZ: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] right-[20%] md:right-[30%] glass-panel p-5 rounded-full border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] flex items-center gap-4 bg-black/50 backdrop-blur-xl"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <UserCheck className="text-white w-6 h-6" />
            </div>
            <div className="pr-4">
              <div className="text-xs font-bold text-white">Volunteer Matched</div>
              <div className="text-[10px] text-green-400 font-mono tracking-widest">ETA: 4 MINS</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Centered Text Content */}
      <div className="container relative z-10 mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <Activity size={14} className="text-blue-400" />
          <span className="text-xs md:text-sm font-semibold text-blue-300 tracking-wider uppercase">[ Smart Resource Allocation ]</span>
        </motion.div>

        {/* Dynamic Mixed Typography Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter mb-6 leading-[0.9] flex flex-col items-center"
        >
          <span className="text-white drop-shadow-lg pb-2">
            Unify Scattered Data.
          </span>
          <span className="flex items-center gap-3 pb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
              Coordinate
            </span>
            <span className="font-serif italic font-light text-blue-400">
              Volunteers.
            </span>
          </span>
          {/* Outlined text effect */}
          <span className="text-transparent pt-1" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.8)" }}>
            Save Lives.
          </span>
        </motion.h1>

        {/* Shortened, Punchy PS Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed text-balance"
        >
          Turn scattered paper reports into real-time heatmaps. Instantly match available volunteers to the most urgent local needs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <MagneticButton>
            <Link href="/dashboard" className="h-14 px-10 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors group w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Launch Prototype
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
