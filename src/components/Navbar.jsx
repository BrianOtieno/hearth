import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";
import AuthModal from "../views/AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Sync theme state with localStorage (defaulting to espresso)
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("hearth_theme_mode") || "espresso",
  );
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem("hearth_custom_colors");
    return saved
      ? JSON.parse(saved)
      : { bg: "#140f0c", card: "#1f1712", text: "#fbf9f5", accent: "#e2b774" };
  });

  // Listen for storage changes if theme changes in other components
  useEffect(() => {
    const handleStorage = () => {
      setThemeMode(localStorage.getItem("hearth_theme_mode") || "espresso");
      const saved = localStorage.getItem("hearth_custom_colors");
      if (saved) setCustomColors(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 500);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const presets = {
    espresso: {
      headerBg: "bg-[#140f0c]/90",
      text: "text-[#fbf9f5]",
      muted: "text-[#9c8e82]",
      accentText: "text-[#e2b774]",
      btnBg: "bg-[#e2b774] text-[#140f0c] hover:bg-[#d0a35e]",
      border: "border-white/5",
      logoBg: "bg-[#e2b774]/10 text-[#e2b774]",
    },
    sage: {
      headerBg: "bg-[#f9f8f6]/90",
      text: "text-[#1b1c1d]",
      muted: "text-[#606467]",
      accentText: "text-[#5a7065]",
      btnBg: "bg-[#5a7065] text-white hover:bg-[#48594f]",
      border: "border-black/5",
      logoBg: "bg-[#5a7065]/10 text-[#5a7065]",
    },
    slate: {
      headerBg: "bg-[#0e1113]/90",
      text: "text-[#f8f9fa]",
      muted: "text-[#8b949e]",
      accentText: "text-[#38bdf8]",
      btnBg: "bg-[#38bdf8] text-[#0e1113] hover:bg-[#0ea5e9]",
      border: "border-white/5",
      logoBg: "bg-[#38bdf8]/10 text-[#38bdf8]",
    },
  };

  const isCustom = themeMode === "custom";
  const theme = isCustom
    ? {
        headerBg: "",
        text: "",
        muted: "opacity-70",
        accentText: "",
        border: "border-current/10",
        logoBg: "",
      }
    : presets[themeMode] || presets.espresso;

  const customHeaderStyle = isCustom
    ? {
        backgroundColor: `${customColors.bg}ee`,
        color: customColors.text,
        borderColor: `${customColors.accent}22`,
      }
    : {};
  const customAccentStyle = isCustom ? { color: customColors.accent } : {};
  const customBtnStyle = isCustom
    ? { backgroundColor: customColors.accent, color: customColors.bg }
    : {};

  // Helper to handle smooth scrolling safely with HashRouter
  const scrollToSection = (id) => {
    // If we are not on the root store front view, navigate home first
    if (
      window.location.hash.includes("/about") ||
      window.location.hash.includes("/admin") ||
      window.location.hash.includes("/driver")
    ) {
      window.location.hash = "#/";
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        style={customHeaderStyle}
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${!isCustom ? `${theme.headerBg} ${theme.text}${theme.border}` : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              style={
                isCustom
                  ? {
                      backgroundColor: `${customColors.accent}20`,
                      color: customColors.accent,
                    }
                  : {}
              }
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif font-medium ${!isCustom ? theme.logoBg : ""}`}
            >
              H
            </div>
            <span className="font-serif text-lg tracking-tight">
              Hearth &amp; Grain
            </span>
          </Link>

          <nav
            className={`hidden md:flex items-center gap-8 text-sm ${!isCustom ? theme.muted : "opacity-80"}`}
          >
            <button
              onClick={() => scrollToSection("menu")}
              style={customAccentStyle}
              className="hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              style={customAccentStyle}
              className="hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("visit")}
              style={customAccentStyle}
              className="hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
            >
              Hours &amp; Location
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              style={customBtnStyle}
              className={`flex items-center gap-2 text-xs font-mono px-5 py-2.5 rounded-full font-medium transition-all shadow-md ${!isCustom ? theme.btnBg : ""}`}
            >
              <Lock size={13} /> Staff Portal Login
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div
            style={customHeaderStyle}
            className={`md:hidden border-b px-6 py-6 space-y-4 ${!isCustom ? `${theme.headerBg}${theme.border}` : ""}`}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                scrollToSection("menu");
              }}
              className="block w-full text-left bg-transparent border-none cursor-pointer py-1"
            >
              Menu
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                scrollToSection("about");
              }}
              className="block w-full text-left bg-transparent border-none cursor-pointer py-1"
            >
              About
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                scrollToSection("visit");
              }}
              className="block w-full text-left bg-transparent border-none cursor-pointer py-1"
            >
              Hours &amp; Location
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsLoginOpen(true);
              }}
              style={customBtnStyle}
              className={`w-full py-3 rounded-xl font-mono text-xs font-medium ${!isCustom ? theme.btnBg : ""}`}
            >
              Staff Portal Login
            </button>
          </div>
        )}
      </header>

      <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
