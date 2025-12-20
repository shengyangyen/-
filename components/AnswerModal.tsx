
import React, { useState } from 'react';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answer: string) => void;
  error?: string;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-4 text-amber-400">解鎖謎題</h2>
        <p className="text-slate-300 mb-6">請輸入答案以繼續前進：</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="在此輸入答案..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          
          {error && (
            <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
            >
              提交驗證
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerModal;
