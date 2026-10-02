import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";
import LocationHours from "../components/LocationHours";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function Storefront() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("hearth_theme_mode") || "espresso";
  });

  // Listen for changes dispatched from the floating ThemeSwitcher component
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

  const menuItems = [
    {
      name: "Country Sourdough",
      price: "$9.00",
      tag: "Signature",
      desc: "24-hour fermented with crackling dark crust and open crumb.",
      image:
        "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Almond Croissant",
      price: "$5.50",
      tag: "Hand-Laminated",
      desc: "Rich almond cream filling finished with powdered sugar snow.",
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Morning Loaf",
      price: "$4.00",
      tag: "Daily Staple",
      desc: "Soft milk bread, lightly sweet, sliced thick to order.",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Robust, complete theme definitions matching your working structure
  const themes = {
    espresso: {
      pageBg:
        "bg-[#140f0c] text-[#fbf9f5] selection:bg-[#e2b774] selection:text-[#140f0c]",
      badge: "bg-[#e2b774]/10 border-[#e2b774]/20 text-[#e2b774]",
      accentText: "text-[#e2b774]",
      mutedText: "text-[#9c8e82]",
      buttonMain:
        "bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] shadow-lg shadow-[#e2b774]/10",
      buttonOutline:
        "bg-transparent hover:bg-white/5 text-[#fbf9f5] border-white/10",
      cardBg: "bg-[#1f1712] border-[#e2b774]/20 shadow-2xl",
      cardNormal: "bg-[#1f1712] border-white/5 hover:border-[#e2b774]/30",
      borderDivider: "border-white/5",
      priceText: "text-[#e2b774]",
    },
    sage: {
      pageBg:
        "bg-[#f9f8f6] text-[#1b1c1d] selection:bg-[#5a7065] selection:text-white",
      badge: "bg-[#5a7065]/10 border-[#5a7065]/20 text-[#5a7065]",
      accentText: "text-[#5a7065]",
      mutedText: "text-[#606467]",
      buttonMain: "bg-[#5a7065] hover:bg-[#48594f] text-white shadow-md",
      buttonOutline:
        "bg-transparent hover:bg-black/5 text-[#1b1c1d] border-black/10",
      cardBg: "bg-white border-[#5a7065]/20 shadow-xl",
      cardNormal: "bg-white border-black/5 hover:border-[#5a7065]/30",
      borderDivider: "border-black/5",
      priceText: "text-[#5a7065]",
    },
    slate: {
      pageBg:
        "bg-[#0e1113] text-[#f8f9fa] selection:bg-[#38bdf8] selection:text-[#0e1113]",
      badge: "bg-[#38bdf8]/10 border-[#38bdf8]/20 text-[#38bdf8]",
      accentText: "text-[#38bdf8]",
      mutedText: "text-[#8b949e]",
      buttonMain:
        "bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0e1113] shadow-lg shadow-[#38bdf8]/10",
      buttonOutline:
        "bg-transparent hover:bg-white/5 text-[#f8f9fa] border-white/10",
      cardBg: "bg-[#161b22] border-[#38bdf8]/20 shadow-2xl",
      cardNormal: "bg-[#161b22] border-white/10 hover:border-[#38bdf8]/30",
      borderDivider: "border-white/5",
      priceText: "text-[#38bdf8]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen ${t.pageBg} transition-colors duration-500 relative`}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${t.badge} text-xs font-mono`}
          >
            <Sparkles size={12} /> Neighborhood Artisan Bakery, Est. 2019
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight leading-[1.08]">
            Bread worth waking <br />
            up <span className={`italic ${t.accentText}`}>early for.</span>
          </h1>
          <p
            className={`${t.mutedText} text-base font-light max-w-xl leading-relaxed`}
          >
            Sourdough proofed overnight, pastries laminated by hand, and coffee
            from local roasters — baked fresh every morning in small batches.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => scrollToSection("menu")}
              className={`px-7 py-3.5 font-medium rounded-full transition-all text-sm flex items-center gap-2 cursor-pointer ${t.buttonMain}`}
            >
              <span>Explore Counter</span> <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("visit")}
              className={`px-7 py-3.5 font-medium rounded-full transition-all text-sm border cursor-pointer ${t.buttonOutline}`}
            >
              Visit Atelier
            </button>
          </div>
        </div>

        {/* Hero Visual Card with Imagery */}
        <div className="lg:col-span-5">
          <div className={`rounded-3xl ${t.cardBg} overflow-hidden group`}>
            <div className="h-48 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600&auto=format&fit=crop"
                alt="Country Sourdough"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <span
                className={`text-[10px] uppercase tracking-widest ${t.accentText} font-mono block mb-1`}
              >
                Today's Spotlight
              </span>
              <h3 className="font-serif text-2xl font-normal mb-2">
                Country Sourdough
              </h3>
              <p
                className={`text-xs ${t.mutedText} font-light leading-relaxed mb-4`}
              >
                Open-crumb loaf with a caramelized crust. Cultivated with wild
                yeast daily.
              </p>
              <div
                className={`flex justify-between items-center pt-4 border-t ${t.borderDivider} font-mono text-xs`}
              >
                <span className={`${t.priceText} font-medium`}>$9.00 USD</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Available Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Counter Section */}
      <section
        id="menu"
        className={`max-w-7xl mx-auto px-6 py-16 border-t ${t.borderDivider}`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span
              className={`text-xs uppercase tracking-widest ${t.accentText} font-mono block mb-1`}
            >
              On The Counter
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light">
              Favorites of the week
            </h2>
          </div>
          <p
            className={`${t.mutedText} text-xs max-w-xs mt-2 md:mt-0 font-light`}
          >
            Once daily batches sell out, the ovens rest until tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl ${t.cardNormal} transition-all duration-300 overflow-hidden flex flex-col justify-between group`}
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${t.badge}`}
                  >
                    {item.tag}
                  </span>
                  <span
                    className={`font-mono text-xs font-medium ${t.accentText}`}
                  >
                    {item.price}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-normal mb-2 group-hover:opacity-80 transition-colors">
                  {item.name}
                </h3>
                <p
                  className={`text-xs ${t.mutedText} font-light leading-relaxed`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Location & Hours Section (Ensure LocationHours wrapper has id="visit") */}
      <LocationHours />

      {/* Footer */}
      <Footer />
    </div>
  );
}
