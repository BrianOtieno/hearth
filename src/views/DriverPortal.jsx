import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiFetch,
  getAuthToken,
  getAuthRole,
  getAuthName,
  clearAuthSession,
} from "../services/api";
import {
  Truck,
  LogOut,
  CheckCircle2,
  Clock,
  Camera,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Toast from "../components/Toast";

export default function DriverPortal() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const role = getAuthRole();
    if (!token || role !== "driver") {
      navigate("/");
      return;
    }
    setDriverName(getAuthName() || "Driver");
    loadDriverDeliveries();
  }, [navigate]);

  async function loadDriverDeliveries() {
    setLoading(true);
    try {
      const data = await apiFetch("/deliveries");
      setDeliveries(data);
    } catch (err) {
      setToast({ message: "Failed to synchronize route data.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    try {
      await apiFetch(`/deliveries/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setToast({
        message: `Delivery marked as ${status.replace("_", " ")}`,
        type: "success",
      });
      loadDriverDeliveries();
    } catch (err) {
      setToast({ message: "Failed to update delivery status.", type: "error" });
    }
  }

  function handleLogout() {
    clearAuthSession();
    navigate("/");
  }

  const completedCount = deliveries.filter(
    (d) => d.status === "completed",
  ).length;
  const progressPercent = deliveries.length
    ? Math.round((completedCount / deliveries.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0e1113] text-[#f8f9fa] p-4 sm:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#161b22] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Truck size={24} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                Field Dispatch Unit
              </span>
              <h1 className="font-serif text-2xl font-normal">{driverName}</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#d4af37] text-xs font-mono text-[#8b949e] hover:text-[#f8f9fa] transition-all self-start sm:self-auto"
          >
            <LogOut size={14} /> Terminate Session
          </button>
        </div>

        {/* Progress Telemetry Card */}
        <div className="p-6 rounded-3xl bg-[#161b22] border border-white/10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-widest text-[#8b949e] font-mono">
              Route Completion Progress
            </span>
            <span className="font-mono text-[#d4af37]">
              {completedCount} / {deliveries.length} Stops ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#0e1113] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-[#d4af37] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-[#f8f9fa]">
            Assigned Store Stops
          </h2>
          {loading ? (
            <div className="text-center py-12 text-[#8b949e] font-mono text-sm">
              Loading telemetry routes...
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-12 text-[#8b949e] font-mono text-sm">
              No active routes assigned.
            </div>
          ) : (
            deliveries.map((d) => {
              const isDone = d.status === "completed";
              const isInProgress = d.status === "in_progress";
              return (
                <div
                  key={d.id}
                  className="p-6 rounded-2xl bg-[#161b22]/70 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#d4af37]/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl font-normal">
                        {d.store_name}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                          isDone
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isInProgress
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-white/5 text-[#8b949e]"
                        }`}
                      >
                        {isDone
                          ? "Delivered"
                          : isInProgress
                            ? "In Progress"
                            : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] font-mono flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#d4af37]" /> Stop ID: #
                      {d.id} — Scheduled Batch Drop
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isDone && (
                      <button
                        onClick={() => handleStatusUpdate(d.id, "in_progress")}
                        disabled={isInProgress}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#f8f9fa] border border-white/10 transition-all"
                      >
                        {isInProgress ? "En Route" : "Start Transit"}
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(d.id, "completed")}
                      disabled={isDone}
                      className={`px-5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                        isDone
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                          : "bg-[#d4af37] text-[#0e1113] hover:bg-[#e5c158]"
                      }`}
                    >
                      <Camera size={14} />{" "}
                      {isDone ? "Verified & Complete" : "Verify & Complete"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
