"use client";

import { useEffect } from "react";
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
    <section className="relative min-h-[95vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Deep Cinematic Lighting */}
      <div className="absolute inset-0 z-[-9999] pointer-events-none">
        <div className="absolute top-[5%] left-[15%] w-[800px] h-[800px] opacity-30 bg-indigo-600/30 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[600px] h-[600px] opacity-25 bg-violet-600/30 blur-[120px] rounded-full mix-blend-screen" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] opacity-15 bg-cyan-500/20 blur-[100px] rounded-full mix-blend-screen" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]" />
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
            className="absolute top-[15%] left-[10%] md:left-[12%] glass-panel p-5 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.1)] w-48 rotate-[-12deg]"
          >
            <FileText className="text-indigo-400/60 w-7 h-7 mb-3" />
            <div className="w-full h-1.5 bg-white/8 rounded mb-1.5" />
            <div className="w-3/4 h-1.5 bg-white/8 rounded mb-3" />
            <div className="text-[9px] text-rose-400/80 font-mono tracking-[0.2em] uppercase">Scattered Data</div>
          </motion.div>

          {/* Object 2: Map Pin / Urgent Need (Top Right) */}
          <motion.div
            style={{ x: obj2X, y: obj2Y, translateZ: 150 }}
            animate={{ y: [15, -15, 15], rotateZ: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[22%] right-[5%] md:right-[12%] glass-panel p-5 rounded-2xl border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)] w-52 rotate-[8deg] flex flex-col items-center text-center"
          >
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-rose-500 blur-xl opacity-40 rounded-full" />
              <MapPin className="text-rose-400 w-9 h-9 relative z-10 drop-shadow-lg" />
            </div>
            <div className="text-sm font-bold text-white/90 mb-0.5">Sector 7 Crisis</div>
            <div className="text-[9px] text-rose-400/80 font-mono tracking-[0.2em] uppercase">Urgent Local Need</div>
          </motion.div>

          {/* Object 3: Volunteer Match (Bottom Center/Right) */}
          <motion.div
            style={{ x: obj3X, y: obj3Y, translateZ: 200 }}
            animate={{ y: [-10, 10, -10], rotateZ: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[18%] right-[18%] md:right-[28%] glass-panel p-4 rounded-full border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <UserCheck className="text-white w-5 h-5" />
            </div>
            <div className="pr-3">
              <div className="text-xs font-bold text-white/90">Volunteer Matched</div>
              <div className="text-[9px] text-emerald-400/80 font-mono tracking-[0.2em]">ETA: 4 MINS</div>
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] mb-6 backdrop-blur-md shadow-[0_0_25px_rgba(99,102,241,0.15)]"
        >
          <Activity size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300 tracking-[0.15em] uppercase">Smart Resource Allocation</span>
        </motion.div>

        {/* Dynamic Mixed Typography Headline — TIGHT line spacing */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[2.75rem] md:text-[4.5rem] lg:text-[5.5rem] font-bold tracking-[-0.04em] mb-2 leading-[0.82] flex flex-col items-center"
        >
          <span className="text-white drop-shadow-lg">
            Unify Scattered Data.
          </span>

          <span className="flex items-center gap-3">
            <span className="text-gradient">
              Coordinate
            </span>
            <span className="font-serif italic font-light text-gradient-hero">
              Volunteers.
            </span>
          </span>

          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.6)" }}
          >
            Save Lives.
          </span>
        </motion.h1>

        {/* Shortened, Punchy PS Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base md:text-lg text-gray-400 mb-10 max-w-xl leading-relaxed text-balance"
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
            <Link href="/dashboard" className="group h-12 px-7 rounded-full border border-white/25 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white hover:text-[#060612] hover:border-white active:scale-[0.97] w-full sm:w-auto">
              Launch Prototype
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex items-center gap-6 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live System
          </div>
          <div className="h-3 w-px bg-gray-700" />
          <div>Open Source</div>
          <div className="h-3 w-px bg-gray-700" />
          <div>Built for Impact</div>
        </motion.div>
      </div>
    </section>
  );
}
