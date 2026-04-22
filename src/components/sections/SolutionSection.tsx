"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Image as ImageIcon, Map, HeartHandshake } from "lucide-react";

export default function SolutionSection() {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
      title: "AI Data Extraction",
      description: "Messy reports become structured needs automatically.",
      color: "from-blue-500/20 to-blue-600/5",
      border: "hover:border-blue-500/30"
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-purple-400" />,
      title: "Vision Damage Analysis",
      description: "Upload images for instant hazard severity grading.",
      color: "from-purple-500/20 to-purple-600/5",
      border: "hover:border-purple-500/30"
    },
    {
      icon: <Map className="w-8 h-8 text-red-400" />,
      title: "Live Heatmap Intelligence",
      description: "Critical zones pulse live on interactive operational maps.",
      color: "from-red-500/20 to-red-600/5",
      border: "hover:border-red-500/30"
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-green-400" />,
      title: "Smart Volunteer Matching",
      description: "Nearest skilled responders are dispatched first.",
      color: "from-green-500/20 to-green-600/5",
      border: "hover:border-green-500/30"
    }
  ];

  return (
    <section id="technology" className="py-20 md:py-24 relative bg-[#050505]">
      {/* Decorative background lines */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6"
          >
            <span className="text-sm font-medium text-gray-300">The Solution</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Intelligent <span className="font-serif italic font-light text-blue-400">Orchestration</span>
          </h2>
          <p className="text-lg text-gray-400">
            A unified system that processes chaos into clarity, matching needs with resources in record time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
              className={`glass p-8 rounded-2xl cursor-pointer transition-all duration-300 border border-white/5 ${feature.border} relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex items-start gap-6">
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
