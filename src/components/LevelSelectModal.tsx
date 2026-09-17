import React from 'react';
import { X, Lock, CheckCircle, Star, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { LEVELS_METADATA } from '../game/levelData';
import { LevelProgress } from '../game/types';

interface LevelSelectModalProps {
  currentLevelId: number;
  progress: LevelProgress;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevelId,
  progress,
  onSelectLevel,
  onClose,
  onResetProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  return (
    <div
      id="level-select-modal"
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-purple-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-purple-400 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl text-white relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-700/50 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-700/60 rounded-xl border border-purple-400/40 text-pink-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200">
                Pilih Level
              </h2>
              <p className="text-xs text-purple-300">
                Level Terbuka: <span className="font-bold text-amber-300">{progress.unlockedLevel}</span> / 10
              </p>
            </div>
          </div>

          <button
            id="btn-close-level-select"
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-800/60 hover:bg-purple-700 text-purple-200 hover:text-white border border-purple-500/30 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid (Scrollable) */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LEVELS_METADATA.map((lvl) => {
              const isUnlocked = lvl.id <= progress.unlockedLevel;
              const isCompleted = progress.completedLevels.includes(lvl.id);
              const isCurrent = lvl.id === currentLevelId;
              const stars = progress.stars[lvl.id] || 0;
              const highScore = progress.highScores[lvl.id];

              return (
                <button
                  key={lvl.id}
                  id={`btn-level-${lvl.id}`}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectLevel(lvl.id);
                    }
                  }}
                  className={`group relative text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-purple-800/90 border-pink-400 shadow-lg shadow-pink-500/20 ring-2 ring-pink-400/50'
                      : isUnlocked
                      ? isCompleted
                        ? 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-400/60 hover:border-amber-400 hover:shadow-md'
                        : 'bg-purple-950/70 hover:bg-purple-900/80 border-purple-600/50 hover:border-purple-300'
                      : 'bg-purple-950/40 border-purple-900/60 opacity-55 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Badge or Lock Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold border ${
                        !isUnlocked
                          ? 'bg-purple-950 border-purple-800 text-purple-600'
                          : isCompleted
                          ? 'bg-gradient-to-tr from-amber-500/30 to-purple-600/40 border-amber-400/60 text-amber-300'
                          : 'bg-purple-800/60 border-purple-500/50 text-purple-200'
                      }`}
                    >
                      {isUnlocked ? (
                        <span>{lvl.id}</span>
                      ) : (
                        <Lock className="w-5 h-5 text-purple-500/80" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-pink-200 transition-colors">
                          {lvl.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-pink-500/30 border border-pink-400/50 text-pink-300 px-1.5 py-0.5 rounded-md font-semibold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-purple-300/90 line-clamp-1">
                        {lvl.subtitle}
                      </p>

                      {/* Difficulty and Coins badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            lvl.difficulty === 'Easy'
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : lvl.difficulty === 'Medium'
                              ? 'bg-blue-950 border border-blue-500/40 text-blue-300'
                              : lvl.difficulty === 'Hard'
                              ? 'bg-amber-950 border border-amber-500/40 text-amber-300'
                              : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                          }`}
                        >
                          {lvl.difficulty}
                        </span>
                        <span className="text-[10px] text-purple-400 font-mono">
                          🥕 {lvl.coinsTotal} Koin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stars or Locked state */}
                  <div className="flex flex-col items-end pl-2">
                    {isUnlocked ? (
                      <>
                        <div className="flex items-center gap-0.5 mb-1">
                          {[1, 2, 3].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-3.5 h-3.5 ${
                                starNum <= stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-purple-800 fill-purple-950'
                              }`}
                            />
                          ))}
                        </div>
                        {highScore !== undefined && (
                          <span className="text-[10px] text-amber-300 font-mono font-medium">
                            {highScore} pts
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-purple-500/70 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Terkunci
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer & Reset Progress option */}
        <div className="pt-3 mt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-purple-300">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Selesaikan tiap level untuk membuka level berikutnya!</span>
          </div>

          {!showConfirmReset ? (
            <button
              id="btn-confirm-reset-trigger"
              onClick={() => setShowConfirmReset(true)}
              className="text-purple-400 hover:text-pink-300 transition-colors underline decoration-dotted"
            >
              Reset Progres
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-pink-300 font-medium">Yakin reset?</span>
              <button
                id="btn-do-reset"
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-0.5 rounded bg-purple-800 hover:bg-purple-700 text-purple-200"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
