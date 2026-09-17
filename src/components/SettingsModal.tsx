import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Vibrate, Info, RotateCcw, X, ShieldAlert, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleSound,
  onResetProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [screenShake, setScreenShake] = useState(() => {
    return localStorage.getItem('bunny_screenshake') !== 'false';
  });

  if (!isOpen) return null;

  const handleToggleScreenShake = () => {
    const next = !screenShake;
    setScreenShake(next);
    localStorage.setItem('bunny_screenshake', next ? 'true' : 'false');
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 bg-purple-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in"
      onClick={onClose}
    >
      <div
        id="settings-modal-dialog"
        className="relative w-full max-w-md bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-purple-400/70 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(76,29,149,0.7)] text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-settings"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-800/80 hover:bg-purple-700 text-purple-200 hover:text-white border border-purple-400/40 transition cursor-pointer active:scale-90"
          aria-label="Tutup Pengaturan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2.5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-200 font-['Fredoka',sans-serif]">
            Pengaturan Game
          </h2>
        </div>

        {/* Settings Options */}
        <div className="space-y-3.5 my-5 text-left text-sm">
          {/* Suara & Musik */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-900/60 border-2 border-purple-400/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-800/80 text-pink-300">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-white font-['Fredoka',sans-serif]">Suara & Musik</p>
                <p className="text-xs text-purple-300">Efek lompatan, koin & melodi BGM</p>
              </div>
            </div>
            <button
              id="btn-toggle-sound-settings"
              onClick={onToggleSound}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition active:scale-95 border ${
                !isMuted
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-green-300/40 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                  : 'bg-purple-800 hover:bg-purple-700 text-purple-300 border-purple-500/40'
              }`}
            >
              {!isMuted ? 'Aktif 🔊' : 'Bisu 🔇'}
            </button>
          </div>

          {/* Efek Getar Layar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-900/60 border-2 border-purple-400/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-800/80 text-amber-300">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white font-['Fredoka',sans-serif]">Efek Getar Layar</p>
                <p className="text-xs text-purple-300">Goncangan kamera saat terkena rintangan</p>
              </div>
            </div>
            <button
              id="btn-toggle-screenshake-settings"
              onClick={handleToggleScreenShake}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition active:scale-95 border ${
                screenShake
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white border-purple-300/40'
                  : 'bg-purple-800 hover:bg-purple-700 text-purple-300 border-purple-500/40'
              }`}
            >
              {screenShake ? 'Nyala ✨' : 'Mati'}
            </button>
          </div>

          {/* Info Kontrol Singkat */}
          <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-400/30 text-xs text-purple-200">
            <div className="flex items-center gap-2 mb-1.5 font-bold text-pink-300">
              <Info className="w-4 h-4" />
              <span>Petunjuk Kontrol Cepat:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
              <div>⌨️ <strong>A / D / Panah</strong>: Bergerak</div>
              <div>🐰 <strong>Spasi / W / ↑</strong>: Lompat</div>
              <div>⏸️ <strong>P / Esc</strong>: Pause</div>
              <div>👾 <strong>Injak Slime</strong>: Kalahkan musuh!</div>
            </div>
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="mt-4 pt-3 border-t border-purple-500/30">
          {resetSuccess && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Semua progress berhasil di-reset ke awal!</span>
            </div>
          )}

          {!showConfirmReset ? (
            <button
              id="btn-open-confirm-reset"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-red-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data & Kemajuan Game</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-red-950/80 border-2 border-red-500/60 text-xs text-red-200 animate-fade-in space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-red-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Yakin ingin mereset progress ke Level 1?</span>
              </div>
              <p className="text-[11px] text-red-300/80">Skor dan bintang yang telah diraih akan kembali ke nol.</p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  id="btn-confirm-reset-yes"
                  onClick={handleConfirmReset}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition shadow"
                >
                  Ya, Reset
                </button>
                <button
                  id="btn-confirm-reset-no"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-1.5 bg-purple-800 hover:bg-purple-700 text-purple-200 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          id="btn-finish-settings"
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-2xl bg-purple-800 hover:bg-purple-700 border-2 border-purple-400/50 text-white font-bold text-sm transition cursor-pointer active:scale-95 shadow"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};
