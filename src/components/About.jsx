import React, { useState, useEffect } from "react";

export default function About() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("hearth_theme_mode") || "espresso";
  });

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
      borderDivider: "border-white/5",
      accentText: "text-[#e2b774]",
      mutedText: "text-[#9c8e82]",
      headingText: "text-[#fbf9f5]",
      boxBorder: "border-[#e2b774]/20",
      statNumber: "text-[#e2b774]",
    },
    sage: {
      borderDivider: "border-black/5",
      accentText: "text-[#5a7065]",
      mutedText: "text-[#606467]",
      headingText: "text-[#1b1c1d]",
      boxBorder: "border-[#5a7065]/20",
      statNumber: "text-[#5a7065]",
    },
    slate: {
      borderDivider: "border-white/5",
      accentText: "text-[#38bdf8]",
      mutedText: "text-[#8b949e]",
      headingText: "text-[#f8f9fa]",
      boxBorder: "border-white/10",
      statNumber: "text-[#38bdf8]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  return (
    <section
      id="about"
      className={`py-24 px-6 border-t ${t.borderDivider} relative transition-colors duration-500`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Artistic Visual Container with Background Image */}
        <div className="lg:col-span-6 relative">
          <div
            className={`aspect-square rounded-3xl border ${t.boxBorder} p-8 flex flex-col justify-end relative overflow-hidden group shadow-2xl`}
          >
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop"
              alt="Bakery Kitchen"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="font-serif text-3xl font-light text-white relative z-10 mb-2 drop-shadow-md">
              "Started in a home kitchen, still baked the same way."
            </span>
            <span
              className={`text-xs uppercase tracking-widest ${t.accentText} font-mono relative z-10 font-medium`}
            >
              Est. 2019 — Hearth &amp; Grain
            </span>
          </div>
        </div>

        {/* Copy & Metrics */}
        <div className="lg:col-span-6 space-y-6">
          <span
            className={`text-xs uppercase tracking-widest ${t.accentText} font-mono block`}
          >
            Our Heritage
          </span>
          <h2
            className={`font-serif text-4xl sm:text-5xl font-light ${t.headingText} leading-tight`}
          >
            Crafted without shortcuts or compromise.
          </h2>
          <p className={`${t.mutedText} text-base leading-relaxed font-light`}>
            What began as weekend baking for neighbors evolved into a local
            institution. We mill select grains, feed our wild starter by hand
            each morning, and keep our roster minimal so every loaf reflects
            uncompromising standards.
          </p>

          <div
            className={`grid grid-cols-3 gap-6 pt-6 border-t ${t.borderDivider}`}
          >
            <div>
              <span
                className={`font-serif text-3xl ${t.statNumber} block mb-1`}
              >
                6+
              </span>
              <span
                className={`text-xs uppercase tracking-wider ${t.mutedText} font-mono`}
              >
                Years Open
              </span>
            </div>
            <div>
              <span
                className={`font-serif text-3xl ${t.statNumber} block mb-1`}
              >
                12
              </span>
              <span
                className={`text-xs uppercase tracking-wider ${t.mutedText} font-mono`}
              >
                Daily Items
              </span>
            </div>
            <div>
              <span
                className={`font-serif text-3xl ${t.statNumber} block mb-1`}
              >
                100%
              </span>
              <span
                className={`text-xs uppercase tracking-wider ${t.mutedText} font-mono`}
              >
                Scratch Baked
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
