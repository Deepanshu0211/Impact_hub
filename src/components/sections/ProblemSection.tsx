"use client";

import { motion } from "framer-motion";
import { FileStack, Clock, Users } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: <FileStack strokeWidth={1.2} className="w-10 h-10 text-indigo-400" />,
      title: "Scattered Reports",
      description: "Paper surveys, WhatsApp messages, and spreadsheets create chaotic, disconnected data silos.",
      gradient: "from-indigo-500/10 to-transparent",
      glow: "group-hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]",
    },
    {
      icon: <Clock strokeWidth={1.2} className="w-10 h-10 text-amber-400" />,
      title: "Slow Decisions",
      description: "By the time data is compiled and analyzed, the ground reality has already changed.",
      gradient: "from-amber-500/10 to-transparent",
      glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    },
    {
      icon: <Users strokeWidth={1.2} className="w-10 h-10 text-rose-400" />,
      title: "Poor Coordination",
      description: "Volunteers and resources are often sent to the wrong places, duplicating efforts.",
      gradient: "from-rose-500/10 to-transparent",
      glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
    }
  ];

  return (
    <section id="features" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] mb-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
            The Problem
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] mb-3 leading-tight">
            The Hidden Cost of{" "}
            <span className="text-gradient-hero font-serif italic font-light">Chaos</span>
          </h2>
          <p className="text-base text-gray-400 leading-relaxed text-balance">
            Local social groups and NGOs collect important information through paper surveys and field reports. But this valuable data is scattered, making it hard to see the biggest problems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`glass p-7 rounded-2xl group card-hover relative overflow-hidden ${problem.glow}`}
            >
              {/* Hover gradient fill */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-white/[0.08] group-hover:border-white/[0.12] transition-all duration-300">
                  {problem.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{problem.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
