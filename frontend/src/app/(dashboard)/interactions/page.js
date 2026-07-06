"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Send,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  MessageSquare,
} from "lucide-react";
import { socket } from "@/app/lib/socket.js";
import axios from "axios";
import { useUsersFetch } from "@/app/context/UsersContext";

export default function CompleteChatAppPage() {
  const { users, loading: isLoading } = useUsersFetch();
  const [activeChatId, setActiveChatId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter users based on search
  const filteredUsers = users?.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={32} />
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Syncing Messages...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-2 sm:p-4 md:p-6 flex justify-center items-center font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-6xl h-[85vh] grid grid-cols-1 md:grid-cols-3 bg-zinc-900/20 border border-zinc-800/80 rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* LEFT: USERS SIDEBAR */}
        <div className="border-r border-zinc-800/60 bg-zinc-950/40 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wide text-zinc-200">
                Messages
              </h3>
              <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                {users?.length || 0} online
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={15}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-600 text-zinc-200"
              />
            </div>
          </div>

          {/* Users Navigation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredUsers?.map((user) => {
              const isSelected = activeChatId === user._id;
              const userMessages = messages[user._id] || [];
              const lastMsg = userMessages.at(-1);

              return (
                <div
                  key={user._id}
                  onClick={() => setActiveChatId(user._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-600/10 border border-indigo-500/30 text-zinc-100"
                      : "bg-transparent border border-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {/* User Initial Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-colors ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090b]" />
                  </div>

                  {/* Meta Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold truncate ${isSelected ? "text-indigo-400" : "text-zinc-200"}`}
                      >
                        {user.name}
                      </span>
                      {lastMsg && !isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 animation-pulse" />
                      )}
                    </div>

                    {/* Last message preview */}
                    <p className="text-[11px] text-zinc-500 truncate font-medium">
                      {lastMsg
                        ? `${lastMsg.type === "sent" ? "You: " : ""}${lastMsg.text}`
                        : user.email}
                    </p>
                  </div>
                </div>
              );
            })}

            {filteredUsers?.length === 0 && (
              <p className="text-center text-xs text-zinc-600 mt-4">
                No users found
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: CHAT CONTROLLER */}
        <div className="md:col-span-2 flex flex-col bg-zinc-950/10 h-full">
          {activeUser ? (
            <>
              {/* Active Chat Header */}
              <div className="p-4 bg-zinc-950/40 border-b border-zinc-800/60 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/10 shrink-0">
                    {activeUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-xs text-zinc-200 tracking-wide">
                      {activeUser.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[180px] sm:max-w-none">
                      {activeUser.email}
                    </span>
                  </div>
                </div>

                {/* Header Mock Actions */}
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <button className="p-2 hover:bg-zinc-900 rounded-lg hover:text-zinc-200 transition-colors">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 hover:bg-zinc-900 rounded-lg hover:text-zinc-200 transition-colors">
                    <Video size={16} />
                  </button>
                  <button className="p-2 hover:bg-zinc-900 rounded-lg hover:text-zinc-200 transition-colors">
                    <Info size={16} />
                  </button>
                </div>
              </div>

              {/* Dynamic Messages Box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-transparent to-zinc-950/10">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">
                      <MessageSquare size={20} />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 mt-1">
                      Say hi to begin your conversation!
                    </span>
                  </div>
                ) : (
                  activeMessages.map((msg, idx) => {
                    const isSent = msg.type === "sent";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 text-xs shadow-md font-medium leading-relaxed tracking-wide ${
                            isSent
                              ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Dynamic Input Panel */}
              <form
                onSubmit={(e) => handleSendMessage(e, activeUser._id)}
                className="p-4 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center gap-2"
              >
                <div className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3 py-2 flex items-center gap-2 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    <Paperclip size={16} />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Type a message for ${activeUser.name}...`}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-600"
                  />

                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-400 transition-colors hidden sm:block"
                  >
                    <Smile size={16} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed text-white w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/10 active:scale-95 shrink-0"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2">
              <MessageSquare
                size={32}
                className="text-zinc-700 animate-pulse"
              />
              <span className="text-xs font-medium text-zinc-500">
                Select a contact from the list to view chat
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
