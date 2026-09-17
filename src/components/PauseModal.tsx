import React from 'react';
import { Play, RotateCcw, ListOrdered, Home, Pause } from 'lucide-react';
import { GameStats } from '../game/engine';

interface PauseModalProps {
  stats: GameStats;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onGoToMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  stats,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onGoToMainMenu,
}) => {
  return (
    <div
      id="pause-modal-overlay"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/85 backdrop-blur-md animate-fade-in"
    >
      <div
        id="pause-modal-card"
        className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-purple-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center text-white relative overflow-hidden"
      >
        {/* Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pause Icon */}
        <div className="inline-flex p-3.5 rounded-2xl bg-purple-800/90 border-2 border-purple-400 shadow-xl mb-3 text-pink-300">
          <Pause className="w-8 h-8 fill-current" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-200 mb-1">
          GAME PAUSED
        </h2>
        <p className="text-pink-300 font-bold text-xs mb-1">
          {stats.levelName}
        </p>
        <p className="text-purple-300 text-xs mb-5">
          Permainan sedang dihentikan sementara.
        </p>

        {/* Mini stats */}
        <div className="bg-purple-900/60 border border-purple-600/40 rounded-2xl p-3 mb-5 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-purple-300 block text-[10px] uppercase font-semibold">Nyawa</span>
            <span className="text-sm font-bold text-pink-400">{'❤️'.repeat(stats.lives)}</span>
          </div>
          <div>
            <span className="text-purple-300 block text-[10px] uppercase font-semibold">Wortel</span>
            <span className="text-sm font-bold text-amber-300">{stats.coins}/{stats.totalCoins}</span>
          </div>
          <div>
            <span className="text-purple-300 block text-[10px] uppercase font-semibold">Waktu</span>
            <span className="text-sm font-bold text-white font-mono">{stats.timeSeconds}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Lanjutkan */}
          <button
            id="btn-pause-resume"
            onClick={onResume}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 active:scale-95 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current text-amber-300" />
            <span>Lanjutkan</span>
          </button>

          {/* Restart Level */}
          <button
            id="btn-pause-restart"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 border border-purple-500/40 text-purple-100 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
            <span>Restart Level</span>
          </button>

          {/* Pilih Level */}
          <button
            id="btn-pause-level-select"
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-purple-200 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-pink-300" />
            <span>Pilih Level</span>
          </button>

          {/* Menu Utama */}
          <button
            id="btn-pause-main-menu"
            onClick={onGoToMainMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-600/40 text-purple-300 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
