"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import type { Enquiry } from "@/types";

const typeBadgeColors: Record<Enquiry["type"], string> = {
  general: "bg-blue-100 text-blue-800",
  quote: "bg-amber-100 text-amber-800",
  contact: "bg-green-100 text-green-800",
};

export default function EnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | Enquiry["type"]>("all");
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all");
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterType !== "all") query = query.eq("type", filterType);
    if (filterRead === "read") query = query.eq("is_read", true);
    if (filterRead === "unread") query = query.eq("is_read", false);

    const { data } = await query;
    setEnquiries(data ?? []);
    setLoading(false);
  }, [filterType, filterRead]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  async function markAsRead(id: string) {
    await supabase.from("enquiries").update({ is_read: true }).eq("id", id);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_read: true } : e))
    );
  }

  async function markAsResponded(id: string) {
    await supabase
      .from("enquiries")
      .update({ is_responded: true, is_read: true })
      .eq("id", id);
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, is_responded: true, is_read: true } : e
      )
    );
  }

  async function saveNotes(id: string) {
    setSavingNotes(id);
    const notes = editingNotes[id] ?? "";
    await supabase.from("enquiries").update({ notes }).eq("id", id);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, notes } : e))
    );
    setSavingNotes(null);
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const enquiry = enquiries.find((e) => e.id === id);
      if (enquiry) {
        setEditingNotes((prev) => ({ ...prev, [id]: enquiry.notes ?? "" }));
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Enquiries</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
        >
          <option value="all">All Types</option>
          <option value="general">General</option>
          <option value="quote">Quote</option>
          <option value="contact">Contact</option>
        </select>

        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>

        <span className="ml-auto text-sm text-gray-500">
          {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Loading…
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            No enquiries found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="w-8 px-4 py-3" />
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Product Interest</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => {
                const isExpanded = expandedId === enquiry.id;
                return (
                  <EnquiryRow
                    key={enquiry.id}
                    enquiry={enquiry}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(enquiry.id)}
                    onMarkRead={() => markAsRead(enquiry.id)}
                    onMarkResponded={() => markAsResponded(enquiry.id)}
                    notesValue={editingNotes[enquiry.id] ?? enquiry.notes ?? ""}
                    onNotesChange={(val) =>
                      setEditingNotes((prev) => ({ ...prev, [enquiry.id]: val }))
                    }
                    onSaveNotes={() => saveNotes(enquiry.id)}
                    isSavingNotes={savingNotes === enquiry.id}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EnquiryRow({
  enquiry,
  isExpanded,
  onToggle,
  onMarkRead,
  onMarkResponded,
  notesValue,
  onNotesChange,
  onSaveNotes,
  isSavingNotes,
}: {
  enquiry: Enquiry;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkRead: () => void;
  onMarkResponded: () => void;
  notesValue: string;
  onNotesChange: (val: string) => void;
  onSaveNotes: () => void;
  isSavingNotes: boolean;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${
          !enquiry.is_read ? "bg-blue-50/40" : ""
        }`}
      >
        <td className="px-4 py-3 text-center">
          {!enquiry.is_read && (
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          )}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
          {formatDateTime(enquiry.created_at)}
        </td>
        <td className="px-4 py-3 font-medium text-gray-900">{enquiry.name}</td>
        <td className="px-4 py-3 text-gray-600">{enquiry.email}</td>
        <td className="px-4 py-3 text-gray-600">{enquiry.phone}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
              typeBadgeColors[enquiry.type]
            }`}
          >
            {enquiry.type}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-600">
          {enquiry.product_interest || "—"}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                enquiry.is_read
                  ? "bg-gray-100 text-gray-600"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {enquiry.is_read ? "Read" : "Unread"}
            </span>
            {enquiry.is_responded && (
              <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Responded
              </span>
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-gray-200 bg-gray-50/50">
          <td colSpan={8} className="px-6 py-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                  Message
                </h4>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {enquiry.message}
                </p>
                {enquiry.company && (
                  <p className="mt-3 text-sm text-gray-500">
                    <span className="font-medium text-gray-600">Company:</span>{" "}
                    {enquiry.company}
                  </p>
                )}
                {enquiry.source_page && (
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-600">Source:</span>{" "}
                    {enquiry.source_page}
                  </p>
                )}
              </div>

              <div>
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                  Admin Notes
                </h4>
                <textarea
                  value={notesValue}
                  onChange={(e) => onNotesChange(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this enquiry…"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                />
                <button
                  onClick={onSaveNotes}
                  disabled={isSavingNotes}
                  className="mt-2 rounded-lg bg-[#C9A84C] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSavingNotes ? "Saving…" : "Save Notes"}
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-4">
              {!enquiry.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead();
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Mark as Read
                </button>
              )}
              {!enquiry.is_responded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkResponded();
                  }}
                  className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Mark as Responded
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
