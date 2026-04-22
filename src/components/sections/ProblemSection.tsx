"use client";

import { motion } from "framer-motion";
import { FileStack, Clock, Users } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: <FileStack strokeWidth={1} className="w-12 h-12 mb-6 text-gray-400" />,
      title: "Scattered Reports",
      description: "Paper surveys, WhatsApp messages, and spreadsheets create chaotic, disconnected data silos."
    },
    {
      icon: <Clock strokeWidth={1} className="w-12 h-12 mb-6 text-gray-400" />,
      title: "Slow Decisions",
      description: "By the time data is compiled and analyzed, the ground reality has already changed."
    },
    {
      icon: <Users strokeWidth={1} className="w-12 h-12 mb-6 text-gray-400" />,
      title: "Poor Coordination",
      description: "Volunteers and resources are often sent to the wrong places, duplicating efforts."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-24 relative bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
            The Hidden Cost of <span className="font-serif italic font-light text-blue-400">Chaos</span>
          </h2>
          <p className="text-lg text-gray-400 text-balance">
            Local social groups and NGOs collect a lot of important information about community needs through paper surveys and field reports. However, this valuable data is often scattered across different places, making it hard to see the biggest problems clearly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass p-8 rounded-2xl group hover:bg-white/[0.05] transition-colors relative overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/10 transition-colors duration-500" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {problem.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-white">{problem.title}</h3>
                <p className="text-gray-400 leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
