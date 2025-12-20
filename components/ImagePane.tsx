
import React, { useState, useRef, useEffect } from 'react';

interface ImagePaneProps {
  src: string;
}

const ImagePane: React.FC<ImagePaneProps> = ({ src }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view on image change
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleZoom = (delta: number) => {
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (scale === 1) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setLastPos({ x: clientX, y: clientY });
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || scale === 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - lastPos.x;
    const dy = clientY - lastPos.y;

    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    setLastPos({ x: clientX, y: clientY });
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative flex-1 bg-slate-900 overflow-hidden cursor-move touch-none"
      ref={containerRef}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <img 
          src={src} 
          alt="Clue" 
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
        />
      </div>

      {/* Control Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={() => handleZoom(0.5)}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button 
          onClick={() => handleZoom(-0.5)}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
      </div>
      
      {scale > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 px-3 py-1 rounded-full text-xs text-white pointer-events-none">
          滑動以平移視野
        </div>
      )}
    </div>
  );
};

export default ImagePane;
