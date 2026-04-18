"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/types";

type GalleryCategory = GalleryImage["category"];

const categoryColors: Record<GalleryCategory, string> = {
  installations: "bg-purple-100 text-purple-800",
  factory: "bg-orange-100 text-orange-800",
  products: "bg-blue-100 text-blue-800",
  events: "bg-green-100 text-green-800",
};

const galleryCategories: GalleryCategory[] = [
  "installations",
  "factory",
  "products",
  "events",
];

interface GalleryForm {
  image_url: string;
  title: string;
  category: GalleryCategory;
  description: string;
  display_order: number;
}

const emptyForm: GalleryForm = {
  image_url: "",
  title: "",
  category: "installations",
  description: "",
  display_order: 0,
};

export default function GalleryPage() {
  const supabase = createClient();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<"all" | GalleryCategory>(
    "all"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (filterCategory !== "all") query = query.eq("category", filterCategory);

    const { data } = await query;
    setImages(data ?? []);
    setLoading(false);
  }, [filterCategory]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setShowAdd(false);
    setForm({
      image_url: img.image_url,
      title: img.title ?? "",
      category: img.category,
      description: img.description ?? "",
      display_order: img.display_order,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.image_url.trim()) return;
    setSaving(true);

    const payload = {
      image_url: form.image_url.trim(),
      title: form.title.trim() || null,
      category: form.category,
      description: form.description.trim() || null,
      display_order: form.display_order,
    };

    if (editingId) {
      await supabase
        .from("gallery_images")
        .update(payload)
        .eq("id", editingId);
    } else {
      await supabase.from("gallery_images").insert(payload);
    }

    setSaving(false);
    cancelEdit();
    fetchImages();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from("gallery_images")
      .update({ is_active: !current })
      .eq("id", id);
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, is_active: !current } : img
      )
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this gallery image? This cannot be undone."))
      return;
    await supabase.from("gallery_images").delete().eq("id", id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  const isFormOpen = showAdd || editingId;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as typeof filterCategory)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
          >
            <option value="all">All Categories</option>
            {galleryCategories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          {!isFormOpen && (
            <button
              onClick={() => {
                setShowAdd(true);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Add Image
            </button>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? "Edit Image" : "Add Image"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                value={form.image_url}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image_url: e.target.value }))
                }
                placeholder="https://…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as GalleryCategory,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              >
                {galleryCategories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    display_order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
          </div>

          {form.image_url && (
            <div className="mt-4">
              <p className="mb-1 text-xs font-medium text-gray-400">Preview</p>
              <img
                src={form.image_url}
                alt="Preview"
                className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.image_url.trim()}
              className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          Loading…
        </div>
      ) : images.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          No gallery images found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md ${
                !img.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={img.image_url}
                  alt={img.title ?? "Gallery image"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' fill='%23e5e7eb'%3E%3Crect width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    categoryColors[img.category]
                  }`}
                >
                  {img.category}
                </span>
              </div>

              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {img.title || "Untitled"}
                </h3>
                {img.description && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {img.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(img.id, img.is_active)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                      img.is_active ? "bg-[#C9A84C]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                        img.is_active ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(img)}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
