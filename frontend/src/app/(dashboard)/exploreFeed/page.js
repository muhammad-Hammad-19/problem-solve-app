"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Code2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useUser } from "@/app/context/UserProvider";

const ExploreFeed = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user: feedItems, loading } = useUser();

  const categories = [
    "All",
    "Development",
    "Design",
    "Marketing",
    "Database",
    "DevOps",
  ];

  const filteredFeed = useMemo(() => {
    return (feedItems || []).filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item?.skills?.some((skill) =>
          skill?.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || item?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory;
    });
  }, [feedItems, activeCategory, searchQuery]);
  
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto mb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Explore Requests
            </h1>
            <p className="text-zinc-400 text-lg">
              Connecting expertise with those who need it most.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
            <Sparkles size={20} /> AI Match
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
            size={22}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, titles, or tags..."
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all text-lg"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-white text-black border-white shadow-lg shadow-white/10"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFeed?.length > 0 ? (
          filteredFeed?.map((item) => (
            <div
              key={item?._id}
              className="group bg-zinc-900/30 border border-zinc-800/50 p-7 rounded-[2rem] hover:bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-inner">
                      {item?.user?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-200">{item.user}</h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.posted}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {item.location || "Remote"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                      item?.urgency === "High"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item?.urgency}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-indigo-400 transition-colors">
                  {item?.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {item?.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {item?.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Code2 size={12} className="text-indigo-500" /> {skill}
                    </span>
                  ))}
                  {item.skills.length > 3 && (
                    <span className="text-[11px] text-zinc-500">
                      +{item.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* View Details Button */}
              <Link href={`/exploreFeed/${item._id}`}>
                <button className="w-full bg-zinc-100 hover:bg-white text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                  View Full Details <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-500 text-lg">
              No requests match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreFeed;
