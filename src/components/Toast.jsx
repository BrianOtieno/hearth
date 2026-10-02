import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#161b22] border border-white/10 shadow-2xl backdrop-blur-xl">
      {isSuccess ? (
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-rose-400 shrink-0" />
      )}
      <span className="text-sm font-mono text-[#f8f9fa]">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-[#8b949e] hover:text-[#f8f9fa]"
      >
        <X size={14} />
      </button>
    </div>
  );
}
