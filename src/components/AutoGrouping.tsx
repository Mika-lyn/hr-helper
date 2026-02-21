import React, { useState } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { Person, Group } from '../types';
import { cn } from '../lib/utils';

interface AutoGroupingProps {
  participants: Person[];
}

export const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (participants.length === 0) return;

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      const groupMembers = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${newGroups.length + 1} 組`,
        members: groupMembers
      });
    }

    setGroups(newGroups);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const csvData = groups.flatMap(group => 
      group.members.map(member => ({
        '組別': group.name,
        '姓名': member.name
      }))
    );

    const csv = Papa.unparse(csvData);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">每組人數</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="font-mono font-bold text-indigo-600 w-8">{groupSize}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />
          <div className="text-sm text-slate-500">
            預計分為 <span className="font-bold text-slate-700">{Math.ceil(participants.length / groupSize)}</span> 組
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={generateGroups}
            disabled={participants.length === 0}
            className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Shuffle size={18} />
            開始自動分組
          </button>
          
          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              下載結果
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={group.id}
              className="glass-card overflow-hidden flex flex-col"
            >
              <div className="bg-slate-50 p-4 border-bottom border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-700">{group.name}</h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4 flex-1 space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {member.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
            <LayoutGrid size={32} />
          </div>
          <div className="text-slate-400 font-medium">點擊按鈕開始分組</div>
        </div>
      )}
    </div>
  );
};
