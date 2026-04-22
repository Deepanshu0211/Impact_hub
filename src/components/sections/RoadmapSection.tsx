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
      icon: <Bot className="w-10 h-10 text-white" />,
      title: "Autonomous Command Agent",
      description: "AI that doesn't just suggest, but safely executes resource allocation based on real-time field constraints.",
      q: "Q3 2026"
    },
    {
      icon: <LineChart className="w-10 h-10 text-white" />,
      title: "Predictive Risk Forecasting",
      description: "Pre-position volunteers and supplies before the crisis peaks by analyzing historical incident data.",
      q: "Q4 2026"
    },
    {
      icon: <Mic className="w-10 h-10 text-white" />,
      title: "Voice Emergency Intake",
      description: "Multilingual voice-to-structured-data translation for instant reporting without internet or smartphones.",
      q: "Q1 2027"
    }
  ];

  return (
    <section id="roadmap" ref={targetRef} className="relative h-[300vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        <div className="container mx-auto px-6 max-w-7xl w-full mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            The Future of <span className="font-serif italic font-light text-blue-400">Response</span>
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex items-center w-full">
          <motion.div style={{ x }} className="flex gap-8 px-6 md:px-24">
            {roadmapItems.map((item, index) => (
              <div 
                key={index} 
                className="w-[85vw] md:w-[600px] h-[350px] glass p-10 rounded-3xl flex flex-col justify-between relative group hover:border-blue-500/30 transition-colors"
              >
                <div className="absolute top-0 right-0 p-8 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                  {item.q}
                </div>
                
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-md">{item.description}</p>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <span className="w-12 h-[1px] bg-gray-500" />
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
