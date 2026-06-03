"use client"
import React, { useState } from 'react';
import { 
  Send, 
  Tag, 
  AlertCircle, 
  Sparkles, 
  Type, 
  AlignLeft,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

const CreateRequest = () => {
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState('Medium');

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Send size={24} className="text-indigo-500" />
            </div>
            Ask for Help
          </h1>
          <p className="text-zinc-500 mt-2">Describe what you're stuck on. The community is here to support you.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Form Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-8">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Type size={16} /> Request Title
              </label>
              <input 
                type="text" 
                placeholder="e.g., Help needed with React Context API"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all text-lg"
              />
              {title.length > 0 && title.length < 10 && (
                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <AlertCircle size={12} /> A bit too short. Be more descriptive!
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <AlignLeft size={16} /> Description
              </label>
              <textarea 
                rows="5"
                placeholder="Describe your problem in detail. What have you tried so far?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category/Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Tag size={16} /> Category / Tags
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Add tags (React, CSS...)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded italic">AI Suggesting...</span>
                  </div>
                </div>
              </div>

              {/* Urgency Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <AlertCircle size={16} /> Urgency Level
                </label>
                <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgency(level)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        urgency === level 
                        ? 'bg-zinc-800 text-white shadow-lg' 
                        : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Enhancement Section (Bonus AI Feature) */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Sparkles size={20} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-indigo-300 flex items-center justify-between">
                  AI Smart Suggestions
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Click a suggestion to automatically improve your request.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 px-3 rounded-full border border-zinc-700 flex items-center gap-1 transition-colors">
                    <Lightbulb size={12} className="text-yellow-500" /> "Make title more specific"
                  </button>
                  <button className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 px-3 rounded-full border border-zinc-700 flex items-center gap-1 transition-colors">
                    <CheckCircle2 size={12} className="text-green-500" /> "Add environment details"
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
                Save as Draft
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95">
                Post Request <Send size={18} />
              </button>
            </div>

          </div>

          {/* Guidelines Sidebar (Optional helper) */}
          <div className="text-center p-6 border border-dashed border-zinc-800 rounded-2xl">
             <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-2">Pro Tip</p>
             <p className="text-sm text-zinc-400 italic">"Good requests include code snippets and expected vs actual outcomes."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;