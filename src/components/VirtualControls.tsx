import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface VirtualControlsProps {
  onPress: (action: 'left' | 'right' | 'jump', pressed: boolean) => void;
  visible?: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onPress,
  visible = true,
}) => {
  if (!visible) return null;

  const handleStart = (action: 'left' | 'right' | 'jump', e: React.SyntheticEvent) => {
    e.preventDefault();
    onPress(action, true);
  };

  const handleEnd = (action: 'left' | 'right' | 'jump', e: React.SyntheticEvent) => {
    e.preventDefault();
    onPress(action, false);
  };

  return (
    <div
      id="virtual-controls"
      className="w-full px-2 sm:px-4 md:px-6 py-1 sm:py-1.5 flex items-center justify-between gap-3 select-none touch-none animate-fade-in"
    >
      {/* Direction Controls (Left & Right) - Bottom Left */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Tombol ← (Kiri) */}
        <button
          id="btn-touch-left"
          onTouchStart={(e) => handleStart('left', e)}
          onTouchEnd={(e) => handleEnd('left', e)}
          onTouchCancel={(e) => handleEnd('left', e)}
          onMouseDown={(e) => handleStart('left', e)}
          onMouseUp={(e) => handleEnd('left', e)}
          onMouseLeave={(e) => handleEnd('left', e)}
          onContextMenu={(e) => e.preventDefault()}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-purple-700 via-purple-800 to-indigo-950 active:from-pink-600 active:to-purple-900 border-2 border-purple-400/80 hover:border-pink-300 shadow-[0_4px_14px_rgba(76,29,149,0.5)] active:shadow-inner active:scale-95 flex items-center justify-center text-white transition-all duration-100 cursor-pointer"
          aria-label="Gerak Kiri"
          title="Gerak Kiri (← / A)"
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
        </button>

        {/* Tombol → (Kanan) */}
        <button
          id="btn-touch-right"
          onTouchStart={(e) => handleStart('right', e)}
          onTouchEnd={(e) => handleEnd('right', e)}
          onTouchCancel={(e) => handleEnd('right', e)}
          onMouseDown={(e) => handleStart('right', e)}
          onMouseUp={(e) => handleEnd('right', e)}
          onMouseLeave={(e) => handleEnd('right', e)}
          onContextMenu={(e) => e.preventDefault()}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-purple-700 via-purple-800 to-indigo-950 active:from-pink-600 active:to-purple-900 border-2 border-purple-400/80 hover:border-pink-300 shadow-[0_4px_14px_rgba(76,29,149,0.5)] active:shadow-inner active:scale-95 flex items-center justify-center text-white transition-all duration-100 cursor-pointer"
          aria-label="Gerak Kanan"
          title="Gerak Kanan (→ / D)"
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
        </button>
      </div>

      {/* Jump Control - Bottom Right */}
      <div className="flex items-center">
        {/* Tombol LOMPAT 🐰 */}
        <button
          id="btn-touch-jump"
          onTouchStart={(e) => handleStart('jump', e)}
          onTouchEnd={(e) => handleEnd('jump', e)}
          onTouchCancel={(e) => handleEnd('jump', e)}
          onMouseDown={(e) => handleStart('jump', e)}
          onMouseUp={(e) => handleEnd('jump', e)}
          onMouseLeave={(e) => handleEnd('jump', e)}
          onContextMenu={(e) => e.preventDefault()}
          className="h-13 sm:h-16 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 active:from-pink-600 active:to-indigo-700 hover:from-pink-400 hover:to-indigo-500 border-2 border-pink-300/90 shadow-[0_6px_20px_rgba(236,72,153,0.45)] active:shadow-inner active:scale-95 flex items-center gap-2 sm:gap-2.5 text-white font-black text-sm sm:text-base tracking-wide transition-all duration-100 cursor-pointer"
          aria-label="Lompat"
          title="Lompat (↑ / Space / W)"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          <span>LOMPAT 🐰</span>
        </button>
      </div>
    </div>
  );
};
