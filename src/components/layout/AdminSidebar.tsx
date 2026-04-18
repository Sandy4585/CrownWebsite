"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Image,
  Quote,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Image,
  Quote,
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "MessageSquare" },
  { label: "Gallery", href: "/admin/gallery", icon: "Image" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Quote" },
];

interface AdminSidebarProps {
  unreadCount?: number;
}

export function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
        <NextImage
          src="/logo.jpg"
          alt="Crown Consultants"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
        />
        <div>
          <p className="text-sm font-bold text-gray-900">Crown Consultants</p>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const showBadge =
              item.icon === "MessageSquare" && unreadCount > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {showBadge && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 px-3 py-4 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <ExternalLink className="h-5 w-5" />
          View Site
        </a>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
