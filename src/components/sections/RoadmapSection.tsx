"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, LineChart, Mic, BanknoteArrowUp, Brain, Smartphone, CheckCircle2, Activity } from "lucide-react";

export default function RoadmapSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const roadmapItems = [
     {
      icon: <BanknoteArrowUp className="w-9 h-9 text-foreground" />,
      title: "Volunteer & Earn",
      description: "Match unemployed youth with local NGO tasks to earn micro-stipends and verified skill credentials, turning idle potential into community impact at scale across India's 1.4 billion population.",
      q: "Phase 1",
      gradient: "from-foreground/[0.06] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <Brain className="w-9 h-9 text-foreground" />,
      title: "Gemma AI Integration",
      description: "Deploy on-device Gemma models to process paper surveys offline in regional languages and intelligently match volunteer skills to community needs, even in rural zero-connectivity zones.",
      q: "Phase 1",
      gradient: "from-foreground/[0.06] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <Smartphone className="w-9 h-9 text-foreground" />,
      title: "Cross-Platform App",
      description: "A single lightweight application accessible on any device, giving volunteers, NGOs, and field workers a seamless unified experience across the fragmented device ecosystem.",
      q: "Phase 1",
      gradient: "from-foreground/[0.06] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <Bot className="w-9 h-9 text-foreground" />,
      title: "Autonomous Command Agent",
      description: "AI that doesn't just suggest, but safely executes resource allocation and coordinates multi-agency dispatches based on real-time field constraints.",
      q: "Phase 2",
      gradient: "from-foreground/[0.06] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <LineChart className="w-9 h-9 text-foreground" />,
      title: "Predictive Risk Forecasting",
      description: "Pre-position volunteers and supplies before the crisis peaks by analyzing historical incident data and live weather telemetry.",
      q: "Phase 2",
      gradient: "from-foreground/[0.05] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <Mic className="w-9 h-9 text-foreground" />,
      title: "Voice Emergency Intake",
      description: "Multilingual voice-to-structured-data translation for instant reporting without internet or smartphones over regular cellular calls.",
      q: "Phase 2",
      gradient: "from-foreground/[0.06] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "completed"
    },
    {
      icon: <Activity className="w-9 h-9 text-foreground" />,
      title: "Continuous Evolution",
      description: "We are constantly learning and iterating. As we gather more field responses, user reviews, and real-world data, we'll keep refining the platform and expanding its capabilities.",
      q: "Future",
      gradient: "from-foreground/[0.05] to-transparent",
      iconGlow: "group-hover:bg-foreground/[0.1] group-hover:border-foreground/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      status: "upcoming"
    }
  ];

  return (
    <section id="roadmap" ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        <div className="container mx-auto px-6 max-w-7xl w-full mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-foreground/[0.06] bg-foreground/[0.03] mb-5 text-xs font-medium text-accent-muted uppercase tracking-[0.15em]">
            Roadmap
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.03em] leading-tight mb-3">
            The Future of{" "}
            <span className="text-gradient-hero font-serif italic font-light">Response</span>
          </h2>
          <p className="text-accent-muted text-sm tracking-wide uppercase font-semibold mb-6">
            Powered by Firebase
          </p>
          <div className="border-l-2 border-foreground/30 pl-5 py-2 max-w-3xl">
            <p className="text-foreground/90 italic text-lg leading-relaxed">
              "Everything we aimed for in the first phase is now a reality. As we enter the second phase, we are building the true future of autonomous disaster response."
            </p>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex items-center w-full">
          <motion.div style={{ x }} className="flex gap-6 px-6 md:px-24">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`w-[85vw] md:w-[550px] h-[340px] glass p-9 rounded-2xl flex flex-col justify-between relative group card-hover border border-foreground/[0.04] overflow-hidden`}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="absolute top-0 right-0 p-7 text-5xl font-bold text-foreground/[0.03] group-hover:text-foreground/[0.08] transition-colors pointer-events-none tracking-tighter">
                  {item.q}
                </div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-6 border border-foreground/[0.06] transition-all duration-500 ${item.iconGlow}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-accent-muted leading-relaxed max-w-md">{item.description}</p>
                </div>

                <div className="relative z-10 flex items-center gap-3 text-xs font-medium text-accent-dim mt-4">
                  {item.status === "completed" ? (
                    <>
                      <div className="relative flex items-center justify-center w-6 h-6 mr-1">
                        {/* Outer pulsing ring */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full bg-green-500/20"
                        />
                        {/* Background circle */}
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                          className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/30"
                        />
                        {/* SVG checkmark */}
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 text-green-500 relative z-10"
                        >
                          <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                            d="M20 6 9 17l-5-5"
                          />
                        </motion.svg>
                      </div>
                      <span className="text-green-500 tracking-widest uppercase font-bold">Achieved</span>
                    </>
                  ) : (
                    <>
                      <span className="w-8 h-px bg-gradient-to-r from-gray-500 to-transparent" />
                      <span className="tracking-widest uppercase text-accent-muted">In Development</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
