"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function ImpactSection() {
  const stats = [
    { value: 10000, suffix: "+", label: "People Supported", color: "text-indigo-400", delay: 0 },
    { value: 300, suffix: "+", label: "Volunteers Coordinated", color: "text-violet-400", delay: 0.1 },
    { value: 40, suffix: "+", label: "NGOs Ready", color: "text-cyan-400", delay: 0.2 },
    { value: 15, suffix: "+", label: "Cities Scalable", color: "text-emerald-400", delay: 0.3 },
  ];

  return (
    <section id="impact" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] mb-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
            Metrics
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] leading-tight">
            Proven at{" "}
            <span className="text-gradient-hero font-serif italic font-light">Scale</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: stat.delay }}
              className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center card-hover group"
            >
              <div className={`text-3xl md:text-5xl font-bold tracking-tighter mb-2 font-mono ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-400 font-medium tracking-[0.1em] uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
