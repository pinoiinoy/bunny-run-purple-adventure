import { LevelData } from './types';

export interface LevelMeta {
  id: number;
  name: string;
  subtitle: string;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  coinsTotal: number;
}

export const LEVELS_METADATA: LevelMeta[] = [
  { id: 1, name: 'Level 1 — Lavender Meadows', subtitle: 'Tutorial & pengenalan kontrol kelinci', theme: 'Padang Rumput Lavender', difficulty: 'Easy', coinsTotal: 15 },
  { id: 2, name: 'Level 2 — Purple Hills', subtitle: 'Bukit bergelombang & platform bergerak', theme: 'Perbukitan Violet', difficulty: 'Easy', coinsTotal: 16 },
  { id: 3, name: 'Level 3 — Crystal Cave', subtitle: 'Gua bertingkat & kristal ungu bercahaya', theme: 'Gua Kristal Amethyst', difficulty: 'Medium', coinsTotal: 18 },
  { id: 4, name: 'Level 4 — Moonlight Forest', subtitle: 'Hutan malam misterius dengan cahaya bulan', theme: 'Hutan Malam Indigo', difficulty: 'Medium', coinsTotal: 20 },
  { id: 5, name: 'Level 5 — Purple Sky', subtitle: 'Platform melayang di langit dengan checkpoint', theme: 'Langit Awan Lavender', difficulty: 'Medium', coinsTotal: 18 },
  { id: 6, name: 'Level 6 — Mystic Ruins', subtitle: 'Pilar batu kuno dengan jurang reruntuhan', theme: 'Reruntuhan Kuno', difficulty: 'Hard', coinsTotal: 22 },
  { id: 7, name: 'Level 7 — Poison Garden', subtitle: 'Taman berbahaya penuh duri & timing lompat', theme: 'Taman Beracun Magenta', difficulty: 'Hard', coinsTotal: 20 },
  { id: 8, name: 'Level 8 — Frozen Purple Mountain', subtitle: 'Puncak es licin dengan mekanik meluncur', theme: 'Puncak Es Ungu Dingin', difficulty: 'Hard', coinsTotal: 22 },
  { id: 9, name: 'Level 9 — Dark Castle', subtitle: 'Benteng kastil gelap & checkpoint tantangan', theme: 'Benteng Kastil Kelam', difficulty: 'Expert', coinsTotal: 24 },
  { id: 10, name: 'Level 10 — Purple Dream Castle', subtitle: 'Kastil impian puncak menggabungkan semua mekanik!', theme: 'Kastil Impian Emas & Ungu', difficulty: 'Expert', coinsTotal: 25 },
];

export function getLevel(id: number): LevelData {
  switch (id) {
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
    case 3:
      return createLevel3();
    case 4:
      return createLevel4();
    case 5:
      return createLevel5();
    case 6:
      return createLevel6();
    case 7:
      return createLevel7();
    case 8:
      return createLevel8();
    case 9:
      return createLevel9();
    case 10:
      return createLevel10();
    default:
      return createLevel1();
  }
}

