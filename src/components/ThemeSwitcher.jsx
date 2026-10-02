import React, { useState, useEffect } from "react";
import { Palette, X, Sliders } from "lucide-react";

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("hearth_theme_mode") || "espresso";
  });
  const [showConfigurator, setShowConfigurator] = useState(false);

  useEffect(() => {
    localStorage.setItem("hearth_theme_mode", activeTheme);
    // Dispatch a storage event so open tabs/components instantly re-render
    window.dispatchEvent(new Event("storage"));
  }, [activeTheme]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showConfigurator ? (
        <button
          onClick={() => setShowConfigurator(true)}
          className="flex items-center gap-2.5 bg-[#161b22] text-[#f8f9fa] px-5 py-3.5 rounded-full shadow-2xl border border-white/10 backdrop-blur-xl hover:scale-105 transition-all"
        >
          <Palette size={16} className="text-[#e2b774]" />
          <span className="text-xs font-mono uppercase tracking-wider">
            Themes
          </span>
        </button>
      ) : (
        <div className="w-72 p-5 rounded-3xl bg-[#161b22] text-[#f8f9fa] border border-white/10 shadow-2xl backdrop-blur-xl space-y-4 animate-slide-up">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#e2b774]" />
              <h4 className="font-serif text-base">Select Theme</h4>
            </div>
            <button
              onClick={() => setShowConfigurator(false)}
              className="text-xs text-[#8b949e] hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTheme("espresso");
                setShowConfigurator(false);
              }}
              className={`w-full py-2.5 text-xs font-mono rounded-xl border transition-all flex items-center justify-between px-4 ${activeTheme === "espresso" ? "bg-[#e2b774] text-[#140f0c] border-transparent font-medium" : "bg-black/25 border-white/5 text-[#8b949e] hover:text-white"}`}
            >
              <span>Espresso</span>
              <span className="w-2 h-2 rounded-full bg-[#e2b774]"></span>
            </button>
            <button
              onClick={() => {
                setActiveTheme("sage");
                setShowConfigurator(false);
              }}
              className={`w-full py-2.5 text-xs font-mono rounded-xl border transition-all flex items-center justify-between px-4 ${activeTheme === "sage" ? "bg-[#5a7065] text-white border-transparent font-medium" : "bg-black/25 border-white/5 text-[#8b949e] hover:text-white"}`}
            >
              <span>Sage</span>
              <span className="w-2 h-2 rounded-full bg-[#5a7065]"></span>
            </button>
            <button
              onClick={() => {
                setActiveTheme("slate");
                setShowConfigurator(false);
              }}
              className={`w-full py-2.5 text-xs font-mono rounded-xl border transition-all flex items-center justify-between px-4 ${activeTheme === "slate" ? "bg-[#38bdf8] text-[#0e1113] border-transparent font-medium" : "bg-black/25 border-white/5 text-[#8b949e] hover:text-white"}`}
            >
              <span>Cyber Slate</span>
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
