import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Tag, Upload } from "lucide-react";
import { apiFetch } from "../../services/api";

export default function CatalogTab({
  products,
  userRole,
  onProductAdded,
  onProductUpdated,
  onProductDeleted,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Breads");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = userRole === "admin";

  function handleOpenAdd() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Breads");
    setImageUrl("");
    setError("");
    setShowForm(true);
  }

  function handleOpenEdit(product) {
    setEditingId(product.ID || product.id);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price ? product.price.toString() : "");
    setCategory(product.category || "Breads");
    setImageUrl(product.image_url || product.imageUrl || "");
    setError("");
    setShowForm(true);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("hearth_token");
      const res = await fetch("http://localhost:8084/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setError("Image upload network error.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await apiFetch(`/products/${productId}`, {
        method: "DELETE",
      });

      if (onProductDeleted) {
        onProductDeleted(productId);
      }
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product. Ensure you have admin permissions.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image_url: imageUrl.trim(),
    };

    try {
      if (editingId) {
        const updated = await apiFetch(`/products/${editingId}`, {
          method: "PUT",
          body: payload,
        });

        if (onProductUpdated) {
          onProductUpdated(
            updated || {
              ID: editingId,
              id: editingId,
              ...payload,
            },
          );
        }
      } else {
        const newProduct = await apiFetch("/products", {
          method: "POST",
          body: payload,
        });

        if (onProductAdded) {
          onProductAdded(newProduct);
        }
      }

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Breads");
      setImageUrl("");
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(
        editingId
          ? "Failed to update product."
          : "Failed to create product. Ensure you have admin permissions.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl">Artisanal Inventory Catalog</h2>
          <p className="text-xs text-[#9c8e82] mt-0.5">
            Current production lines available at Hearth & Grain.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (showForm && !editingId) {
                setShowForm(false);
              } else {
                handleOpenAdd();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-md font-medium"
          >
            <Plus size={16} />{" "}
            {showForm && !editingId ? "Cancel" : "Add Product"}
          </button>
        )}
      </div>

      {/* Inline Add / Edit Form */}
      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg">
              {editingId
                ? "Edit Product Details"
                : "Add New Product to Catalog"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#9c8e82] hover:text-[#fbf9f5]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sourdough Rye"
                required
                className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="6.50"
                required
                className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
              >
                <option value="Breads">Breads</option>
                <option value="Pastries">Pastries</option>
                <option value="Specialty">Specialty</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
                Attach Image File
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 bg-[#0e1113] hover:bg-black/40 text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono cursor-pointer transition-colors border-dashed">
                  <Upload size={14} className="text-[#e2b774]" />
                  <span>{uploading ? "Uploading..." : "Choose Image File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {imageUrl && (
            <div className="flex items-center gap-3 bg-[#0e1113] p-3 rounded-xl border border-white/10">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border border-white/10"
              />
              <div className="flex-1 truncate text-xs font-mono text-[#9c8e82]">
                Attached: <span className="text-[#fbf9f5]">{imageUrl}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9c8e82] mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ingredients and texture..."
              rows={2}
              className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2b774]"
            />
          </div>

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#9c8e82] text-xs font-mono uppercase tracking-wider rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2.5 bg-[#e2b774] hover:bg-[#d0a35e] text-[#140f0c] text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-md font-medium"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </form>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => {
          const prodId = product.ID || product.id;
          const img = product.image_url || product.imageUrl;
          const cat = product.category || "Breads";

          return (
            <div
              key={prodId}
              className="bg-[#161b22] border border-white/10 rounded-2xl p-5 shadow-lg flex gap-4 items-start"
            >
              {img ? (
                <img
                  src={img}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-white/10 flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-black/30 rounded-xl border border-white/10 flex items-center justify-center text-[#9c8e82] flex-shrink-0">
                  <ImageIcon size={24} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className="font-serif text-lg truncate">
                    {product.name}
                  </h3>
                  <span className="font-mono text-xs text-[#e2b774] bg-[#e2b774]/10 px-2.5 py-1 rounded-lg border border-[#e2b774]/25 whitespace-nowrap">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <Tag size={12} className="text-[#9c8e82]" />
                  <span className="text-[10px] font-mono text-[#9c8e82] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {cat}
                  </span>
                </div>

                <p className="text-xs text-[#9c8e82] leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {isAdmin && (
                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono text-[#9c8e82] hover:text-[#fbf9f5] transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prodId)}
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-xs font-mono text-rose-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}