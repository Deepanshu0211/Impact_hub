"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

export default function FinalCTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black flex items-center justify-center">
      {/* Optimized Static Aurora Background - Removes extreme GPU lag */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[80px] rounded-[100%]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[0.95] text-white">
            Build Systems That Save Time.
            <span className="block text-gray-500 mt-2">When Time Saves Lives.</span>
          </h2>
          
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto text-balance">
            Join the mission to transform crisis response. Smart resource allocation is no longer a luxury—it's a necessity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton>
              <Link href="/dashboard" className="h-14 px-8 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto group">
                Launch Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
