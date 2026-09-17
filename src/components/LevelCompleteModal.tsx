import React from 'react';
import { Trophy, Star, RotateCcw, Clock, Award, Carrot, ArrowRight, ListOrdered, Home, Sparkles } from 'lucide-react';
import { GameStats } from '../game/engine';

interface LevelCompleteModalProps {
  stats: GameStats;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevelSelect: () => void;
  onGoToMainMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  stats,
  onNextLevel,
  onReplay,
  onOpenLevelSelect,
  onGoToMainMenu,
}) => {
  // Determine star rating:
  // 1 star: finished
  // 2 stars: collected >= 70% coins
  // 3 stars: collected 100% coins & 3 lives
  let stars = 1;
  if (stats.totalCoins > 0 && stats.coins >= Math.floor(stats.totalCoins * 0.7)) stars = 2;
  if (stats.coins === stats.totalCoins && stats.lives === 3) stars = 3;

  const isFinal = stats.isLastLevel || stats.currentLevelId >= 10;

  return (
    <div
      id="level-complete-modal"
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-purple-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-purple-400 rounded-3xl p-5 sm:p-8 max-w-xl sm:max-w-2xl w-full shadow-2xl text-center text-white relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level Badge and Trophy Icon */}
        <div className="inline-flex p-3 sm:p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-pink-500 border-2 border-amber-300 shadow-xl mb-2 sm:mb-3">
          <Trophy className="w-7 h-7 sm:w-9 sm:h-9 text-white animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200 mb-1 tracking-tight">
          LEVEL COMPLETE!
        </h2>
        <p className="text-pink-300 font-bold text-sm sm:text-base mb-1">
          {stats.levelName}
        </p>
        <p className="text-purple-300 text-xs sm:text-sm mb-4 sm:mb-5">
          {stats.levelSubtitle || 'Selamat! Kelinci lucu berhasil mencapai finish! 🎉'}
        </p>

        {/* Stars Display */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all duration-300 ${
                starNum <= stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 sm:scale-110 shadow-lg shadow-amber-500/25'
                  : 'bg-purple-900/40 border-purple-800 text-purple-700 scale-95'
              }`}
            >
              <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
            </div>
          ))}
        </div>

        {/* Stats Grid - 3 Responsive Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mb-5 sm:mb-6">
          {/* Coins / Carrots */}
          <div className="bg-purple-900/60 border border-purple-600/40 rounded-2xl p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-1 sm:gap-2.5 text-center sm:text-left shadow-inner">
            <div className="p-1.5 sm:p-2 bg-amber-500/20 text-amber-300 rounded-xl shrink-0">
              <Carrot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-purple-300 uppercase font-bold tracking-wider">Wortel</p>
              <p className="text-sm sm:text-lg font-black text-amber-300 truncate">
                {stats.coins} <span className="text-[10px] sm:text-xs text-purple-300 font-semibold">/ {stats.totalCoins}</span>
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="bg-purple-900/60 border border-purple-600/40 rounded-2xl p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-1 sm:gap-2.5 text-center sm:text-left shadow-inner">
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 text-indigo-300 rounded-xl shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-purple-300 uppercase font-bold tracking-wider">Waktu</p>
              <p className="text-sm sm:text-lg font-black text-white truncate font-mono">{stats.timeSeconds}s</p>
            </div>
          </div>

          {/* Score */}
          <div className="bg-purple-900/70 border border-purple-500/50 rounded-2xl p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-1 sm:gap-2.5 text-center sm:text-left shadow-inner">
            <div className="p-1.5 sm:p-2 bg-pink-500/20 text-pink-300 rounded-xl shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-purple-300 uppercase font-bold tracking-wider">Skor</p>
              <p className="text-sm sm:text-lg font-black text-amber-300 truncate font-mono">{stats.score}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 sm:space-y-3">
          {!isFinal ? (
            /* Levels 1 - 9: Next Level */
            <button
              id="btn-next-level"
              onClick={onNextLevel}
              className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 active:scale-95 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition cursor-pointer tracking-wide"
            >
              <span>Next Level</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            /* Level 10: Tombol Next Level tidak ditampilkan. Diganti: Main Lagi, Pilih Level, Menu Utama */
            <button
              id="btn-level-10-replay"
              onClick={onReplay}
              className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 active:scale-95 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition cursor-pointer tracking-wide"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Main Lagi Level 10</span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {!isFinal && (
              <button
                id="btn-replay-level"
                onClick={onReplay}
                className="py-2.5 px-3 rounded-xl bg-purple-800/80 hover:bg-purple-700 border border-purple-500/40 text-purple-100 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4 text-purple-300" />
                <span>Replay</span>
              </button>
            )}

            <button
              id="btn-level-select-from-complete"
              onClick={onOpenLevelSelect}
              className={`py-2.5 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-purple-100 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                isFinal ? 'col-span-1' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4 text-pink-300" />
              <span>Pilih Level</span>
            </button>

            <button
              id="btn-main-menu-from-complete"
              onClick={onGoToMainMenu}
              className={`py-2.5 px-3 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-600/40 text-purple-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                isFinal ? 'col-span-2' : ''
              }`}
            >
              <Home className="w-4 h-4 text-amber-300" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
