import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, ShoppingBag, Clock } from "lucide-react";
import { apiFetch } from "../services/api";

import OverviewTab from "../components/dashboard/OverviewTab";
import CatalogTab from "../components/dashboard/CatalogTab";
import RequestsTab from "../components/dashboard/RequestsTab";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Operator");
  const [userRole, setUserRole] = useState("user");
  const [activeTab, setActiveTab] = useState("overview");

  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("hearth_name") || "Operator";
    const role = localStorage.getItem("hearth_role") || "user";
    setUserName(name);
    setUserRole(role);

    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const prodData = await apiFetch("/products").catch(() => []);
      setProducts(Array.isArray(prodData) ? prodData : []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    }

    try {
      const reqData = await apiFetch("/requests").catch(() => []);
      setRequests(Array.isArray(reqData) ? reqData : []);
    } catch (err) {
      console.error("Failed to load requests", err);
      setRequests([]);
    }
    setLoading(false);
  }

  async function handleAddRequest(e) {
    e.preventDefault();
    if (!selectedProduct.trim()) return;

    try {
      const created = await apiFetch("/requests", {
        method: "POST",
        body: { item: selectedProduct.trim() },
      });
      if (created) {
        setRequests([created, ...requests]);
        setSelectedProduct("");
      }
    } catch (err) {
      console.error("Failed to submit request", err);
    }
  }

  function handleProductAdded(newProduct) {
    if (newProduct) {
      setProducts([newProduct, ...products]);
    }
  }

  function handleProductDeleted(deletedId) {
    setProducts(products.filter((p) => (p.ID || p.id) !== deletedId));
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1113] text-[#fbf9f5] flex items-center justify-center font-mono text-xs">
        Loading Hearth & Grain Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1113] text-[#fbf9f5] p-6 md:p-10">
      {/* Top Bar Navigation */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal tracking-wide">
            Hearth & Grain
          </h1>
          <p className="text-xs font-mono text-[#9c8e82] mt-1">
            Operator Portal & Request Tracking Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-[#e2b774] text-[#140f0c] font-medium"
                  : "text-[#9c8e82] hover:text-[#fbf9f5]"
              }`}
            >
              <LayoutDashboard size={14} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "catalog"
                  ? "bg-[#e2b774] text-[#140f0c] font-medium"
                  : "text-[#9c8e82] hover:text-[#fbf9f5]"
              }`}
            >
              <ShoppingBag size={14} /> Catalog
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-[#e2b774] text-[#140f0c] font-medium"
                  : "text-[#9c8e82] hover:text-[#fbf9f5]"
              }`}
            >
              <Clock size={14} /> Requests
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono transition-colors text-rose-400"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === "overview" && (
          <OverviewTab
            userName={userName}
            userRole={userRole}
            productsCount={products.length}
            requestsCount={requests.length}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "catalog" && (
          <CatalogTab
            products={products}
            userRole={userRole}
            onProductAdded={handleProductAdded}
            onProductUpdated={(updated) => {
              setProducts(
                products.map((p) =>
                  (p.ID || p.id) === (updated.ID || updated.id) ? updated : p,
                ),
              );
            }}
            onProductDeleted={(deletedId) => {
              setProducts(products.filter((p) => (p.ID || p.id) !== deletedId));
            }}
          />
        )}
        {activeTab === "requests" && (
          <RequestsTab
            products={products}
            requests={requests}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            handleAddRequest={handleAddRequest}
            setRequests={setRequests}
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
}
