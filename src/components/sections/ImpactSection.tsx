"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function ImpactSection() {
  const stats = [
    { value: 10000, suffix: "+", label: "People Supported", delay: 0 },
    { value: 300, suffix: "+", label: "Volunteers Coordinated", delay: 0.1 },
    { value: 40, suffix: "+", label: "NGOs Ready", delay: 0.2 },
    { value: 15, suffix: "+", label: "Cities Scalable", delay: 0.3 },
  ];

  return (
    <section id="impact" className="py-20 md:py-24 relative bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Proven at <span className="font-serif italic font-light text-blue-400">Scale</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: stat.delay }}
              className={`flex flex-col items-center justify-center text-center px-4 ${index === 0 ? "pl-0" : ""} ${index === stats.length - 1 ? "pr-0 border-r-0" : ""}`}
            >
              <div className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-2 font-mono">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
