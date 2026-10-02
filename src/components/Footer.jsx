import React from "react";
import { Sparkles } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-[#0e1113] relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <div className="font-serif text-lg text-[#f8f9fa] mb-2 flex items-center justify-center md:justify-start gap-2">
            <span>Hearth &amp; Grain Bakery</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
          </div>
          <p className="text-xs text-[#8b949e]">
            &copy; 2026 Hearth &amp; Grain. High-fidelity artisan operations
            matrix.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#8b949e]">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#d4af37] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#d4af37] transition-colors"
          >
            Facebook
          </a>
          <a
            href="tel:+10000000000"
            className="hover:text-[#d4af37] transition-colors"
          >
            Direct Line
          </a>
        </div>

        <div className="text-xs font-mono text-[#8b949e] flex items-center gap-2">
          <Sparkles size={12} className="text-[#d4af37]" />
          <span>Unified Dispatch Active</span>
        </div>
      </div>

      {/* Permanently floating theme switcher */}
      <ThemeSwitcher />
    </footer>
  );
}
