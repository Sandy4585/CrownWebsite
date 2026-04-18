"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";

interface TestimonialForm {
  client_name: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  display_order: number;
}

const emptyForm: TestimonialForm = {
  client_name: "",
  company: "",
  location: "",
  content: "",
  rating: 5,
  display_order: 0,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-amber-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function TestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    setTestimonials(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setShowAdd(false);
    setForm({
      client_name: t.client_name,
      company: t.company ?? "",
      location: t.location ?? "",
      content: t.content,
      rating: t.rating,
      display_order: t.display_order,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.client_name.trim() || !form.content.trim()) return;
    setSaving(true);

    const payload = {
      client_name: form.client_name.trim(),
      company: form.company.trim() || null,
      location: form.location.trim() || null,
      content: form.content.trim(),
      rating: form.rating,
      display_order: form.display_order,
    };

    if (editingId) {
      await supabase.from("testimonials").update(payload).eq("id", editingId);
    } else {
      await supabase.from("testimonials").insert(payload);
    }

    setSaving(false);
    cancelEdit();
    fetchTestimonials();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from("testimonials")
      .update({ is_active: !current })
      .eq("id", id);
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this testimonial? This cannot be undone."))
      return;
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  const isFormOpen = showAdd || editingId;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        {!isFormOpen && (
          <button
            onClick={() => {
              setShowAdd(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Add Testimonial
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                value={form.client_name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    client_name: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                value={form.company}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, company: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    rating: parseInt(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                placeholder="Testimonial content…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
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
              disabled={
                saving || !form.client_name.trim() || !form.content.trim()
              }
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
      ) : testimonials.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          No testimonials found
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-center">Order</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr
                  key={t.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    !t.is_active ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {t.client_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.location || "—"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-600">
                    {t.content}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StarRating rating={t.rating} />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {t.display_order}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(t.id, t.is_active)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                        t.is_active ? "bg-[#C9A84C]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                          t.is_active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
        </div>
      )}
    </div>
  );
}
