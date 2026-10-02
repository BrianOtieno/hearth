import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";

export default function AboutPage() {
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
    espresso: { pageBg: "bg-[#140f0c] text-[#fbf9f5]" },
    sage: { pageBg: "bg-[#f9f8f6] text-[#1b1c1d]" },
    slate: { pageBg: "bg-[#0e1113] text-[#f8f9fa]" },
  };

  const t = themes[activeTheme] || themes.espresso;

  return (
    <div
      className={`min-h-screen ${t.pageBg} transition-colors duration-500 flex flex-col justify-between`}
    >
      <Navbar />
      <main className="flex-grow">
        <About />
      </main>
      <Footer />
    </div>
  );
}
