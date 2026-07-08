"use client";
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Trophy,
  Bell,
  PlusCircle,
  Users,
  Zap,
  LogOut,
} from "lucide-react";
import { useUsersFeeds } from "@/app/context/UserFeedContext";
import { useCurrentUser } from "@/app/context/CurrentUserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link";

const HelplyticsDashboard = () => {
  const { feeds, fetchUserFeeds } = useUsersFeeds();
  const { currentUser, setCurrentUser, fetchCurrentUser } = useCurrentUser();
  const router = useRouter();

  const recentRequests = feeds?.slice(-3) || [];

  // User ka first letter nikalne ka logic
  const userFirstLetter = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : currentUser?.username
      ? currentUser.username.charAt(0).toUpperCase()
      : "D";

  useEffect(() => {
    if (fetchUserFeeds && fetchCurrentUser) {
      fetchUserFeeds();
      fetchCurrentUser();
    }
  }, []);

  const stats = [
    {
      label: "Total Contributions",
      value: "42",
      icon: Trophy,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Active Requests",
      value: feeds?.length || "0",
      icon: MessageSquare,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Trust Score",
      value: "98%",
      icon: Zap,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Helpers Online",
      value: "156",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10",
    },
  ];

  // Logout with Backend Request and Redirect to '/'
  const handleLogout = async () => {
    try {
      // Backend api endpoint (Aap apne hisab se URL change kar sakte hain agar kuch aur ho)
      const res = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Agar response successfully aa jata hai

      if (res.data.success) {
        console.log("Logged out successfully");
        setCurrentUser(null);
        router.push("/"); // '/' ke page pe redirect kiya
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Error In Logout Route");
    }
  };

  return (
    <div className="flex h-screen bg-[#020203] text-zinc-100 font-sans antialiased selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/60 bg-[#070709] flex flex-col p-5 justify-between">
        <div className="space-y-7">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Helplytics
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
            />
            <NavItem
              icon={<Search size={18} />}
              label="Explore"
              href="/exploreFeed"
            />
            <NavItem
              icon={<MessageSquare size={18} />}
              label="Interactions"
              href="/interactions"
            />
            <NavItem
              icon={<Trophy size={18} />}
              label="Leaderboard"
              href="/leaderboard"
            />
            <NavItem icon={<Bell size={18} />} label="Notifications" href="#" />
          </nav>
        </div>

        {/* Sidebar Bottom (User Profile & Logout) */}
        <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2 bg-[#070709]">
          {/* Profile Section */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-inner border border-indigo-400/20 uppercase shrink-0">
              {userFirstLetter}
            </div>
            <div className="text-left truncate">
              <p className="text-sm font-semibold text-zinc-200 truncate max-w-[120px]">
                {currentUser?.name || "Developer"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 group shrink-0"
            title="Logout"
          >
            <LogOut
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#070709] to-[#020203]">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/60 flex items-center justify-between py-5 px-8 bg-[#020203]/40 backdrop-blur-xl z-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Overview Dashboard
          </h2>
          <div className="flex items-center gap-4">
            {/* New Request Button (Sirf Button Bacha Hai, Modal Ka Kam Khatam) */}
            <button
              onClick={() => router.push("/createReq")}
              className="bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-zinc-100/10 transition-all duration-200 flex items-center gap-2 group"
            >
              <PlusCircle
                size={16}
                className="text-zinc-900 transition-transform group-hover:scale-110"
              />
              Create Request
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 overflow-y-auto space-y-8">
          {/* Welcome Text */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Welcome back, {currentUser?.name || "Dev"}.
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Here is an overview of what's happening in your workspace today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="relative overflow-hidden bg-[#0d0d11]/40 border border-zinc-800/80 p-5 rounded-2xl hover:border-zinc-700/80 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-3 tracking-tight group-hover:text-white transition-colors">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* AI Insights Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-transparent border border-indigo-500/20 p-5 rounded-2xl shadow-xl shadow-indigo-500/[0.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <Zap size={15} className="text-indigo-400 fill-indigo-400/20" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                AI Smart Recommendation
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Based on your expert profile in{" "}
              <span className="text-indigo-300 font-semibold underline decoration-indigo-400/30 underline-offset-4">
                React & Next.js
              </span>
              , there are 5 active requests waiting for your troubleshooting!
            </p>
          </div>

          {/* Recent Requests Table/List */}
          <div className="bg-[#070709]/60 border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-800/60 flex justify-between items-center bg-[#0d0d11]/20">
              <h3 className="font-semibold text-zinc-200 text-sm tracking-wide">
                Recent Help Requests
              </h3>
              <button
                onClick={() => router.push("/exploreFeed")}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10"
              >
                View Feed
              </button>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {recentRequests.length > 0 ? (
                recentRequests.map((req, index) => (
                  <div
                    key={req._id || index}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/20 transition-all duration-200"
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-medium text-sm text-zinc-100 hover:text-indigo-400 cursor-pointer transition-colors max-w-xl truncate">
                        {req.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-zinc-500">
                          by{" "}
                          <span className="text-zinc-400">
                            {req.user || "Anonymous"}
                          </span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {req?.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-zinc-800/40">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          req.urgency === "High"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-zinc-800/60 text-zinc-400 border border-zinc-700/40"
                        }`}
                      >
                        {req.urgency || "Low"}
                      </span>
                      <button className="text-xs bg-zinc-800 text-zinc-200 border border-zinc-700/60 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-700 hover:text-white transition-all duration-200 shadow-sm">
                        Accept Help
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  No requests found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, href = "#", active = false }) => (
  <Link className="block" href={href}>
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
        active
          ? "bg-zinc-800/80 text-white font-semibold border border-zinc-700/50 shadow-inner"
          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  </Link>
);

export default HelplyticsDashboard;
