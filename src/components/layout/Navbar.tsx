"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#technology", label: "Technology" },
  { href: "#impact", label: "Impact" },
  { href: "#roadmap", label: "Roadmap" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto transition-all duration-700 ease-out w-full rounded-full ${
            isScrolled
              ? "max-w-3xl py-2 px-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              : "max-w-5xl py-3 px-6 bg-transparent"
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isScrolled ? "px-3" : ""}`}>
            {/* Logo — clean, no glow chaos */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 ease-out">
                <div className="w-2 h-2 bg-[#060612] rounded-sm" />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-white">
                Impact Hub
              </span>
            </Link>

            {/* Desktop Nav — floating links with underline cursor */}
            <div className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                const isHovered = hoveredLink === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-500 hover:text-gray-200"
                    }`}
                  >
                    {link.label}
                    {/* Underline indicator — follows hover, falls back to active */}
                    {(isActive || isHovered) && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side — minimal CTA */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/login"
                className="text-[13px] font-medium text-gray-500 hover:text-white transition-colors duration-300"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="group flex items-center gap-1.5 text-[13px] font-medium text-white border border-white/20 rounded-full px-4 py-1.5 hover:bg-white hover:text-[#060612] transition-all duration-300"
              >
                Launch
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu — slide down, no heavy glass */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-20 left-4 right-4 z-50 bg-[#0c0c1a]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 max-w-md mx-auto"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                        activeSection === link.href
                          ? "text-white bg-white/[0.05]"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center text-sm text-gray-400 hover:text-white py-2.5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-white/20 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-[#060612] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Launch
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
