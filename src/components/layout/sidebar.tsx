"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardCheck,
  GraduationCap,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount: number;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/grades", label: "Grades", icon: GraduationCap },
  { href: "/students", label: "Students", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle, badge: true },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar({ isCollapsed, onToggleCollapse, unreadCount }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar-bg h-screen sticky top-0 transition-all duration-200",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!isCollapsed && (
          <Link href="/" className="text-lg font-bold text-gray-900">
            EduTrack
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Teacher info */}
      {!isCollapsed && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              MJ
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">Ms. Johnson</p>
              <p className="truncate text-xs text-gray-500">7th Grade</p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="border-t border-border p-3 flex justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            MJ
          </div>
        </div>
      )}
    </aside>
  );
}
