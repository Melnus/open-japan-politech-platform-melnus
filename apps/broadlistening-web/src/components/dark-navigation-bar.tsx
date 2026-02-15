"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

export function DarkNavigationBar({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "py-3 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.04]"
          : "py-5 bg-transparent"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          {/* Animated logo mark */}
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 opacity-80 blur-[6px] transition-all duration-500 group-hover:opacity-100 group-hover:blur-[10px]" />
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-[#050505]" />
            </div>
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <span className="text-aurora">Broad</span>
            <span className="text-white/90">Listening</span>
            <span className="text-cyan-400/40 text-xs ml-1 align-super">β</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
                {isActive && <span className="absolute inset-0 rounded-lg bg-white/[0.06]" />}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="relative p-2 text-white/40 transition-colors hover:text-white/80 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
        >
          <div className="flex h-5 w-5 flex-col items-center justify-center gap-1">
            <span
              className={`h-px w-4 bg-current transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-[3px]" : ""
              }`}
            />
            <span
              className={`h-px w-4 bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-4 bg-current transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-[3px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <nav className="border-t border-white/[0.04] bg-[#050505]/90 backdrop-blur-2xl px-6 py-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-3 text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
