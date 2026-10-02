import React, { useState, useEffect } from "react";

export default function MenuGrid() {
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

  const items = [
    {
      name: "Country Sourdough",
      price: "$9.00",
      tag: "Signature",
      desc: "24-hour fermented with crackling dark crust and open crumb.",
    },
    {
      name: "Almond Croissant",
      price: "$5.50",
      tag: "Hand-Laminated",
      desc: "Rich almond cream filling finished with powdered sugar snow.",
    },
    {
      name: "Morning Loaf",
      price: "$4.00",
      tag: "Daily Staple",
      desc: "Soft milk bread, lightly sweet, sliced thick to order.",
    },
  ];

  const themes = {
    espresso: {
      borderDivider: "border-white/5",
      badge: "bg-[#e2b774]/10 text-[#e2b774]",
      accentText: "text-[#e2b774]",
      mutedText: "text-[#9c8e82]",
      headingText: "text-[#fbf9f5]",
      cardNormal:
        "bg-[#1f1712] border-white/5 hover:border-[#e2b774]/30 shadow-2xl",
      priceText: "text-[#fbf9f5]",
    },
    sage: {
      borderDivider: "border-black/5",
      badge: "bg-[#5a7065]/10 text-[#5a7065]",
      accentText: "text-[#5a7065]",
      mutedText: "text-[#606467]",
      headingText: "text-[#1b1c1d]",
      cardNormal: "bg-white border-black/5 hover:border-[#5a7065]/30 shadow-xl",
      priceText: "text-[#1b1c1d]",
    },
    slate: {
      borderDivider: "border-white/5",
      badge: "bg-[#38bdf8]/10 text-[#38bdf8]",
      accentText: "text-[#38bdf8]",
      mutedText: "text-[#8b949e]",
      headingText: "text-[#f8f9fa]",
      cardNormal:
        "bg-[#161b22] border-white/10 hover:border-[#38bdf8]/30 shadow-2xl",
      priceText: "text-[#f8f9fa]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  return (
    <section
      id="menu"
      className={`py-24 px-6 border-t ${t.borderDivider} transition-colors duration-500`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span
              className={`text-xs uppercase tracking-widest ${t.accentText} font-mono block mb-2`}
            >
              Daily Offerings
            </span>
            <h2
              className={`font-serif text-4xl sm:text-5xl font-light ${t.headingText}`}
            >
              Fresh from the ovens
            </h2>
          </div>
          <p
            className={`${t.mutedText} text-sm max-w-sm mt-4 md:mt-0 font-light`}
          >
            Small batches baked every morning. Once they sell out for the day,
            the ovens rest until tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl ${t.cardNormal} transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-full ${t.badge}`}
                  >
                    {item.tag}
                  </span>
                  <span className={`font-mono ${t.priceText} font-medium`}>
                    {item.price}
                  </span>
                </div>
                <h3
                  className={`font-serif text-2xl font-normal ${t.headingText} mb-3 group-hover:${t.accentText} transition-colors`}
                >
                  {item.name}
                </h3>
                <p
                  className={`${t.mutedText} text-sm leading-relaxed font-light`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
