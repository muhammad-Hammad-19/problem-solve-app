"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useUserFetch } from "@/app/context/UserContext";
import { socket } from "@/app/lib/socket.js";
import axios from "axios";

export default function CompleteChatAppPage() {
  const { users, loading: isLoading } = useUserFetch();
  const [activeChatId, setActiveChatId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState({});
  const bottomRef = useRef(null);

  // Current user fetch
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("http://localhost:5000/user/getUser", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.user._id);
    };
    getUser();
  }, []);

  // Socket login
  useEffect(() => {
    if (!currentUserId) return;
    socket.emit("login-user", currentUserId);
  }, [currentUserId]);

  // Aane wala message state mein save karo
  useEffect(() => {
    const handleMessage = (data) => {
      const { senderId, inputData } = data;
      setMessages((prev) => {
        const prevChat = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [...prevChat, { text: inputData, type: "received" }],
        };
      });
    };

    socket.on("chat-message", handleMessage);
    return () => socket.off("chat-message", handleMessage);
  }, []);

  // Default pehla user active karo
  useEffect(() => {
    if (users && users.length > 0 && !activeChatId) {
      setActiveChatId(users[0]._id);
    }
  }, [users, activeChatId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  const activeUser = users?.find((user) => user._id === activeChatId);
  const activeMessages = messages[activeChatId] || [];

  // Message send karo
  const handleSendMessage = (e, id) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const data = {
      senderId: currentUserId,
      inputData: inputText,
      recevierId: id,
    };

    socket.emit("chat-message", data);

    // Sent message bhi state mein save karo
    setMessages((prev) => {
      const prevChat = prev[id] || [];
      return {
        ...prev,
        [id]: [...prevChat, { text: inputText, type: "sent" }],
      };
    });

    setInputText("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin text-indigo-500 mr-2" size={24} />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-5xl h-[80vh] grid grid-cols-1 md:grid-cols-3 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT: USERS LIST */}
        <div className="border-r border-zinc-800 bg-zinc-950/40 flex flex-col h-full">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-sm font-black tracking-wider uppercase text-zinc-400">
              Active Users
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {users?.map((user) => {
              const isSelected = activeChatId === user._id;
              const userMessages = messages[user._id] || [];
              const lastMsg = userMessages.at(-1);

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
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{user.name}</span>
                    {/* Unread dot — agar messages hain aur ye active nahi */}
                    {lastMsg && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate">
                    {user.email}
                  </span>
                  {/* Last message preview */}
                  {lastMsg && (
                    <span className="text-[10px] text-zinc-600 truncate mt-0.5">
                      {lastMsg.type === "sent" ? "You: " : ""}
                      {lastMsg.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: CHAT VIEW */}
        <div className="md:col-span-2 flex flex-col bg-zinc-950/20 h-full">
          {activeUser ? (
            <>
              {/* Header */}
              <div className="p-4 bg-zinc-900/40 border-b border-zinc-800 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                  {activeUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-sm text-zinc-200">
                    {activeUser.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {activeUser._id}
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
                    <span className="text-2xl">💬</span>
                    <span className="text-xs italic">
                      Koi message nahi — kuch bhejo!
                    </span>
                  </div>
                ) : (
                  activeMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.type === "sent" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-xs break-words leading-relaxed ${
                          msg.type === "sent"
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))
                )}
                {/* Auto scroll anchor */}
                <div ref={bottomRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => handleSendMessage(e, activeUser._id)}
                className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`${activeUser.name} ko message karo...`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-5 py-2 rounded-xl transition-all"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs">
              Kisi user ko select karo chat karne ke liye.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
