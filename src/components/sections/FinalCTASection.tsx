"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

export default function FinalCTASection() {
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#050510]" />

      {/* Grid texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-cyan-400/15 blur-3xl" />

        <div className="absolute top-16 left-[12%] h-52 w-52 rounded-full bg-violet-500/10 blur-[90px] animate-pulse" />

        <div className="absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px] animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-14 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-12 md:py-20"
        >
          {/* top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/75 uppercase"
          >
            <Sparkles size={14} className="text-cyan-300" />
            Final Call To Action
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.7 }}
            className="mx-auto max-w-4xl text-center text-[2.5rem] font-bold leading-[0.92] tracking-[-0.05em] text-white md:text-[4.5rem] lg:text-[5.5rem]"
          >
            Build Systems
            <span className="block text-white/80">
              That Save Time.
            </span>
            <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
              Because Time Saves Lives.
            </span>
          </motion.h2>

          {/* Copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-white/60 md:text-lg"
          >
            Crisis response should be instant, coordinated, and intelligent.
            Replace chaos with clarity and deploy resources where they matter most.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton>
              <Link
                href="/dashboard"
                className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white px-8 text-sm font-semibold text-[#060612] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Launch Dashboard</span>

                <ArrowRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />

                <span className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-violet-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </MagneticButton>

            <Link
              href="#features"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 px-8 text-sm font-medium text-white/75 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* tiny trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-8 text-center text-xs tracking-[0.16em] text-white/35 uppercase"
          >
            Faster Decisions • Smarter Allocation • Real Impact
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}