"use client";

import { AnimatePresence, motion } from "@ojpp/ui";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface DarkNavigationBarProps {
  items: NavItem[];
}

export function DarkNavigationBar({ items }: DarkNavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/5 bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-white/5 bg-slate-950/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">Social</span>
          <span className="text-gray-100">Guard</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-gray-400 transition-colors hover:text-emerald-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-400"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-lg px-6 py-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {items.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="block py-2 text-sm text-gray-400 transition-colors hover:text-emerald-400"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