// -------------------------------------------------------------
// LEVEL 1: Lavender Meadows (Tutorial & Easiest)
// -------------------------------------------------------------
function createLevel1(): LevelData {
  return {
    id: 1,
    name: 'Level 1 — Lavender Meadows',
    width: 2300,
    height: 600,
    spawnPoint: { x: 80, y: 380 },
    theme: {
      skyGradient: ['#581C87', '#7E22CE', '#F3E8FF'],
      mountainColor: '#6B21A8',
      platformColor: '#7E22CE',
      grassColor: '#F3E8FF',
      subtitle: 'Tutorial & Padang Lavender',
      badge: '🌸',
      themeType: 'meadows',
    },
    tutorialSigns: [
      { x: 180, y: 370, text: 'Gunakan Tombol Panah atau A / D', subtext: 'Untuk bergerak ke kiri & kanan' },
      { x: 580, y: 370, text: 'Tekan SPASI atau W / ↑', subtext: 'Untuk melompat ke atas platform!' },
      { x: 1100, y: 370, text: 'Injak Slime dari Atas!', subtext: 'Injak kepala musuh untuk mengalahkannya' },
      { x: 1750, y: 370, text: 'Waspada Duri Amethyst!', subtext: 'Lompati duri kristal agar tidak terluka' },
    ],
    finish: { x: 2100, y: 350, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      // Safe tutorial ground with gentle steps
      { x: 0, y: 460, width: 500, height: 140, type: 'ground' },
      { x: 320, y: 370, width: 120, height: 26, type: 'floating' },
      { x: 480, y: 300, width: 120, height: 26, type: 'floating' },
      { x: 520, y: 460, width: 550, height: 140, type: 'ground' },
      { x: 740, y: 360, width: 120, height: 26, type: 'floating' },
      { x: 920, y: 280, width: 120, height: 26, type: 'floating' },
      // Flat section with 1 slow slime
      { x: 1090, y: 460, width: 500, height: 140, type: 'ground' },
      // Easy jump over 1 small hazard
      { x: 1610, y: 460, width: 690, height: 140, type: 'ground' },
      { x: 1700, y: 360, width: 130, height: 26, type: 'floating' },
      { x: 1890, y: 290, width: 130, height: 26, type: 'floating' },
    ],
    hazards: [
      // Only 1 small, very visible hazard
      { x: 1380, y: 435, width: 60, height: 25, count: 3, hazardType: 'crystal' },
    ],
    enemies: [
      // Slow friendly teaching slime
      { id: 101, x: 1220, y: 420, width: 40, height: 38, vx: 0.9, startX: 1140, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 0 },
      { id: 102, x: 1980, y: 420, width: 40, height: 38, vx: 0.9, startX: 1940, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 0.8 },
    ],
    coins: [
      { id: 1, x: 160, y: 410, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 260, y: 410, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.3 },
      { id: 3, x: 380, y: 320, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.6 },
      { id: 4, x: 540, y: 250, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.9 },
      { id: 5, x: 680, y: 410, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.2 },
      { id: 6, x: 800, y: 310, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 7, x: 980, y: 230, radius: 14, collected: false, rotation: 1.8, bobOffset: 1.8 },
      { id: 8, x: 1160, y: 410, radius: 14, collected: false, rotation: 2.1, bobOffset: 2.1 },
      { id: 9, x: 1300, y: 410, radius: 14, collected: false, rotation: 2.4, bobOffset: 2.4 },
      { id: 10, x: 1520, y: 410, radius: 14, collected: false, rotation: 2.7, bobOffset: 2.7 },
      { id: 11, x: 1765, y: 310, radius: 14, collected: false, rotation: 3.0, bobOffset: 0.4 },
      { id: 12, x: 1955, y: 240, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.0 },
      { id: 13, x: 2040, y: 410, radius: 14, collected: false, rotation: 0.6, bobOffset: 1.6 },
      { id: 14, x: 2180, y: 410, radius: 14, collected: false, rotation: 0.9, bobOffset: 2.2 },
      { id: 15, x: 2240, y: 380, radius: 14, collected: false, rotation: 1.2, bobOffset: 0.8 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 2: Purple Hills (Higher, wider platforms & moving platforms)
// -------------------------------------------------------------
function createLevel2(): LevelData {
  return {
    id: 2,
    name: 'Level 2 — Purple Hills',
    width: 2700,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#4C1D95', '#8B5CF6', '#EDE9FE'],
      mountainColor: '#5B21B6',
      platformColor: '#6D28D9',
      grassColor: '#DDD6FE',
      subtitle: 'Bukit Bergelombang & Platform Bergerak',
      badge: '🌄',
      themeType: 'hills',
    },
    finish: { x: 2500, y: 350, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 380, height: 150, type: 'ground' },
      // Elevated rolling hill steps
      { x: 280, y: 360, width: 110, height: 26, type: 'floating' },
      { x: 440, y: 280, width: 110, height: 26, type: 'floating' },
      { x: 600, y: 210, width: 110, height: 26, type: 'floating' },
      // First moving platform across a valley
      { x: 760, y: 310, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.5, initialX: 760, moveDirection: 1 },
      // Next hill summit
      { x: 1040, y: 450, width: 420, height: 150, type: 'ground' },
      { x: 1180, y: 340, width: 110, height: 26, type: 'floating' },
      { x: 1330, y: 260, width: 110, height: 26, type: 'floating' },
      // Second moving platform across high chasm
      { x: 1500, y: 330, width: 110, height: 25, type: 'moving', moveRange: 140, moveSpeed: 1.7, initialX: 1500, moveDirection: 1 },
      // Plateau with slimes
      { x: 1780, y: 450, width: 440, height: 150, type: 'ground' },
      // Third moving platform leading to goal
      { x: 2060, y: 360, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 2060, moveDirection: -1 },
      { x: 2320, y: 450, width: 380, height: 150, type: 'ground' },
    ],
    hazards: [
      { x: 1120, y: 425, width: 60, height: 25, count: 3, hazardType: 'crystal' },
      { x: 1880, y: 425, width: 70, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      // 4 purple slimes across different hill levels
      { id: 201, x: 200, y: 410, width: 40, height: 38, vx: 1.1, startX: 150, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 0 },
      { id: 202, x: 1100, y: 410, width: 40, height: 38, vx: 1.3, startX: 1060, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 0.5 },
      { id: 203, x: 1820, y: 410, width: 40, height: 38, vx: -1.2, startX: 1780, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 1.0 },
      { id: 204, x: 2380, y: 410, width: 40, height: 38, vx: 1.2, startX: 2340, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 1.5 },
    ],
    coins: [
      { id: 1, x: 160, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 335, y: 310, radius: 14, collected: false, rotation: 0.4, bobOffset: 0.4 },
      { id: 3, x: 495, y: 230, radius: 14, collected: false, rotation: 0.8, bobOffset: 0.8 },
      { id: 4, x: 655, y: 160, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.2 },
      { id: 5, x: 825, y: 260, radius: 14, collected: false, rotation: 1.6, bobOffset: 1.6 },
      { id: 6, x: 1090, y: 400, radius: 14, collected: false, rotation: 2.0, bobOffset: 2.0 },
      { id: 7, x: 1235, y: 290, radius: 14, collected: false, rotation: 2.4, bobOffset: 2.4 },
      { id: 8, x: 1385, y: 210, radius: 14, collected: false, rotation: 2.8, bobOffset: 0.3 },
      { id: 9, x: 1570, y: 280, radius: 14, collected: false, rotation: 0.2, bobOffset: 0.9 },
      { id: 10, x: 1840, y: 400, radius: 14, collected: false, rotation: 0.6, bobOffset: 1.5 },
      { id: 11, x: 1960, y: 400, radius: 14, collected: false, rotation: 1.0, bobOffset: 2.1 },
      { id: 12, x: 2125, y: 310, radius: 14, collected: false, rotation: 1.4, bobOffset: 0.5 },
      { id: 13, x: 2260, y: 360, radius: 14, collected: false, rotation: 1.8, bobOffset: 1.1 },
      { id: 14, x: 2420, y: 400, radius: 14, collected: false, rotation: 2.2, bobOffset: 1.7 },
      { id: 15, x: 2470, y: 370, radius: 14, collected: false, rotation: 2.6, bobOffset: 2.3 },
      { id: 16, x: 2540, y: 400, radius: 14, collected: false, rotation: 3.0, bobOffset: 0.7 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 3: Crystal Cave (Tiered platforms, dark cave & glowing crystals)
// -------------------------------------------------------------
function createLevel3(): LevelData {
  return {
    id: 3,
    name: 'Level 3 — Crystal Cave',
    width: 2800,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#1E1B4B', '#2E1065', '#3B0764'],
      mountainColor: '#3B0764',
      platformColor: '#581C87',
      grassColor: '#C084FC',
      subtitle: 'Gua Kristal Bertingkat Amethyst',
      badge: '💎',
      themeType: 'crystal',
    },
    finish: { x: 2580, y: 350, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      // Cave entrance
      { x: 0, y: 450, width: 340, height: 150, type: 'ground' },
      // Tier 1 (Lower) & Tier 2 (Upper) cavern routes!
      { x: 260, y: 350, width: 110, height: 26, type: 'floating' },
      { x: 400, y: 250, width: 160, height: 26, type: 'floating' },
      { x: 590, y: 180, width: 180, height: 26, type: 'floating' },
      // Lower ground with crystal spikes
      { x: 380, y: 450, width: 440, height: 150, type: 'ground' },
      // Mid cavern tiered structure
      { x: 860, y: 380, width: 140, height: 26, type: 'floating' },
      { x: 1030, y: 280, width: 150, height: 26, type: 'floating' },
      { x: 1210, y: 190, width: 160, height: 26, type: 'floating' },
      { x: 920, y: 460, width: 460, height: 140, type: 'ground' },
      // Deep cave chamber with moving crystal platform
      { x: 1420, y: 320, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.6, initialX: 1420, moveDirection: 1 },
      { x: 1680, y: 450, width: 440, height: 150, type: 'ground' },
      { x: 1800, y: 330, width: 120, height: 26, type: 'floating' },
      { x: 1960, y: 240, width: 130, height: 26, type: 'floating' },
      // Crystal bridge to exit
      { x: 2140, y: 340, width: 110, height: 25, type: 'moving', moveRange: 120, moveSpeed: 1.5, initialX: 2140, moveDirection: -1 },
      { x: 2380, y: 450, width: 420, height: 150, type: 'ground' },
    ],
    hazards: [
      // Multiple crystal stalagmite hazards
      { x: 480, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1040, y: 435, width: 90, height: 25, count: 5, hazardType: 'crystal' },
      { x: 1860, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 2450, y: 425, width: 70, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      { id: 301, x: 200, y: 410, width: 40, height: 38, vx: 1.2, startX: 160, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0 },
      { id: 302, x: 420, y: 210, width: 36, height: 34, vx: 1.1, startX: 410, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 0.6 },
      { id: 303, x: 1220, y: 150, width: 36, height: 34, vx: 1.2, startX: 1210, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 1.2 },
      { id: 304, x: 1720, y: 410, width: 40, height: 38, vx: -1.3, startX: 1690, patrolDistance: 150, squished: false, squishTimer: 0, wobble: 0.4 },
    ],
    coins: [
      { id: 1, x: 170, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 315, y: 300, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.5 },
      { id: 3, x: 480, y: 200, radius: 14, collected: false, rotation: 0.6, bobOffset: 1.0 },
      { id: 4, x: 680, y: 130, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.5 },
      { id: 5, x: 620, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 2.0 },
      { id: 6, x: 730, y: 400, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.5 },
      { id: 7, x: 930, y: 330, radius: 14, collected: false, rotation: 1.8, bobOffset: 0.3 },
      { id: 8, x: 1105, y: 230, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.8 },
      { id: 9, x: 1290, y: 140, radius: 14, collected: false, rotation: 2.4, bobOffset: 1.3 },
      { id: 10, x: 1180, y: 410, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.8 },
      { id: 11, x: 1480, y: 270, radius: 14, collected: false, rotation: 3.0, bobOffset: 2.3 },
      { id: 12, x: 1740, y: 400, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.6 },
      { id: 13, x: 1860, y: 280, radius: 14, collected: false, rotation: 0.6, bobOffset: 1.1 },
      { id: 14, x: 2025, y: 190, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.6 },
      { id: 15, x: 2200, y: 290, radius: 14, collected: false, rotation: 1.2, bobOffset: 2.1 },
      { id: 16, x: 2410, y: 400, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.6 },
      { id: 17, x: 2520, y: 370, radius: 14, collected: false, rotation: 1.8, bobOffset: 0.4 },
      { id: 18, x: 2630, y: 400, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.9 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 4: Moonlight Forest (Night forest, moon & trees, tricky branches)
// -------------------------------------------------------------
function createLevel4(): LevelData {
  return {
    id: 4,
    name: 'Level 4 — Moonlight Forest',
    width: 3000,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#0F172A', '#1E1B4B', '#312E81'],
      mountainColor: '#1E1B4B',
      platformColor: '#4338CA',
      grassColor: '#A5B4FC',
      subtitle: 'Hutan Malam Berbintang & Bulan Bercahaya',
      badge: '🌙',
      themeType: 'forest',
    },
    finish: { x: 2780, y: 350, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 340, height: 150, type: 'ground' },
      // Elevated enchanted branch platforms
      { x: 270, y: 360, width: 100, height: 24, type: 'floating' },
      { x: 420, y: 270, width: 110, height: 24, type: 'floating' },
      { x: 570, y: 190, width: 120, height: 24, type: 'floating' },
      { x: 740, y: 450, width: 380, height: 150, type: 'ground' },
      { x: 860, y: 340, width: 110, height: 24, type: 'floating' },
      { x: 1010, y: 240, width: 110, height: 24, type: 'floating' },
      // Forest clearing with moving canopy platform
      { x: 1180, y: 320, width: 110, height: 24, type: 'moving', moveRange: 130, moveSpeed: 1.7, initialX: 1180, moveDirection: 1 },
      { x: 1440, y: 450, width: 420, height: 150, type: 'ground' },
      { x: 1560, y: 350, width: 110, height: 24, type: 'floating' },
      { x: 1710, y: 260, width: 110, height: 24, type: 'floating' },
      { x: 1870, y: 180, width: 120, height: 24, type: 'floating' },
      // Second high branch crossing
      { x: 2040, y: 280, width: 110, height: 24, type: 'moving', moveRange: 130, moveSpeed: 1.9, initialX: 2040, moveDirection: -1 },
      { x: 2280, y: 370, width: 120, height: 24, type: 'floating' },
      { x: 2460, y: 290, width: 120, height: 24, type: 'floating' },
      { x: 2640, y: 450, width: 360, height: 150, type: 'ground' },
    ],
    hazards: [
      { x: 820, y: 425, width: 70, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1520, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1740, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      // 5 sneaky nocturnal purple slimes
      { id: 401, x: 180, y: 410, width: 40, height: 38, vx: 1.2, startX: 140, patrolDistance: 150, squished: false, squishTimer: 0, wobble: 0 },
      { id: 402, x: 920, y: 410, width: 40, height: 38, vx: -1.3, startX: 890, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 0.6 },
      { id: 403, x: 1620, y: 410, width: 40, height: 38, vx: 1.4, startX: 1580, patrolDistance: 160, squished: false, squishTimer: 0, wobble: 1.1 },
      { id: 404, x: 1880, y: 140, width: 36, height: 34, vx: 1.0, startX: 1870, patrolDistance: 90, squished: false, squishTimer: 0, wobble: 0.3 },
      { id: 405, x: 2700, y: 410, width: 40, height: 38, vx: 1.3, startX: 2660, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.9 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 320, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 475, y: 220, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 630, y: 140, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 780, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 915, y: 290, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1065, y: 190, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1240, y: 270, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1480, y: 400, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1615, y: 300, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1765, y: 210, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 1930, y: 130, radius: 14, collected: false, rotation: 0.2, bobOffset: 1.9 },
      { id: 13, x: 2100, y: 230, radius: 14, collected: false, rotation: 0.5, bobOffset: 2.3 },
      { id: 14, x: 2340, y: 320, radius: 14, collected: false, rotation: 0.8, bobOffset: 0.5 },
      { id: 15, x: 2520, y: 240, radius: 14, collected: false, rotation: 1.1, bobOffset: 1.0 },
      { id: 16, x: 2680, y: 400, radius: 14, collected: false, rotation: 1.4, bobOffset: 1.5 },
      { id: 17, x: 2730, y: 360, radius: 14, collected: false, rotation: 1.7, bobOffset: 2.0 },
      { id: 18, x: 2840, y: 380, radius: 14, collected: false, rotation: 2.0, bobOffset: 0.2 },
      { id: 19, x: 2900, y: 400, radius: 14, collected: false, rotation: 2.3, bobOffset: 0.8 },
      { id: 20, x: 2950, y: 370, radius: 14, collected: false, rotation: 2.6, bobOffset: 1.4 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 5: Purple Sky (High altitude, floating cloud platforms, checkpoint)
// -------------------------------------------------------------
function createLevel5(): LevelData {
  return {
    id: 5,
    name: 'Level 5 — Purple Sky',
    width: 3000,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#38BDF8', '#818CF8', '#C084FC'],
      mountainColor: '#6366F1',
      platformColor: '#A855F7',
      grassColor: '#FFFFFF',
      subtitle: 'Langit Awan Lavender & Checkpoint Udara',
      badge: '☁️',
      themeType: 'sky',
    },
    checkpoints: [
      { id: 501, x: 1380, y: 310, width: 34, height: 60, activated: false, label: 'Sky Checkpoint' },
    ],
    finish: { x: 2780, y: 340, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      // Starting launch pad
      { x: 0, y: 450, width: 320, height: 150, type: 'ground' },
      // Floating cloud platforms in mid-air (no floor beneath!)
      { x: 280, y: 370, width: 110, height: 26, type: 'floating', isCloud: true },
      { x: 440, y: 290, width: 110, height: 26, type: 'floating', isCloud: true },
      { x: 600, y: 210, width: 110, height: 26, type: 'floating', isCloud: true },
      // Moving cloud platform
      { x: 760, y: 280, width: 120, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.6, initialX: 760, moveDirection: 1, isCloud: true },
      { x: 1030, y: 350, width: 120, height: 26, type: 'floating', isCloud: true },
      { x: 1200, y: 270, width: 120, height: 26, type: 'floating', isCloud: true },
      // Mid-sky island where checkpoint sits!
      { x: 1350, y: 370, width: 280, height: 40, type: 'floating' },
      // Moving cloud across second abyss
      { x: 1680, y: 320, width: 120, height: 25, type: 'moving', moveRange: 140, moveSpeed: 1.8, initialX: 1680, moveDirection: 1, isCloud: true },
      { x: 1960, y: 250, width: 110, height: 26, type: 'floating', isCloud: true },
      { x: 2120, y: 180, width: 110, height: 26, type: 'floating', isCloud: true },
      // Third moving cloud
      { x: 2290, y: 270, width: 120, height: 25, type: 'moving', moveRange: 130, moveSpeed: 2.0, initialX: 2290, moveDirection: -1, isCloud: true },
      { x: 2520, y: 360, width: 120, height: 26, type: 'floating', isCloud: true },
      { x: 2700, y: 440, width: 300, height: 160, type: 'ground' },
    ],
    hazards: [
      { x: 1450, y: 345, width: 70, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      { id: 501, x: 180, y: 410, width: 40, height: 38, vx: 1.0, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 502, x: 1480, y: 330, width: 36, height: 34, vx: 1.1, startX: 1420, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.7 },
      { id: 503, x: 2740, y: 400, width: 40, height: 38, vx: 1.2, startX: 2710, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 1.3 },
    ],
    coins: [
      { id: 1, x: 160, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 335, y: 320, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 495, y: 240, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 655, y: 160, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 820, y: 230, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 1090, y: 300, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1260, y: 220, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1410, y: 320, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1560, y: 320, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1740, y: 270, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 2015, y: 200, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 2175, y: 130, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2350, y: 220, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2580, y: 310, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2750, y: 390, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2800, y: 360, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 2860, y: 390, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 2920, y: 360, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 6: Mystic Ruins (Ancient pillars, broken stone masonry, pits, checkpoint)
// -------------------------------------------------------------
function createLevel6(): LevelData {
  return {
    id: 6,
    name: 'Level 6 — Mystic Ruins',
    width: 3100,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#312E81', '#4F46E5', '#A78BFA'],
      mountainColor: '#3730A3',
      platformColor: '#6366F1',
      grassColor: '#E0E7FF',
      subtitle: 'Pilar Reruntuhan Kuno & Jurang Batu',
      badge: '🏛️',
      themeType: 'ruins',
    },
    checkpoints: [
      { id: 601, x: 1460, y: 300, width: 34, height: 60, activated: false, label: 'Ruins Checkpoint' },
    ],
    finish: { x: 2860, y: 340, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 320, height: 150, type: 'ground' },
      // Ruined stone pillar steps
      { x: 260, y: 360, width: 90, height: 240, type: 'ground' }, // High pillar
      { x: 400, y: 280, width: 90, height: 320, type: 'ground' }, // Higher pillar
      { x: 550, y: 200, width: 110, height: 26, type: 'floating' },
      // Pits with ruins
      { x: 720, y: 450, width: 360, height: 150, type: 'ground' },
      { x: 880, y: 330, width: 100, height: 26, type: 'floating' },
      { x: 1040, y: 240, width: 100, height: 26, type: 'floating' },
      // Pillar gaps
      { x: 1190, y: 370, width: 90, height: 230, type: 'ground' },
      // Checkpoint sanctuary platform
      { x: 1380, y: 360, width: 340, height: 240, type: 'ground' },
      // Tricky moving pillar top
      { x: 1780, y: 310, width: 100, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 1780, moveDirection: 1 },
      { x: 2040, y: 230, width: 90, height: 370, type: 'ground' },
      { x: 2200, y: 320, width: 90, height: 280, type: 'ground' },
      { x: 2360, y: 240, width: 100, height: 26, type: 'floating' },
      // Final ruined colonnade
      { x: 2520, y: 340, width: 100, height: 25, type: 'moving', moveRange: 120, moveSpeed: 1.9, initialX: 2520, moveDirection: -1 },
      { x: 2740, y: 440, width: 360, height: 160, type: 'ground' },
    ],
    hazards: [
      { x: 780, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 960, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1520, y: 335, width: 80, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      { id: 601, x: 180, y: 410, width: 40, height: 38, vx: 1.2, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 602, x: 800, y: 410, width: 40, height: 38, vx: 1.3, startX: 760, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.5 },
      { id: 603, x: 1420, y: 320, width: 40, height: 38, vx: 1.2, startX: 1390, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 1.0 },
      { id: 604, x: 2780, y: 400, width: 40, height: 38, vx: 1.4, startX: 2750, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.3 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 305, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 445, y: 230, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 605, y: 150, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 760, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 930, y: 280, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1090, y: 190, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1235, y: 320, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1400, y: 310, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1640, y: 310, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1830, y: 260, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 2085, y: 180, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2245, y: 270, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2410, y: 190, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2570, y: 290, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2760, y: 390, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 2810, y: 360, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 2880, y: 300, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
      { id: 19, x: 2940, y: 390, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.8 },
      { id: 20, x: 3000, y: 360, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.4 },
      { id: 21, x: 3040, y: 390, radius: 14, collected: false, rotation: 3.0, bobOffset: 2.0 },
      { id: 22, x: 3070, y: 370, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.3 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 7: Poison Garden (Dangerous thorns, magenta botanical hazards, timing jumps)
// -------------------------------------------------------------
function createLevel7(): LevelData {
  return {
    id: 7,
    name: 'Level 7 — Poison Garden',
    width: 3200,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#4A044E', '#86198F', '#F472B6'],
      mountainColor: '#701A75',
      platformColor: '#9D174D',
      grassColor: '#FBCFE8',
      subtitle: 'Taman Duri Beracun Magenta & Timing Lompat',
      badge: '🌺',
      themeType: 'garden',
    },
    checkpoints: [
      { id: 701, x: 1520, y: 310, width: 34, height: 60, activated: false, label: 'Garden Sanctuary' },
    ],
    finish: { x: 2980, y: 340, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 320, height: 150, type: 'ground' },
      // Staggered botanical platforms over thorn beds
      { x: 260, y: 360, width: 100, height: 26, type: 'floating' },
      { x: 410, y: 280, width: 100, height: 26, type: 'floating' },
      { x: 560, y: 200, width: 110, height: 26, type: 'floating' },
      // Ground with dense thorns
      { x: 690, y: 450, width: 440, height: 150, type: 'ground' },
      // Moving vine platforms requiring jump timing
      { x: 1160, y: 340, width: 100, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 1160, moveDirection: 1 },
      { x: 1400, y: 370, width: 280, height: 230, type: 'ground' }, // Checkpoint platform
      { x: 1720, y: 290, width: 100, height: 25, type: 'moving', moveRange: 130, moveSpeed: 2.0, initialX: 1720, moveDirection: 1 },
      { x: 1980, y: 210, width: 100, height: 26, type: 'floating' },
      { x: 2140, y: 300, width: 100, height: 25, type: 'moving', moveRange: 120, moveSpeed: 2.1, initialX: 2140, moveDirection: -1 },
      { x: 2370, y: 380, width: 100, height: 26, type: 'floating' },
      { x: 2530, y: 290, width: 100, height: 26, type: 'floating' },
      { x: 2700, y: 210, width: 110, height: 26, type: 'floating' },
      { x: 2860, y: 440, width: 340, height: 160, type: 'ground' },
    ],
    hazards: [
      // Dangerous prickly thorns (styled with poison buds!)
      { x: 740, y: 425, width: 90, height: 25, count: 5, hazardType: 'thorn' },
      { x: 920, y: 425, width: 90, height: 25, count: 5, hazardType: 'thorn' },
      { x: 1460, y: 345, width: 80, height: 25, count: 4, hazardType: 'thorn' },
      { x: 2920, y: 415, width: 80, height: 25, count: 4, hazardType: 'thorn' },
    ],
    enemies: [
      // 5 toxic purple slimes
      { id: 701, x: 180, y: 410, width: 40, height: 38, vx: 1.3, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 702, x: 840, y: 410, width: 40, height: 38, vx: 1.4, startX: 800, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.6 },
      { id: 703, x: 1560, y: 330, width: 36, height: 34, vx: 1.2, startX: 1520, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 1.1 },
      { id: 704, x: 2710, y: 170, width: 36, height: 34, vx: 1.0, startX: 2700, patrolDistance: 80, squished: false, squishTimer: 0, wobble: 0.4 },
      { id: 705, x: 2900, y: 400, width: 40, height: 38, vx: 1.5, startX: 2870, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 0.8 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 310, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 460, y: 230, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 615, y: 150, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 710, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 880, y: 400, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1040, y: 400, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1210, y: 290, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1430, y: 320, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1620, y: 320, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1770, y: 240, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 2030, y: 160, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2200, y: 250, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2420, y: 330, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2580, y: 240, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2755, y: 160, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 2880, y: 390, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 2940, y: 360, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
      { id: 19, x: 3040, y: 390, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.8 },
      { id: 20, x: 3120, y: 370, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.4 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 8: Frozen Purple Mountain (Slippery ice platforms, slide momentum)
// -------------------------------------------------------------
function createLevel8(): LevelData {
  return {
    id: 8,
    name: 'Level 8 — Frozen Purple Mountain',
    width: 3300,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    hasIcePhysics: true,
    theme: {
      skyGradient: ['#1E1B4B', '#4338CA', '#A5F3FC'],
      mountainColor: '#312E81',
      platformColor: '#0284C7',
      grassColor: '#E0F2FE',
      subtitle: 'Puncak Es Ungu Dingin & Permukaan Licin',
      badge: '❄️',
      themeType: 'frozen',
    },
    checkpoints: [
      { id: 801, x: 1580, y: 310, width: 34, height: 60, activated: false, label: 'Ice Mountain Shelter' },
    ],
    finish: { x: 3080, y: 340, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 320, height: 150, type: 'ground' },
      // Slippery ice platforms (character slides!)
      { x: 260, y: 360, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 420, y: 280, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 580, y: 200, width: 120, height: 26, type: 'floating', isIce: true },
      // Ground ice sheet with chasm
      { x: 740, y: 450, width: 360, height: 150, type: 'ground', isIce: true },
      { x: 920, y: 340, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 1080, y: 250, width: 110, height: 26, type: 'floating', isIce: true },
      // Moving ice floe
      { x: 1250, y: 330, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 1250, moveDirection: 1, isIce: true },
      // Checkpoint mountain plateau
      { x: 1480, y: 370, width: 340, height: 230, type: 'ground' },
      // High frozen glacier steps
      { x: 1880, y: 300, width: 110, height: 25, type: 'moving', moveRange: 140, moveSpeed: 2.0, initialX: 1880, moveDirection: 1, isIce: true },
      { x: 2140, y: 220, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 2310, y: 150, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 2480, y: 240, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 2.1, initialX: 2480, moveDirection: -1, isIce: true },
      { x: 2720, y: 330, width: 110, height: 26, type: 'floating', isIce: true },
      { x: 2950, y: 440, width: 350, height: 160, type: 'ground' },
    ],
    hazards: [
      // Frozen icicle hazards
      { x: 800, y: 425, width: 80, height: 25, count: 4, hazardType: 'frozen' },
      { x: 980, y: 425, width: 70, height: 25, count: 4, hazardType: 'frozen' },
      { x: 1600, y: 345, width: 80, height: 25, count: 4, hazardType: 'frozen' },
      { x: 3000, y: 415, width: 70, height: 25, count: 4, hazardType: 'frozen' },
    ],
    enemies: [
      { id: 801, x: 180, y: 410, width: 40, height: 38, vx: 1.3, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 802, x: 860, y: 410, width: 40, height: 38, vx: 1.4, startX: 820, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.6 },
      { id: 803, x: 1520, y: 330, width: 40, height: 38, vx: -1.3, startX: 1490, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 1.1 },
      { id: 804, x: 2980, y: 400, width: 40, height: 38, vx: 1.4, startX: 2960, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 0.5 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 315, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 475, y: 230, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 635, y: 150, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 770, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 975, y: 290, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1135, y: 200, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1305, y: 280, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1510, y: 320, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1720, y: 320, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1935, y: 250, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 2195, y: 170, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2365, y: 100, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2535, y: 190, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2775, y: 280, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2970, y: 390, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 3020, y: 360, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 3120, y: 390, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
      { id: 19, x: 3170, y: 360, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.8 },
      { id: 20, x: 3220, y: 390, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.4 },
      { id: 21, x: 3260, y: 370, radius: 14, collected: false, rotation: 3.0, bobOffset: 2.0 },
      { id: 22, x: 3280, y: 400, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.3 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 9: Dark Castle (Gothic castle rooms, torches, checkpoint before hard section)
// -------------------------------------------------------------
function createLevel9(): LevelData {
  return {
    id: 9,
    name: 'Level 9 — Dark Castle',
    width: 3500,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    theme: {
      skyGradient: ['#09090B', '#18181B', '#3B0764'],
      mountainColor: '#18181B',
      platformColor: '#3F3F46',
      grassColor: '#E4E4E7',
      subtitle: 'Benteng Kastil Kelam & Checkpoint Kamar Gelap',
      badge: '🏰',
      themeType: 'castle',
    },
    checkpoints: [
      { id: 901, x: 1820, y: 310, width: 34, height: 60, activated: false, label: 'Castle Keep Checkpoint' },
    ],
    finish: { x: 3280, y: 340, width: 65, height: 100, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 320, height: 150, type: 'ground' },
      // Castle battlements & upper balconies
      { x: 260, y: 360, width: 100, height: 26, type: 'floating' },
      { x: 400, y: 270, width: 110, height: 26, type: 'floating' },
      { x: 550, y: 190, width: 110, height: 26, type: 'floating' },
      // Castle hall floor with traps
      { x: 700, y: 450, width: 440, height: 150, type: 'ground' },
      { x: 860, y: 340, width: 100, height: 26, type: 'floating' },
      { x: 1010, y: 250, width: 110, height: 26, type: 'floating' },
      // Moving castle chandelier platform
      { x: 1180, y: 330, width: 100, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 1180, moveDirection: 1 },
      { x: 1420, y: 450, width: 360, height: 150, type: 'ground' },
      { x: 1560, y: 340, width: 100, height: 26, type: 'floating' },
      // Checkpoint chamber before climactic gauntlet
      { x: 1720, y: 370, width: 360, height: 230, type: 'ground' },
      // Difficult gauntlet: high speed moving platforms and narrow ledges
      { x: 2140, y: 320, width: 100, height: 25, type: 'moving', moveRange: 130, moveSpeed: 2.1, initialX: 2140, moveDirection: 1 },
      { x: 2380, y: 240, width: 100, height: 26, type: 'floating' },
      { x: 2530, y: 160, width: 100, height: 26, type: 'floating' },
      { x: 2680, y: 250, width: 100, height: 25, type: 'moving', moveRange: 120, moveSpeed: 2.2, initialX: 2680, moveDirection: -1 },
      { x: 2900, y: 340, width: 100, height: 26, type: 'floating' },
      { x: 3100, y: 440, width: 400, height: 160, type: 'ground' },
    ],
    hazards: [
      { x: 760, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 960, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1480, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1880, y: 345, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 3160, y: 415, width: 70, height: 25, count: 4, hazardType: 'crystal' },
    ],
    enemies: [
      // 6 fast castle guardian slimes
      { id: 901, x: 180, y: 410, width: 40, height: 38, vx: 1.4, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 902, x: 840, y: 410, width: 40, height: 38, vx: 1.5, startX: 800, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.5 },
      { id: 903, x: 1520, y: 410, width: 40, height: 38, vx: -1.4, startX: 1480, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 1.0 },
      { id: 904, x: 1780, y: 330, width: 40, height: 38, vx: 1.5, startX: 1750, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.3 },
      { id: 905, x: 2400, y: 200, width: 36, height: 34, vx: 1.1, startX: 2390, patrolDistance: 80, squished: false, squishTimer: 0, wobble: 0.8 },
      { id: 906, x: 3200, y: 400, width: 40, height: 38, vx: 1.6, startX: 3180, patrolDistance: 120, squished: false, squishTimer: 0, wobble: 1.2 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 310, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 450, y: 220, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 605, y: 140, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 740, y: 400, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 910, y: 290, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1065, y: 200, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1230, y: 280, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1460, y: 400, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1610, y: 290, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1760, y: 320, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 1980, y: 320, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2190, y: 270, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2430, y: 190, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2580, y: 110, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2730, y: 200, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 2950, y: 290, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 3120, y: 390, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
      { id: 19, x: 3180, y: 360, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.8 },
      { id: 20, x: 3240, y: 390, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.4 },
      { id: 21, x: 3320, y: 290, radius: 14, collected: false, rotation: 3.0, bobOffset: 2.0 },
      { id: 22, x: 3380, y: 390, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.3 },
      { id: 23, x: 3430, y: 370, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.9 },
      { id: 24, x: 3470, y: 400, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.5 },
    ],
  };
}

// -------------------------------------------------------------
// LEVEL 10: Purple Dream Castle (Grand Finale combining ALL mechanics!)
// -------------------------------------------------------------
function createLevel10(): LevelData {
  return {
    id: 10,
    name: 'Level 10 — Purple Dream Castle',
    width: 3700,
    height: 600,
    spawnPoint: { x: 80, y: 370 },
    hasIcePhysics: true,
    theme: {
      skyGradient: ['#3B0764', '#7C3AED', '#FDE047'],
      mountainColor: '#4C1D95',
      platformColor: '#6D28D9',
      grassColor: '#FEF08A',
      subtitle: 'Kastil Impian Emas & Puncak Petualangan',
      badge: '👑',
      themeType: 'dream',
    },
    checkpoints: [
      { id: 1001, x: 1480, y: 310, width: 34, height: 60, activated: false, label: 'Grand Hall Checkpoint' },
      { id: 1002, x: 2680, y: 310, width: 34, height: 60, activated: false, label: 'Royal Spire Checkpoint' },
    ],
    finish: { x: 3450, y: 320, width: 85, height: 120, activated: false, particleTimer: 0 },
    platforms: [
      { x: 0, y: 450, width: 340, height: 150, type: 'ground' },
      // 1. Cloud & moving intro
      { x: 260, y: 360, width: 100, height: 26, type: 'floating', isCloud: true },
      { x: 410, y: 270, width: 100, height: 26, type: 'floating' },
      { x: 560, y: 190, width: 110, height: 26, type: 'floating' },
      { x: 720, y: 280, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 1.8, initialX: 720, moveDirection: 1 },
      // 2. Palace Terrace with spikes
      { x: 980, y: 450, width: 440, height: 150, type: 'ground' },
      { x: 1120, y: 330, width: 100, height: 26, type: 'floating' },
      { x: 1270, y: 240, width: 110, height: 26, type: 'floating' },
      // 3. First Checkpoint: Grand Hall
      { x: 1420, y: 370, width: 320, height: 230, type: 'ground' },
      // 4. Slippery Royal Crystal Ice Bridge!
      { x: 1800, y: 350, width: 160, height: 26, type: 'floating', isIce: true },
      { x: 2020, y: 270, width: 140, height: 26, type: 'floating', isIce: true },
      { x: 2220, y: 190, width: 140, height: 26, type: 'floating', isIce: true },
      // 5. Moving Palace Chandelier over abyss
      { x: 2420, y: 280, width: 110, height: 25, type: 'moving', moveRange: 140, moveSpeed: 2.2, initialX: 2420, moveDirection: 1 },
      // 6. Second Checkpoint: Royal Spire
      { x: 2620, y: 370, width: 320, height: 230, type: 'ground' },
      // 7. Final Grand Gauntlet to the Golden Palace Finish
      { x: 3000, y: 290, width: 110, height: 25, type: 'moving', moveRange: 130, moveSpeed: 2.2, initialX: 3000, moveDirection: -1 },
      { x: 3180, y: 210, width: 110, height: 26, type: 'floating' },
      { x: 3320, y: 440, width: 380, height: 160, type: 'ground' },
    ],
    hazards: [
      { x: 1040, y: 425, width: 80, height: 25, count: 4, hazardType: 'thorn' },
      { x: 1220, y: 425, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 1540, y: 345, width: 80, height: 25, count: 4, hazardType: 'frozen' },
      { x: 2740, y: 345, width: 80, height: 25, count: 4, hazardType: 'crystal' },
      { x: 3360, y: 415, width: 60, height: 25, count: 3, hazardType: 'thorn' },
    ],
    enemies: [
      // Fast royal slimes across the palace
      { id: 1001, x: 180, y: 410, width: 40, height: 38, vx: 1.4, startX: 140, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0 },
      { id: 1002, x: 1100, y: 410, width: 40, height: 38, vx: 1.6, startX: 1060, patrolDistance: 140, squished: false, squishTimer: 0, wobble: 0.5 },
      { id: 1003, x: 1580, y: 330, width: 40, height: 38, vx: -1.5, startX: 1520, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 1.0 },
      { id: 1004, x: 2040, y: 230, width: 36, height: 34, vx: 1.2, startX: 2020, patrolDistance: 110, squished: false, squishTimer: 0, wobble: 0.4 },
      { id: 1005, x: 2780, y: 330, width: 40, height: 38, vx: 1.6, startX: 2740, patrolDistance: 130, squished: false, squishTimer: 0, wobble: 0.9 },
      { id: 1006, x: 3400, y: 400, width: 40, height: 38, vx: 1.7, startX: 3380, patrolDistance: 110, squished: false, squishTimer: 0, wobble: 1.4 },
    ],
    coins: [
      { id: 1, x: 150, y: 400, radius: 14, collected: false, rotation: 0, bobOffset: 0 },
      { id: 2, x: 310, y: 310, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 3, x: 460, y: 220, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.8 },
      { id: 4, x: 615, y: 140, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.2 },
      { id: 5, x: 780, y: 230, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.6 },
      { id: 6, x: 1020, y: 400, radius: 14, collected: false, rotation: 1.5, bobOffset: 2.0 },
      { id: 7, x: 1170, y: 280, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.4 },
      { id: 8, x: 1325, y: 190, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.3 },
      { id: 9, x: 1470, y: 320, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.7 },
      { id: 10, x: 1660, y: 320, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.1 },
      { id: 11, x: 1880, y: 300, radius: 14, collected: false, rotation: 3.0, bobOffset: 1.5 },
      { id: 12, x: 2090, y: 220, radius: 14, collected: false, rotation: 0.3, bobOffset: 1.9 },
      { id: 13, x: 2290, y: 140, radius: 14, collected: false, rotation: 0.6, bobOffset: 2.3 },
      { id: 14, x: 2480, y: 230, radius: 14, collected: false, rotation: 0.9, bobOffset: 0.5 },
      { id: 15, x: 2670, y: 320, radius: 14, collected: false, rotation: 1.2, bobOffset: 1.0 },
      { id: 16, x: 2860, y: 320, radius: 14, collected: false, rotation: 1.5, bobOffset: 1.5 },
      { id: 17, x: 3050, y: 240, radius: 14, collected: false, rotation: 1.8, bobOffset: 2.0 },
      { id: 18, x: 3235, y: 160, radius: 14, collected: false, rotation: 2.1, bobOffset: 0.2 },
      { id: 19, x: 3350, y: 390, radius: 14, collected: false, rotation: 2.4, bobOffset: 0.8 },
      { id: 20, x: 3410, y: 360, radius: 14, collected: false, rotation: 2.7, bobOffset: 1.4 },
      { id: 21, x: 3450, y: 250, radius: 14, collected: false, rotation: 3.0, bobOffset: 2.0 }, // Above Finish Portal
      { id: 22, x: 3500, y: 250, radius: 14, collected: false, rotation: 0.3, bobOffset: 0.4 },
      { id: 23, x: 3550, y: 390, radius: 14, collected: false, rotation: 0.6, bobOffset: 0.9 },
      { id: 24, x: 3610, y: 370, radius: 14, collected: false, rotation: 0.9, bobOffset: 1.5 },
      { id: 25, x: 3660, y: 390, radius: 14, collected: false, rotation: 1.2, bobOffset: 2.1 },
    ],
  };
}
