import React from 'react';
import { RotateCcw, Frown, ListOrdered, Home, RefreshCw } from 'lucide-react';
import { GameStats } from '../game/engine';

interface GameOverModalProps {
  stats: GameStats;
  onRetry: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onGoToMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRetry,
  onRestart,
  onOpenLevelSelect,
  onGoToMainMenu,
}) => {
  return (
    <div
      id="game-over-modal"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/90 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-pink-500/80 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center text-white relative overflow-hidden">
        {/* Sad Icon */}
        <div className="inline-flex p-3.5 rounded-full bg-pink-500/20 border-2 border-pink-400 shadow-xl mb-2 text-pink-400 animate-pulse">
          <Frown className="w-9 h-9" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-pink-300 mb-1">
          GAME OVER
        </h2>
        <p className="text-purple-300 text-xs mb-1 font-semibold">
          {stats.levelName}
        </p>
        <p className="text-purple-200 text-xs mb-4">
          Kelinci kehabisan nyawa! Jangan menyerah, coba lagi!
        </p>

        {/* Mini stats */}
        <div className="bg-purple-900/60 border border-purple-600/40 rounded-2xl p-3 mb-4 space-y-1.5 text-xs sm:text-sm text-purple-200">
          <div className="flex justify-between">
            <span>🥕 Wortel Terkumpul:</span>
            <span className="font-bold text-amber-300">{stats.coins} / {stats.totalCoins}</span>
          </div>
          <div className="flex justify-between">
            <span>⭐ Skor:</span>
            <span className="font-bold text-white">{stats.score}</span>
          </div>
        </div>

        {/* Buttons: Coba Lagi, Restart Level, Pilih Level, Menu Utama */}
        <div className="space-y-2">
          {/* Coba Lagi */}
          <button
            id="btn-retry"
            onClick={onRetry}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 active:scale-95 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>

          {/* Restart Level */}
          <button
            id="btn-restart-from-over"
            onClick={onRestart}
            className="w-full py-2 px-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 border border-purple-500/40 text-purple-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
            <span>Restart Level</span>
          </button>

          <div className="flex gap-2">
            {/* Pilih Level */}
            <button
              id="btn-level-select-from-over"
              onClick={onOpenLevelSelect}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-purple-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5 text-pink-300" />
              <span>Pilih Level</span>
            </button>

            {/* Menu Utama */}
            <button
              id="btn-main-menu-from-over"
              onClick={onGoToMainMenu}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-600/40 text-purple-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-300" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
