import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin, apiFetch } from "../services/api";
import { X, Shield, Lock, User, Mail } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistering) {
        await apiFetch("/auth/register", {
          method: "POST",
          body: { username: username.trim(), email: email.trim(), password },
        });
        const data = await apiLogin(username.trim(), password);
        onClose();
        navigate(data.role === "admin" ? "/admin" : "/driver");
      } else {
        const data = await apiLogin(username.trim(), password);
        onClose();
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "driver") {
          navigate("/driver");
        } else {
          setError("Unknown user role assigned.");
        }
      }
    } catch (err) {
      setError(
        isRegistering
          ? "Registration failed. Username may already exist."
          : "Invalid credentials. Please verify your username and password.",
      );
    } finally {
      setLoading(false);
    }
  }

  const themes = {
    espresso: {
      modalBg: "bg-[#161b22] text-[#fbf9f5]",
      border: "border-white/10",
      accent: "text-[#e2b774]",
      accentBg: "bg-[#e2b774]/10 border-[#e2b774]/30",
      tabActive: "bg-[#e2b774] text-[#140f0c] font-medium",
      tabInactive: "text-[#9c8e82] hover:text-[#fbf9f5]",
      inputBg:
        "bg-[#0e1113] text-[#fbf9f5] border-white/10 focus:border-[#e2b774]",
      buttonMain: "bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c]",
      muted: "text-[#9c8e82]",
    },
    sage: {
      modalBg: "bg-white text-[#1b1c1d]",
      border: "border-black/10",
      accent: "text-[#5a7065]",
      accentBg: "bg-[#5a7065]/10 border-[#5a7065]/30",
      tabActive: "bg-[#5a7065] text-white font-medium",
      tabInactive: "text-[#606467] hover:text-[#1b1c1d]",
      inputBg:
        "bg-[#f9f8f6] text-[#1b1c1d] border-black/10 focus:border-[#5a7065]",
      buttonMain: "bg-[#5a7065] hover:bg-[#48594f] text-white",
      muted: "text-[#606467]",
    },
    slate: {
      modalBg: "bg-[#161b22] text-[#f8f9fa]",
      border: "border-white/10",
      accent: "text-[#38bdf8]",
      accentBg: "bg-[#38bdf8]/10 border-[#38bdf8]/30",
      tabActive: "bg-[#38bdf8] text-[#0e1113] font-medium",
      tabInactive: "text-[#8b949e] hover:text-[#f8f9fa]",
      inputBg:
        "bg-[#0e1113] text-[#f8f9fa] border-white/10 focus:border-[#38bdf8]",
      buttonMain: "bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0e1113]",
      muted: "text-[#8b949e]",
    },
  };

  const t = themes[activeTheme] || themes.espresso;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`w-full max-w-md ${t.modalBg} border ${t.border} rounded-3xl p-8 relative shadow-2xl transition-colors duration-500`}
      >
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 ${t.muted} hover:opacity-15 transition-opacity`}
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div
            className={`w-10 h-10 rounded-xl ${t.accentBg} flex items-center justify-center ${t.accent} mb-4 border`}
          >
            <Shield size={20} />
          </div>
          <h3 className="font-serif text-2xl font-normal">
            {isRegistering ? "Create Staff Account" : "Staff Sign In"}
          </h3>
          <p className={`text-xs ${t.muted} mt-1 font-light`}>
            {isRegistering
              ? "Register a new operator or driver credential."
              : "Unified access for drivers and administrators."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className={`flex bg-black/20 p-1 rounded-xl mb-6 border ${t.border}`}
        >
          <button
            type="button"
            onClick={() => {
              setIsRegistering(false);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
              !isRegistering ? t.tabActive : t.tabInactive
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(true);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
              isRegistering ? t.tabActive : t.tabInactive
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider ${t.muted} mb-2`}
            >
              Username
            </label>
            <div className="relative">
              <User
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.muted}`}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${t.inputBg} focus:outline-none text-sm`}
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label
                className={`block text-xs font-mono uppercase tracking-wider ${t.muted} mb-2`}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.muted}`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hearthgrain.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${t.inputBg} focus:outline-none text-sm`}
                />
              </div>
            </div>
          )}

          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider ${t.muted} mb-2`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.muted}`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${t.inputBg} focus:outline-none text-sm`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 ${t.buttonMain} font-medium rounded-xl transition-all text-sm mt-2 shadow-lg`}
          >
            {loading
              ? "Processing..."
              : isRegistering
                ? "Create Account"
                : "Sign In to System"}
          </button>

          {error && (
            <p className="text-rose-400 text-xs text-center mt-2">{error}</p>
          )}
        </form>

        <div
          className={`mt-6 pt-4 border-t ${t.border} text-[11px] ${t.muted} font-mono text-center`}
        >
          {isRegistering
            ? "New accounts register with standard operator privileges."
            : "Authorized personnel only."}
        </div>
      </div>
    </div>
  );
}
