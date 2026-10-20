import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Upload,
  Clock,
  Navigation,
  Calendar,
  Edit2,
  Save,
  X,
  Search,
  Filter,
  Maximize2,
} from "lucide-react";
import { apiFetch } from "../../services/api";

export default function DeliveriesTab({ deliveries, setDeliveries, userRole }) {
  const [storeName, setStoreName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");

  // Active delivery being processed in-flight
  const [activeDeliveryId, setActiveDeliveryId] = useState(null);
  const [beforePhotoUrl, setBeforePhotoUrl] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState("");

  // Full editing state for Today's submissions
  const [editingId, setEditingId] = useState(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editBeforePhoto, setEditBeforePhoto] = useState("");
  const [editAfterPhoto, setEditAfterPhoto] = useState("");

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Lightbox Modal State for browsing photos
  const [modalImage, setModalImage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = userRole === "admin";
  const currentUsername = localStorage.getItem("hearth_name") || "";
  const currentUserId = localStorage.getItem("hearth_user_id");

  // Get device geolocation
  function handleGetLocation(setLatFn, setLngFn) {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatFn(position.coords.latitude.toFixed(6));
        setLngFn(position.coords.longitude.toFixed(6));
      },
      () => {
        alert("Unable to retrieve your location.");
      },
    );
  }

  // Step 1: Upload & Save Before Photo
  async function handleSaveBeforePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!storeName.trim()) {
      alert(
        "Please enter the Store Name / Location before uploading the initial shelf photo.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("before_photo", file);

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("hearth_token");
      let deliveryId = activeDeliveryId;

      if (!deliveryId) {
        const initRes = await apiFetch("/deliveries", {
          method: "POST",
          body: {
            store_name: storeName.trim(),
            store_lat: lat ? parseFloat(lat) : 0.0,
            store_lng: lng ? parseFloat(lng) : 0.0,
            notes: notes.trim(),
          },
        });
        deliveryId = initRes.ID || initRes.id;
        setActiveDeliveryId(deliveryId);
      }

      const res = await fetch(
        `http://localhost:8084/deliveries/${deliveryId}/start`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) {
        setBeforePhotoUrl(data.before_photo || data.BeforePhoto);
      } else {
        setError(data.error || "Failed to save before photo.");
      }
    } catch (err) {
      setError("Network error saving before photo.");
    } finally {
      setUploading(false);
    }
  }

  // Step 2: Upload & Save After Photo
  async function handleSaveAfterPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!activeDeliveryId || !beforePhotoUrl) {
      alert("Please upload and save the 'Before' shelf photo first.");
      return;
    }

    const formData = new FormData();
    formData.append("after_photo", file);

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("hearth_token");
      const res = await fetch(
        `http://localhost:8084/deliveries/${activeDeliveryId}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) {
        setAfterPhotoUrl(data.after_photo || data.AfterPhoto);

        if (setDeliveries) {
          const updatedList = await apiFetch("/deliveries");
          setDeliveries(Array.isArray(updatedList) ? updatedList : []);
        }

        setStoreName("");
        setLat("");
        setLng("");
        setNotes("");
        setActiveDeliveryId(null);
        setBeforePhotoUrl("");
        setAfterPhotoUrl("");
      } else {
        setError(data.error || "Failed to complete delivery.");
      }
    } catch (err) {
      setError("Network error completing delivery.");
    } finally {
      setUploading(false);
    }
  }

  // Handle re-uploading photos during edit mode
  async function handleEditPhotoUpload(e, type, delivId) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === "before" ? "before_photo" : "after_photo", file);

    const token = localStorage.getItem("hearth_token");
    const endpoint = `http://localhost:8084/deliveries/${delivId}/${type === "before" ? "start" : "complete"}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (type === "before")
          setEditBeforePhoto(data.before_photo || data.BeforePhoto);
        else setEditAfterPhoto(data.after_photo || data.AfterPhoto);
      }
    } catch (err) {
      console.error(`Failed to update ${type} photo`, err);
    }
  }

  // Save all edited fields to backend
  async function handleSaveFullEdit(delivId) {
    try {
      await apiFetch(`/deliveries/${delivId}`, {
        method: "PUT",
        body: {
          store_name: editStoreName.trim(),
          store_lat: editLat ? parseFloat(editLat) : 0.0,
          store_lng: editLng ? parseFloat(editLng) : 0.0,
          notes: editNotes.trim(),
          before_photo: editBeforePhoto,
          after_photo: editAfterPhoto,
        },
      });

      if (setDeliveries) {
        setDeliveries(
          deliveries.map((d) =>
            (d.ID || d.id) === delivId
              ? {
                  ...d,
                  store_name: editStoreName,
                  StoreName: editStoreName,
                  store_lat: editLat,
                  StoreLat: editLat,
                  store_lng: editLng,
                  StoreLng: editLng,
                  notes: editNotes,
                  Notes: editNotes,
                  before_photo: editBeforePhoto,
                  BeforePhoto: editBeforePhoto,
                  after_photo: editAfterPhoto,
                  AfterPhoto: editAfterPhoto,
                }
              : d,
          ),
        );
      }
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update delivery", err);
    }
  }

  // Role-based filtering + Search query & Status filtering
  const filteredDeliveries = (deliveries || []).filter((deliv) => {
    if (!isAdmin) {
      const recordUserId = deliv.user_id || deliv.UserID;
      const recordUser = deliv.User || {};
      const recordUsername = recordUser.username || recordUser.Username || "";

      const matchesId =
        currentUserId &&
        recordUserId &&
        String(recordUserId) === String(currentUserId);
      const matchesName =
        currentUsername && recordUsername && recordUsername === currentUsername;
      if (!matchesId && !matchesName) return false;
    }

    const status = (deliv.status || deliv.Status || "").toLowerCase();
    if (statusFilter !== "all" && status !== statusFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const store = (deliv.store_name || deliv.StoreName || "").toLowerCase();
      const notesVal = (deliv.notes || deliv.Notes || "").toLowerCase();
      const driverName = (
        deliv.User?.username ||
        deliv.User?.name ||
        ""
      ).toLowerCase();

      if (
        !store.includes(query) &&
        !notesVal.includes(query) &&
        !driverName.includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  const todayStr = new Date().toDateString();
  const todaysDeliveries = filteredDeliveries.filter((deliv) => {
    const dateStr = deliv.CreatedAt || deliv.created_at;
    if (!dateStr) return false;
    return new Date(dateStr).toDateString() === todayStr;
  });

  const previousDeliveries = filteredDeliveries.filter((deliv) => {
    const dateStr = deliv.CreatedAt || deliv.created_at;
    if (!dateStr) return true;
    return new Date(dateStr).toDateString() !== todayStr;
  });

  function renderDeliveryCard(deliv, isEditable = false) {
    const delivId = deliv.ID || deliv.id;
    const createdAtStr = deliv.CreatedAt || deliv.created_at;
    const recordUser = deliv.User || {};
    const submitterName = recordUser.name || recordUser.username || "Operator";
    const isEditing = editingId === delivId;

    if (isEditing) {
      return (
        <div
          key={delivId}
          className="bg-[#0e1113] border border-[#e2b774]/40 rounded-xl p-5 space-y-4"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-[#e2b774] font-medium">
              Editing Delivery Record #{delivId}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveFullEdit(delivId)}
                className="px-3 py-1 bg-[#e2b774] text-[#140f0c] text-xs font-mono rounded-lg flex items-center gap-1 font-medium"
              >
                <Save size={12} /> Save Changes
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-2 py-1 bg-white/5 text-[#9c8e82] hover:text-[#fbf9f5] text-xs rounded-lg"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-[#9c8e82] mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={editStoreName}
                onChange={(e) => setEditStoreName(e.target.value)}
                className="w-full bg-[#161b22] text-[#fbf9f5] border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#e2b774]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9c8e82] mb-1">
                GPS Coordinates
              </label>
              <button
                type="button"
                onClick={() => handleGetLocation(setEditLat, setEditLng)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#161b22] text-[#fbf9f5] border border-white/10 rounded-lg py-1.5 text-xs font-mono"
              >
                <Navigation size={12} className="text-[#e2b774]" />
                {editLat && editLng
                  ? `${editLat}, ${editLng}`
                  : "Update Location"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9c8e82] mb-1">
              Delivery Notes
            </label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full bg-[#161b22] text-[#fbf9f5] border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#e2b774]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-[#161b22] p-3 rounded-lg border border-white/10 flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setModalImage(editBeforePhoto)}
              >
                <img
                  src={editBeforePhoto}
                  alt="Before"
                  className="w-10 h-10 object-cover rounded border border-white/10"
                />
                <span className="text-[11px] font-mono text-[#9c8e82]">
                  Before Photo
                </span>
              </div>
              <label className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[11px] font-mono text-[#e2b774] cursor-pointer">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditPhotoUpload(e, "before", delivId)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-[#161b22] p-3 rounded-lg border border-white/10 flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setModalImage(editAfterPhoto)}
              >
                <img
                  src={editAfterPhoto}
                  alt="After"
                  className="w-10 h-10 object-cover rounded border border-white/10"
                />
                <span className="text-[11px] font-mono text-[#9c8e82]">
                  After Photo
                </span>
              </div>
              <label className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[11px] font-mono text-[#e2b774] cursor-pointer">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditPhotoUpload(e, "after", delivId)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      );
    }

    const beforeImg = deliv.before_photo || deliv.BeforePhoto;
    const afterImg = deliv.after_photo || deliv.AfterPhoto;

    return (
      <div
        key={delivId}
        className="bg-[#0e1113] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="space-y-2 flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-base font-medium">
              {deliv.store_name || deliv.StoreName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {deliv.status || deliv.Status}
            </span>
            {isAdmin && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#e2b774]/10 text-[#e2b774] border border-[#e2b774]/30">
                Driver: {submitterName}
              </span>
            )}
          </div>

          {createdAtStr && (
            <p className="text-[11px] font-mono text-[#e2b774] flex items-center gap-1">
              <Clock size={12} /> Logged:{" "}
              {new Date(createdAtStr.replace("Z", "")).toLocaleString()}
            </p>
          )}

          {(deliv.store_lat || deliv.StoreLat) !== 0 && (
            <p className="text-[11px] font-mono text-[#9c8e82] flex items-center gap-1">
              <MapPin size={12} className="text-[#e2b774]" /> Coordinates:{" "}
              {deliv.store_lat || deliv.StoreLat},{" "}
              {deliv.store_lng || deliv.StoreLng}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            {(deliv.notes || deliv.Notes) && (
              <p className="text-xs text-[#9c8e82]">
                Note: {deliv.notes || deliv.Notes}
              </p>
            )}
            {isEditable && (
              <button
                onClick={() => {
                  setEditingId(delivId);
                  setEditStoreName(deliv.store_name || deliv.StoreName || "");
                  setEditLat(deliv.store_lat || deliv.StoreLat || "");
                  setEditLng(deliv.store_lng || deliv.StoreLng || "");
                  setEditNotes(deliv.notes || deliv.Notes || "");
                  setEditBeforePhoto(beforeImg || "");
                  setEditAfterPhoto(afterImg || "");
                }}
                className="text-[11px] font-mono text-[#e2b774] hover:underline flex items-center gap-1"
              >
                <Edit2 size={12} /> Edit Submission
              </button>
            )}
          </div>
        </div>

        {/* Clickable Before/After Thumbnails */}
        <div className="flex items-center gap-3">
          {beforeImg && (
            <div
              className="text-center group cursor-pointer"
              onClick={() => setModalImage(beforeImg)}
            >
              <span className="text-[10px] font-mono text-[#9c8e82] block mb-1">
                Before
              </span>
              <div className="relative">
                <img
                  src={beforeImg}
                  alt="Before shelf"
                  className="w-14 h-14 object-cover rounded-lg border border-white/10 group-hover:border-[#e2b774] transition-colors"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Maximize2 size={14} className="text-[#e2b774]" />
                </div>
              </div>
            </div>
          )}
          {afterImg && (
            <div
              className="text-center group cursor-pointer"
              onClick={() => setModalImage(afterImg)}
            >
              <span className="text-[10px] font-mono text-[#9c8e82] block mb-1">
                After
              </span>
              <div className="relative">
                <img
                  src={afterImg}
                  alt="After shelf"
                  className="w-14 h-14 object-cover rounded-lg border border-white/10 group-hover:border-[#e2b774] transition-colors"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Maximize2 size={14} className="text-[#e2b774]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl">Driver Delivery Portal</h2>
        <p className="text-xs text-[#9c8e82] mt-0.5">
          {isAdmin
            ? "Viewing all platform-wide store drop-offs and shelf restock verifications."
            : "Record your store drop-offs with geotagged coordinates and shelf photos."}
        </p>
      </div>

      {/* Interactive Staged Delivery Card */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-serif text-lg text-[#fbf9f5] border-b border-white/10 pb-3 flex justify-between items-center">
          <span>New Store Delivery Record</span>
          {activeDeliveryId && (
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
              Session Active (In Progress)
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              Store Name / Location *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. California Market"
              disabled={!!activeDeliveryId}
              required
              className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              GPS Coordinates
            </label>
            <button
              type="button"
              onClick={() => handleGetLocation(setLat, setLng)}
              className="w-full flex items-center justify-center gap-2 bg-[#0e1113] hover:bg-black/40 text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono transition-colors"
            >
              <Navigation size={14} className="text-[#e2b774]" />
              {lat && lng ? `${lat}, ${lng}` : "Capture GPS Location"}
            </button>
          </div>
        </div>

        {/* Staged Photo Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Step 1: Before Photo */}
          <div className="space-y-2 bg-[#0e1113] p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9c8e82]">
                Step 1: Shelf Photo (Before)
              </span>
              {beforePhotoUrl && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Saved ✓
                </span>
              )}
            </div>

            {beforePhotoUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={beforePhotoUrl}
                  alt="Before shelf"
                  onClick={() => setModalImage(beforePhotoUrl)}
                  className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-[#e2b774] transition-colors"
                  title="Click to expand"
                />
                <span className="text-xs font-mono text-[#9c8e82]">
                  Initial shelf state captured successfully.
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 border border-white/10 border-dashed rounded-xl p-6 cursor-pointer transition-colors">
                <Upload size={20} className="text-[#e2b774] mb-1.5" />
                <span className="text-xs font-mono text-[#fbf9f5]">
                  {uploading ? "Saving..." : "Upload & Save Before Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSaveBeforePhoto}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Step 2: After Photo */}
          <div className="space-y-2 bg-[#0e1113] p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9c8e82]">
                Step 2: Shelf Photo (After)
              </span>
              {afterPhotoUrl && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Completed ✓
                </span>
              )}
            </div>

            {afterPhotoUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={afterPhotoUrl}
                  alt="After shelf"
                  onClick={() => setModalImage(afterPhotoUrl)}
                  className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-[#e2b774] transition-colors"
                  title="Click to expand"
                />
                <span className="text-xs font-mono text-[#9c8e82]">
                  Restocked shelf state verified.
                </span>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center border border-white/10 border-dashed rounded-xl p-6 transition-colors ${!beforePhotoUrl ? "opacity-40 cursor-not-allowed bg-black/20" : "bg-black/40 hover:bg-black/60 cursor-pointer"}`}
              >
                <Upload size={20} className="text-[#e2b774] mb-1.5" />
                <span className="text-xs font-mono text-[#fbf9f5]">
                  {uploading ? "Saving..." : "Upload After & Complete"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSaveAfterPhoto}
                  disabled={!beforePhotoUrl}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5 mt-2">
            Delivery Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Delivered 40 loaves of sourdough, manager signed off."
            className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
          />
        </div>

        {error && <p className="text-rose-400 text-xs">{error}</p>}
      </div>

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
            placeholder="Search by store name, notes, or driver..."
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
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Grouped Delivery Logs */}
      <div className="space-y-6">
        {/* Today's Submissions */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#e2b774] border-b border-white/15 pb-3 flex items-center gap-2">
            <Calendar size={14} /> Today's Deliveries ({todaysDeliveries.length}
            )
          </h3>

          {todaysDeliveries.length === 0 ? (
            <p className="text-xs text-[#9c8e82] text-center py-6 font-mono">
              No matching delivery records for today.
            </p>
          ) : (
            <div className="space-y-4">
              {todaysDeliveries.map((d) => renderDeliveryCard(d, true))}
            </div>
          )}
        </div>

        {/* Previous Submissions */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9c8e82] border-b border-white/15 pb-3 flex items-center gap-2">
            <Clock size={14} /> Previous Deliveries ({previousDeliveries.length}
            )
          </h3>

          {previousDeliveries.length === 0 ? (
            <p className="text-xs text-[#9c8e82] text-center py-6 font-mono">
              No matching previous delivery logs found.
            </p>
          ) : (
            <div className="space-y-4">
              {previousDeliveries.map((d) => renderDeliveryCard(d, false))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#161b22] border border-white/15 rounded-2xl p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-3 -right-3 bg-[#e2b774] text-[#140f0c] p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <X size={16} />
            </button>
            <img
              src={modalImage}
              alt="Expanded shelf verification"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
