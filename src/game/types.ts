export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BunnyPlayer extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  isJumping: boolean;
  facing: 'left' | 'right';
  animFrame: number;
  walkCycle: number;
  squishX: number;
  squishY: number;
  invulnerableTime: number;
  lives: number;
}

export interface Platform extends Rect {
  type: 'ground' | 'floating' | 'moving';
  color?: string;
  moveRange?: number;
  moveSpeed?: number;
  initialX?: number;
  moveDirection?: number;
  isIce?: boolean; // Ice physics: low friction / sliding momentum
  isCloud?: boolean; // Cloud aesthetic for sky level
}

export interface Checkpoint extends Rect {
  id: number;
  activated: boolean;
  label?: string;
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  rotation: number;
  bobOffset: number;
}

export interface EnemySlime extends Rect {
  id: number;
  vx: number;
  startX: number;
  patrolDistance: number;
  squished: boolean;
  squishTimer: number;
  wobble: number;
}

export interface HazardSpike extends Rect {
  count: number;
  hazardType?: 'crystal' | 'thorn' | 'frozen';
}

export interface FinishGoal extends Rect {
  activated: boolean;
  particleTimer: number;
}

export interface GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'sparkle' | 'dust' | 'confetti' | 'heart' | 'snow' | 'spore';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
}

export interface LevelTheme {
  skyGradient: [string, string, string];
  mountainColor: string;
  platformColor?: string;
  grassColor?: string;
  subtitle: string;
  badge: string;
  themeType?: 'meadows' | 'hills' | 'crystal' | 'forest' | 'sky' | 'ruins' | 'garden' | 'frozen' | 'castle' | 'dream';
}

export interface TutorialSign {
  x: number;
  y: number;
  text: string;
  subtext?: string;
}

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  finish: FinishGoal;
  platforms: Platform[];
  coins: Coin[];
  enemies: EnemySlime[];
  hazards: HazardSpike[];
  checkpoints?: Checkpoint[];
  tutorialSigns?: TutorialSign[];
  theme: LevelTheme;
  hasIcePhysics?: boolean;
}

export interface LevelProgress {
  unlockedLevel: number;
  completedLevels: number[];
  highScores: Record<number, number>;
  stars: Record<number, number>;
  bestCoins: Record<number, number>;
}

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'LEVEL_COMPLETE' | 'GAME_OVER' | 'GAME_WIN';

