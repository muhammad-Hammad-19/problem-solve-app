"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  RefreshCcw,
  Check,
  Circle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Backend base url — apna env variable se lagao (e.g. process.env.NEXT_PUBLIC_API_URL)
// ---------------------------------------------------------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TYPE_META = {
  NEW_HELPER: {
    icon: UserPlus,
    label: "New helper",
    accent: "border-l-[#3457D5]",
    chip: "text-[#3457D5] bg-[#3457D5]/10",
  },
  HELPER_ACCEPTED: {
    icon: CheckCircle2,
    label: "Accepted",
    accent: "border-l-[#2F9E5B]",
    chip: "text-[#2F9E5B] bg-[#2F9E5B]/10",
  },
  STATUS_CHANGED: {
    icon: RefreshCcw,
    label: "Status",
    accent: "border-l-[#B8860B]",
    chip: "text-[#B8860B] bg-[#B8860B]/10",
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "NEW_HELPER", label: "New helpers" },
  { key: "HELPER_ACCEPTED", label: "Accepted" },
  { key: "STATUS_CHANGED", label: "Status" },
];

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

function groupOf(iso) {
  const d = new Date(iso);
  const now = new Date();
  const isSameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isSameDay) return "Today";
  if (isYesterday) return "Yesterday";
  return "Earlier";
}

export default function NotificationPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------------------------------------------------
  // Fetch notifications from backend
  // -------------------------------------------------------------------
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/notifications/`, {
        credentials: "include", // agar cookie based auth hai
        // headers: { Authorization: `Bearer ${token}` }, // agar token based auth hai
      });
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.isRead);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const grouped = useMemo(() => {
    const order = ["Today", "Yesterday", "Earlier"];
    return order
      .map((g) => ({
        group: g,
        items: filtered
          .filter((n) => groupOf(n.createdAt) === g)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  // -------------------------------------------------------------------
  // Mark single as read
  // -------------------------------------------------------------------
  const markRead = async (id) => {
    setItems((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // silently ignore, UI already updated optimistically
    }
  };

  // -------------------------------------------------------------------
  // Mark all as read
  // -------------------------------------------------------------------
  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // silently ignore
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <p className="text-sm text-[#1B1F3B]/50">Loading notifications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <p className="text-sm text-[#C1443C]">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans text-[#1B1F3B]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-[28px] font-semibold tracking-tight text-[#1B1F3B]">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-[#1B1F3B]/60">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "You're all caught up"}
            </p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 rounded-full border border-[#1B1F3B]/10 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1B1F3B] shadow-sm transition hover:bg-[#1B1F3B]/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={14} strokeWidth={2.5} />
            Mark all read
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-1.5 border-b border-[#1B1F3B]/10 pb-px">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative px-3 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "text-[#1B1F3B]"
                  : "text-[#1B1F3B]/45 hover:text-[#1B1F3B]/70"
              }`}
            >
              {f.label}
              {f.key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#3457D5] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
              {filter === f.key && (
                <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-[#1B1F3B]" />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1B1F3B]/15 bg-white/60 py-16 text-center">
            <p className="text-sm text-[#1B1F3B]/50">
              Nothing here. Try a different filter.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ group, items: groupItems }) => (
              <div key={group}>
                <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#1B1F3B]/40">
                  {group}
                </h2>
                <ul className="overflow-hidden rounded-2xl border border-[#1B1F3B]/8 bg-white shadow-sm">
                  {groupItems.map((n, idx) => {
                    const meta = TYPE_META[n.type];
                    const Icon = meta.icon;
                    return (
                      <li
                        key={n._id}
                        className={`group flex items-start gap-3 border-l-[3px] ${meta.accent} px-4 py-3.5 transition hover:bg-[#1B1F3B]/[0.02] ${
                          idx !== groupItems.length - 1
                            ? "border-b border-b-[#1B1F3B]/6"
                            : ""
                        } ${!n.isRead ? "bg-[#3457D5]/[0.03]" : ""}`}
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.chip}`}
                        >
                          <Icon size={15} strokeWidth={2.25} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] leading-snug text-[#1B1F3B]">
                            <span className="font-semibold">
                              {n.sender ? n.sender.name : "System"}
                            </span>{" "}
                            <span className="text-[#1B1F3B]/75">
                              {n.message}
                            </span>
                          </p>
                          <span className="mt-1 inline-flex items-center gap-2 font-mono text-[11px] tracking-tight text-[#1B1F3B]/40">
                            {timeAgo(n.createdAt)}
                            <span className="text-[#1B1F3B]/20">•</span>
                            {meta.label}
                          </span>
                        </div>

                        {!n.isRead ? (
                          <button
                            onClick={() => markRead(n._id)}
                            title="Mark as read"
                            className="mt-1.5 shrink-0"
                          >
                            <Circle
                              size={8}
                              className="fill-[#3457D5] text-[#3457D5]"
                            />
                          </button>
                        ) : (
                          <span className="mt-1.5 h-2 w-2 shrink-0" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
