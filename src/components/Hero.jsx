import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Hero() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("hearth_theme_mode") || "espresso";
  });

  // Listen for storage changes dispatched from the floating ThemeSwitcher
  useEffect(() => {
    const handleStorageChange = () => {
      const current = localStorage.getItem("hearth_theme_mode");
      if (current && current !== activeTheme) {
        setActiveTheme(current);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 300);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [activeTheme]);

  const themes = {
    espresso: {
      glow: "bg-[#e2b774]/5",
      badge: "bg-[#e2b774]/10 border-[#e2b774]/20 text-[#e2b774]",
      headingText: "text-[#fbf9f5]",
      accentText: "text-[#e2b774]",
      mutedText: "text-[#9c8e82]",
      buttonMain:
        "bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] shadow-lg shadow-[#e2b774]/10",
      buttonOutline:
        "bg-transparent hover:bg-white/5 text-[#fbf9f5] border-white/10",
      cardBg: "bg-[#1f1712] border-[#e2b774]/20 shadow-2xl",
      cardGlow: "bg-[#e2b774]/10",
      borderDivider: "border-white/10",
      priceText: "text-[#e2b774]",
    },
    sage: {
      glow: "bg-[#5a7065]/5",
      badge: "bg-[#5a7065]/10 border-[#5a7065]/20 text-[#5a7065]",
      headingText: "text-[#1b1c1d]",
      accentText: "text-[#5a7065]",
      mutedText: "text-[#606467]",
      buttonMain: "bg-[#5a7065] hover:bg-[#48594f] text-white shadow-md",
      buttonOutline:
        "bg-transparent hover:bg-black/5 text-[#1b1c1d] border-black/10",
      cardBg: "bg-white border-[#5a7065]/20 shadow-xl",
      cardGlow: "bg-[#5a7065]/10",
      borderDivider: "border-black/5",
      priceText: "text-[#5a7065]",
    },
    slate: {
      glow: "bg-[#38bdf8]/5",
      badge: "bg-[#38bdf8]/10 border-[#38bdf8]/20 text-[#38bdf8]",
      headingText: "text-[#f8f9fa]",
      accentText: "text-[#38bdf8]",
      mutedText: "text-[#8b949e]",
      buttonMain:
        "bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0e1113] shadow-lg shadow-[#38bdf8]/10",
      buttonOutline:
        "bg-transparent hover:bg-white/5 text-[#f8f9fa] border-white/10",
      cardBg: "bg-[#161b22] border-[#38bdf8]/20 shadow-2xl",
      cardGlow: "bg-[#38bdf8]/10",
      borderDivider: "border-white/10",
      priceText: "text-[#38bdf8]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden transition-colors duration-500">
      {/* Background radial glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${t.glow} rounded-full blur-3xl pointer-events-none`}
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${t.badge} text-xs font-medium tracking-wide`}
          >
            <Sparkles size={13} /> Neighborhood Artisan Bakery, Est. 2019
          </div>

          <h1
            className={`font-serif text-5xl sm:text-7xl font-light tracking-tight leading-[1.05] ${t.headingText}`}
          >
            Bread worth waking <br />
            up <span className={`italic ${t.accentText}`}>early for.</span>
          </h1>

          <p
            className={`${t.mutedText} text-lg font-light max-w-xl leading-relaxed`}
          >
            Sourdough proofed overnight, pastries laminated by hand, and coffee
            from local roasters — baked fresh every morning in small batches.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => scrollToSection("menu")}
              className={`px-8 py-4 font-medium rounded-full transition-all duration-300 flex items-center gap-2 group cursor-pointer ${t.buttonMain}`}
            >
              <span>Explore Counter</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("visit")}
              className={`px-8 py-4 font-medium rounded-full transition-all duration-300 border cursor-pointer ${t.buttonOutline}`}
            >
              Visit Atelier
            </button>
          </div>
        </div>

        {/* Artistic floating visual card */}
        <div className="lg:col-span-5">
          <div
            className={`p-8 rounded-3xl ${t.cardBg} border relative overflow-hidden group transition-colors duration-500`}
          >
            <div
              className={`absolute -right-12 -bottom-12 w-48 h-48 ${t.cardGlow} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700`}
            />
            <span
              className={`text-xs uppercase tracking-widest ${t.accentText} font-mono block mb-3`}
            >
              Featured Batch
            </span>
            <h3
              className={`font-serif text-3xl font-normal ${t.headingText} mb-4`}
            >
              Country Sourdough
            </h3>
            <p
              className={`${t.mutedText} text-sm leading-relaxed mb-6 font-light`}
            >
              Crackling dark crust, open iridescent crumb, and wild yeast
              cultured daily at dawn.
            </p>
            <div
              className={`flex justify-between items-center pt-4 border-t ${t.borderDivider} font-mono text-sm`}
            >
              <span className={`${t.priceText} font-medium`}>$9.00 USD</span>
              <span className="text-emerald-400 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Available Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
