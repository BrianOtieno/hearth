import React from "react";
import { User, Package, Clock } from "lucide-react";

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
          <h2 className="font-serif text-xl mb-1">{userName}</h2>
          <span className="inline-block px-2.5 py-1 rounded-full bg-[#e2b774]/20 text-[#e2b774] font-mono text-[10px] uppercase tracking-wider mb-4">
            Role: {userRole}
          </span>
          <p className="text-xs text-[#9c8e82] leading-relaxed">
            Your operator account is active. You can track submissions, submit
            inventory requests, and browse the catalog.
          </p>
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
              Bakery Product Catalog
            </h3>
            <p className="text-xs text-[#9c8e82]">
              Explore {productsCount} active artisan baked goods and pricing.
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
              Request Tracking & Submissions
            </h3>
            <p className="text-xs text-[#9c8e82]">
              You have {requestsCount} active logged requests in the database
              queue.
            </p>
          </div>
          <Clock className="text-[#e2b774]" size={20} />
        </div>
      </div>
    </div>
  );
}
