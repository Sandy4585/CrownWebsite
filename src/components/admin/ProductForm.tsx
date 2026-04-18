"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { productSchema, type ProductFormValues } from "@/lib/validations";
import type { Category, Product } from "@/types";

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!initialData;

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState(
    initialData?.images?.join("\n") || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditing);

  const [specEntries, setSpecEntries] = useState<
    { key: string; value: string }[]
  >(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([key, value]) => ({
          key,
          value,
        }))
      : []
  );
  const [featureEntries, setFeatureEntries] = useState<string[]>(
    initialData?.features || []
  );
  const [appEntries, setAppEntries] = useState<string[]>(
    initialData?.applications || []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      category_id: initialData?.category_id || "",
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      price_display: initialData?.price_display || "",
      is_price_visible: initialData?.is_price_visible ?? false,
      specs: initialData?.specs || undefined,
      features: initialData?.features || undefined,
      applications: initialData?.applications || undefined,
      is_featured: initialData?.is_featured ?? false,
      is_active: initialData?.is_active ?? true,
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
    },
  });

  const watchName = watch("name");
  const isPriceVisible = watch("is_price_visible");
  const isFeatured = watch("is_featured");
  const isActive = watch("is_active");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (data) setCategories(data);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!slugTouched && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, slugTouched, setValue]);

  const parsedImages = imageUrls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const slugField = register("slug");

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const specs: Record<string, string> = {};
      specEntries.forEach(({ key, value }) => {
        if (key.trim()) specs[key.trim()] = value;
      });

      const features = featureEntries.filter((f) => f.trim());
      const applications = appEntries.filter((a) => a.trim());
      const images = parsedImages.length > 0 ? parsedImages : null;
      const thumbnail = parsedImages.length > 0 ? parsedImages[0] : null;

      const payload = {
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        short_description: data.short_description || null,
        description: data.description || null,
        price_display: data.price_display || null,
        is_price_visible: data.is_price_visible,
        specs: Object.keys(specs).length > 0 ? specs : null,
        features: features.length > 0 ? features : null,
        applications: applications.length > 0 ? applications : null,
        images,
        thumbnail,
        is_featured: data.is_featured,
        is_active: data.is_active,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        display_order: initialData?.display_order ?? 0,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }

      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
            paths: ["/products", `/products/${data.slug}`],
          }),
        });
      } catch {
        /* revalidation is best-effort */
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* ── Basic Information ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              className={inputClass}
              placeholder="Product name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              ref={slugField.ref}
              name={slugField.name}
              onBlur={slugField.onBlur}
              onChange={(e) => {
                slugField.onChange(e);
                setSlugTouched(true);
              }}
              className={inputClass}
              placeholder="product-slug"
              value={watch("slug")}
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-500">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select {...register("category_id")} className={inputClass}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Price Display
            </label>
            <input
              {...register("price_display")}
              className={inputClass}
              placeholder="e.g. ₹2,50,000 onwards"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setValue("is_price_visible", !isPriceVisible)}
            className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
              isPriceVisible ? "bg-[#C9A84C]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isPriceVisible ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            Show price on product page
          </span>
        </div>
      </section>

      {/* ── Descriptions ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Descriptions
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Short Description
              <span className="ml-1 text-xs text-gray-400">(max 200 chars)</span>
            </label>
            <textarea
              {...register("short_description")}
              rows={2}
              maxLength={200}
              className={inputClass}
              placeholder="Brief product description"
            />
            {errors.short_description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.short_description.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Description
              <span className="ml-1 text-xs text-gray-400">
                (supports markdown)
              </span>
            </label>
            <textarea
              {...register("description")}
              rows={8}
              className={inputClass}
              placeholder="Detailed product description"
            />
          </div>
        </div>
      </section>

      {/* ── Specifications ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Specifications
        </h2>

        <div className="space-y-3">
          {specEntries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={entry.key}
                onChange={(e) => {
                  const next = [...specEntries];
                  next[i] = { ...next[i], key: e.target.value };
                  setSpecEntries(next);
                }}
                className={`flex-1 ${inputClass}`}
                placeholder="Key (e.g. Capacity)"
              />
              <input
                value={entry.value}
                onChange={(e) => {
                  const next = [...specEntries];
                  next[i] = { ...next[i], value: e.target.value };
                  setSpecEntries(next);
                }}
                className={`flex-1 ${inputClass}`}
                placeholder="Value (e.g. 5 kg/batch)"
              />
              <button
                type="button"
                onClick={() =>
                  setSpecEntries(specEntries.filter((_, idx) => idx !== i))
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSpecEntries([...specEntries, { key: "", value: "" }])
          }
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] hover:text-[#A8882E]"
        >
          <Plus className="h-4 w-4" />
          Add Specification
        </button>
      </section>

      {/* ── Features ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Features</h2>

        <div className="space-y-3">
          {featureEntries.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={feature}
                onChange={(e) => {
                  const next = [...featureEntries];
                  next[i] = e.target.value;
                  setFeatureEntries(next);
                }}
                className={`flex-1 ${inputClass}`}
                placeholder="Feature description"
              />
              <button
                type="button"
                onClick={() =>
                  setFeatureEntries(featureEntries.filter((_, idx) => idx !== i))
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFeatureEntries([...featureEntries, ""])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] hover:text-[#A8882E]"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </section>

      {/* ── Applications ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Applications
        </h2>

        <div className="space-y-3">
          {appEntries.map((app, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={app}
                onChange={(e) => {
                  const next = [...appEntries];
                  next[i] = e.target.value;
                  setAppEntries(next);
                }}
                className={`flex-1 ${inputClass}`}
                placeholder="Application / use case"
              />
              <button
                type="button"
                onClick={() =>
                  setAppEntries(appEntries.filter((_, idx) => idx !== i))
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAppEntries([...appEntries, ""])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] hover:text-[#A8882E]"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </section>

      {/* ── Images ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Images</h2>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Image URLs
            <span className="ml-1 text-xs text-gray-400">
              (one URL per line — first image becomes the thumbnail)
            </span>
          </label>
          <textarea
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            rows={4}
            className={inputClass}
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          />
        </div>

        {parsedImages.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Preview</p>
            <div className="flex flex-wrap gap-3">
              {parsedImages.map((url, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[#C9A84C] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Thumbnail
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Visibility ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Visibility
        </h2>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValue("is_featured", !isFeatured)}
              className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                isFeatured ? "bg-[#C9A84C]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isFeatured ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">Featured</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValue("is_active", !isActive)}
              className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                isActive ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">Active</span>
          </div>
        </div>
      </section>

      {/* ── SEO ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">SEO</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              {...register("meta_title")}
              className={inputClass}
              placeholder="SEO title (leave blank to use product name)"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              {...register("meta_description")}
              rows={3}
              className={inputClass}
              placeholder="SEO description"
            />
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#A8882E] disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting
            ? isEditing
              ? "Saving…"
              : "Creating…"
            : isEditing
              ? "Save Changes"
              : "Create Product"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
