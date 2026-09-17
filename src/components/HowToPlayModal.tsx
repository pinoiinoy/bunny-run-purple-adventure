import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="how-to-play-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-gradient-to-b from-purple-900 to-indigo-950 border-2 border-purple-400/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-purple-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-purple-700/60 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl font-bold text-white">Cara Bermain</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Controls */}
          <div>
            <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" /> Kontrol Keyboard / Layar Sentuh:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-purple-950/70 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-pink-300 block">Jalan Kiri / Kanan:</span>
                Panah [← / →] atau [A / D] atau tombol layar
              </div>
              <div className="bg-purple-950/70 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-pink-300 block">Lompat Kelinci:</span>
                [Spasi] / [W] / [↑] atau tombol [LOMPAT 🐰]
              </div>
              <div className="bg-purple-950/70 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-pink-300 block">Restart Cepat:</span>
                Tekan tombol [R]
              </div>
              <div className="bg-purple-950/70 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-pink-300 block">Tinggi Lompatan:</span>
                Tahan tombol lompat lebih lama untuk melompat lebih tinggi!
              </div>
            </div>
          </div>

          {/* Gameplay Mechanics */}
          <div>
            <h4 className="font-bold text-pink-300 mb-2">Fitur & Rintangan Spesial:</h4>
            <ul className="space-y-2 text-xs text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">🥕</span>
                <span><strong>Wortel Emas:</strong> Kumpulkan semua wortel untuk skor maksimal dan bintang 3!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">⭐</span>
                <span><strong>Checkpoint Bendera:</strong> Lewati tiang kristal bendera untuk menyimpan titik respawn jika kelinci jatuh ke jurang.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">❄️</span>
                <span><strong>Platform Es Berseluncur:</strong> Di level Frozen Mountain, kelinci meluncur lebih licin dan kencang di atas es!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">👾</span>
                <span><strong>Purple Slime:</strong> Injak bagian atas slime untuk mengalahkannya (+200 poin & pantul lompat)! Jangan menyentuhnya dari samping.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">🌺</span>
                <span><strong>Duri Kristal & Duri Beracun:</strong> Hati-hati jangan menyentuh duri kristal tajam atau belukar berduri ungu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base leading-none">👑</span>
                <span><strong>Garis Finish:</strong> Masuki gerbang portal ungu di ujung kanan level untuk menyelesaikan petualangan ("Level Complete").</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-purple-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition"
          >
            Mengerti, Ayo Main!
          </button>
        </div>
      </div>
    </div>
  );
};
