"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  Trash2,
  User,
  Sparkles,
  Inbox,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [readingId, setReadingId] = useState(null);

  // =========================
  // Fetch Notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE}/notifications`, {
        withCredentials: true,
      });

      setNotifications(response.data);
    } catch (error) {
      console.error("Notification error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notifications. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Mark One As Read
  // =========================
  const markAsRead = async (id) => {
    try {
      setReadingId(id);

      await axios.patch(
        `${API_BASE}/notifications/${id}/read`,
        {},
        {
          withCredentials: true,
        },
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Mark read error:", error);
    } finally {
      setReadingId(null);
    }
  };

  // =========================
  // Mark All As Read
  // =========================
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${API_BASE}/notifications/mark-all-read`,
        {},
        {
          withCredentials: true,
        },
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  // =========================
  // Delete Notification
  // =========================
  const deleteNotification = async (id) => {
    try {
      setDeletingId(id);

      await axios.delete(`${API_BASE}/notifications/${id}`, {
        withCredentials: true,
      });

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id),
      );
    } catch (error) {
      console.error("Delete notification error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // Initial Fetch
  // =========================
  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // Stats
  // =========================
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  // =========================
  // Relative Time
  // =========================
  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // Notification Icon
  // =========================
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_FEED":
        return <Sparkles size={17} />;

      default:
        return <Bell size={17} />;
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4 animate-pulse">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-4 h-3 w-20 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Bell size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">{error}</p>

          <button
            onClick={fetchNotifications}
            className="mt-6 rounded-xl bg-[#1b1f3b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#272d55] active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        {/* ================= Header ================= */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1b1f3b] text-white shadow-lg shadow-[#1b1f3b]/20">
              <Bell size={25} />

              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#f7f8fa] bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Stay updated with your HelpHub activity.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          )}
        </div>

        {/* ================= Notification Count ================= */}
        {notifications.length > 0 && (
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Recent activity
            </p>

            <p className="text-xs text-gray-400">
              {notifications.length}{" "}
              {notifications.length === 1 ? "notification" : "notifications"}
            </p>
          </div>
        )}

        {/* ================= Empty State ================= */}
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-400">
              <Inbox size={34} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-lg font-bold text-gray-900">
              You&apos;re all caught up
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You don&apos;t have any notifications right now. We&apos;ll let
              you know when something new happens.
            </p>
          </div>
        ) : (
          /* ================= Notifications ================= */
          <div className="space-y-3">
            {notifications.map((notification) => {
              const isUnread = !notification.isRead;

              const senderName = notification.sender?.name?.trim() || "HelpHub";

              const avatarLetter = senderName.charAt(0).toUpperCase();

              return (
                <article
                  key={notification._id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    isUnread
                      ? "border-blue-100 shadow-sm shadow-blue-100/50"
                      : "border-gray-100 shadow-sm"
                  }`}
                >
                  {/* Unread indicator */}
                  {isUnread && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div
                        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                          isUnread
                            ? "bg-[#1b1f3b] text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {notification.sender?.name ? (
                          avatarLetter
                        ) : (
                          <User size={19} />
                        )}

                        {isUnread && (
                          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Top row */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`truncate text-sm ${
                                  isUnread
                                    ? "font-bold text-gray-900"
                                    : "font-semibold text-gray-700"
                                }`}
                              >
                                {senderName}
                              </h3>

                              {isUnread && (
                                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="mt-1.5 text-sm leading-6 text-gray-600">
                              {notification.message}
                            </p>
                          </div>

                          {/* Type */}
                          <span className="flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            {getNotificationIcon(notification.type)}
                            {notification.type?.replaceAll("_", " ") ||
                              "Notification"}
                          </span>
                        </div>

                        {/* Bottom row */}
                        <div className="mt-5 flex flex-col gap-3 border-t border-gray-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock3 size={14} />

                            <span>{getTimeAgo(notification.createdAt)}</span>

                            <span className="text-gray-300">•</span>

                            <span className="hidden sm:inline">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                disabled={readingId === notification._id}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {readingId === notification._id ? (
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                ) : (
                                  <Check size={14} />
                                )}

                                {readingId === notification._id
                                  ? "Reading..."
                                  : "Mark as read"}
                              </button>
                            )}

                            <button
                              onClick={() =>
                                deleteNotification(notification._id)
                              }
                              disabled={deletingId === notification._id}
                              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === notification._id ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
