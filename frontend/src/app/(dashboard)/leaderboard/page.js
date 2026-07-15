"use client";
import React, { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Flame,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const LeaderboardPage = () => {
  const [leaderUsers, setLeaderUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLeaderUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/request/fetch`,
          {
            withCredentials: true,
          },
        );

        if (res.data.successful && res.data.helperCounter) {
          // Response object `{ "Ali Khan": 4, "Sarah": 10 }` ko structure array me badalna
          const formattedUsers = Object.entries(res.data.helperCounter).map(
            ([name, solvedCount], index) => {
              return {
                id: name + index, // unique ID creation
                name: name,
                avatar: name.charAt(0).toUpperCase(), // Name ka pehla akshar
                problemsSolved: solvedCount,
                points: solvedCount * 100, // Har solved problem ke 100 points
                streak: Math.floor(Math.random() * 5) + 1, // Mock dynamic streak
                status: index % 2 === 0 ? "up" : "steady", // Mock trends
              };
            },
          );

          // Users ko highest points ke hisab se sort karna (Rank automation)
          const sortedUsers = formattedUsers.sort(
            (a, b) => b.points - a.points,
          );

          setLeaderUsers(sortedUsers);
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to load leaderboard data.");
      }
    };

    fetchLeaderUser();
  }, []);

  // Search Filter functionality
  const filteredUsers = leaderUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUserClick = (userName) => {
    toast.info(`Viewing profile of ${userName}`, {
      theme: "dark",
    });
  };

  const renderRankBadge = (rank) => {
    if (rank === 1)
      return (
        <Trophy
          className="text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
          size={24}
        />
      );
    if (rank === 2) return <Medal className="text-zinc-400" size={24} />;
    if (rank === 3) return <Medal className="text-amber-700" size={24} />;
    return <span className="text-zinc-500 font-bold px-2">{rank}</span>;
  };

  const renderStatus = (status) => {
    if (status === "up")
      return <ArrowUp className="text-green-500" size={16} />;
    if (status === "down")
      return <ArrowDown className="text-red-500" size={16} />;
    return <Minus className="text-zinc-600" size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-12">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent flex items-center gap-3">
              <Trophy className="text-indigo-500" size={36} /> Global
              Leaderboard
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Top helpers and problem solvers in the community.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              size={18}
            />
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Top 3 Podiums Section - Render elements conditionally if array has enough size */}
        {filteredUsers.length >= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
            {/* #2 Place */}
            {filteredUsers[1] && (
              <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-[2rem] text-center order-2 sm:order-1 sm:h-[180px] flex flex-col justify-center items-center relative group hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-lg mb-2 border border-zinc-700">
                  {filteredUsers[1].avatar}
                </div>
                <h3 className="font-bold text-zinc-200">
                  {filteredUsers[1].name}
                </h3>
                <p className="text-xs text-zinc-500">
                  {filteredUsers[1].points} pts
                </p>
                <div className="absolute top-4 left-4 bg-zinc-800 px-2 py-0.5 rounded-md text-xs text-zinc-400 font-bold">
                  #2
                </div>
              </div>
            )}

            {/* #1 Place */}
            {filteredUsers[0] && (
              <div className="bg-zinc-900/60 border border-indigo-500/30 p-6 rounded-[2rem] text-center order-1 sm:order-2 sm:h-[210px] flex flex-col justify-center items-center relative shadow-lg shadow-indigo-500/5 group hover:border-indigo-500/50 transition-all">
                <div className="absolute -top-5 bg-gradient-to-r from-amber-400 to-yellow-500 p-2 rounded-full text-black shadow-xl">
                  <Trophy size={20} />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl mb-2 shadow-md mt-2">
                  {filteredUsers[0].avatar}
                </div>
                <h3 className="font-extrabold text-white text-lg">
                  {filteredUsers[0].name}
                </h3>
                <p className="text-sm text-indigo-400 font-bold">
                  {filteredUsers[0].points} pts
                </p>
                <div className="absolute top-4 left-4 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-xs text-indigo-400 font-bold">
                  #1
                </div>
              </div>
            )}

            {/* #3 Place */}
            {filteredUsers[2] && (
              <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-[2rem] text-center order-3 sm:h-[160px] flex flex-col justify-center items-center relative group hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-lg mb-2 border border-zinc-700">
                  {filteredUsers[2].avatar}
                </div>
                <h3 className="font-bold text-zinc-300">
                  {filteredUsers[2].name}
                </h3>
                <p className="text-xs text-zinc-500">
                  {filteredUsers[2].points} pts
                </p>
                <div className="absolute top-4 left-4 bg-zinc-800 px-2 py-0.5 rounded-md text-xs text-zinc-500 font-bold">
                  #3
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard List / Table */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-zinc-800 text-xs font-black uppercase tracking-wider text-zinc-500">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-5">User</div>
            <div className="col-span-4 sm:col-span-2 text-center">Solved</div>
            <div className="hidden sm:block sm:col-span-2 text-center">
              Streak
            </div>
            <div className="col-span-1 text-center hidden sm:block">Trend</div>
            <div className="col-span-4 sm:col-span-1 text-right">Points</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.name)}
                  className="grid grid-cols-12 gap-2 px-6 py-5 items-center hover:bg-zinc-800/20 transition-all cursor-pointer group"
                >
                  {/* Automated Rank calculation via Map Index */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    {renderRankBadge(index + 1)}
                  </div>

                  {/* Profile Details */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold group-hover:border-indigo-500/50 transition-colors">
                      {user.avatar}
                    </div>
                    <span className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                      {user.name}
                    </span>
                  </div>

                  {/* Solved Problems */}
                  <div className="col-span-4 sm:col-span-2 text-center text-sm text-zinc-400 font-medium">
                    {user.problemsSolved}
                  </div>

                  {/* Streak */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 text-sm text-amber-500 font-bold">
                    <Flame size={16} fill="currentColor" />
                    {user.streak}d
                  </div>

                  {/* Trend */}
                  <div className="col-span-1 flex justify-center hidden sm:flex">
                    {renderStatus(user.status)}
                  </div>

                  {/* Points */}
                  <div className="col-span-4 sm:col-span-1 text-right text-sm font-black text-zinc-100">
                    {user.points}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm">
                No active helpers found in leaderboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
