"use client";

import { AnimatePresence, motion } from "@ojpp/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード" },
  { href: "/budget", label: "予算推移" },
  { href: "/programs", label: "プログラム" },
  { href: "/compare", label: "政党比較" },
];

export function CultureScopeNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-black/60 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-white/5 bg-black/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-amber-400">Culture</span>
          <span className="text-zinc-200">Scope</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-amber-400"
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
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
            className="md:hidden border-t border-white/5 bg-black/80 backdrop-blur-xl px-6 py-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`block py-3 text-sm transition-colors ${
                      isActive ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
