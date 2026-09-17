import {
  BunnyPlayer,
  LevelData,
  GameState,
  GameParticle,
  FloatingText,
  LevelProgress,
} from './types';
import { getLevel } from './levelData';
import { GameRenderer } from './renderer';
import { sound } from './audio';

const STORAGE_KEY = 'bunny_run_progress_v1';

export function getSavedProgress(): LevelProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read localStorage:', e);
  }
  return {
    unlockedLevel: 1,
    completedLevels: [],
    highScores: {},
    stars: {},
    bestCoins: {},
  };
}

export function saveLevelResult(
  levelId: number,
  score: number,
  coins: number,
  totalCoins: number,
  lives: number
): { stars: number; newUnlock: boolean } {
  const progress = getSavedProgress();
  let stars = 1;
  if (coins >= Math.floor(totalCoins * 0.7)) stars = 2;
  if (coins === totalCoins && lives === 3) stars = 3;

  const currentStars = progress.stars[levelId] || 0;
  if (stars > currentStars) {
    progress.stars[levelId] = stars;
  }

  const currentScore = progress.highScores[levelId] || 0;
  if (score > currentScore) {
    progress.highScores[levelId] = score;
  }

  const currentCoins = progress.bestCoins[levelId] || 0;
  if (coins > currentCoins) {
    progress.bestCoins[levelId] = coins;
  }

  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }

  let newUnlock = false;
  const nextLevel = Math.min(10, levelId + 1);
  if (nextLevel > progress.unlockedLevel) {
    progress.unlockedLevel = nextLevel;
    newUnlock = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to write localStorage:', e);
  }

  return { stars, newUnlock };
}

export function resetSavedProgress(): LevelProgress {
  const initial: LevelProgress = {
    unlockedLevel: 1,
    completedLevels: [],
    highScores: {},
    stars: {},
    bestCoins: {},
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.warn('Failed to reset localStorage:', e);
  }
  return initial;
}

export interface GameStats {
  coins: number;
  totalCoins: number;
  lives: number;
  timeSeconds: number;
  score: number;
  gameState: GameState;
  currentLevelId: number;
  levelName: string;
  levelSubtitle: string;
  levelBadge: string;
  isLastLevel: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: GameRenderer;
  private animId: number | null = null;
  private lastTime: number = 0;

  // Current Level Tracker
  public currentLevelId: number = 1;

  // Level & Entities
  public level: LevelData;
  public bunny: BunnyPlayer;
  public particles: GameParticle[] = [];
  public floatingTexts: FloatingText[] = [];

  // Camera
  public cameraX: number = 0;
  public cameraY: number = 0;

  // Input State
  public keys = {
    left: false,
    right: false,
    jump: false,
  };

  // Jump assistance
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;

  // Game Stats & State
  public gameState: GameState = 'START';
  public coinsCollected: number = 0;
  public totalCoins: number = 0;
  public score: number = 0;
  public startTime: number = 0;
  public elapsedTime: number = 0;
  private activePlayTimeMs: number = 0;
  public screenShake: number = 0;

  // Listener for React UI
  private onStatsCallback?: (stats: GameStats) => void;

  constructor(canvas: HTMLCanvasElement, onStats?: (stats: GameStats) => void, initialLevelId = 1) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    this.currentLevelId = Math.max(1, Math.min(10, initialLevelId));
    this.renderer = new GameRenderer(this.ctx, canvas.width, canvas.height);
    this.level = getLevel(this.currentLevelId);
    this.totalCoins = this.level.coins.length;
    this.onStatsCallback = onStats;
    this.activeSpawnPoint = { x: this.level.spawnPoint.x, y: this.level.spawnPoint.y };

