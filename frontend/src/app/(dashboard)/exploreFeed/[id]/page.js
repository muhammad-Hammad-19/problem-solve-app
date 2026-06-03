"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { 
  MapPin, 
  Clock, 
  Code2, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  MessageSquare,
  AlertCircle,
  Briefcase,
  Users
} from "lucide-react";

const RequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user: feedItems } = useUser();

  const item = feedItems?.find((f) => f?._id.toString() === params?.id);

  // Dummy Helpers Array
  const dummyHelpers = [
    {
      id: "1",
      name: "Alex Rivera",
      avatar: "AR",
      role: "Full Stack Engineer",
      joinedAt: "10m ago"
    },
    {
      id: "2",
      name: "Sarah Chen",
      avatar: "SC",
      role: "UI/UX Designer",
      joinedAt: "2h ago"
    }
  ];

  if (!item) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        <p className="text-zinc-500 animate-pulse">Fetching request details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Top Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 mb-10 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Back to Explore</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Header Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-black uppercase">
                  {item.category}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${
                  item.urgency === "High" ? "bg-red-500/10 text-red-500" : "bg-zinc-800 text-zinc-400"
                }`}>
                  <AlertCircle size={14} /> {item.urgency} Priority
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                {item.title}
              </h1>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                  <Briefcase size={20} /> Project Description
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800/50">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Code2 size={22} className="text-indigo-500" /> Required Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-3 rounded-2xl text-sm font-medium transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar info & Actions */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black mb-4 shadow-xl">
                {item.user[0].toUpperCase()}
              </div>
              <h4 className="text-xl font-bold">{item.user}</h4>
              <p className="text-zinc-500 text-sm mb-6 flex items-center justify-center gap-1">
                <MapPin size={14} /> {item.location}
              </p>
              <div className="text-left bg-black/20 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Posted:</span>
                  <span className="text-zinc-300 font-medium">{item.posted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-green-500 font-medium italic">Active</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 group">
                <MessageSquare size={22} className="group-hover:animate-bounce" /> I CAN HELP
              </button>
              
              <button className="w-full bg-zinc-800 hover:bg-green-600/20 hover:text-green-500 hover:border-green-500/50 text-zinc-400 py-5 rounded-[1.5rem] font-bold border border-zinc-700 flex items-center justify-center gap-3 transition-all active:scale-95">
                <CheckCircle2 size={22} /> MARK AS SOLVED
              </button>
            </div>
            
            {/* HELPERS CARD (UI LOOP ONLY) */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 border-b border-zinc-800 pb-3">
                <Users size={18} className="text-indigo-400" />
                <h5 className="font-bold text-sm uppercase tracking-wider">Helpers Active ({dummyHelpers.length})</h5>
              </div>
              
              <div className="space-y-3">
                {dummyHelpers.map((helper) => (
                  <div key={helper.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {helper.avatar}
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-zinc-200">{helper.name}</h6>
                        <p className="text-xs text-zinc-500">{helper.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-medium">{helper.joinedAt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;