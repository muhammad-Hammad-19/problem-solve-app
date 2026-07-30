"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/app/context/CurrentUserContext";
import { useUsersFeeds } from "@/app/context/UserFeedContext";

const roleCopy = {
  "Need help": "Looking for support from the community",
  "Can help": "Ready to help other community members",
  Both: "Ready to give and receive help",
};

export default function ProfilePage() {
  const { currentUser, isLoading } = useCurrentUser();
  const { feeds = [] } = useUsersFeeds();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020203] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Loading profile...
        </div>
      </main>
    );
  }

  const name = currentUser?.name || "Community member";
  const firstLetter = name.charAt(0).toUpperCase();
  const role = currentUser?.role || "Both";
  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Active member";

  return (
    <main className="min-h-screen bg-[#020203] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <Zap size={15} className="text-indigo-400" />
            Profile
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#0d0d11]/70 shadow-2xl shadow-indigo-950/10">
          <div className="h-32 bg-gradient-to-r from-indigo-950 via-violet-950/80 to-zinc-900 sm:h-40" />
          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-[#0d0d11] bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold text-white shadow-xl shadow-indigo-950/30 sm:h-28 sm:w-28 sm:text-5xl">
                  {firstLetter}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {name}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-400">{roleCopy[role]}</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active member
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoCard icon={Mail} label="Email" value={currentUser?.email || "Not available"} />
              <InfoCard icon={UserRound} label="Role" value={role} />
              <InfoCard icon={CalendarDays} label="Member since" value={joinedDate} />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-zinc-800/80 bg-[#0d0d11]/60 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-100">About this profile</h2>
                <p className="mt-1 text-xs text-zinc-500">Community participation details</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-zinc-400">
              {roleCopy[role]}. Connect with this community to exchange knowledge,
              solve problems, and build a stronger help network.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Account verified through Help Hub
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-[#0d0d11]/60 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-100">Activity overview</h2>
                <p className="mt-1 text-xs text-zinc-500">Your current workspace activity</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Help requests" value={feeds.length} />
              <StatCard label="Trust score" value="98%" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
      <Icon size={17} className="mb-3 text-zinc-500" />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
