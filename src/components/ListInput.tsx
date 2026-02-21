import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, ClipboardList, X, UserPlus, FileText, Trash2, AlertCircle } from 'lucide-react';
import { Person } from '../types';
import { cn } from '../lib/utils';

interface ListInputProps {
  onListUpdate: (list: Person[]) => void;
  currentList: Person[];
}

export const ListInput: React.FC<ListInputProps> = ({ onListUpdate, currentList }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = () => {
    const names = inputText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newPeople: Person[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onListUpdate([...currentList, ...newPeople]);
    setInputText('');
  };

  const loadMockData = () => {
    const mockNames = [
      '陳大文', '林小明', '張華強', '李美玲', '王小芬', 
      '趙子龍', '孫悟空', '周杰倫', '蔡依林', '劉德華',
      '林志玲', '郭台銘', '馬雲', '張忠謀', '黃仁勳'
    ];
    const newPeople: Person[] = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onListUpdate([...currentList, ...newPeople]);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = currentList.filter(person => {
      if (seen.has(person.name)) {
        return false;
      }
      seen.add(person.name);
      return true;
    });
    onListUpdate(uniqueList);
  };

  const duplicateNames = currentList
    .map(p => p.name)
    .filter((name, index, array) => array.indexOf(name) !== index);
  
  const hasDuplicates = duplicateNames.length > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter(n => n.length > 0);
        
        const newPeople: Person[] = names.map(name => ({
          id: Math.random().toString(36).substr(2, 9),
          name
        }));
        
        onListUpdate([...currentList, ...newPeople]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const removePerson = (id: string) => {
    onListUpdate(currentList.filter(p => p.id !== id));
  };

  const clearAll = () => {
    onListUpdate([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <ClipboardList size={20} />
            <h3>貼上姓名名單</h3>
          </div>
          <textarea
            className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="每行一個姓名，或用逗號分隔..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleTextSubmit}
              disabled={!inputText.trim()}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              加入名單
            </button>
            <button
              onClick={loadMockData}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              title="載入模擬名單"
            >
              <FileText size={18} />
              模擬名單
            </button>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center items-center border-dashed border-2 border-slate-300 bg-slate-50/50">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700">上傳 CSV 檔案</h3>
              <p className="text-xs text-slate-500 mt-1">支援 .csv 格式，系統將自動提取姓名</p>
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-colors"
            >
              選擇檔案
            </button>
          </div>
        </div>
      </div>

      {currentList.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              目前名單 ({currentList.length} 人)
              {hasDuplicates && (
                <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                  <AlertCircle size={10} />
                  發現重複姓名
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {hasDuplicates && (
                <button
                  onClick={removeDuplicates}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  移除重複
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5"
              >
                全部清除
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {currentList.map((person) => {
              const isDuplicate = currentList.filter(p => p.name === person.name).length > 1;
              return (
                <div
                  key={person.id}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full text-sm group transition-colors",
                    isDuplicate 
                      ? "bg-amber-100 text-amber-700 border border-amber-200" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <span>{person.name}</span>
                  <button
                    onClick={() => removePerson(person.id)}
                    className={cn(
                      "transition-colors",
                      isDuplicate ? "text-amber-400 hover:text-red-500" : "text-slate-400 hover:text-red-500"
                    )}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
