import React, { useState, useEffect } from "react";
import { Clock, MapPin, Compass } from "lucide-react";

export default function LocationHours() {
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
      cardNormal: "bg-[#1f1712] border-white/5 hover:border-[#e2b774]/30",
      borderDivider: "border-white/5",
      accentText: "text-[#e2b774]",
      mutedText: "text-[#9c8e82]",
    },
    sage: {
      cardNormal: "bg-white border-black/5 hover:border-[#5a7065]/30",
      borderDivider: "border-black/5",
      accentText: "text-[#5a7065]",
      mutedText: "text-[#606467]",
    },
    slate: {
      cardNormal: "bg-[#161b22] border-white/10 hover:border-[#38bdf8]/30",
      borderDivider: "border-white/5",
      accentText: "text-[#38bdf8]",
      mutedText: "text-[#8b949e]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  return (
    <section
      id="visit"
      className={`max-w-7xl mx-auto px-6 py-16 border-t ${t.borderDivider} transition-colors duration-500`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-8 rounded-3xl ${t.cardNormal} shadow-sm border`}>
          <div className={`flex items-center gap-3 ${t.accentText} mb-4`}>
            <Clock size={20} />
            <h3 className="font-serif text-xl font-normal">Atelier Hours</h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div
              className={`flex justify-between py-2.5 border-b ${t.borderDivider}`}
            >
              <span className={t.mutedText}>Tue – Fri</span>
              <span>7:00 AM – 3:00 PM</span>
            </div>
            <div
              className={`flex justify-between py-2.5 border-b ${t.borderDivider}`}
            >
              <span className={t.mutedText}>Saturday</span>
              <span>7:00 AM – 4:00 PM</span>
            </div>
            <div
              className={`flex justify-between py-2.5 border-b ${t.borderDivider}`}
            >
              <span className={t.mutedText}>Sunday</span>
              <span>8:00 AM – 1:00 PM</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className={t.mutedText}>Monday</span>
              <span className="text-rose-400">Closed (Rest &amp; Prep)</span>
            </div>
          </div>
        </div>

        <div
          className={`p-8 rounded-3xl ${t.cardNormal} shadow-sm border flex flex-col justify-between`}
        >
          <div>
            <div className={`flex items-center gap-3 ${t.accentText} mb-4`}>
              <MapPin size={20} />
              <h3 className="font-serif text-xl font-normal">Location</h3>
            </div>
            <p
              className={`${t.mutedText} font-light leading-relaxed mb-4 text-sm`}
            >
              123 Main Street
              <br />
              Your City, CA 00000
            </p>
            <p
              className={`text-[11px] ${t.mutedText} font-mono leading-relaxed`}
            >
              Situated two doors down from the corner apothecary. Street parking
              available.
            </p>
          </div>
          <div className={`pt-6 mt-6 border-t ${t.borderDivider}`}>
            <a
              href="tel:+10000000000"
              className={`text-xs font-mono ${t.accentText} hover:underline flex items-center gap-2`}
            >
              <Compass size={14} /> Direct Inquiry Line →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
