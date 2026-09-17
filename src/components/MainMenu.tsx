import React, { useState } from 'react';
import {
  Play,
  ListOrdered,
  HelpCircle,
  Volume2,
  VolumeX,
  Settings,
  Star,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { LevelProgress } from '../game/types';
import { MenuPlatformerBackground } from './MenuPlatformerBackground';
import { AnimatedBunnyHero } from './AnimatedBunnyHero';
import { SettingsModal } from './SettingsModal';

interface MainMenuProps {
  progress: LevelProgress;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  onResetProgress: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onStartGame,
  onOpenLevelSelect,
  onOpenHowToPlay,
  onResetProgress,
  isMuted,
  onToggleSound,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const unlocked = progress.unlockedLevel || 1;
  const totalStars = Object.values(progress.stars || {}).reduce<number>(
    (a, b) => a + Number(b || 0),
    0
  );

  return (
    <div
      id="main-menu-screen"
      className="absolute inset-0 z-40 w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 text-center select-none overflow-hidden"
    >
      {/* 1. 2D PLATFORMER WORLD ANIMATED BACKGROUND */}
      <MenuPlatformerBackground />

      {/* 2. TOP SECTION: GAME TITLE & SUBTITLE */}
      <header className="relative z-10 pt-2 sm:pt-3 flex flex-col items-center">
        {/* Playful Floating Sparkle Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-spin transition-transform duration-1000" />
          <span className="px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-purple-900/70 border border-pink-300/40 text-[10px] sm:text-xs font-black tracking-widest uppercase text-pink-200 shadow-sm backdrop-blur-xs font-['Fredoka',sans-serif]">
            ✦ PURPLE ADVENTURE ✦
          </span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
        </div>

        {/* Big 3D Cartoon Platformer Title: BUNNY RUN */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-purple-200 drop-shadow-title font-['Fredoka',sans-serif] tracking-wider leading-none">
          BUNNY RUN
        </h1>
      </header>

      {/* 3. CENTER SECTION: HERO BUNNY CHARACTER */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto -mt-1 sm:-mt-2">
        <AnimatedBunnyHero />
      </div>

      {/* 4. ACTIONS SECTION: MAIN PLAY BUTTON & AUXILIARY MENU BUTTONS */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl flex flex-col items-center gap-2.5 sm:gap-3.5 px-3 mb-1 sm:mb-2">
        {/* BIG MAIN PLAY BUTTON: ▶ MULAI PETUALANGAN */}
        <button
          id="btn-start-game"
          onClick={onStartGame}
          className="group relative w-full sm:w-auto min-w-[260px] sm:min-w-[340px] md:min-w-[380px] py-3.5 sm:py-4 px-8 sm:px-12 rounded-full font-['Fredoka',sans-serif] text-lg sm:text-2xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 active:scale-95 shadow-[0_10px_30px_rgba(236,72,153,0.55)] hover:shadow-[0_14px_40px_rgba(236,72,153,0.75)] border-2 border-pink-200/60 transition-all duration-200 flex items-center justify-center gap-3 animate-pulse-play cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400/90 text-purple-950 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
          </div>
          <span className="tracking-wide drop-shadow-sm">MULAI PETUALANGAN</span>
        </button>

        {/* AUXILIARY MENU BUTTONS: 4 CLASSIC PLATFORMER BUTTONS */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs sm:text-sm font-['Fredoka',sans-serif]">
          {/* 1. Pilih Level */}
          <button
            id="btn-open-levels-from-start"
            onClick={onOpenLevelSelect}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800/90 border-2 border-purple-400/60 hover:border-pink-300 text-purple-100 hover:text-white font-bold transition shadow-sm active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Pilih Level dari 1 sampai 10"
          >
            <ListOrdered className="w-4 h-4 text-pink-300 shrink-0" />
            <span className="truncate">Pilih Level</span>
          </button>

          {/* 2. Cara Bermain */}
          <button
            id="btn-how-to-play-from-menu"
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800/90 border-2 border-purple-400/60 hover:border-pink-300 text-purple-100 hover:text-white font-bold transition shadow-sm active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Lihat petunjuk kontrol & trik bermain"
          >
            <HelpCircle className="w-4 h-4 text-pink-300 shrink-0" />
            <span className="truncate">Cara Bermain</span>
          </button>

          {/* 3. Suara (Toggle Mute/Unmute) */}
          <button
            id="btn-toggle-sound-menu"
            onClick={onToggleSound}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border-2 transition shadow-sm active:scale-95 cursor-pointer backdrop-blur-xs font-bold ${
              !isMuted
                ? 'bg-purple-900/80 hover:bg-purple-800/90 border-purple-400/60 text-purple-100 hover:text-white hover:border-pink-300'
                : 'bg-purple-950/85 hover:bg-purple-900 border-red-400/60 text-red-200 hover:text-white'
            }`}
            title={!isMuted ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-red-300 shrink-0" />
            )}
            <span className="truncate">{!isMuted ? 'Suara: On' : 'Suara: Off'}</span>
          </button>

          {/* 4. Pengaturan */}
          <button
            id="btn-open-settings-menu"
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800/90 border-2 border-purple-400/60 hover:border-pink-300 text-purple-100 hover:text-white font-bold transition shadow-sm active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Buka Pengaturan Game"
          >
            <Settings className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">Pengaturan</span>
          </button>
        </div>
      </div>

      {/* 5. BOTTOM SECTION: PLAYER PROGRESS BADGE */}
      <footer className="relative z-10 pb-1 flex flex-col items-center gap-1">
        <div
          id="menu-player-progress-badge"
          className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/75 border border-purple-300/40 text-white text-[11px] sm:text-xs shadow-md backdrop-blur-xs font-['Fredoka',sans-serif]"
        >
          <div className="flex items-center gap-1 text-pink-300 font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>LEVEL TERBUKA:</span>
            <span className="text-amber-300 font-black">{unlocked} / 10</span>
          </div>

          <span className="text-purple-400">•</span>

          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{totalStars} / 30 BINTANG</span>
          </div>
        </div>
      </footer>

      {/* 6. SETTINGS MODAL */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isMuted={isMuted}
        onToggleSound={onToggleSound}
        onResetProgress={onResetProgress}
      />
    </div>
  );
};
