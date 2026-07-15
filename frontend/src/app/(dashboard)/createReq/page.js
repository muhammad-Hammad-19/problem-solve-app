"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Send,
  Tag,
  AlertCircle,
  Sparkles,
  Type,
  AlignLeft,
  Bot,
  Zap,
  Activity,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateRequest = () => {
  const router = useRouter();
  const [urgency, setUrgency] = useState("Medium");
  const [clickAi, setClickAi] = useState(false);
  const { register, handleSubmit, watch, getValues, setValue, reset } = useForm(
    {
      defaultValues: {
        title: "",
        description: "",
        tags: "Development", // Default enum value
        skills: "", // NAYA: Skills add kiya
      },
    }
  );

  const formValues = watch();

  const onSubmit = async (data) => {
    try {
    const res = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_URL}/feed/create`,
  {
    ...data,
    urgency,
  },
  {
    withCredentials: true,
  }
);
      const dataSucess = res.data.success;

      if (dataSucess === true) {
        // Success Toast trigger karna
        toast.success("Post created successfully! 🎉", {
          theme: "dark", // Dark mode UI ke hisaab se
          position: "bottom-right",
        });
        reset();
        
        // Toast dikhane ke baad redirect karna
        setTimeout(() => {
          router.push("/exploreFeed");
        }, 2000);
      }
    } catch (err) {
      console.log(err.message);
      // Error Toast add karna
      toast.error("Failed to create post. Please try again.", {
        theme: "dark",
        position: "bottom-right",
      });
    }
  };

  const handleAiRes = async () => {
    const { title, description, tags } = getValues();
    setClickAi(true);
    try {
     const res = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_URL}/feed/ai`,
  {
    title,
    description,
    tags,
  },
  {
    withCredentials: true,
  }
);
      const data = res.data;
      const { improvedTitle, tags: aiTags, descriptionSuggestion } = data;
      if (improvedTitle || tags || description || data) {
        setClickAi(false);
      }
      setValue("description", descriptionSuggestion);
      setValue("title", improvedTitle);
      setValue("tags", aiTags);
      toast.info("AI suggestions applied!", { theme: "dark", position: "bottom-right" });
    } catch (error) {
      console.error(error.message);
      setClickAi(false);
      toast.error("AI Assistant failed to respond.", { theme: "dark", position: "bottom-right" });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] text-zinc-100 p-4 md:p-12 font-sans antialiased">
      {/* ToastContainer component zaroori hai alerts show karne ke liye */}
      <ToastContainer />
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-500 flex items-center gap-3">
              Ask the Community
            </h1>
            <p className="text-zinc-500 mt-2 text-sm md:text-base">
              Submit your request and let our network handle the rest.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/80 px-4 py-2 rounded-full text-xs text-zinc-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: Optimal
          </div>
        </div>

        {/* 3-Column Modern Grid (1 Column for AI Assistant, 2 Columns for Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 1. LEFT SIDEBAR: Ultra-Modern AI Assistant UI */}
          <div className="lg:col-span-1 bg-zinc-900/20 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />

            {/* AI Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl shadow-inner">
                  <Bot size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-200 text-sm tracking-wide">
                    Smart Assistant
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    LIVE_GUIDANCE_MODE
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold tracking-wider uppercase">
                Active
              </span>
            </div>

            {/* Live Typing Dynamic Display */}
            <div className="space-y-4">
              {/* Live Title Module */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                  <span>Form Scan: Title</span>
                  <Activity
                    size={12}
                    className={
                      formValues.title ? "text-indigo-400 animate-pulse" : ""
                    }
                  />
                </div>
                <div className="p-3 bg-zinc-950/80 border border-zinc-800/60 rounded-xl min-h-[54px] flex flex-col justify-center transition-all duration-300">
                  {formValues.title ? (
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed break-all">
                      {formValues.title}
                    </p>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      Awaiting title input to run real-time analysis...
                    </span>
                  )}
                </div>
              </div>

              {/* Live Description Module */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                  <span>Context Completeness</span>
                  <Zap
                    size={12}
                    className={formValues.description ? "text-amber-400" : ""}
                  />
                </div>
                <div className="p-3 bg-zinc-950/80 border border-zinc-800/60 rounded-xl min-h-[80px] max-h-[140px] overflow-y-auto transition-all duration-300">
                  {formValues.description ? (
                    <p className="text-xs font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {formValues.description}
                    </p>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      Type problem details to render live structured guidance.
                    </span>
                  )}
                </div>
              </div>

              {/* Modern Checklist */}
              <div className="pt-2">
                <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-2.5">
                  Requirements Progress
                </div>
                <div className="space-y-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Title optimization</span>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${formValues.title?.length >= 10 ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" : "bg-zinc-800"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Context & reproduction steps
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${formValues.description?.length >= 25 ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" : "bg-zinc-800"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Category Tag Assignment
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${formValues.tags ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" : "bg-zinc-800"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-600">
              <span>METRIC_STREAM_CONNECTED</span>
              <span>v1.0.4</span>
            </div>
          </div>

          {/* 2. RIGHT / CENTER: Main Input Form (Occupies 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-zinc-900/20 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
            >
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} className="text-zinc-500" /> Request Title
                </label>
                <input
                  type="text"
                  placeholder="What are you trying to build or solve?"
                  {...register("title")}
                  className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 px-4 focus:outline-none transition-all duration-200 text-zinc-100 placeholder-zinc-600 text-base shadow-inner focus:ring-1 focus:ring-indigo-500/20"
                />
                {formValues.title?.length > 0 &&
                  formValues.title.length < 10 && (
                    <p className="text-xs text-amber-500 flex items-center gap-1.5 font-medium mt-1">
                      <ShieldAlert size={13} /> Highly descriptive titles
                      receive up to 80% more engagement.
                    </p>
                  )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <AlignLeft size={14} className="text-zinc-500" /> Full
                  Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide context, attach code blocks, or list error messages..."
                  {...register("description")}
                  className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 px-4 focus:outline-none transition-all duration-200 text-zinc-100 placeholder-zinc-600 text-sm resize-none shadow-inner focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>

              {/* Tags & Urgency Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category/Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={14} className="text-zinc-500" /> Metadata Tags
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="React, Next.js, Tailwind..."
                      {...register("tags")}
                      className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 px-4 focus:outline-none transition-all duration-200 text-sm placeholder-zinc-600 text-zinc-100 focus:ring-1 focus:ring-indigo-500/20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        AI Enabled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Urgency Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={14} className="text-zinc-500" /> Priority
                    Level
                  </label>
                  <div className="flex p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-xl backdrop-blur-md">
                    {["Low", "Medium", "High"].map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setUrgency(level)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                          urgency === level
                            ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-md"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions Panel */}
              <div className="bg-gradient-to-r from-indigo-500/[0.03] to-purple-500/[0.03] border border-indigo-500/10 rounded-xl p-4 flex items-start gap-4">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shrink-0">
                  <Sparkles size={16} className="text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 tracking-wide uppercase flex items-center gap-2">
                    AI Assist Tools
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Use these macros to instant-format your text block layouts.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={handleAiRes}
                      type="button"
                      disabled={clickAi}
                      className="text-[10px] font-medium bg-zinc-900 hover:bg-blue-800/80 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-400 hover:text-zinc-200 py-1 px-2.5 rounded-md border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      {clickAi ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-500 border-t-blue-500"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        "Ai Suggestions"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="pt-6 border-t border-zinc-900 flex items-center justify-between">
                <button
                  type="button"
                  className="text-zinc-500 text-xs font-medium hover:text-zinc-300 transition-colors tracking-wide uppercase"
                >
                  Save Progress
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-lg shadow-indigo-600/10 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Publish Post <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;