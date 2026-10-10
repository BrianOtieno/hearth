import React from "react";
import { Send, Clock, CheckCircle2, Flame, ArrowRight } from "lucide-react";
import { apiFetch } from "../../services/api";

export default function RequestsTab({
  products,
  requests,
  selectedProduct,
  setSelectedProduct,
  handleAddRequest,
  setRequests,
  userRole,
}) {
  const isAdmin = userRole === "admin";

  async function handleAdvanceStatus(requestId, currentStatus) {
    let nextStatus = "baking";
    if (currentStatus === "pending") nextStatus = "baking";
    else if (currentStatus === "baking") nextStatus = "fulfilled";
    else return;

    try {
      const updated = await apiFetch(`/requests/${requestId}/status`, {
        method: "PATCH",
        body: { status: nextStatus },
      });

      if (setRequests) {
        setRequests(
          requests.map((r) =>
            (r.ID || r.id) === requestId
              ? { ...r, status: updated.status || nextStatus }
              : r,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update request status", err);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl">Request Tracking Ledger</h2>
        <p className="text-xs text-[#9c8e82] mt-0.5">
          Submit and monitor special product requests.
        </p>
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleAddRequest}
        className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
            Select Product Line
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
            className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e2b774]"
          >
            <option value="" disabled>
              -- Choose a product to request --
            </option>
            {products.map((p) => (
              <option
                key={p.ID || p.id}
                value={`${p.name} ($${p.price?.toFixed(2)})`}
              >
                {p.name} (${p.price?.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3.5 bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-md font-medium flex items-center justify-center gap-2 self-end"
        >
          <Send size={14} /> Submit
        </button>
      </form>

      {/* Logged Submissions Ledger */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#9c8e82] border-b border-white/15 pb-3">
          Logged Submissions (Database Persistent)
        </h3>

        {requests.length === 0 ? (
          <p className="text-xs text-[#9c8e82] text-center py-8 font-mono">
            No requests logged yet. Submit one above!
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const reqId = req.ID || req.id;
              const status = req.status || "pending";

              return (
                <div
                  key={reqId}
                  className="bg-[#0e1113] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-base font-medium">
                        {req.item}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                          status === "fulfilled"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : status === "baking"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-[#e2b774]/10 text-[#e2b774] border-[#e2b774]/20"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#9c8e82]">
                      Requested by:{" "}
                      {req.User?.name || req.User?.username || "Operator"}
                    </p>
                  </div>

                  {isAdmin && status !== "fulfilled" && (
                    <button
                      onClick={() => handleAdvanceStatus(reqId, status)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-[#fbf9f5] transition-colors"
                    >
                      {status === "pending" ? (
                        <>
                          <Flame size={13} className="text-amber-400" /> Start
                          Baking
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={13}
                            className="text-emerald-400"
                          />{" "}
                          Mark Fulfilled
                        </>
                      )}
                      <ArrowRight size={12} className="text-[#9c8e82]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
