"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

type ProductWithCategory = Product & { category: { name: string } | null };

interface ProductsTableProps {
  initialProducts: ProductWithCategory[];
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleField(
    id: string,
    field: "is_featured" | "is_active",
    current: boolean
  ) {
    const { error } = await supabase
      .from("products")
      .update({ [field]: !current })
      .eq("id", id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: !current } : p))
      );
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Image
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Price
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">
                Featured
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">
                Active
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {search ? "No products match your search" : "No products yet"}
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.price_display || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        toggleField(
                          product.id,
                          "is_featured",
                          product.is_featured
                        )
                      }
                      className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        product.is_featured ? "bg-[#C9A84C]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          product.is_featured
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        toggleField(
                          product.id,
                          "is_active",
                          product.is_active
                        )
                      }
                      className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        product.is_active ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          product.is_active
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() =>
                          deleteProduct(product.id, product.name)
                        }
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
