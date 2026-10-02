import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-[#0e1113] text-[#f8f9fa] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#e2b774]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="font-serif text-2xl tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e2b774]/10 text-[#e2b774] flex items-center justify-center font-serif text-sm font-medium">
              H
            </div>
            <span>Hearth &amp; Grain</span>
          </div>
          <p className="text-sm text-[#8b949e] font-light max-w-sm leading-relaxed">
            24-hour fermented sourdough, hand-laminated viennoiserie, and
            precision-engineered morning batches. Baked with absolute reverence
            for craft.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#8b949e]">
            <Sparkles size={12} className="text-[#e2b774]" />
            <span>Unified Dispatch Active • Est. 2019</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[#e2b774]">
            Atelier Nav
          </h4>
          <ul className="space-y-2.5 text-sm text-[#8b949e]">
            <li>
              <button
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-[#f8f9fa] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
              >
                Explore Counter
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  document
                    .getElementById("visit")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-[#f8f9fa] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
              >
                Hours &amp; Location
              </button>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f8f9fa] transition-colors"
              >
                Instagram Dispatch
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f8f9fa] transition-colors"
              >
                Community Journal
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter / Daily Drop Signup Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[#e2b774]">
            Morning Batch Alerts
          </h4>
          <p className="text-sm text-[#8b949e] font-light">
            Get notified the exact moment fresh sourdough and morning pastries
            come out of the stone oven.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-4 py-3 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 size={18} />
              <span>You are on the priority morning list.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="connoisseur@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#e2b774] flex-grow transition-colors"
              />
              <button
                type="submit"
                className="bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center cursor-pointer"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8b949e] relative z-10">
        <p>
          &copy; 2026 Hearth &amp; Grain. High-fidelity artisan operations
          matrix.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="tel:+10000000000"
            className="hover:text-[#f8f9fa] transition-colors flex items-center gap-1.5"
          >
            <Phone size={13} className="text-[#e2b774]" />
            <span>Direct Atelier Line</span>
          </a>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400">Secure Node Online</span>
          </div>
        </div>
      </div>

      {/* Permanently floating theme switcher */}
      <ThemeSwitcher />
    </footer>
  );
}
