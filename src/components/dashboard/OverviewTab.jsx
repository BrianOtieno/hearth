import React from "react";
import { User, Package, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function OverviewTab({
  userName,
  userRole,
  productsCount,
  requestsCount,
  setActiveTab,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {/* Profile Card */}
      <div className="bg-[#161b22] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-[#e2b774]/10 border border-[#e2b774]/30 flex items-center justify-center text-[#e2b774] mb-4">
            <User size={24} />
          </div>
          <h2 className="font-serif text-xl mb-1 text-[#fbf9f5]">
            {userName || "Operator"}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e2b774]/20 text-[#e2b774] font-mono text-[10px] uppercase tracking-wider border border-[#e2b774]/30">
              <ShieldCheck size={12} /> Role: {userRole}
            </span>
          </div>
          <p className="text-xs text-[#9c8e82] leading-relaxed">
            Your operator account is active at Hearth & Grain. You can manage
            inventory products, attach catalog imagery, and monitor live
            production requests.
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-[#e2b774]">
          <Sparkles size={14} /> System Operational
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="md:col-span-2 space-y-6">
        <div
          onClick={() => setActiveTab("catalog")}
          className="bg-[#161b22] hover:border-[#e2b774]/40 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between cursor-pointer transition-all group"
        >
          <div>
            <h3 className="font-serif text-lg mb-1 group-hover:text-[#e2b774] transition-colors">
              Artisanal Product Catalog
            </h3>
            <p className="text-xs text-[#9c8e82]">
              Explore and manage {productsCount} active artisan baked goods,
              pricing, and attached imagery.
            </p>
          </div>
          <Package className="text-[#e2b774]" size={20} />
        </div>

        <div
          onClick={() => setActiveTab("requests")}
          className="bg-[#161b22] hover:border-[#e2b774]/40 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between cursor-pointer transition-all group"
        >
          <div>
            <h3 className="font-serif text-lg mb-1 group-hover:text-[#e2b774] transition-colors">
              Request Tracking & Production Pipeline
            </h3>
            <p className="text-xs text-[#9c8e82]">
              You have {requestsCount} active logged requests in the queue
              waiting for processing.
            </p>
          </div>
          <Clock className="text-[#e2b774]" size={20} />
        </div>
      </div>
    </div>
  );
}
