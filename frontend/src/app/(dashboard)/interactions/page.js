"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  Info,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import axios from "axios";
import { socket } from "@/app/lib/socket.js";
import { useUsersFetch } from "@/app/context/UsersContext";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CompleteChatAppPage() {
  const { users = [], isLoading: usersLoading } = useUsersFetch();
  const [activeChatId, setActiveChatId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/getUser`, {
          withCredentials: true,
        });

        if (isMounted) {
          setCurrentUserId(response.data.user._id);
        }
      } catch (error) {
        console.error("Current user fetch failed:", error.message);
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      socket.emit("login-user", currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    const handleMessage = (data) => {
      if (!data?.senderId || !data?.content) return;

      const incomingMessage = {
        id: data._id || `${data.senderId}-${Date.now()}`,
        text: data.content,
        type: "received",
        createdAt: data.createdAt || new Date().toISOString(),
      };

      setMessages((previous) => ({
        ...previous,
        [data.senderId]: [
          ...(previous[data.senderId] || []),
          incomingMessage,
        ],
      }));
    };

    socket.on("chat-message", handleMessage);
    return () => socket.off("chat-message", handleMessage);
  }, []);

  useEffect(() => {
    if (users.length > 0 && !activeChatId) {
      setActiveChatId(users[0]._id);
    }
  }, [users, activeChatId]);

  useEffect(() => {
    if (!activeChatId || !currentUserId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      setMessagesLoading(true);

      try {
        const response = await axios.get(`${API_URL}/message/${activeChatId}`, {
          withCredentials: true,
        });

        const fetchedMessages = (response.data.messages || []).map((message) => ({
          id: message._id,
          text: message.content,
          type:
            String(message.senderId) === String(currentUserId)
              ? "sent"
              : "received",
          createdAt: message.createdAt,
        }));

        if (isMounted) {
          setMessages((previous) => ({
            ...previous,
            [activeChatId]: fetchedMessages,
          }));
        }
      } catch (error) {
        console.error("Messages fetch failed:", error.message);
      } finally {
        if (isMounted) {
          setMessagesLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [activeChatId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  const activeUser = users.find((user) => user._id === activeChatId);
  const activeMessages = messages[activeChatId] || [];
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendMessage = (event, receiverId) => {
    event.preventDefault();

    const content = inputText.trim();
    if (!content || !currentUserId) return;

    socket.emit("chat-message", {
      senderId: currentUserId,
      receiverId,
      content,
    });

    setMessages((previous) => ({
      ...previous,
      [receiverId]: [
        ...(previous[receiverId] || []),
        {
          id: `local-${Date.now()}`,
          text: content,
          type: "sent",
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setInputText("");
  };

  if (usersLoading) {
    return <PageLoader label="Loading conversations" />;
  }

  return (
    <main className="min-h-screen bg-[#050507] p-3 text-zinc-100 selection:bg-indigo-500/30 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0a0e] shadow-2xl shadow-black/40 md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex min-h-[300px] flex-col border-b border-white/[0.08] bg-[#0d0d12] md:min-h-0 md:border-b-0 md:border-r">
          <div className="border-b border-white/[0.08] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-600/20">
                    <MessageSquare size={17} />
                  </div>
                  <h1 className="text-lg font-bold tracking-tight">Messages</h1>
                </div>
                <p className="text-xs leading-5 text-zinc-500">
                  Stay connected with your help community.
                </p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                {users.length} contacts
              </span>
            </div>

            <div className="relative mt-5">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                size={15}
              />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-2.5 pl-10 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
            {filteredUsers.map((user) => {
              const isSelected = activeChatId === user._id;
              const lastMessage = messages[user._id]?.at(-1);

              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => setActiveChatId(user._id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-indigo-500/30 bg-indigo-500/[0.12] shadow-lg shadow-indigo-950/20"
                      : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-sm font-bold text-zinc-200 ring-1 ring-white/10">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0d0d12] bg-emerald-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-xs font-semibold ${
                          isSelected ? "text-indigo-300" : "text-zinc-200"
                        }`}
                      >
                        {user.name}
                      </span>
                      {lastMessage && !isSelected ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-[11px] text-zinc-500">
                      {lastMessage
                        ? `${lastMessage.type === "sent" ? "You: " : ""}${lastMessage.text}`
                        : user.email}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredUsers.length === 0 ? (
              <p className="px-3 py-8 text-center text-xs text-zinc-600">
                No contacts found
              </p>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.12),_transparent_35%),#08080b]">
          {activeUser ? (
            <>
              <header className="flex items-center justify-between border-b border-white/[0.08] bg-black/10 px-5 py-4 backdrop-blur-xl sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold shadow-lg shadow-indigo-900/30">
                    {activeUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-zinc-100">
                      {activeUser.name}
                    </h2>
                    <p className="mt-1 truncate text-[11px] text-emerald-400">
                      Active now
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-zinc-500">
                  <button type="button" className="chat-action-button" aria-label="Start call">
                    <Phone size={16} />
                  </button>
                  <button type="button" className="chat-action-button" aria-label="Start video call">
                    <Video size={16} />
                  </button>
                  <button type="button" className="chat-action-button" aria-label="More options">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </header>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-8">
                {messagesLoading ? (
                  <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 text-zinc-500">
                    <Loader2 size={26} className="animate-spin text-indigo-400" />
                    <span className="text-xs font-medium">Fetching messages...</span>
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                      <MessageSquare size={25} />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-300">
                      Start a new conversation
                    </h3>
                    <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-600">
                      Send a message to {activeUser.name} and start helping each other.
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto flex max-w-3xl flex-col gap-3">
                    <p className="pb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      Conversation
                    </p>
                    {activeMessages.map((message) => {
                      const isSent = message.type === "sent";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[82%] sm:max-w-[68%] ${isSent ? "items-end" : "items-start"} flex flex-col`}>
                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${
                                isSent
                                  ? "rounded-br-md bg-indigo-600 text-white shadow-indigo-950/20"
                                  : "rounded-bl-md border border-white/[0.08] bg-white/[0.06] text-zinc-200"
                              }`}
                            >
                              {message.text}
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-zinc-600">
                              {formatTime(message.createdAt)}
                              {isSent ? <CheckCheck size={13} className="text-indigo-400" /> : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              <form
                onSubmit={(event) => handleSendMessage(event, activeUser._id)}
                className="border-t border-white/[0.08] bg-black/10 p-4 sm:px-7 sm:py-5"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-2 transition focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10">
                  <button type="button" className="chat-input-action" aria-label="Attach file">
                    <Paperclip size={17} />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    placeholder={`Write a message to ${activeUser.name}...`}
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                  />
                  <button type="button" className="chat-input-action hidden sm:block" aria-label="Add emoji">
                    <Smile size={17} />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="mt-2 hidden items-center gap-1 text-[10px] text-zinc-600 sm:flex">
                  <Info size={12} /> Messages are saved securely to your conversation.
                </p>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.04] text-zinc-500">
                <MessageSquare size={26} />
              </div>
              <h2 className="text-sm font-semibold text-zinc-300">Choose a conversation</h2>
              <p className="mt-2 text-xs text-zinc-600">
                Select someone from your contacts to view messages.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PageLoader({ label }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] text-zinc-400">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </span>
      </div>
    </main>
  );
}

function formatTime(value) {
  if (!value) return "Now";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
