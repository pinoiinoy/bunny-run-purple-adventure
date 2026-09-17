import React, { useEffect, useRef } from 'react';
import { Crown, Sparkles, Trophy, RotateCcw, ListOrdered, Award, Carrot, Home, CheckCircle2 } from 'lucide-react';
import { GameStats } from '../game/engine';

interface GameWinModalProps {
  stats: GameStats;
  totalCoinsAllLevels?: number;
  onRestartAll: () => void;
  onOpenLevelSelect: () => void;
  onGoToMainMenu: () => void;
}

export const GameWinModal: React.FC<GameWinModalProps> = ({
  stats,
  totalCoinsAllLevels = 145,
  onRestartAll,
  onOpenLevelSelect,
  onGoToMainMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simple vanilla Canvas confetti animation (no external libraries)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const colors = ['#F472B6', '#C084FC', '#FBBF24', '#38BDF8', '#A78BFA', '#F43F5E', '#34D399'];
    const confettiPieces = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3.5,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      confettiPieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      id="game-win-modal"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/90 backdrop-blur-lg animate-fade-in overflow-hidden"
    >
      {/* Canvas Confetti Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <div
        id="game-win-card"
        className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center text-white relative overflow-hidden z-20"
      >
        {/* Decorative Golden & Pink Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Crown Icon */}
        <div className="inline-flex p-3 sm:p-4 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 border-2 border-amber-300 shadow-2xl mb-2 sm:mb-3 animate-bounce">
          <Crown className="w-10 sm:w-12 h-10 sm:h-12 text-white fill-amber-300" />
        </div>

        {/* Celebration Title */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-amber-300">
            Tamat Petualangan!
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-100 mb-1 tracking-tight">
          YOU WIN!
        </h2>
        <p className="text-pink-300 font-extrabold text-sm sm:text-base mb-1">
          Selamat! Kamu berhasil menyelesaikan Bunny Run: Purple Adventure!
        </p>
        <p className="text-purple-200 text-xs sm:text-sm mb-5">
          Kelinci pemberani berhasil menaklukkan seluruh rintangan dan mencapai tahta tertinggi di Kastil Impian Ungu! 👑✨
        </p>

        {/* Highlighted Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          {/* Total Level */}
          <div className="bg-purple-900/70 border border-purple-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-pink-300 rounded-xl">
              <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-semibold">Total Level</p>
              <p className="text-base sm:text-lg font-black text-white">10 / 10</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-purple-900/70 border border-purple-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <Award className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-semibold">Progress</p>
              <p className="text-base sm:text-lg font-black text-emerald-300">100% Selesai</p>
            </div>
          </div>

          {/* Total Coins */}
          <div className="bg-purple-900/70 border border-purple-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Carrot className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-semibold">Total Coin</p>
              <p className="text-base sm:text-lg font-black text-amber-300">
                {stats.coins} <span className="text-xs text-purple-300 font-normal">/ {stats.totalCoins}</span>
              </p>
            </div>
          </div>

          {/* Total Score */}
          <div className="bg-purple-900/70 border border-purple-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Trophy className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-semibold">Total Score</p>
              <p className="text-base sm:text-lg font-black text-amber-300 font-mono">
                {stats.score}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            id="btn-win-replay-all"
            onClick={onRestartAll}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 active:scale-95 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main dari Level 1</span>
          </button>

          <div className="flex gap-2">
            <button
              id="btn-win-level-select"
              onClick={onOpenLevelSelect}
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-900/80 hover:bg-purple-800 border-2 border-purple-400/50 active:scale-95 text-purple-100 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ListOrdered className="w-4 h-4 text-pink-300" />
              <span>Pilih Level</span>
            </button>

            <button
              id="btn-win-main-menu"
              onClick={onGoToMainMenu}
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-950/90 hover:bg-purple-900 border-2 border-purple-500/50 active:scale-95 text-purple-200 hover:text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
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
