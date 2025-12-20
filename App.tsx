
import React, { useState, useEffect, useMemo } from 'react';
import { PAGES, MAX_LIVES } from './constants';
import { GameStatus } from './types';
import ImagePane from './components/ImagePane';
import AnswerModal from './components/AnswerModal';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [status, setStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Track solved question indices to skip verification when going back/forth
  const [solvedIndices, setSolvedIndices] = useState<Set<number>>(new Set());
  
  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);

  const currentPage = PAGES[currentIndex];

  // Initialize timer on first mount
  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  useEffect(() => {
    if (lives <= 0) {
      setStatus(GameStatus.GAMEOVER);
    }
  }, [lives]);

  const handleNext = () => {
    if (currentPage.isQuestion && !solvedIndices.has(currentIndex)) {
      setShowAnswerModal(true);
      setErrorMsg('');
    } else {
      if (currentIndex < PAGES.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setFinishTime(Date.now());
        setStatus(GameStatus.SUCCESS);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const validateAnswer = (answer: string) => {
    if (answer.trim() === currentPage.answer) {
      setSolvedIndices(prev => new Set(prev).add(currentIndex));
      setShowAnswerModal(false);
      if (currentIndex < PAGES.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setFinishTime(Date.now());
        setStatus(GameStatus.SUCCESS);
      }
    } else {
      setLives(prev => prev - 1);
      setErrorMsg(`答案錯誤！剩餘生命：${lives - 1}`);
      
      if (lives - 1 <= 0) {
        setShowAnswerModal(false);
      }
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setLives(MAX_LIVES);
    setStatus(GameStatus.PLAYING);
    setShowAnswerModal(false);
    setSolvedIndices(new Set());
    setStartTime(Date.now());
    setFinishTime(null);
  };

  const formatDuration = (start: number, end: number) => {
    const diff = Math.floor((end - start) / 1000);
    const mm = Math.floor(diff / 60).toString().padStart(2, '0');
    const ss = (diff % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Render Game Over Screen
  if (status === GameStatus.GAMEOVER) {
    return (
      <div className="game-container flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="mb-8 text-7xl animate-bounce">💀</div>
        <h1 className="text-4xl font-black text-red-500 mb-4">GAME OVER</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          你耗盡了所有的勇氣，<br />
          謎題終究未能解開...
        </p>
        <button 
          onClick={restartGame}
          className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-900/40 transition-all active:scale-95"
        >
          重新開始
        </button>
      </div>
    );
  }

  // Render Success Screen
  if (status === GameStatus.SUCCESS) {
    return (
      <div className="game-container flex flex-col items-center justify-center p-8 text-center bg-slate-950 bg-gradient-to-b from-slate-900 to-amber-950">
        <div className="mb-8 text-7xl">🏆</div>
        <h1 className="text-4xl font-black text-amber-400 mb-2">任務達成</h1>
        <div className="mb-6 py-2 px-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-200 text-sm font-bold uppercase tracking-widest">通關時間</p>
          <p className="text-2xl font-mono text-white">
            {startTime && finishTime ? formatDuration(startTime, finishTime) : '00:00'}
          </p>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed mb-8 italic">
          "恭喜你，未來的守護者。傳說中的廚具將引導你通往幸福之路。"
        </p>
        <button 
          onClick={restartGame}
          className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full shadow-lg transition-all active:scale-95"
        >
          再玩一次
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header Info */}
      <header className="px-4 py-3 bg-slate-900/80 backdrop-blur-md flex justify-between items-center border-b border-white/10 shrink-0 z-20">
        <div className="flex items-center gap-1">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">進度</span>
          <span className="text-amber-500 font-mono font-bold">{currentIndex + 1} / {PAGES.length}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
          {[...Array(MAX_LIVES)].map((_, i) => (
            <span key={i} className={`transition-all duration-300 ${i < lives ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-slate-700 opacity-30 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentPage.imageUrl ? (
          <ImagePane src={currentPage.imageUrl} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-10 bg-slate-900 text-center">
            <div className="space-y-6">
               <div className="text-4xl mb-4 text-amber-500">📜</div>
               <p className="text-xl text-slate-200 leading-relaxed font-serif">
                {currentPage.content}
               </p>
            </div>
          </div>
        )}

        {/* Special Button for Page 11 (Index 10) */}
        {currentIndex === 10 && (
          <button 
            onClick={() => setShowSpecialModal(true)}
            className="absolute bottom-4 right-4 bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-xl border border-blue-400/50 backdrop-blur-sm transition-all z-30 animate-pulse"
          >
            🔍 解卦
          </button>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="p-5 bg-slate-900 border-t border-white/5 shrink-0 z-20">
        <div className="flex gap-4">
          <button 
            disabled={currentIndex === 0}
            onClick={handleBack}
            className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              currentIndex === 0 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' 
                : 'bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            上一頁
          </button>
          <button 
            onClick={handleNext}
            className="flex-[1.5] py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {currentPage.isQuestion && !solvedIndices.has(currentIndex) ? '破解謎題' : (currentIndex === PAGES.length - 1 ? '結束冒險' : '繼續前進')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </footer>

      {/* Answer Modal */}
      <AnswerModal 
        isOpen={showAnswerModal} 
        onClose={() => setShowAnswerModal(false)}
        onSubmit={validateAnswer}
        error={errorMsg}
      />

      {/* Special "解卦" Floating Modal */}
      {showSpecialModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
           <div className="relative w-full h-full max-w-lg flex flex-col">
              <button 
                onClick={() => setShowSpecialModal(false)}
                className="absolute top-0 right-0 p-4 text-white z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="flex-1 flex items-center justify-center">
                 <img 
                    src="https://github.com/shengyangyen/2026-/blob/main/T3-3.png?raw=true" 
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-blue-500/20"
                    alt="解卦線索"
                 />
              </div>
              <p className="text-center text-blue-300 font-bold mb-8">「卦象已現，仔細觀察。」</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
