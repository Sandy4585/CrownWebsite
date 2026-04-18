"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  display_order: 0,
};

export default function CategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    setCategories(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setShowAdd(false);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      display_order: cat.display_order,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      description: form.description.trim() || null,
      display_order: form.display_order,
    };

    if (editingId) {
      await supabase.from("categories").update(payload).eq("id", editingId);
    } else {
      await supabase.from("categories").insert(payload);
    }

    setSaving(false);
    cancelEdit();
    fetchCategories();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from("categories")
      .update({ is_active: !current })
      .eq("id", id);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const isFormOpen = showAdd || editingId;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        {!isFormOpen && (
          <button
            onClick={() => {
              setShowAdd(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Add Category
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
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
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
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

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Loading…
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            No categories found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Order</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {cat.slug}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-600">
                    {cat.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {cat.display_order}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(cat.id, cat.is_active)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                        cat.is_active ? "bg-[#C9A84C]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                          cat.is_active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
