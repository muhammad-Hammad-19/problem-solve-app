"use client";
import React, { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";
import { useUserFetch } from "@/app/context/UserContext";
export default function CompleteChatAppPage() {
  const { users, loading: isLoading } = useUserFetch();
  const [activeChatId, setActiveChatId] = useState("");

  // Pehle user ko automatically select karne ke liye
  console.log(users);
  
  useEffect(() => {
    if (users && users.length > 0 && !activeChatId) {
      setActiveChatId(users[0]._id);
    }
  }, [users, activeChatId]);

  // Dummy Conversations Store mapped with MongoDB IDs
  const dummyConversations = {
    "6a036f21d1bfc5f2cda8f361": [
      {
        id: 1,
        sender: "Sarah Connor",
        text: "Hey! Did you check the latest design updates?",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Yes, looks solid. Working on the layout now.",
        isMe: true,
      },
    ],
    "6a036f21d1bfc5f2cda8f362": [
      {
        id: 1,
        sender: "David Kim",
        text: "Docker image is built and tested.",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Awesome, push it to staging.",
        isMe: true,
      },
    ],
    "6a036f21d1bfc5f2cda8f363": [
      {
        id: 1,
        sender: "Amara Oak",
        text: "Database migration scripts are ready.",
        isMe: false,
      },
    ],
    // Naya dummy user data object compatibility matching ke liye
    "6a3017fb40424f1fd8c5a526": [
      {
        id: 1,
        sender: "Usman",
        text: "Assalam-o-Alaikum! Chat app ka context successfully link ho gaya hai.",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Walaikum Assalam! Haan, bilkul clean data fetch ho raha hai.",
        isMe: true,
      },
    ],
  };

  const activeUser =
    users?.find((user) => user._id === activeChatId) || users?.[0];
  const activeMessages = dummyConversations[activeChatId] || [
    {
      id: 1,
      sender: "System",
      text: "No previous logs found. Start a fresh connection stream.",
      isMe: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin text-indigo-500 mr-2" size={24} />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Loading Active Streams...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-5xl h-[80vh] grid grid-cols-1 md:grid-cols-3 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT SIDEBAR: USERS LIST */}
        <div className="border-r border-zinc-800 bg-zinc-950/40 flex flex-col h-full">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-sm font-black tracking-wider uppercase text-zinc-400">
              Active Users
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {users?.map((user) => {
              const isSelected = activeChatId === user._id;
              return (
                <div
                  key={user._id}
                  onClick={() => setActiveChatId(user._id)}
                  className={`flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400"
                      : "bg-transparent border-transparent hover:bg-zinc-800/30 text-zinc-300"
                  }`}
                >
                  <span className="text-xs font-bold">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 truncate">
                    {user.email}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: CHAT VIEW */}
        <div className="md:col-span-2 flex flex-col bg-zinc-950/20 h-full">
          {activeUser ? (
            <>
              {/* Active User Header */}
              <div className="p-4 bg-zinc-900/40 border-b border-zinc-800 flex flex-col">
                <h4 className="font-bold text-sm text-zinc-200">
                  {activeUser.name}
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {activeUser._id}
                </span>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                        msg.isMe
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
                      }`}
                    >
                      <p className="font-semibold text-[10px] opacity-60 mb-0.5">
                        {msg.sender}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs">
              Select a pipeline node to view decrypted logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
