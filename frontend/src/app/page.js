"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  MessageSquare,
  Search,
} from "lucide-react";

import { motion } from "framer-motion";
import { useCurrentUser } from "./context/CurrentUserContext";
const LandingPage = () => {
  const { currentUser: user } = useCurrentUser();
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Helplytics{" "}
              <span className="text-indigo-600 font-extrabold">AI</span>
            </span>
          </div>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-all shadow-md active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-500 shadow-sm mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Solving community hurdles with AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[0.95]"
          >
            Empowering <br />
            <span className="text-indigo-600 italic">Community</span> Solvers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 leading-relaxed"
          >
            The first AI-driven support platform designed to connect problem
            solvers with those seeking help. Fast, intelligent, and
            community-first.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Conditional Logic for Main Button */}
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {user ? "Go to Dashboard" : "Create Request"}{" "}
              <ArrowRight size={18} />
            </Link>

            {/* Conditional Logic for Secondary Button */}
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all text-center"
            >
              {user ? "Explore Requests" : "Explore Skills"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- Live Preview Card --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] border border-slate-200 p-4 shadow-2xl"
        >
          <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                <div className="h-3 w-3 rounded-full bg-slate-200"></div>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-2">
                <Search size={14} className="text-slate-400" /> Search AI
                Feed...
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                  <div>
                    <h4 className="text-sm font-bold">Ahmed Khan</h4>
                    <p className="text-[10px] text-slate-400">
                      2 mins ago • Urgent
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium mb-4">
                  Struggling with Redux Toolkit middleware. Can anyone help?
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                    React
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full">
                    AI Suggested Tag
                  </span>
                </div>
              </div>

              <div className="bg-indigo-600 p-8 rounded-3xl text-white">
                <BarChart3 className="mb-4 opacity-70" />
                <h3 className="text-xl font-bold mb-2">AI Match Insight</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Based on current requests, "JavaScript Performance" is the
                  most trending topic this week. Top helpers in this category
                  get 2x Trust Score.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- Features Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Trust Score System
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every interaction is verified. Build your profile with badges and
              a dynamic trust score that reflects your community contribution.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Real-time Messaging
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Seamlessly communicate with helpers within the platform. Share
              code snippets and solve problems through our integrated chat.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Leaderboard Ranking
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Stay motivated! Compete with the best helpers in the community and
              earn a spot on our global leaderboard with exclusive rewards.
            </p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[3px]">
          © 2026 HELPHYTICS AI • ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
