import React, { useState } from 'react';
import { Copy, Check, Download, X, Code2, Globe } from 'lucide-react';

interface VanillaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VanillaExportModal: React.FC<VanillaExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vanillaCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bunny Run: Purple Adventure (10 Levels)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@600;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }
    body {
      background: linear-gradient(135deg, #2E1065, #3B0764, #1E1B4B);
      font-family: 'Fredoka', 'Nunito', sans-serif;
      color: #F3E8FF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow-x: hidden;
      padding: 12px;
    }
    .game-wrapper {
      position: relative;
      background: #4C1D95;
      border: 4px solid #C084FC;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      max-width: 960px;
      width: 100%;
    }
    .hud {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #581C87;
      padding: 10px 16px;
      border-bottom: 2px solid #A855F7;
      flex-wrap: wrap;
      gap: 8px;
    }
    .hud-title {
      font-weight: 700;
      font-size: 1.05rem;
      color: #F3E8FF;
    }
    .hud-stats {
      display: flex;
      gap: 10px;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .stat-badge {
      background: rgba(168, 85, 247, 0.3);
      border: 1px solid #C084FC;
      border-radius: 999px;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hud-actions {
      display: flex;
      gap: 6px;
    }
    .btn-icon {
      background: #7E22CE;
      border: 1px solid #C084FC;
      color: #F3E8FF;
      border-radius: 10px;
      padding: 6px 12px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-icon:hover {
      background: #9333EA;
    }
    #gameCanvas {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #1E1B4B;
    }
    .touch-controls {
      display: flex;
      justify-content: space-between;
      padding: 12px 18px;
      background: #3B0764;
    }
    .touch-btn {
      background: #7E22CE;
      border: 2px solid #C084FC;
      color: white;
      font-size: 1.5rem;
      border-radius: 14px;
      width: 60px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      cursor: pointer;
    }
    .touch-btn:active {
      background: #A855F7;
    }
    .touch-group {
      display: flex;
      gap: 12px;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(46, 16, 101, 0.88);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      z-index: 20;
    }
    .overlay.hidden {
      display: none;
    }
    .modal-box {
      background: linear-gradient(180deg, #581C87, #3B0764);
      border: 4px solid #C084FC;
      border-radius: 24px;
      padding: 28px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
    }
    .btn-main {
      background: linear-gradient(90deg, #EC4899, #8B5CF6);
      border: none;
      color: white;
      font-size: 1.15rem;
      font-weight: 700;
      padding: 12px 28px;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
      margin-top: 14px;
      font-family: inherit;
    }
    .btn-main:hover {
      opacity: 0.95;
    }
    .level-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      max-height: 280px;
      overflow-y: auto;
      margin: 14px 0;
      padding-right: 4px;
    }
    .level-card {
      background: rgba(76, 29, 149, 0.6);
      border: 2px solid #7E22CE;
      border-radius: 12px;
      padding: 8px 10px;
      text-align: left;
      cursor: pointer;
      color: #F3E8FF;
      font-family: inherit;
      font-size: 0.85rem;
    }
    .level-card.unlocked:hover {
      background: #7E22CE;
      border-color: #C084FC;
    }
    .level-card.locked {
      opacity: 0.5;
      cursor: not-allowed;
      border-color: #4C1D95;
    }
  </style>
</head>
<body>
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-title">🐰 Bunny Run: <span id="hudLevelName" style="color: #F472B6;">Level 1</span></div>
      <div class="hud-stats">
        <div class="stat-badge">❤️ <span id="livesDisplay">3</span></div>
        <div class="stat-badge">🥕 <span id="coinsDisplay">0/15</span></div>
        <div class="stat-badge">⭐ <span id="scoreDisplay">0</span></div>
        <div class="stat-badge">⏱️ <span id="timerDisplay">0s</span></div>
      </div>
      <div class="hud-actions">
        <button class="btn-icon" onclick="openLevelSelect()">📑 Level</button>
        <button class="btn-icon" onclick="restartLevel()">↺ Ulang</button>
        <button class="btn-icon" id="muteBtn" onclick="toggleAudio()">🔊</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="960" height="540"></canvas>

    <div class="touch-controls">
      <div class="touch-group">
        <button class="touch-btn" id="leftBtn">◀</button>
        <button class="touch-btn" id="rightBtn">▶</button>
      </div>
      <button class="touch-btn" id="jumpBtn">▲</button>
    </div>

    <!-- Start Overlay -->
    <div class="overlay" id="startOverlay">
      <div class="modal-box">
        <div style="font-size: 4rem; margin-bottom: 8px;">🐰</div>
        <h1 style="font-size: 2.2rem; color: #F3E8FF;">Bunny Run</h1>
        <p style="color: #F472B6; font-weight: 700; margin-bottom: 8px;">💜 Purple Adventure • 10 Levels 💜</p>
        <p style="color: #D8B4FE; font-size: 0.9rem; margin-bottom: 12px;">Petualangan kelinci lucu melompat melewati platform lavender, mengumpulkan wortel koin, dan menginjak slime ungu!</p>
        <button class="btn-main" onclick="startGame()">Mulai Main ▶</button>
        <button class="btn-icon" style="margin-top: 10px;" onclick="openLevelSelect()">📑 Pilih Level (1 - 10)</button>
      </div>
    </div>

    <!-- Level Complete Overlay -->
    <div class="overlay hidden" id="completeOverlay">
      <div class="modal-box">
        <div style="font-size: 3.5rem;">🏆</div>
        <h2 style="font-size: 2rem; color: #FDE047;">LEVEL COMPLETE!</h2>
        <p id="completeMsg" style="color: #E9D5FF; margin: 8px 0; font-size: 1rem;">Hebat! Kamu berhasil mencapai garis finish!</p>
        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 16px;">
          <button class="btn-main" id="nextLevelBtn" onclick="nextLevel()" style="margin-top: 0;">Next Level ➔</button>
          <button class="btn-icon" onclick="restartLevel()">Replay ↺</button>
          <button class="btn-icon" onclick="openLevelSelect()">Pilih Level</button>
        </div>
      </div>
    </div>

    <!-- Game Win Overlay -->
    <div class="overlay hidden" id="winOverlay">
      <div class="modal-box" style="border-color: #FDE047;">
        <div style="font-size: 4rem;">👑</div>
        <h2 style="font-size: 2.2rem; color: #FDE047;">YOU WIN!</h2>
        <p style="color: #F472B6; font-weight: 700;">Selamat! Kamu telah menamatkan ke-10 Level!</p>
        <p style="color: #E9D5FF; font-size: 0.9rem; margin: 10px 0;">Kelinci berhasil mencapai Kastil Impian Ungu!</p>
        <button class="btn-main" onclick="loadLevel(1)" style="margin-top: 10px;">Main dari Level 1 ↺</button>
        <button class="btn-icon" style="margin-top: 8px;" onclick="openLevelSelect()">Pilih Level</button>
      </div>
    </div>

    <!-- Game Over Overlay -->
    <div class="overlay hidden" id="overOverlay">
      <div class="modal-box" style="border-color: #F43F5E;">
        <div style="font-size: 3.5rem;">😢</div>
        <h2 style="font-size: 2rem; color: #FDA4AF;">GAME OVER</h2>
        <p style="color: #E9D5FF; margin: 8px 0;">Kelinci kehabisan nyawa!</p>
        <button class="btn-main" onclick="restartLevel()" style="background: linear-gradient(90deg, #F43F5E, #9333EA);">Coba Lagi ↺</button>
        <button class="btn-icon" style="margin-top: 8px;" onclick="openLevelSelect()">Pilih Level</button>
      </div>
    </div>

    <!-- Level Select Overlay -->
    <div class="overlay hidden" id="levelSelectOverlay">
      <div class="modal-box" style="max-width: 500px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #7E22CE; padding-bottom: 8px;">
          <h3 style="font-size: 1.4rem; color: #FDE047;">Pilih Level (1 - 10)</h3>
          <button class="btn-icon" onclick="closeLevelSelect()">✕</button>
        </div>
        <div class="level-grid" id="levelGridContainer"></div>
        <button class="btn-icon" onclick="resetProgress()" style="color: #FDA4AF;">Reset Progres</button>
      </div>
    </div>
  </div>

  <script>
    // Audio Synthesizer (Web Audio API)
    const AudioEngine = {
      ctx: null,
      muted: false,
      init() {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this.ctx = new AC();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      },
      playJump() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(160, this.ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.16);
        g.gain.setValueAtTime(0.18, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + 0.2);
      },
      playCoin() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(980, this.ctx.currentTime);
        o.frequency.setValueAtTime(1320, this.ctx.currentTime + 0.07);
        g.gain.setValueAtTime(0.15, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + 0.24);
      },
      playWin() {
        if (this.muted) return;
        this.init();
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.18, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
            o.connect(g);
            g.connect(this.ctx.destination);
            o.start();
            o.stop(this.ctx.currentTime + 0.38);
          }, idx * 100);
        });
      },
      playHurt() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(260, this.ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0.2, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + 0.24);
      }
    };

    // 10 Level Metadata
    const LEVELS_CONFIG = [
      { id: 1, name: 'Level 1 — Lavender Meadows', len: 2500, sky: ['#581C87', '#7E22CE', '#F3E8FF'], plat: '#7E22CE', grass: '#F3E8FF', count: 15 },
      { id: 2, name: 'Level 2 — Purple Hills', len: 2700, sky: ['#4C1D95', '#8B5CF6', '#EDE9FE'], plat: '#6D28D9', grass: '#DDD6FE', count: 16 },
      { id: 3, name: 'Level 3 — Crystal Cave', len: 2800, sky: ['#1E1B4B', '#312E81', '#4C1D95'], plat: '#581C87', grass: '#C084FC', count: 18 },
      { id: 4, name: 'Level 4 — Moonlight Forest', len: 2900, sky: ['#0F172A', '#312E81', '#581C87'], plat: '#4338CA', grass: '#A5B4FC', count: 20 },
      { id: 5, name: 'Level 5 — Purple Sky', len: 2900, sky: ['#7C3AED', '#C084FC', '#FDF4FF'], plat: '#9333EA', grass: '#F3E8FF', count: 18 },
      { id: 6, name: 'Level 6 — Mystic Ruins', len: 3000, sky: ['#3B0764', '#6B21A8', '#C084FC'], plat: '#581C87', grass: '#E9D5FF', count: 22 },
      { id: 7, name: 'Level 7 — Poison Garden', len: 3000, sky: ['#3B0764', '#701A75', '#A21CAF'], plat: '#86198F', grass: '#F472B6', count: 20 },
      { id: 8, name: 'Level 8 — Frozen Purple Mountain', len: 3100, sky: ['#1E1B4B', '#3730A3', '#818CF8'], plat: '#4338CA', grass: '#E0E7FF', count: 22 },
      { id: 9, name: 'Level 9 — Dark Castle', len: 3200, sky: ['#180828', '#2E1065', '#581C87'], plat: '#3B0764', grass: '#C084FC', count: 24 },
      { id: 10, name: 'Level 10 — Purple Dream Castle', len: 3300, sky: ['#3B0764', '#7C3AED', '#FDE047'], plat: '#6D28D9', grass: '#FEF08A', count: 25 }
    ];

    // Local Storage Progress
    function getUnlockedLevel() {
      try {
        const val = localStorage.getItem('bunny_run_unlocked_level');
        return val ? parseInt(val, 10) : 1;
      } catch (e) { return 1; }
    }
    function saveUnlockedLevel(lvl) {
      try {
        const cur = getUnlockedLevel();
        if (lvl > cur) localStorage.setItem('bunny_run_unlocked_level', Math.min(10, lvl));
      } catch (e) {}
    }
    function resetProgress() {
      if (confirm('Reset progres level kembali ke Level 1?')) {
        localStorage.removeItem('bunny_run_unlocked_level');
        openLevelSelect();
      }
    }

    // Canvas Setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let currentLevelId = 1;
    let unlockedLevel = getUnlockedLevel();
    let gameState = 'START';
    let coins = 0;
    let totalCoins = 15;
    let score = 0;
    let lives = 3;
    let timer = 0;
    let timerInterval = null;

    let cameraX = 0;
    let bunny = { x: 70, y: 380, width: 36, height: 44, vx: 0, vy: 0, isGrounded: false, facing: 'right' };
    let keys = { left: false, right: false, jump: false };
    let platforms = [];
    let coinsList = [];
    let enemies = [];
    let hazards = [];
    let finish = { x: 2280, y: 350, width: 65, height: 100 };
    let currentTheme = LEVELS_CONFIG[0];

    function buildLevelData(lvlId) {
      currentTheme = LEVELS_CONFIG[lvlId - 1] || LEVELS_CONFIG[0];
      const W = currentTheme.len;
      platforms = [
        { x: 0, y: 450, width: 380, height: 150 },
        { x: 260, y: 360, width: 110, height: 25 },
        { x: 420, y: 290, width: 110, height: 25 },
        { x: 570, y: 220, width: 110, height: 25 },
        { x: 720, y: 450, width: 420, height: 150 },
        { x: 860, y: 330, width: 110, height: 25 },
        { x: 1020, y: 250, width: 110, height: 25 },
        { x: 1240, y: 450, width: 440, height: 150 },
        { x: 1740, y: 360, width: 110, height: 25 },
        { x: 1980, y: 290, width: 110, height: 25 },
        { x: 2180, y: 360, width: 110, height: 25 },
        { x: 2400, y: 450, width: W - 2400 + 100, height: 150 }
      ];

      finish = { x: W - 220, y: 350, width: 65, height: 100 };
      hazards = [
        { x: 820, y: 425, width: 70, height: 25 },
        { x: 1360, y: 425, width: 70, height: 25 }
      ];

      enemies = [
        { x: 920, y: 410, width: 40, height: 38, vx: 1.2, startX: 860, dist: 180, squished: false },
        { x: 1450, y: 410, width: 40, height: 38, vx: -1.3, startX: 1380, dist: 180, squished: false }
      ];

      totalCoins = currentTheme.count;
      coinsList = [];
      const step = (W - 300) / totalCoins;
      for (let i = 0; i < totalCoins; i++) {
        coinsList.push({
          x: 150 + i * step,
          y: 280 + Math.sin(i * 1.2) * 110,
          radius: 14,
          collected: false
        });
      }
    }

    function loadLevel(lvlId) {
      currentLevelId = Math.max(1, Math.min(10, lvlId));
      buildLevelData(currentLevelId);
      bunny = { x: 70, y: 380, width: 36, height: 44, vx: 0, vy: 0, isGrounded: false, facing: 'right' };
      cameraX = 0;
      coins = 0;
      lives = 3;
      timer = 0;
      updateHUD();
      closeOverlays();
      gameState = 'PLAYING';
      clearInterval(timerInterval);
      timerInterval = setInterval(() => { timer++; updateHUD(); }, 1000);
    }

    function updateHUD() {
      document.getElementById('hudLevelName').textContent = 'Lv ' + currentLevelId + ' ' + currentTheme.name.split('—')[1];
      document.getElementById('livesDisplay').textContent = lives;
      document.getElementById('coinsDisplay').textContent = coins + '/' + totalCoins;
      document.getElementById('scoreDisplay').textContent = score;
      document.getElementById('timerDisplay').textContent = timer + 's';
    }

    function closeOverlays() {
      document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    }

    function startGame() {
      AudioEngine.init();
      loadLevel(1);
    }

    function restartLevel() {
      loadLevel(currentLevelId);
    }

    function nextLevel() {
      if (currentLevelId < 10) {
        loadLevel(currentLevelId + 1);
      } else {
        document.getElementById('winOverlay').classList.remove('hidden');
      }
    }

    function openLevelSelect() {
      closeOverlays();
      unlockedLevel = getUnlockedLevel();
      const cont = document.getElementById('levelGridContainer');
      cont.innerHTML = '';
      LEVELS_CONFIG.forEach(lvl => {
        const isUnlocked = lvl.id <= unlockedLevel;
        const btn = document.createElement('button');
        btn.className = 'level-card ' + (isUnlocked ? 'unlocked' : 'locked');
        btn.innerHTML = '<strong>' + (isUnlocked ? '🔓 ' : '🔒 ') + lvl.name + '</strong><br><span style="font-size:0.75rem; color:#D8B4FE;">🥕 ' + lvl.count + ' Koin</span>';
        if (isUnlocked) {
          btn.onclick = () => { loadLevel(lvl.id); closeLevelSelect(); };
        }
        cont.appendChild(btn);
      });
      document.getElementById('levelSelectOverlay').classList.remove('hidden');
    }

    function closeLevelSelect() {
      document.getElementById('levelSelectOverlay').classList.add('hidden');
    }

    function toggleAudio() {
      AudioEngine.muted = !AudioEngine.muted;
      document.getElementById('muteBtn').textContent = AudioEngine.muted ? '🔇' : '🔊';
    }

    // Input Handlers
    window.addEventListener('keydown', e => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
      if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) {
        if (!keys.jump && bunny.isGrounded) {
          bunny.vy = -11.5;
          AudioEngine.playJump();
        }
        keys.jump = true;
      }
      if (e.code === 'KeyR') restartLevel();
    });
    window.addEventListener('keyup', e => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
      if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) keys.jump = false;
    });

    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      el.addEventListener('touchstart', e => { e.preventDefault(); if (action === 'jump' && bunny.isGrounded) { bunny.vy = -11.5; AudioEngine.playJump(); } else keys[action] = true; });
      el.addEventListener('touchend', e => { e.preventDefault(); keys[action] = false; });
      el.addEventListener('mousedown', () => { if (action === 'jump' && bunny.isGrounded) { bunny.vy = -11.5; AudioEngine.playJump(); } else keys[action] = true; });
      el.addEventListener('mouseup', () => keys[action] = false);
    };
    bindTouch('leftBtn', 'left');
    bindTouch('rightBtn', 'right');
    bindTouch('jumpBtn', 'jump');

    // Game Physics & Loop
    function update() {
      if (gameState !== 'PLAYING') return;

      if (keys.left) { bunny.vx = -4.8; bunny.facing = 'left'; }
      else if (keys.right) { bunny.vx = 4.8; bunny.facing = 'right'; }
      else { bunny.vx *= 0.78; if (Math.abs(bunny.vx) < 0.1) bunny.vx = 0; }

      bunny.vy += 0.52;
      bunny.x += bunny.vx;
      bunny.y += bunny.vy;

      // Platform Collision
      bunny.isGrounded = false;
      platforms.forEach(p => {
        if (bunny.x + bunny.width > p.x && bunny.x < p.x + p.width) {
          if (bunny.vy >= 0 && bunny.y + bunny.height >= p.y && bunny.y + bunny.height <= p.y + 16) {
            bunny.y = p.y - bunny.height;
            bunny.vy = 0;
            bunny.isGrounded = true;
          }
        }
      });

      // Coin Collection
      coinsList.forEach(c => {
        if (!c.collected && Math.hypot(bunny.x + bunny.width / 2 - c.x, bunny.y + bunny.height / 2 - c.y) < 28) {
          c.collected = true;
          coins++;
          score += 100;
          AudioEngine.playCoin();
          updateHUD();
        }
      });

      // Enemy logic
      enemies.forEach(e => {
        if (e.squished) return;
        e.x += e.vx;
        if (e.x > e.startX + e.dist || e.x < e.startX) e.vx *= -1;

        if (bunny.x < e.x + e.width && bunny.x + bunny.width > e.x &&
            bunny.y < e.y + e.height && bunny.y + bunny.height > e.y) {
          if (bunny.vy > 0 && bunny.y + bunny.height <= e.y + 24) {
            e.squished = true;
            bunny.vy = -8.5;
            score += 200;
            AudioEngine.playCoin();
          } else {
            lives--;
            AudioEngine.playHurt();
            updateHUD();
            if (lives <= 0) {
              gameState = 'GAME_OVER';
              document.getElementById('overOverlay').classList.remove('hidden');
            } else {
              bunny.x = Math.max(80, bunny.x - 150);
              bunny.y = 200;
              bunny.vy = 0;
            }
          }
        }
      });

      // Hazard collision
      hazards.forEach(h => {
        if (bunny.x < h.x + h.width && bunny.x + bunny.width > h.x &&
            bunny.y < h.y + h.height && bunny.y + bunny.height > h.y) {
          lives--;
          AudioEngine.playHurt();
          updateHUD();
          if (lives <= 0) {
            gameState = 'GAME_OVER';
            document.getElementById('overOverlay').classList.remove('hidden');
          } else {
            bunny.x = Math.max(80, bunny.x - 150);
            bunny.y = 200;
            bunny.vy = 0;
          }
        }
      });

      // Abyss check
      if (bunny.y > 620) {
        lives--;
        AudioEngine.playHurt();
        updateHUD();
        if (lives <= 0) {
          gameState = 'GAME_OVER';
          document.getElementById('overOverlay').classList.remove('hidden');
        } else {
          bunny.x = Math.max(80, bunny.x - 200);
          bunny.y = 200;
          bunny.vy = 0;
        }
      }

      // Finish Check
      if (bunny.x < finish.x + finish.width && bunny.x + bunny.width > finish.x &&
          bunny.y < finish.y + finish.height && bunny.y + bunny.height > finish.y) {
        gameState = 'LEVEL_COMPLETE';
        clearInterval(timerInterval);
        AudioEngine.playWin();
        score += lives * 500;
        saveUnlockedLevel(currentLevelId + 1);

        if (currentLevelId >= 10) {
          document.getElementById('winOverlay').classList.remove('hidden');
        } else {
          document.getElementById('completeMsg').textContent = 'Selamat! ' + currentTheme.name + ' Selesai! 🎉';
          document.getElementById('completeOverlay').classList.remove('hidden');
        }
      }

      // Camera Follow
      cameraX += (bunny.x - 360 - cameraX) * 0.1;
      if (cameraX < 0) cameraX = 0;
      if (cameraX > currentTheme.len - 960) cameraX = currentTheme.len - 960;
    }

    function render() {
      // Background Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 540);
      grad.addColorStop(0, currentTheme.sky[0]);
      grad.addColorStop(0.5, currentTheme.sky[1]);
      grad.addColorStop(1, currentTheme.sky[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 960, 540);

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Draw Platforms
      platforms.forEach(p => {
        ctx.fillStyle = currentTheme.plat;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, p.height, 8);
        ctx.fill();
        ctx.fillStyle = currentTheme.grass;
        ctx.fillRect(p.x, p.y, p.width, 8);
      });

      // Draw Spikes
      hazards.forEach(h => {
        ctx.fillStyle = '#C026D3';
        const count = 4;
        const w = h.width / count;
        for (let i = 0; i < count; i++) {
          ctx.beginPath();
          ctx.moveTo(h.x + i * w, h.y + h.height);
          ctx.lineTo(h.x + (i + 0.5) * w, h.y);
          ctx.lineTo(h.x + (i + 1) * w, h.y + h.height);
          ctx.fill();
        }
      });

      // Draw Coins
      coinsList.forEach(c => {
        if (c.collected) return;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Slimes
      enemies.forEach(e => {
        if (e.squished) return;
        ctx.fillStyle = '#A855F7';
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2, Math.PI, 0);
        ctx.lineTo(e.x + e.width, e.y + e.height);
        ctx.lineTo(e.x, e.y + e.height);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(e.x + 12, e.y + 16, 4, 0, Math.PI * 2);
        ctx.arc(e.x + 28, e.y + 16, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Finish Arch
      ctx.fillStyle = '#E879F9';
      ctx.fillRect(finish.x, finish.y, finish.width, finish.height);
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 16px Nunito';
      ctx.fillText('FINISH', finish.x + 4, finish.y - 10);

      // Draw Cute Bunny
      ctx.fillStyle = '#FAF5FF';
      ctx.beginPath();
      ctx.roundRect(bunny.x, bunny.y + 10, bunny.width, bunny.height - 10, 10);
      ctx.fill();
      // Bunny Ears
      ctx.fillStyle = '#F3E8FF';
      ctx.fillRect(bunny.x + 6, bunny.y - 12, 8, 22);
      ctx.fillRect(bunny.x + bunny.width - 14, bunny.y - 12, 8, 22);
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(bunny.x + 8, bunny.y - 8, 4, 16);
      ctx.fillRect(bunny.x + bunny.width - 12, bunny.y - 8, 4, 16);
      // Bunny Face
      ctx.fillStyle = '#581C87';
      const eyeX = bunny.facing === 'right' ? bunny.x + 22 : bunny.x + 10;
      ctx.beginPath();
      ctx.arc(eyeX, bunny.y + 22, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(bunny.x + bunny.width / 2, bunny.y + 26, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      requestAnimationFrame(() => { update(); render(); });
    }

    buildLevelData(1);
    render();
  </script>
</body>
</html>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vanillaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtmlFile = () => {
    const blob = new Blob([vanillaCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="vanilla-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-gradient-to-b from-purple-900 via-purple-950 to-indigo-950 border-4 border-purple-400 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-800 rounded-lg text-pink-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Ekspor 10 Level Vanilla HTML (GitHub Pages)</h3>
              <p className="text-xs text-purple-300">File mandiri murni HTML, CSS, & JS tanpa framework</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-purple-950/70 border border-purple-700/60 rounded-xl p-4 text-sm text-purple-200 leading-relaxed">
            <p className="font-semibold text-amber-300 mb-1">🚀 Cara Upload ke GitHub Pages (Pemula):</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-purple-200">
              <li>Klik tombol <strong>Download index.html</strong> di bawah.</li>
              <li>Buka repositori baru di GitHub Anda (misal: <code>bunny-run</code>).</li>
              <li>Upload file <code>index.html</code> ke branch <code>main</code>.</li>
              <li>Buka <strong>Settings &gt; Pages</strong> di GitHub, pilih <code>Deploy from a branch (main / root)</code>.</li>
              <li>Game 10 level langsung online dan bisa dimainkan teman-temanmu!</li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-mono text-purple-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-400" /> index.html (Pure Vanilla 10 Levels)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-purple-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin!' : 'Salin Semua'}
                </button>
                <button
                  onClick={downloadHtmlFile}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
              </div>
            </div>
            <pre className="bg-purple-950 text-purple-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-purple-800/80 leading-normal selection:bg-purple-700">
              {vanillaCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-purple-800 bg-purple-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-purple-200 rounded-lg text-sm font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
