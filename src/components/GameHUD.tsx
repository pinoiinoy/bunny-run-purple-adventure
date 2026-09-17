import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Code2, Heart, ListOrdered, Pause, Play, Home } from 'lucide-react';
import { GameStats } from '../game/engine';

interface GameHUDProps {
  stats: GameStats;
  isMuted: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onTogglePause: () => void;
  onOpenHowToPlay: () => void;
  onOpenExport: () => void;
  onOpenLevelSelect: () => void;
  onGoToMainMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  isMuted,
  onToggleSound,
  onRestart,
  onTogglePause,
  onOpenHowToPlay,
  onOpenExport,
  onOpenLevelSelect,
  onGoToMainMenu,
}) => {
  const isPaused = stats.gameState === 'PAUSED';

  return (
    <header className="w-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 border-b-2 border-purple-500/40 px-2 sm:px-4 py-1.5 sm:py-2 text-white shadow-lg select-none">
      <div className="w-full px-1 sm:px-2 flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Dynamic Level Info */}
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl filter drop-shadow" role="img" aria-label="bunny">
            🐰
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-purple-100 flex items-center gap-1">
                Bunny Run: <span className="text-pink-400 font-extrabold hidden sm:inline">Purple Adventure</span>
              </h1>
              <span className="text-[11px] sm:text-xs bg-purple-800/90 border border-purple-400/50 text-pink-300 font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                Level {stats.currentLevelId || 1}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-300 font-medium truncate max-w-[150px] sm:max-w-[240px]">
              {stats.levelName || 'Level 1 — Lavender Meadows'}
            </p>
          </div>
        </div>

        {/* Stats Counter Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-semibold">
          {/* HP / Lives */}
          <div
            id="hud-lives"
            className="bg-purple-950/80 border border-pink-500/40 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 shadow-inner"
            title={`Nyawa: ${stats.lives} dari 3`}
          >
            <span className="text-[10px] text-purple-300 hidden sm:inline uppercase font-bold mr-0.5">HP:</span>
            <span className="text-pink-400 flex items-center gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                    i < stats.lives ? 'text-pink-500 fill-pink-500 scale-100' : 'text-purple-800/60 scale-75'
                  }`}
                />
              ))}
            </span>
          </div>

          {/* Coins / Carrots */}
          <div
            id="hud-coins"
            className="bg-purple-950/80 border border-amber-400/50 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 text-amber-300 shadow-inner"
            title="Wortel Koin Terkumpul"
          >
            <span className="text-sm sm:text-base leading-none">🥕</span>
            <span className="font-mono font-bold tracking-wider text-xs sm:text-sm">
              {stats.coins}/{stats.totalCoins}
            </span>
          </div>

          {/* Score */}
          <div
            id="hud-score"
            className="bg-purple-950/80 border border-purple-400/50 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1.5 text-purple-200 shadow-inner"
            title="Skor Petualangan"
          >
            <span className="text-[10px] uppercase font-bold text-purple-300">Skor:</span>
            <span className="font-mono font-bold text-white text-xs sm:text-sm">{stats.score}</span>
          </div>

          {/* Timer */}
          <div
            id="hud-timer"
            className="bg-purple-950/80 border border-purple-400/50 rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 text-purple-200 shadow-inner"
            title="Waktu Bermain"
          >
            <span className="text-xs">⏱️</span>
            <span className="font-mono font-bold text-xs sm:text-sm">{stats.timeSeconds}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Menu Utama (Home) Button */}
          <button
            id="btn-hud-main-menu"
            onClick={onGoToMainMenu}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-purple-100 hover:text-white border border-purple-400/40 text-xs font-semibold flex items-center gap-1 shadow transition-all active:scale-95 cursor-pointer"
            title="Kembali ke Menu Utama"
            aria-label="Menu Utama"
          >
            <Home className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Menu Utama</span>
          </button>

          {/* Pause Button */}
          {stats.gameState === 'PLAYING' || stats.gameState === 'PAUSED' ? (
            <button
              id="btn-pause-toggle"
              onClick={onTogglePause}
              title={isPaused ? 'Lanjutkan (P)' : 'Jeda Permainan (P / Esc)'}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-sm ${
                isPaused
                  ? 'bg-amber-500 hover:bg-amber-400 text-purple-950 border-amber-300 animate-pulse'
                  : 'bg-purple-800/80 hover:bg-purple-700 text-purple-200 hover:text-white border-purple-400/40'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>
          ) : null}

          {/* Level Select */}
          <button
            id="btn-level-select-hud"
            onClick={onOpenLevelSelect}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-purple-100 hover:text-white border border-purple-400/40 text-xs font-semibold flex items-center gap-1 shadow transition-all active:scale-95 cursor-pointer"
            title="Menu Pilih Level"
          >
            <ListOrdered className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Level</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-1.5 sm:p-2 rounded-xl bg-purple-800/70 hover:bg-purple-700 text-purple-200 hover:text-white border border-purple-500/30 transition-colors shadow-sm cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-pink-300" />}
          </button>

          {/* Restart Level */}
          <button
            id="btn-restart"
            onClick={onRestart}
            title="Mulai Ulang Level (R)"
            className="p-1.5 sm:p-2 rounded-xl bg-purple-800/70 hover:bg-purple-700 text-purple-200 hover:text-white border border-purple-500/30 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* How To Play */}
          <button
            id="btn-how-to-play"
            onClick={onOpenHowToPlay}
            title="Petunjuk Kontrol & Rintangan"
            className="p-1.5 sm:p-2 rounded-xl bg-purple-800/70 hover:bg-purple-700 text-purple-200 hover:text-white border border-purple-500/30 transition-colors shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Export Vanilla */}
          <button
            id="btn-export-vanilla"
            onClick={onOpenExport}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-purple-100 hover:text-white border border-purple-400/40 text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            title="Ekspor Standalone Vanilla HTML ke GitHub Pages"
          >
            <Code2 className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden md:inline">Ekspor Vanilla</span>
          </button>
        </div>
      </div>
    </header>
  );
};
