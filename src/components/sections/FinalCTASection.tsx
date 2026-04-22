"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

export default function FinalCTASection() {
  return (
    <section className="relative py-16 md:py-20">
      {/* Soft glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center backdrop-blur-xl md:px-10"
        >
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-white max-w-xl mx-auto">
          <span className="font-sans">
            Faster Response.
          </span>

          <span className="block font-serif italic text-gradient mt-1">
            More Lives Saved.
          </span>
        </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm md:text-base leading-relaxed text-white/60">
            Coordinate teams, manage resources, and respond faster when every second matters.
          </p>

          <div className="mt-7 flex justify-center">
            <MagneticButton>
              <Link
                href="/dashboard"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#060612] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Dashboard
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}