    this.bunny = this.createInitialBunny();
  }

  private activeSpawnPoint: { x: number; y: number } = { x: 80, y: 380 };

  private createInitialBunny(): BunnyPlayer {
    return {
      x: this.level.spawnPoint.x,
      y: this.level.spawnPoint.y,
      width: 36,
      height: 44,
      vx: 0,
      vy: 0,
      isGrounded: false,
      isJumping: false,
      facing: 'right',
      animFrame: 0,
      walkCycle: 0,
      squishX: 1,
      squishY: 1,
      invulnerableTime: 0,
      lives: 3,
    };
  }

  public resize(width: number, height: number, dpr: number = 1) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.renderer.resize(width, height, dpr);
    this.updateCamera();
  }

  public loadLevel(levelId: number, autoStart = true) {
    this.currentLevelId = Math.max(1, Math.min(10, levelId));
    this.level = getLevel(this.currentLevelId);
    this.totalCoins = this.level.coins.length;
    this.coinsCollected = 0;
    this.activeSpawnPoint = { x: this.level.spawnPoint.x, y: this.level.spawnPoint.y };
    if (this.level.checkpoints) {
      this.level.checkpoints.forEach((cp) => (cp.activated = false));
    }
    this.bunny = this.createInitialBunny();
    this.particles = [];
    this.floatingTexts = [];
    this.cameraX = 0;
    this.cameraY = 0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.startTime = performance.now();
    this.elapsedTime = 0;
    this.activePlayTimeMs = 0;
    this.screenShake = 0;
    this.keys = { left: false, right: false, jump: false };
    this.gameState = autoStart ? 'PLAYING' : 'START';

    if (autoStart) {
      sound.startBGM();
      this.lastTime = performance.now();
      if (!this.animId) {
        this.loop(this.lastTime);
      }
    } else {
      sound.stopBGM();
    }
    this.emitStats();
  }

  public nextLevel() {
    if (this.currentLevelId < 10) {
      this.loadLevel(this.currentLevelId + 1, true);
    } else {
      this.gameState = 'GAME_WIN';
      sound.stopBGM();
      sound.playGrandVictory();
      this.emitStats();
    }
  }

  public start() {
    this.gameState = 'PLAYING';
    this.startTime = performance.now();
    sound.startBGM();
    this.emitStats();
    this.lastTime = performance.now();
    if (!this.animId) {
      this.loop(this.lastTime);
    }
  }

  public pause() {
    if (this.gameState === 'PLAYING') {
      this.gameState = 'PAUSED';
      this.keys = { left: false, right: false, jump: false };
      sound.stopBGM();
      this.emitStats();
    }
  }

  public resume() {
    if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
      sound.startBGM();
      this.lastTime = performance.now();
      this.emitStats();
    }
  }

  public togglePause() {
    if (this.gameState === 'PLAYING') {
      this.pause();
    } else if (this.gameState === 'PAUSED') {
      this.resume();
    }
  }

  public retry() {
    // Retry from checkpoint with full lives
    this.bunny.lives = 3;
    this.bunny.x = this.activeSpawnPoint.x;
    this.bunny.y = this.activeSpawnPoint.y;
    this.bunny.vx = 0;
    this.bunny.vy = 0;
    this.bunny.invulnerableTime = 1200;
    this.gameState = 'PLAYING';
    sound.startBGM();
    this.lastTime = performance.now();
    this.emitStats();
  }

  public goToMainMenu() {
    sound.stopBGM();
    this.keys = { left: false, right: false, jump: false };
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.screenShake = 0;
    this.loadLevel(this.currentLevelId, false);
    this.gameState = 'START';
    this.emitStats();
  }

  public restart() {
    this.loadLevel(this.currentLevelId, true);
  }

  public stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    sound.stopBGM();
  }

  public handleKeyDown(code: string) {
    if (code === 'KeyP' || code === 'Escape') {
      this.togglePause();
      return;
    }
    if (this.gameState === 'PAUSED') return;

    if (code === 'ArrowLeft' || code === 'KeyA') {
      this.keys.left = true;
    }
    if (code === 'ArrowRight' || code === 'KeyD') {
      this.keys.right = true;
    }
    if (code === 'ArrowUp' || code === 'Space' || code === 'KeyW') {
      this.keys.jump = true;
      this.jumpBufferTimer = 8; // Jump buffer frames
    }
    if (code === 'KeyR') {
      this.restart();
    }
  }

  public handleKeyUp(code: string) {
    if (code === 'ArrowLeft' || code === 'KeyA') {
      this.keys.left = false;
    }
    if (code === 'ArrowRight' || code === 'KeyD') {
      this.keys.right = false;
    }
    if (code === 'ArrowUp' || code === 'Space' || code === 'KeyW') {
      this.keys.jump = false;
      // Variable jump height: cut vertical boost if released early
      if (this.bunny.vy < -4) {
        this.bunny.vy = -3;
      }
    }
  }

  public setVirtualKey(action: 'left' | 'right' | 'jump', pressed: boolean) {
    if (action === 'left') this.keys.left = pressed;
    if (action === 'right') this.keys.right = pressed;
    if (action === 'jump') {
      this.keys.jump = pressed;
      if (pressed) {
        this.jumpBufferTimer = 8;
      } else {
        if (this.bunny.vy < -4) {
          this.bunny.vy = -3;
        }
      }
    }
  }

  private loop = (time: number) => {
    const dt = Math.min(32, time - this.lastTime);
    this.lastTime = time;

    this.update(dt, time);

    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShake;
      shakeY = (Math.random() - 0.5) * this.screenShake;
      this.screenShake *= 0.82;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    this.renderer.render(
      this.cameraX + shakeX,
      this.cameraY + shakeY,
      this.bunny,
      this.level.platforms,
      this.level.coins,
      this.level.enemies,
      this.level.hazards,
      this.level.finish,
      this.particles,
      this.floatingTexts,
      time,
      this.level.theme,
      this.level.checkpoints,
      this.level.tutorialSigns,
      this.currentLevelId >= 10
    );

    this.animId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, time: number) {
    if (this.gameState === 'PAUSED') {
      // Total freeze when paused: timer, bunny, enemies, obstacles, and particles halt completely
      return;
    }

    if (this.gameState === 'PLAYING') {
      this.activePlayTimeMs += dt;
      this.elapsedTime = Math.floor(this.activePlayTimeMs / 1000);
      this.updatePhysics();
      this.updateEnemies(dt);
      this.updateMovingPlatforms();
      this.checkCoinCollections();
      this.checkCheckpointCollisions();
      this.checkHazardCollisions();
      this.checkEnemyCollisions();
      this.checkFinishCondition();
      this.updateCamera();
      this.emitStats();
    }

    this.updateParticles();
    this.updateFloatingTexts();

    // Finish celebration fireworks while in LEVEL_COMPLETE or GAME_WIN
    if ((this.gameState === 'LEVEL_COMPLETE' || this.gameState === 'GAME_WIN') && Math.random() < 0.3) {
      this.addConfettiBurst(
        this.level.finish.x + Math.random() * this.level.finish.width,
        this.level.finish.y + Math.random() * 20
      );
    }
  }

  private updatePhysics() {
    const b = this.bunny;

    // Check if bunny is standing on ice
    const standingOnIce =
      b.isGrounded &&
      (this.level.theme.themeType === 'frozen' ||
        this.level.platforms.some(
          (p) =>
            p.isIce &&
            b.y + b.height >= p.y - 4 &&
            b.y + b.height <= p.y + 6 &&
            b.x + b.width > p.x &&
            b.x < p.x + p.width
        ));

    // Horizontal Movement with Ice sliding physics
    const speed = standingOnIce ? 5.6 : 4.8;
    const accel = standingOnIce ? 0.22 : 0.45;
    const friction = standingOnIce ? 0.965 : 0.78;

    if (this.keys.left) {
      b.vx -= accel;
      if (b.vx < -speed) b.vx = -speed;
      b.facing = 'left';
      b.walkCycle += 0.22;
      // Dust particles while running
      if (b.isGrounded && Math.random() < 0.25) {
        if (standingOnIce) {
          this.addIceSparkle(b.x + b.width / 2, b.y + b.height);
        } else {
          this.addDustParticle(b.x + b.width / 2, b.y + b.height);
        }
      }
    } else if (this.keys.right) {
      b.vx += accel;
      if (b.vx > speed) b.vx = speed;
      b.facing = 'right';
      b.walkCycle += 0.22;
      // Dust particles while running
      if (b.isGrounded && Math.random() < 0.25) {
        if (standingOnIce) {
          this.addIceSparkle(b.x + b.width / 2, b.y + b.height);
        } else {
          this.addDustParticle(b.x + b.width / 2, b.y + b.height);
        }
      }
    } else {
      b.vx *= friction;
      if (Math.abs(b.vx) < 0.08) b.vx = 0;
      if (standingOnIce && Math.abs(b.vx) > 1.2 && Math.random() < 0.2) {
        this.addIceSparkle(b.x + b.width / 2, b.y + b.height);
      }
    }

    // Gravity
    const gravity = 0.52;
    const maxFallSpeed = 12;
    b.vy += gravity;
    if (b.vy > maxFallSpeed) b.vy = maxFallSpeed;

    // Coyote time & Jump Buffer
    if (b.isGrounded) {
      this.coyoteTimer = 6;
    } else {
      if (this.coyoteTimer > 0) this.coyoteTimer--;
    }

    if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;

    // Execute Jump
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      b.vy = -11.6;
      b.isGrounded = false;
      b.isJumping = true;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      b.squishX = 0.78;
      b.squishY = 1.28; // Stretch up
      sound.playJump();
      for (let i = 0; i < 4; i++) {
        this.addDustParticle(b.x + b.width / 2 + (Math.random() - 0.5) * 16, b.y + b.height);
      }
    }

    // Squash & stretch recovery
    b.squishX += (1 - b.squishX) * 0.14;
    b.squishY += (1 - b.squishY) * 0.14;

    // Invulnerability timer
    if (b.invulnerableTime > 0) {
      b.invulnerableTime -= 16;
    }

    // Move Horizontal & Collide
    b.x += b.vx;
    this.handleHorizontalPlatformCollisions();

    // Keep within level bounds
    if (b.x < 0) {
      b.x = 0;
      b.vx = 0;
    }
    if (b.x + b.width > this.level.width) {
      b.x = this.level.width - b.width;
      b.vx = 0;
    }

    // Move Vertical & Collide
    b.y += b.vy;
    this.handleVerticalPlatformCollisions();

    // Check Fall in Abyss
    if (b.y > this.level.height + 40) {
      this.handlePlayerHurt(true);
    }
  }

  private handleHorizontalPlatformCollisions() {
    const b = this.bunny;
    for (const plat of this.level.platforms) {
      if (this.isColliding(b, plat)) {
        if (b.vx > 0) {
          // Moving right, hit left edge of platform
          b.x = plat.x - b.width;
          b.vx = 0;
        } else if (b.vx < 0) {
          // Moving left, hit right edge of platform
          b.x = plat.x + plat.width;
          b.vx = 0;
        }
      }
    }
  }

  private handleVerticalPlatformCollisions() {
    const b = this.bunny;
    let groundedThisFrame = false;

    for (const plat of this.level.platforms) {
      if (this.isColliding(b, plat)) {
        if (b.vy > 0) {
          // Landing on top of platform
          b.y = plat.y - b.height;
          b.vy = 0;
          groundedThisFrame = true;
          if (b.isJumping || b.squishY > 1.05 || !b.isGrounded) {
            b.isJumping = false;
            // Landing squish!
            b.squishX = 1.28;
            b.squishY = 0.72;
            for (let i = 0; i < 3; i++) {
              this.addDustParticle(b.x + b.width / 2 + (Math.random() - 0.5) * 14, b.y + b.height);
            }
          }
        } else if (b.vy < 0) {
          // Bumping head against ceiling/bottom of platform
          b.y = plat.y + plat.height;
          b.vy = 0;
        }
      }
    }

    b.isGrounded = groundedThisFrame;
    if (b.isGrounded) {
      b.isJumping = false;
    }
  }

  private updateMovingPlatforms() {
    for (const p of this.level.platforms) {
      if (p.type === 'moving' && p.initialX !== undefined && p.moveRange && p.moveSpeed) {
        p.x += (p.moveDirection || 1) * p.moveSpeed;
        if (p.x > p.initialX + p.moveRange) {
          p.x = p.initialX + p.moveRange;
          p.moveDirection = -1;
        } else if (p.x < p.initialX) {
          p.x = p.initialX;
          p.moveDirection = 1;
        }

        // If bunny is standing on this platform, carry bunny along!
        const b = this.bunny;
        if (
          b.isGrounded &&
          b.y + b.height >= p.y - 2 &&
          b.y + b.height <= p.y + 6 &&
          b.x + b.width > p.x &&
          b.x < p.x + p.width
        ) {
          b.x += (p.moveDirection || 1) * p.moveSpeed;
        }
      }
    }
  }

  private updateEnemies(dt: number) {
    for (const slime of this.level.enemies) {
      if (slime.squished) {
        slime.squishTimer += dt;
        continue;
      }

      // Patrol back and forth
      slime.x += slime.vx;
      if (slime.x > slime.startX + slime.patrolDistance) {
        slime.x = slime.startX + slime.patrolDistance;
        slime.vx = -Math.abs(slime.vx);
      } else if (slime.x < slime.startX) {
        slime.x = slime.startX;
        slime.vx = Math.abs(slime.vx);
      }
    }
  }

  private checkCoinCollections() {
    const b = this.bunny;
    const bCenterX = b.x + b.width / 2;
    const bCenterY = b.y + b.height / 2;

    for (const coin of this.level.coins) {
      if (!coin.collected) {
        const dx = bCenterX - coin.x;
        const dy = bCenterY - coin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < coin.radius + b.width / 2) {
          coin.collected = true;
          this.coinsCollected++;
          this.score += 100;
          sound.playCoin();
          this.addCoinSparkles(coin.x, coin.y);
          this.addFloatingText(coin.x, coin.y - 10, '+100 🥕', '#F59E0B');
        }
      }
    }
  }

  private checkCheckpointCollisions() {
    if (!this.level.checkpoints) return;
    const b = this.bunny;

    for (const cp of this.level.checkpoints) {
      if (!cp.activated && this.isColliding(b, cp)) {
        cp.activated = true;
        this.activeSpawnPoint = {
          x: cp.x + 5,
          y: cp.y + cp.height - b.height,
        };
        sound.playCheckpoint();
        this.addFloatingText(cp.x + cp.width / 2, cp.y - 14, '⭐ CHECKPOINT!', '#FDE047');
        this.addSlimeSparkles(cp.x + cp.width / 2, cp.y + cp.height / 2);
      }
    }
  }

  private checkHazardCollisions() {
    const b = this.bunny;
    if (b.invulnerableTime > 0) return;

    for (const spike of this.level.hazards) {
      if (this.isColliding(b, spike)) {
        this.handlePlayerHurt(false);
        break;
      }
    }
  }

  private checkEnemyCollisions() {
    const b = this.bunny;

    for (const slime of this.level.enemies) {
      if (slime.squished) continue;

      if (this.isColliding(b, slime)) {
        // Did bunny land on top of the slime?
        // Bunny is falling and bottom of bunny is near top half of slime
        const isStomp = b.vy > 0 && b.y + b.height <= slime.y + slime.height * 0.55;

        if (isStomp) {
          // Stomp squish!
          slime.squished = true;
          b.vy = -8.5; // Bounce up!
          this.score += 200;
          sound.playSquish();
          this.addSlimeSparkles(slime.x + slime.width / 2, slime.y + slime.height / 2);
          this.addFloatingText(slime.x + slime.width / 2, slime.y - 12, 'SQUISH! +200', '#D946EF');
        } else if (b.invulnerableTime <= 0) {
          // Bunny touched slime side/underneath -> get hurt
          this.handlePlayerHurt(false);
          // Bounce bunny back away from slime
          b.vx = b.x < slime.x ? -4 : 4;
          b.vy = -5;
          break;
        }
      }
    }
  }

  private handlePlayerHurt(isAbyssFall: boolean) {
    const b = this.bunny;
    b.lives--;
    this.screenShake = 8;
    sound.playHurt();
    this.addFloatingText(b.x + b.width / 2, b.y - 15, '-1 HP!', '#EF4444');

    if (b.lives <= 0) {
      this.gameState = 'GAME_OVER';
      this.keys = { left: false, right: false, jump: false };
      sound.stopBGM();
      sound.playGameOver();
      this.emitStats();
      return;
    }

    b.invulnerableTime = 1800; // 1.8 seconds invulnerable

    if (isAbyssFall) {
      // Respawn at the current active checkpoint or start spawn point
      b.x = this.activeSpawnPoint.x;
      b.y = this.activeSpawnPoint.y;
      b.vx = 0;
      b.vy = 0;
    }
  }

  private checkFinishCondition() {
    const b = this.bunny;
    const goal = this.level.finish;

    if (this.isColliding(b, goal) && this.gameState === 'PLAYING') {
      const isLast = this.currentLevelId >= 10;
      this.gameState = isLast ? 'GAME_WIN' : 'LEVEL_COMPLETE';
      this.keys = { left: false, right: false, jump: false };
      sound.stopBGM();
      if (isLast) {
        sound.playGrandVictory();
      } else {
        sound.playWin();
      }

      // Bonus score for remaining lives and coins
      this.score += b.lives * 500;
      this.score += Math.max(0, 300 - this.elapsedTime * 2);

      // Save level progress to localStorage
      saveLevelResult(this.currentLevelId, this.score, this.coinsCollected, this.totalCoins, b.lives);

      this.addConfettiBurst(goal.x + goal.width / 2, goal.y + goal.height / 2);
      this.emitStats();
    }
  }

  private updateCamera() {
    // Determine the visible world width taking into account responsive scaling
    const worldScale = this.renderer.getWorldScale();
    const visibleWorldWidth = this.canvas.width / worldScale;

    // Target camera centered somewhat ahead of bunny
    const targetX = this.bunny.x - visibleWorldWidth * 0.38;
    this.cameraX += (targetX - this.cameraX) * 0.08;

    // Clamp camera within level
    const maxCamX = Math.max(0, this.level.width - visibleWorldWidth);
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > maxCamX) this.cameraX = maxCamX;

    this.cameraY = 0; // Fixed vertical viewport for clean platforming
  }

  private isColliding(r1: { x: number; y: number; width: number; height: number }, r2: { x: number; y: number; width: number; height: number }): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  private addDustParticle(x: number, y: number) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y - 2,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5,
      size: 3 + Math.random() * 3,
      color: 'rgba(233, 213, 255, 0.7)',
      alpha: 0.8,
      life: 0,
      maxLife: 20,
      type: 'dust',
    });
  }

  private addIceSparkle(x: number, y: number) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y - 2,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2,
      size: 2.5 + Math.random() * 2.5,
      color: Math.random() < 0.5 ? '#E0F2FE' : '#BAE6FD',
      alpha: 0.9,
      life: 0,
      maxLife: 18,
      type: 'sparkle',
    });
  }

  private addCoinSparkles(x: number, y: number) {
    const colors = ['#FBBF24', '#F59E0B', '#FDE68A', '#F472B6'];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 2,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0,
        maxLife: 28,
        type: 'sparkle',
      });
    }
  }

  private addSlimeSparkles(x: number, y: number) {
    const colors = ['#C084FC', '#E879F9', '#A855F7', '#F472B6'];
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 3,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0,
        maxLife: 30,
        type: 'sparkle',
      });
    }
  }

  private addConfettiBurst(x: number, y: number) {
    const colors = ['#C084FC', '#F472B6', '#FBBF24', '#38BDF8', '#A78BFA', '#F43F5E'];
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 55,
        type: 'confetti',
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
      life: 0,
    });
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;

      if (p.type === 'confetti') {
        p.vy += 0.15; // Gravity for confetti
        p.vx *= 0.98;
      }

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts() {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 0.8;
      ft.life++;
      ft.alpha = 1 - ft.life / 40;

      if (ft.life >= 40) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private emitStats() {
    if (this.onStatsCallback) {
      this.onStatsCallback({
        coins: this.coinsCollected,
        totalCoins: this.totalCoins,
        lives: this.bunny.lives,
        timeSeconds: this.elapsedTime,
        score: this.score,
        gameState: this.gameState,
        currentLevelId: this.currentLevelId,
        levelName: this.level.name,
        levelSubtitle: this.level.theme.subtitle,
        levelBadge: this.level.theme.badge,
        isLastLevel: this.currentLevelId >= 10,
      });
    }
  }
}
