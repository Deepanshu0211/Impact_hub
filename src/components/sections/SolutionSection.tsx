"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Image as ImageIcon, Map, HeartHandshake } from "lucide-react";

export default function SolutionSection() {
  const features = [
    {
      icon: <BrainCircuit className="w-7 h-7 text-foreground/70" />,
      title: "AI Data Extraction",
      description: "Messy reports become structured needs automatically using NLP engines.",
      gradient: "from-foreground/[0.06] to-transparent",
      borderHover: "hover:border-foreground/15",
      iconBg: "group-hover:bg-foreground/[0.08] group-hover:border-foreground/[0.15]",
    },
    {
      icon: <ImageIcon className="w-7 h-7 text-accent-muted" />,
      title: "Vision Damage Analysis",
      description: "Upload images for instant hazard severity grading via computer vision.",
      gradient: "from-foreground/[0.05] to-transparent",
      borderHover: "hover:border-foreground/15",
      iconBg: "group-hover:bg-foreground/[0.08] group-hover:border-foreground/[0.15]",
    },
    {
      icon: <Map className="w-7 h-7 text-foreground/70" />,
      title: "Live Heatmap Intelligence",
      description: "Critical zones pulse live on interactive operational maps in real-time.",
      gradient: "from-foreground/[0.06] to-transparent",
      borderHover: "hover:border-foreground/15",
      iconBg: "group-hover:bg-foreground/[0.08] group-hover:border-foreground/[0.15]",
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-foreground/70" />,
      title: "Smart Volunteer Matching",
      description: "Nearest skilled responders are automatically dispatched first.",
      gradient: "from-foreground/[0.05] to-transparent",
      borderHover: "hover:border-foreground/15",
      iconBg: "group-hover:bg-foreground/[0.08] group-hover:border-foreground/[0.15]",
    }
  ];

  return (
    <section id="technology" className="py-16 md:py-20 relative">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-foreground/[0.06] bg-foreground/[0.03] mb-5 text-xs font-medium text-accent-muted uppercase tracking-[0.15em]"
          >
            The Solution
          </motion.div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] mb-3 leading-tight">
            Intelligent{" "}
            <span className="text-gradient-hero font-serif italic font-light">Orchestration</span>
          </h2>
          <p className="text-base text-accent-muted leading-relaxed">
            A unified system that processes chaos into clarity, matching needs with resources in record time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`glass p-7 rounded-2xl cursor-pointer card-hover border border-foreground/[0.04] ${feature.borderHover} relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex items-start gap-5">
                <div className={`p-3.5 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] backdrop-blur-md transition-all duration-300 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1.5 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-accent-muted leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
