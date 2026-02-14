"use client";

import { AnimatePresence, motion } from "@ojpp/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

export function DarkNavBar({ items }: { items: NavItem[] }) {
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
          ? "border-white/[0.06] bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-white/[0.04] bg-slate-950/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-red-500">Seat</span>
          <span className="text-white">Map</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-slate-400 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-white md:hidden"
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
            className="overflow-hidden border-t border-white/[0.04] bg-slate-950/95 px-6 py-4 backdrop-blur-lg md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="block py-2 text-sm text-slate-400 transition-colors hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
