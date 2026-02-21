import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, UserCheck } from 'lucide-react';
import { Person } from '../types';
import { cn } from '../lib/utils';

interface LuckyDrawProps {
  participants: Person[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [history, setHistory] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableParticipants, setAvailableParticipants] = useState<Person[]>(participants);

  useEffect(() => {
    setAvailableParticipants(participants);
    setWinner(null);
    setHistory([]);
  }, [participants]);

  const startDraw = () => {
    if (availableParticipants.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);

    let count = 0;
    const totalSteps = 30;
    const interval = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * availableParticipants.length));
      count++;
      
      if (count >= totalSteps) {
        clearInterval(interval);
        const finalWinnerIndex = Math.floor(Math.random() * availableParticipants.length);
        const finalWinner = availableParticipants[finalWinnerIndex];
        
        setWinner(finalWinner);
        setHistory(prev => [finalWinner, ...prev]);
        setIsDrawing(false);
        
        if (!allowDuplicates) {
          setAvailableParticipants(prev => prev.filter(p => p.id !== finalWinner.id));
        }

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
    }, 80);
  };

  const resetDraw = () => {
    setAvailableParticipants(participants);
    setWinner(null);
    setHistory([]);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center space-y-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">獎品抽籤</h2>
          <p className="text-slate-500 text-sm">
            剩餘人數: <span className="font-mono font-bold text-indigo-600">{availableParticipants.length}</span>
          </p>
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="text-4xl font-black text-indigo-600 font-mono tracking-widest"
                >
                  {availableParticipants[currentIndex]?.name}
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ scale: 0.5, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-100">
                    <Trophy size={40} />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">中獎者</div>
                  <div className="text-5xl font-black text-slate-800">{winner.name}</div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-300 flex flex-col items-center gap-4"
                >
                  <UserCheck size={64} strokeWidth={1} />
                  <p className="text-sm font-medium">準備就緒</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
              />
              <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-sm text-slate-600 font-medium group-hover:text-indigo-600 transition-colors">允許重複抽取</span>
          </label>

          <button
            onClick={startDraw}
            disabled={isDrawing || availableParticipants.length === 0}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDrawing ? '抽籤中...' : '開始抽籤'}
          </button>

          <button
            onClick={resetDraw}
            className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
            title="重置"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            中獎紀錄
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {history.map((p, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={`${p.id}-${i}`}
                className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">第 {history.length - i} 位</div>
                <div className="font-semibold text-slate-700">{p.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
