"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface NavigationBarProps {
  brand: string;
  brandColor?: string;
  brandHref?: string;
  items: NavItem[];
  accentColor?: string;
  variant?: "light" | "dark";
}

export function NavigationBar({
  brand,
  brandColor = "text-blue-600",
  brandHref = "/",
  items,
  accentColor = "text-blue-600",
  variant = "dark",
}: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandParts = brand.match(/^([A-Z][a-z]+)(.+)$/);

  const isDark = variant === "dark";

  const headerBg = isDark
    ? scrolled
      ? "bg-[#0d1117]/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
      : "bg-[#0d1117]/60 backdrop-blur-md"
    : scrolled
      ? "bg-white/70 backdrop-blur-xl shadow-sm"
      : "bg-white/80 backdrop-blur-md";

  const borderClass = isDark ? "border-b border-[rgba(255,255,255,0.06)]" : "border-b";

  const textColor = isDark ? "text-[#8b949e]" : "";
  const hoverTextColor = isDark ? "hover:text-[#f0f0f0]" : "";
  const mobileBg = isDark ? "bg-[#0d1117]/95 backdrop-blur-lg" : "bg-white/95 backdrop-blur-lg";
  const mobileItemHover = isDark ? "hover:text-[#FF6B35]" : "hover:text-blue-600";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${borderClass} ${headerBg}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href={brandHref} className="text-xl font-bold">
          {brandParts ? (
            <>
              <span className={brandColor}>{brandParts[1]}</span>
              <span className={isDark ? "text-white" : ""}>{brandParts[2]}</span>
            </>
          ) : (
            <span className={brandColor}>{brand}</span>
          )}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative transition-colors ${textColor} ${hoverTextColor} ${accentColor} after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`md:hidden p-2 ${isDark ? "text-[#8b949e]" : ""}`}
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

      {/* Mobile menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className={`md:hidden border-t ${isDark ? "border-[rgba(255,255,255,0.06)]" : ""} ${mobileBg} px-6 py-4 overflow-hidden`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {items.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`block py-2 text-sm transition-colors ${textColor} ${mobileItemHover}`}
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
