"use client";
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Trophy,
  Settings,
  Bell,
  PlusCircle,
  Users,
  Zap,
} from "lucide-react";
import { useUser } from "@/app/context/UserProvider.jsx";
import { useRouter } from "next/navigation";

const HelplyticsDashboard = () => {
  const { user: userReq } = useUser();
  const router = useRouter();
  const recentRequests = userReq?.slice(-2);

  const stats = [
    {
      label: "Total Contributions",
      value: "42",
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      label: "Active Requests",
      value: "12",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    { label: "Trust Score", value: "98%", icon: Zap, color: "text-purple-500" },
    {
      label: "Helpers Online",
      value: "156",
      icon: Users,
      color: "text-green-500",
    },
  ];

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={20} fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Helplytics</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<Search size={18} />} label="Explore" />
          <NavItem icon={<MessageSquare size={18} />} label="Interactions" />
          <NavItem icon={<Trophy size={18} />} label="Leaderboard" />
          <NavItem icon={<Bell size={18} />} label="Notifications" />
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-md">
          <h2 className="text-sm font-medium text-zinc-400">Overview</h2>
          <div className="flex items-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2">
              <PlusCircle size={16} /> New Request
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, Dev.
            </h1>
            <p className="text-zinc-500 mt-1">
              Here is what's happening in your community today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats?.map((stat, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-zinc-400 font-medium">
                    {stat.label}
                  </p>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-xl mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                AI Insights
              </span>
            </div>
            <p className="text-zinc-300">
              Based on your skills in{" "}
              <span className="text-white font-medium">React</span>, there are 5
              new requests you could solve right now!
            </p>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-semibold">Recent Help Requests</h3>
              <button
                onClick={() => router.push("/exploreFeed")}
                className="text-sm text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-zinc-800">
              {recentRequests?.map((req) => (
                <div
                  key={req.id}
                  className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-zinc-100">{req.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500">
                        by {req.user}
                      </span>
                      <div className="flex gap-2">
                        {req?.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        req.urgency === "High"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {req.urgency}
                    </span>
                    <button className="text-sm bg-zinc-100 text-zinc-900 px-4 py-1.5 rounded-md font-medium hover:bg-zinc-200 transition-colors">
                      Help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-zinc-800 text-white"
        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default HelplyticsDashboard;
