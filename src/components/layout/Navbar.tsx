"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <div className="fixed top-[10px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto transition-all duration-300 w-full max-w-6xl rounded-[15px] ${
          isScrolled ? "py-3 px-6 glass border border-white/10" : "py-4 px-6 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-shadow">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight">Impact Hub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#technology" className="hover:text-white transition-colors">Technology</Link>
            <Link href="#impact" className="hover:text-white transition-colors">Impact</Link>
            <Link href="#roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/dashboard" className="relative overflow-hidden rounded-full bg-white text-black px-5 py-2 text-sm font-medium font-helvetica transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Launch Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      </motion.nav>
    </div>
  );
}
