"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, LineChart, Mic } from "lucide-react";

export default function RoadmapSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  const roadmapItems = [
    {
      icon: <Bot className="w-9 h-9 text-white" />,
      title: "Autonomous Command Agent",
      description: "AI that doesn't just suggest, but safely executes resource allocation based on real-time field constraints.",
      q: "Q3 2026",
      gradient: "from-indigo-500/20 to-indigo-600/5",
      iconGlow: "group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]",
    },
    {
      icon: <LineChart className="w-9 h-9 text-white" />,
      title: "Predictive Risk Forecasting",
      description: "Pre-position volunteers and supplies before the crisis peaks by analyzing historical incident data.",
      q: "Q4 2026",
      gradient: "from-violet-500/20 to-violet-600/5",
      iconGlow: "group-hover:bg-violet-500/20 group-hover:border-violet-500/40 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]",
    },
    {
      icon: <Mic className="w-9 h-9 text-white" />,
      title: "Voice Emergency Intake",
      description: "Multilingual voice-to-structured-data translation for instant reporting without internet or smartphones.",
      q: "Q1 2027",
      gradient: "from-cyan-500/20 to-cyan-600/5",
      iconGlow: "group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]",
    }
  ];

  return (
    <section id="roadmap" ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        <div className="container mx-auto px-6 max-w-7xl w-full mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] mb-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
            Roadmap
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] leading-tight">
            The Future of{" "}
            <span className="text-gradient-hero font-serif italic font-light">Response</span>
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex items-center w-full">
          <motion.div style={{ x }} className="flex gap-6 px-6 md:px-24">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`w-[85vw] md:w-[550px] h-[340px] glass p-9 rounded-2xl flex flex-col justify-between relative group card-hover border border-white/[0.04] overflow-hidden`}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="absolute top-0 right-0 p-7 text-5xl font-bold text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none tracking-tighter">
                  {item.q}
                </div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-white/[0.04] flex items-center justify-center mb-6 border border-white/[0.06] transition-all duration-500 ${item.iconGlow}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-md">{item.description}</p>
                </div>

                <div className="relative z-10 flex items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="w-8 h-px bg-gradient-to-r from-gray-500 to-transparent" />
                  In Development
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
