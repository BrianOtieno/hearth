import React, { useState, useEffect } from "react";
import { LogOut, RefreshCw, LayoutDashboard, ShieldCheck } from "lucide-react";
import {
  apiFetch,
  apiLogin,
  getAuthToken,
  getAuthRole,
  getAuthName,
  clearAuthSession,
} from "../services/api";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminName, setAdminName] = useState("");

  const [summary, setSummary] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const role = getAuthRole();
    if (token && role === "admin") {
      setIsLoggedIn(true);
      setAdminName(getAuthName() || "Admin");
      loadAdminData();
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiLogin(username.trim(), password);
      if (data.role !== "admin") {
        setLoginError("Access denied. Admin account required.");
        clearAuthSession();
        return;
      }
      setLoginError("");
      setIsLoggedIn(true);
      setAdminName(data.name);
      loadAdminData();
    } catch (err) {
      setLoginError("Invalid credentials or backend offline.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuthSession();
    setIsLoggedIn(false);
    setSummary([]);
    setDeliveries([]);
    setUsername("");
    setPassword("");
  }

  async function loadAdminData() {
    setLoading(true);
    try {
      const [summaryData, deliveriesData] = await Promise.all([
        apiFetch("/admin/summary"),
        apiFetch("/deliveries"),
      ]);
      setSummary(summaryData);
      setDeliveries(deliveriesData);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bakery-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-bakery-card border border-bakery-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        {!isLoggedIn ? (
          <div className="p-8 max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-bakery-gold/10 flex items-center justify-center text-bakery-gold">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-bakery-cream">
                  Admin Portal
                </h2>
                <p className="text-bakery-muted text-sm">
                  Hearth & Grain Operations
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-bakery-muted mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-bakery-bg border border-bakery-border text-bakery-cream placeholder-bakery-muted/40 focus:outline-none focus:border-bakery-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-bakery-muted mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-bakery-bg border border-bakery-border text-bakery-cream placeholder-bakery-muted/40 focus:outline-none focus:border-bakery-gold transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-bakery-gold hover:bg-bakery-goldHover text-bakery-bg font-semibold rounded-xl shadow-lg transition-all duration-200 mt-2"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
              {loginError && (
                <p className="text-red-400 text-sm text-center mt-2">
                  {loginError}
                </p>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-bakery-border text-xs text-bakery-muted text-center">
              Demo credentials — username:{" "}
              <strong className="text-bakery-cream">admin</strong>, password:{" "}
              <strong className="text-bakery-cream">admin123</strong>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-bakery-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bakery-gold/10 flex items-center justify-center text-bakery-gold">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-bakery-cream">
                    Delivery Dashboard
                  </h3>
                  <p className="text-bakery-muted text-xs">
                    All 22 Store Routes
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-bakery-border text-bakery-muted hover:text-bakery-cream hover:border-bakery-gold transition-colors text-sm"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            {/* Driver Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {summary.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-bakery-bg p-4 rounded-xl border border-bakery-border text-center"
                >
                  <div className="text-xs uppercase tracking-wider text-bakery-muted mb-1 font-medium">
                    {s.driver_name}
                  </div>
                  <div className="font-serif text-2xl font-semibold text-bakery-gold">
                    {s.completed}{" "}
                    <span className="text-sm text-bakery-muted font-sans font-normal">
                      / {s.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Master Store Table */}
            <div className="bg-bakery-bg border border-bakery-border rounded-xl overflow-hidden mb-6">
              <div className="max-h-[340px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-bakery-card border-b border-bakery-border text-xs uppercase tracking-wider text-bakery-gold sticky top-0">
                      <th className="py-3 px-4 font-semibold">Store</th>
                      <th className="py-3 px-4 font-semibold">Driver</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bakery-border">
                    {deliveries.map((d) => {
                      const isDone = d.status === "completed";
                      const isStarted = d.status === "in_progress";
                      return (
                        <tr
                          key={d.id}
                          className="hover:bg-bakery-card/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-bakery-cream">
                            {d.store_name}
                          </td>
                          <td className="py-3 px-4 text-bakery-muted">
                            {d.driver_name || "Unassigned"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                                isDone
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : isStarted
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-bakery-gold/10 text-bakery-gold"
                              }`}
                            >
                              {isDone
                                ? "Delivered"
                                : isStarted
                                  ? "In Progress"
                                  : "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={loadAdminData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-bakery-border text-bakery-cream hover:border-bakery-gold transition-colors text-sm font-medium"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                Refresh Data
              </button>
              <span className="text-xs text-bakery-muted">
                Live sync with Go backend
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
