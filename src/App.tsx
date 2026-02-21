import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Users, Settings, ListFilter, Sparkles } from 'lucide-react';
import { ListInput } from './components/ListInput';
import { LuckyDraw } from './components/LuckyDraw';
import { AutoGrouping } from './components/AutoGrouping';
import { Person, ToolMode } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [participants, setParticipants] = useState<Person[]>([]);
  const [mode, setMode] = useState<ToolMode>('draw');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Sparkles size={18} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">HR Smart Tools</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('draw')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                mode === 'draw' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Gift size={16} />
              獎品抽籤
            </button>
            <button
              onClick={() => setMode('group')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                mode === 'group' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Users size={16} />
              自動分組
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 1: List Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
            <ListFilter size={12} />
            名單管理
          </div>
          <ListInput onListUpdate={setParticipants} currentList={participants} />
        </section>

        {/* Section 2: Tool Content */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
            <Settings size={12} />
            功能操作
          </div>
          
          {participants.length === 0 ? (
            <div className="glass-card p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto">
                <Users size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-700">尚未匯入名單</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  請先在上方貼上姓名或上傳 CSV 檔案，即可開始使用抽籤或分組功能。
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {mode === 'draw' ? (
                  <LuckyDraw participants={participants} />
                ) : (
                  <AutoGrouping participants={participants} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 text-center text-[10px] text-slate-400 font-medium tracking-widest uppercase">
        HR Smart Tools © 2026 • Crafted for Professionals
      </footer>
    </div>
  );
}
