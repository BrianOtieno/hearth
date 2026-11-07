import React, { useState } from "react";
import {
  Send,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { apiFetch } from "../../services/api";

export default function RequestsTab({
  products,
  requests,
  setRequests,
  userRole,
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [targetDate, setTargetDate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const isAdmin = userRole === "admin";

  // Find currently selected product object for price calculations
  const selectedProductObj = products.find(
    (p) => String(p.ID || p.id) === String(selectedProductId),
  );
  const unitPrice = selectedProductObj ? selectedProductObj.price || 0 : 0;
  const totalPrice = unitPrice * quantity;

  // Handle Order Submission
  async function handleSubmitOrder(e) {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product line.");
      return;
    }

    setSubmitting(true);
    setError("");

    const itemLabel = `${selectedProductObj.name} x${quantity} ($${totalPrice.toFixed(2)})`;

    const payload = {
      item: itemLabel,
      product_id: parseInt(selectedProductId),
      quantity: parseInt(quantity),
      unit_price: unitPrice,
      total_price: totalPrice,
      target_date: targetDate,
      notes: specialNotes.trim(),
    };

    try {
      const created = await apiFetch("/requests", {
        method: "POST",
        body: payload,
      });

      if (created && setRequests) {
        setRequests([created, ...(requests || [])]);
      }

      // Reset Form
      setSelectedProductId("");
      setQuantity(1);
      setTargetDate("");
      setSpecialNotes("");
    } catch (err) {
      console.error("Failed to submit request", err);
      setError("Failed to log request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Advance Order Status Workflow
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
      alert("Failed to update status.");
    }
  }

  // Search & Status Filtering
  const safeRequests = Array.isArray(requests) ? requests : [];
  const filteredRequests = safeRequests.filter((req) => {
    const status = (req.status || "pending").toLowerCase();
    if (statusFilter !== "all" && status !== statusFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const itemName = (req.item || "").toLowerCase();
      const notes = (req.notes || "").toLowerCase();
      const userName = (
        req.User?.name ||
        req.User?.username ||
        ""
      ).toLowerCase();

      if (
        !itemName.includes(query) &&
        !notes.includes(query) &&
        !userName.includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl">
          Special Order & Request Tracking
        </h2>
        <p className="text-xs text-[#9c8e82] mt-0.5">
          Submit detailed product orders, set target completion dates, and track
          fulfillment workflows.
        </p>
      </div>

      {/* Advanced Order Request Form */}
      <form
        onSubmit={handleSubmitOrder}
        className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4"
      >
        <h3 className="font-serif text-lg text-[#fbf9f5] border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Create Production Request</span>
          {totalPrice > 0 && (
            <span className="text-xs font-mono text-[#e2b774] bg-[#e2b774]/10 px-3 py-1 rounded-lg border border-[#e2b774]/25">
              Estimated Total: ${totalPrice.toFixed(2)}
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Select Product Line */}
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              Select Product Line *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
            >
              <option value="" disabled>
                -- Choose a product to request --
              </option>
              {products.map((p) => (
                <option key={p.ID || p.id} value={p.ID || p.id}>
                  {p.name} (${p.price?.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              Quantity (Units) *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              required
              className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
            />
          </div>

          {/* Target Delivery Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              Target Completion Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
            />
          </div>
        </div>

        {/* Special Instructions / Notes */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
            Special Baking Instructions & Notes
          </label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="e.g. Extra crusty finish, slice into thick sandwich cuts, allergy alert..."
            className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
          />
        </div>

        {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-md font-medium flex items-center gap-2"
          >
            <Send size={14} />{" "}
            {submitting ? "Logging Request..." : "Submit Production Request"}
          </button>
        </div>
      </form>

      {/* Filter and Search Controls Toolbar */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8e82]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests by product, notes, or requester..."
            className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#e2b774]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-[#9c8e82]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-[#e2b774] w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="baking">Baking / In Progress</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      {/* Logged Submissions Ledger */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/15 pb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9c8e82]">
            Production Request Ledger ({filteredRequests.length})
          </h3>
          {filteredRequests.length > 0 && (
            <span className="text-[10px] font-mono text-[#9c8e82]">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-xs text-[#9c8e82] text-center py-8 font-mono">
            No matching requests logged yet.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedRequests.map((req) => {
                const reqId = req.ID || req.id;
                const status = (req.status || "pending").toLowerCase();
                const createdAt = req.CreatedAt || req.created_at;
                const requesterName =
                  req.User?.name || req.User?.username || "Operator";

                return (
                  <div
                    key={reqId}
                    className="bg-[#0e1113] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
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

                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#9c8e82] pt-0.5">
                        <span>
                          Requested by:{" "}
                          <span className="text-[#fbf9f5]">
                            {requesterName}
                          </span>
                        </span>

                        {req.target_date && (
                          <span className="flex items-center gap-1 text-[#e2b774]">
                            <Calendar size={12} /> Target: {req.target_date}
                          </span>
                        )}

                        {createdAt && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> Logged:{" "}
                            {new Date(
                              createdAt.replace("Z", ""),
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {req.notes && (
                        <p className="text-xs text-[#9c8e82] pt-1 flex items-center gap-1.5">
                          <FileText size={12} className="text-[#e2b774]" />{" "}
                          Note: {req.notes}
                        </p>
                      )}
                    </div>

                    {isAdmin && status !== "fulfilled" && (
                      <button
                        onClick={() => handleAdvanceStatus(reqId, status)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-[#fbf9f5] transition-colors whitespace-nowrap self-end md:self-center"
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

            {/* Pagination Controls Bar */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0e1113] hover:bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#fbf9f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <span className="text-xs font-mono text-[#9c8e82]">
                  Showing {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, filteredRequests.length)} of{" "}
                  {filteredRequests.length}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0e1113] hover:bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#fbf9f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
