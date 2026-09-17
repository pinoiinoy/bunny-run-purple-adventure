import {
  BunnyPlayer,
  Platform,
  Coin,
  EnemySlime,
  HazardSpike,
  FinishGoal,
  GameParticle,
  FloatingText,
  LevelTheme,
  Checkpoint,
  TutorialSign,
} from './types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private clouds: { x: number; y: number; scale: number; speed: number }[] = [];
  private bgStars: { x: number; y: number; size: number; phase: number }[] = [];
  private snowflakes: { x: number; y: number; size: number; speedY: number; drift: number }[] = [];
  private dpr: number = 1;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, dpr: number = 1) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.dpr = dpr || 1;
    this.initBackgroundElements();
  }

  public resize(width: number, height: number, dpr: number = 1) {
    this.width = width;
    this.height = height;
    this.dpr = dpr || 1;
  }

  public getWorldScale(): number {
    // Reference base world height is 540 world units
    // World coordinates (y: 0 to 540) maps to full vertical height of viewport
    // On narrow viewports (e.g. tablet portrait or phone), ensure at least 750 world units wide are visible
    const cssHeight = this.height / this.dpr;
    const cssWidth = this.width / this.dpr;
    const baseScale = Math.min(cssHeight / 540, cssWidth / 750);
    return Math.max(0.2, baseScale * this.dpr);
  }

  public getCameraYOffset(): number {
    const worldScale = this.getWorldScale();
    const visibleWorldHeight = this.height / worldScale;
    if (visibleWorldHeight > 540) {
      // Anchors world y=540 near the bottom of canvas so platforms stay grounded
      return -(visibleWorldHeight - 540);
    }
    return 0;
  }

  private initBackgroundElements() {
    // Generate gentle clouds
    for (let i = 0; i < 14; i++) {
      this.clouds.push({
        x: Math.random() * 4000,
        y: 30 + Math.random() * 220,
        scale: 0.7 + Math.random() * 0.9,
        speed: 0.15 + Math.random() * 0.25,
      });
    }

    // Twinkling stars in sky
    for (let i = 0; i < 50; i++) {
      this.bgStars.push({
        x: Math.random() * 4000,
        y: 15 + Math.random() * 280,
        size: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Gentle snowflakes for ice level
    for (let i = 0; i < 40; i++) {
      this.snowflakes.push({
        x: Math.random() * 2000,
        y: Math.random() * 600,
        size: 1.5 + Math.random() * 2.5,
        speedY: 0.6 + Math.random() * 1.2,
        drift: Math.random() * Math.PI * 2,
      });
    }
  }

  public render(
    cameraX: number,
    cameraY: number,
    bunny: BunnyPlayer,
    platforms: Platform[],
    coins: Coin[],
    enemies: EnemySlime[],
    hazards: HazardSpike[],
    finish: FinishGoal,
    particles: GameParticle[],
    floatingTexts: FloatingText[],
    time: number,
    theme?: LevelTheme,
    checkpoints?: Checkpoint[],
    tutorialSigns?: TutorialSign[],
    isLastLevel: boolean = false
  ) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Sky Gradient (Screen space)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    if (theme && theme.skyGradient) {
      skyGrad.addColorStop(0, theme.skyGradient[0]);
      skyGrad.addColorStop(0.5, theme.skyGradient[1]);
      skyGrad.addColorStop(1, theme.skyGradient[2]);
    } else {
      skyGrad.addColorStop(0, '#581C87');
      skyGrad.addColorStop(0.35, '#7E22CE');
      skyGrad.addColorStop(0.7, '#A855F7');
      skyGrad.addColorStop(1, '#F3E8FF');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    const themeType = theme?.themeType || 'meadows';

    // 2. Specific Theme Background Visuals
    if (themeType === 'meadows') {
      this.drawMeadowFlowers(cameraX * 0.25, time);
    } else if (themeType === 'forest') {
      this.drawMoon(time);
      this.drawForestSilhouettes(cameraX * 0.18);
    } else if (themeType === 'crystal') {
      this.drawCrystalCavernRoof(cameraX * 0.2, time);
    } else if (themeType === 'ruins') {
      this.drawRuinsBackground(cameraX * 0.2);
    } else if (themeType === 'garden') {
      this.drawPoisonGardenBackground(cameraX * 0.2, time);
    } else if (themeType === 'castle' || themeType === 'dream') {
      this.drawCastleSpires(cameraX * 0.15, themeType === 'dream');
    }

    // 3. Parallax Far Mountain Layer
    const mountainCol = theme?.mountainColor || '#6B21A8';
    const mountainBase1 = this.height * 0.58;
    const mountainBase2 = this.height * 0.72;
    this.drawMountains(cameraX * 0.15, mountainCol, 0.22, mountainBase1, themeType);
    this.drawMountains(cameraX * 0.35, mountainCol, 0.38, mountainBase2, themeType);

    // 4. Stars / Sky sparkles
    this.drawStars(cameraX * 0.1, time);

    // 5. Parallax Drifting Fluffy Clouds
    if (themeType !== 'crystal') {
      this.drawClouds(cameraX * 0.25, time, themeType === 'sky');
    }

    // 6. Snowflakes for Frozen Mountain
    if (themeType === 'frozen') {
      this.drawSnow(cameraX, time);
    }

    // World Space Begins
    const worldScale = this.getWorldScale();
    const camYOffset = this.getCameraYOffset();

    ctx.save();
    ctx.scale(worldScale, worldScale);
    ctx.translate(-cameraX, -(cameraY + camYOffset));

    // 7. Tutorial Signs (Level 1)
    if (tutorialSigns) {
      tutorialSigns.forEach((sign) => this.drawTutorialSign(sign, time));
    }

    // 8. Draw Platforms
    platforms.forEach((plat) => this.drawPlatform(plat, time, theme));

    // 9. Draw Checkpoints
    if (checkpoints) {
      checkpoints.forEach((cp) => this.drawCheckpoint(cp, time));
    }

    // 10. Draw Hazards
    hazards.forEach((spike) => this.drawHazard(spike, time));

    // 11. Draw Finish Gate
    this.drawFinishGoal(finish, time, isLastLevel);

    // 12. Draw Coins / Golden Carrots
    coins.forEach((coin) => {
      if (!coin.collected) {
        this.drawCoin(coin, time);
      }
    });

    // 13. Draw Purple Slimes
    enemies.forEach((enemy) => this.drawSlime(enemy, time));

    // 14. Draw Bunny
    this.drawBunny(bunny, time);

    // 15. Draw World Particles
    particles.forEach((p) => this.drawParticle(p));

    // 16. Draw Floating Texts
    floatingTexts.forEach((ft) => this.drawFloatingText(ft));

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // THEME SPECIFIC BACKGROUNDS
  // -------------------------------------------------------------------------
  private drawMoon(time: number) {
    const ctx = this.ctx;
    ctx.save();
    const moonX = this.width * 0.82;
    const moonY = 85;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.002);

    // Luminous halo
    const glow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 75 + pulse * 10);
    glow.addColorStop(0, 'rgba(238, 242, 255, 0.45)');
    glow.addColorStop(0.5, 'rgba(199, 210, 254, 0.2)');
    glow.addColorStop(1, 'rgba(165, 180, 252, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 80 + pulse * 10, 0, Math.PI * 2);
    ctx.fill();

    // Solid Moon Disc
    const moonGrad = ctx.createLinearGradient(moonX - 25, moonY - 25, moonX + 25, moonY + 25);
    moonGrad.addColorStop(0, '#FFFFFF');
    moonGrad.addColorStop(0.7, '#E0E7FF');
    moonGrad.addColorStop(1, '#C7D2FE');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Gentle craters
    ctx.fillStyle = 'rgba(165, 180, 252, 0.35)';
    ctx.beginPath();
    ctx.arc(moonX - 8, moonY - 8, 7, 0, Math.PI * 2);
    ctx.arc(moonX + 12, moonY - 2, 5, 0, Math.PI * 2);
    ctx.arc(moonX + 2, moonY + 12, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawForestSilhouettes(offsetX: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(30, 27, 75, 0.55)';
    const treeSpacing = 90;
    const startX = -((offsetX % treeSpacing) + treeSpacing);

    for (let x = startX; x < this.width + 120; x += treeSpacing) {
      const treeH = 160 + ((Math.sin(x * 12.3) * 40) | 0);
      const baseY = this.height - 40;
      // Tall pine tree silhouette
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + 12, baseY - treeH * 0.4);
      ctx.lineTo(x + 5, baseY - treeH * 0.4);
      ctx.lineTo(x + 15, baseY - treeH * 0.7);
      ctx.lineTo(x + 8, baseY - treeH * 0.7);
      ctx.lineTo(x + 20, baseY - treeH);
      ctx.lineTo(x + 32, baseY - treeH * 0.7);
      ctx.lineTo(x + 25, baseY - treeH * 0.7);
      ctx.lineTo(x + 35, baseY - treeH * 0.4);
      ctx.lineTo(x + 28, baseY - treeH * 0.4);
      ctx.lineTo(x + 40, baseY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawMeadowFlowers(offsetX: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    const spacing = 48;
    const startX = -((offsetX % spacing) + spacing);
    const baseY = this.height - 25;

    for (let x = startX; x < this.width + 60; x += spacing) {
      const sway = Math.sin(time * 0.003 + x * 0.04) * 5;
      const flowerH = 28 + (Math.sin(x * 11.2) * 8);

      // Green slender stem
      ctx.strokeStyle = '#4ADE80';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.quadraticCurveTo(x + sway * 0.5, baseY - flowerH * 0.5, x + sway, baseY - flowerH);
      ctx.stroke();

      // Lavender flower florets
      const flowerColor = x % 96 === 0 ? '#E879F9' : '#C084FC';
      ctx.fillStyle = flowerColor;
      for (let f = 0; f < 4; f++) {
        const floretY = baseY - flowerH + f * 5;
        const floretX = x + sway * (1 - f * 0.2);
        ctx.beginPath();
        ctx.arc(floretX - 2.5, floretY, 3, 0, Math.PI * 2);
        ctx.arc(floretX + 2.5, floretY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Yellow center pollen highlight
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(x + sway, baseY - flowerH - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawPoisonGardenBackground(offsetX: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    const spacing = 95;
    const startX = -((offsetX % spacing) + spacing);
    const baseY = this.height - 35;

    for (let x = startX; x < this.width + 100; x += spacing) {
      const vineH = 80 + Math.sin(x * 3.7) * 25;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.004 + x);

      // Tangled toxic bramble stalk
      ctx.strokeStyle = '#371B58';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.quadraticCurveTo(x - 20, baseY - vineH * 0.6, x - 6, baseY - vineH);
      ctx.stroke();

      // Toxic Thorn pricks
      ctx.fillStyle = '#4C1D95';
      ctx.beginPath();
      ctx.moveTo(x - 10, baseY - vineH * 0.4);
      ctx.lineTo(x - 22, baseY - vineH * 0.44);
      ctx.lineTo(x - 12, baseY - vineH * 0.48);
      ctx.closePath();
      ctx.fill();

      // Glowing Spore Bulb
      const bulbX = x - 6;
      const bulbY = baseY - vineH;
      const aura = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 18 + pulse * 6);
      aura.addColorStop(0, 'rgba(236, 72, 153, 0.7)');
      aura.addColorStop(0.6, 'rgba(168, 85, 247, 0.3)');
      aura.addColorStop(1, 'rgba(76, 29, 149, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 18 + pulse * 6, 0, Math.PI * 2);
      ctx.fill();

      // Solid spore bud
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 6 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawCrystalCavernRoof(offsetX: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#2E1065';
    // Cavern stalactites hanging from top
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const step = 60;
    const startX = -((offsetX % step) + step);

    for (let x = startX; x < this.width + 80; x += step) {
      const h = 45 + Math.sin(x * 0.05) * 30;
      ctx.lineTo(x + step * 0.5, h);
      ctx.lineTo(x + step, 0);
    }
    ctx.lineTo(this.width, 0);
    ctx.closePath();
    ctx.fill();

    // Glowing crystal clusters
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.005);
    ctx.fillStyle = `rgba(192, 132, 252, ${0.4 + pulse * 0.3})`;
    for (let x = startX + 25; x < this.width + 60; x += 180) {
      ctx.beginPath();
      ctx.arc(x, 25, 4 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawRuinsBackground(offsetX: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(55, 48, 163, 0.35)';
    const spacing = 220;
    const startX = -((offsetX % spacing) + spacing);

    for (let x = startX; x < this.width + 100; x += spacing) {
      const colH = 200;
      const colY = this.height - 70 - colH;
      // Pillar
      ctx.fillRect(x, colY, 26, colH);
      // Capital & Base
      ctx.fillRect(x - 6, colY, 38, 12);
      ctx.fillRect(x - 6, colY + colH - 12, 38, 12);
    }
    ctx.restore();
  }

  private drawCastleSpires(offsetX: number, isDream: boolean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = isDream ? 'rgba(124, 58, 237, 0.4)' : 'rgba(24, 24, 27, 0.55)';
    const spacing = 240;
    const startX = -((offsetX % spacing) + spacing);

    for (let x = startX; x < this.width + 100; x += spacing) {
      const towerH = 230;
      const baseY = this.height - 60;
      // Tower Body
      ctx.fillRect(x, baseY - towerH, 44, towerH);
      // Castle Battlement top
      ctx.fillRect(x - 4, baseY - towerH - 14, 52, 14);
      // Spire Point
      ctx.beginPath();
      ctx.moveTo(x + 22, baseY - towerH - 45);
      ctx.lineTo(x + 4, baseY - towerH - 14);
      ctx.lineTo(x + 40, baseY - towerH - 14);
      ctx.closePath();
      ctx.fill();

      // Dream Castle golden flag
      if (isDream) {
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(x + 22, baseY - towerH - 58, 2, 14);
        ctx.beginPath();
        ctx.moveTo(x + 24, baseY - towerH - 58);
        ctx.lineTo(x + 38, baseY - towerH - 52);
        ctx.lineTo(x + 24, baseY - towerH - 46);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(124, 58, 237, 0.4)';
      }
    }
    ctx.restore();
  }

  private drawSnow(cameraX: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

    this.snowflakes.forEach((s, idx) => {
      const curY = (s.y + time * 0.05 * s.speedY) % this.height;
      const curX = ((s.x - cameraX * 0.2 + Math.sin(time * 0.002 + s.drift) * 20) % this.width + this.width) % this.width;
      ctx.beginPath();
      ctx.arc(curX, curY, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private drawMountains(offsetX: number, color: string, opacity: number, baseY: number, themeType: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, this.height);

    const step = themeType === 'frozen' ? 110 : 140;
    const startIdx = Math.floor(offsetX / step) - 2;
    const endIdx = startIdx + Math.ceil(this.width / step) + 4;

    for (let i = startIdx; i <= endIdx; i++) {
      const peakX = i * step - offsetX;
      const heightVar = Math.sin(i * 1.7) * 70 + Math.cos(i * 0.8) * 45;
      const peakY = baseY - heightVar;
      if (i === startIdx) {
        ctx.lineTo(peakX, peakY);
      } else {
        if (themeType === 'frozen') {
          // Sharp jagged ice peaks
          ctx.lineTo(peakX, peakY);
        } else {
          const prevX = (i - 1) * step - offsetX;
          const cpX = (prevX + peakX) / 2;
          ctx.quadraticCurveTo(cpX, peakY - 15, peakX, peakY);
        }
      }
    }

    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawStars(offsetX: number, time: number) {
    const ctx = this.ctx;
    ctx.save();
    this.bgStars.forEach((star) => {
      const screenX = ((star.x - offsetX) % (this.width + 200) + (this.width + 200)) % (this.width + 200) - 100;
      const alpha = 0.35 + 0.45 * Math.sin(time * 0.003 + star.phase);
      ctx.fillStyle = `rgba(243, 232, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(screenX, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private drawClouds(offsetX: number, time: number, isSkyLevel: boolean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = isSkyLevel ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.42)';

    this.clouds.forEach((cloud) => {
      const curX = ((cloud.x - offsetX + time * 0.02 * cloud.speed) % (this.width + 300) + (this.width + 300)) % (this.width + 300) - 150;
      const s = cloud.scale * (isSkyLevel ? 1.25 : 1);

      ctx.beginPath();
      ctx.arc(curX, cloud.y, 22 * s, 0, Math.PI * 2);
      ctx.arc(curX + 22 * s, cloud.y - 10 * s, 26 * s, 0, Math.PI * 2);
      ctx.arc(curX + 46 * s, cloud.y - 4 * s, 22 * s, 0, Math.PI * 2);
      ctx.arc(curX + 66 * s, cloud.y, 18 * s, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // TUTORIAL SIGN (Level 1)
  // -------------------------------------------------------------------------
  private drawTutorialSign(sign: TutorialSign, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const x = sign.x;
    const y = sign.y;
    const w = 210;
    const h = 54;

    // Wooden post
    ctx.fillStyle = '#78350F';
    ctx.fillRect(x + w / 2 - 4, y + h, 8, 40);

    // Signboard panel
    ctx.fillStyle = '#581C87';
    this.roundRect(ctx, x, y, w, h, 10);
    ctx.fill();

    ctx.strokeStyle = '#D8B4FE';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cute bunny ears on sign
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x + 22, y - 6, 4, 10, -0.2, 0, Math.PI * 2);
    ctx.ellipse(x + 34, y - 6, 4, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sign.text, x + w / 2, y + 22);

    if (sign.subtext) {
      ctx.fillStyle = '#FAF5FF';
      ctx.font = '11px Fredoka, Nunito, sans-serif';
      ctx.fillText(sign.subtext, x + w / 2, y + 40);
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // CHECKPOINT RENDERING
  // -------------------------------------------------------------------------
  private drawCheckpoint(cp: Checkpoint, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const cx = cp.x + cp.width / 2;
    const cy = cp.y + cp.height;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.006);

    // Base pedestal
    ctx.fillStyle = cp.activated ? '#CA8A04' : '#6B21A8';
    this.roundRect(ctx, cx - 14, cy - 8, 28, 8, 3);
    ctx.fill();

    // Pole
    ctx.fillStyle = cp.activated ? '#FDE047' : '#94A3B8';
    ctx.fillRect(cx - 2.5, cy - cp.height, 5, cp.height - 8);

    // Glowing Flag Banner
    const flagW = 28;
    const flagH = 20;
    const flagWave = Math.sin(time * 0.007) * 3;

    if (cp.activated) {
      // Activated Flag (Bright Golden/Pink!)
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.moveTo(cx + 2.5, cy - cp.height + 4);
      ctx.lineTo(cx + 2.5 + flagW, cy - cp.height + 4 + flagWave);
      ctx.lineTo(cx + 2.5 + flagW - 6, cy - cp.height + 4 + flagH / 2);
      ctx.lineTo(cx + 2.5 + flagW, cy - cp.height + 4 + flagH + flagWave);
      ctx.lineTo(cx + 2.5, cy - cp.height + 4 + flagH);
      ctx.closePath();
      ctx.fill();

      // Shining Golden Star on Flag
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(cx + 12, cy - cp.height + 14 + flagWave * 0.5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Radiant Orb on top of pole
      const orbGrad = ctx.createRadialGradient(cx, cy - cp.height - 2, 2, cx, cy - cp.height - 2, 16);
      orbGrad.addColorStop(0, '#FFFFFF');
      orbGrad.addColorStop(0.4, '#FDE047');
      orbGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - cp.height - 2, 14 + pulse * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(cx, cy - cp.height - 2, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dormant Flag (Soft lilac)
      ctx.fillStyle = '#8B5CF6';
      ctx.beginPath();
      ctx.moveTo(cx + 2.5, cy - cp.height + 4);
      ctx.lineTo(cx + 2.5 + 20, cy - cp.height + 8);
      ctx.lineTo(cx + 2.5, cy - cp.height + 16);
      ctx.closePath();
      ctx.fill();

      // Dormant amethyst jewel
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.arc(cx, cy - cp.height - 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // PLATFORM RENDERING (With Ice, Cloud, Ruins, Garden variations)
  // -------------------------------------------------------------------------
  private drawPlatform(p: Platform, time: number, theme?: LevelTheme) {
    const ctx = this.ctx;
    ctx.save();

    const radius = 10;
    const { x, y, width, height } = p;
    const isIce = p.isIce || theme?.themeType === 'frozen';
    const isCloud = p.isCloud;
    const themeType = theme?.themeType || 'meadows';

    if (isCloud) {
      // ☁️ Fluffy Cloud Platform (Level 5)
      ctx.fillStyle = '#FFFFFF';
      this.roundRect(ctx, x, y, width, height, 12);
      ctx.fill();

      // Puffy cloud trim
      ctx.fillStyle = '#F3E8FF';
      const puffR = 12;
      for (let px = x + 10; px <= x + width - 10; px += 24) {
        ctx.beginPath();
        ctx.arc(px, y + 2, puffR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#DDD6FE';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      return;
    }

    if (isIce) {
      // ❄️ Crystalline Ice Platform (Level 8 & 10)
      const iceGrad = ctx.createLinearGradient(x, y, x, y + height);
      iceGrad.addColorStop(0, '#E0F2FE'); // Frost white top
      iceGrad.addColorStop(0.3, '#38BDF8'); // Sky icy cyan
      iceGrad.addColorStop(1, '#1E1B4B'); // Dark deep ice base

      ctx.fillStyle = iceGrad;
      this.roundRect(ctx, x, y, width, height, radius);
      ctx.fill();

      // Gleaming icy surface sheen
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x + 4, y, width - 8, 3.5);

      // Hanging Icicles underneath!
      ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
      for (let ix = x + 16; ix < x + width - 12; ix += 26) {
        const iLen = 8 + (Math.sin(ix * 0.1) * 6);
        ctx.beginPath();
        ctx.moveTo(ix, y + height);
        ctx.lineTo(ix + 6, y + height);
        ctx.lineTo(ix + 3, y + height + iLen);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = '#BAE6FD';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Standard & Themed Platforms
    const bodyGrad = ctx.createLinearGradient(x, y, x, y + height);
    if (p.type === 'moving') {
      bodyGrad.addColorStop(0, '#A855F7');
      bodyGrad.addColorStop(0.5, '#7E22CE');
      bodyGrad.addColorStop(1, '#4C1D95');
    } else if (themeType === 'ruins') {
      bodyGrad.addColorStop(0, '#475569');
      bodyGrad.addColorStop(0.5, '#334155');
      bodyGrad.addColorStop(1, '#1E293B');
    } else if (themeType === 'castle') {
      bodyGrad.addColorStop(0, '#3F3F46');
      bodyGrad.addColorStop(0.5, '#27272A');
      bodyGrad.addColorStop(1, '#18181B');
    } else if (themeType === 'dream') {
      bodyGrad.addColorStop(0, '#7E22CE');
      bodyGrad.addColorStop(0.5, '#581C87');
      bodyGrad.addColorStop(1, '#3B0764');
    } else {
      const pCol = theme?.platformColor || '#9333EA';
      bodyGrad.addColorStop(0, pCol);
      bodyGrad.addColorStop(0.6, '#6B21A8');
      bodyGrad.addColorStop(1, '#3B0764');
    }

    ctx.fillStyle = bodyGrad;
    this.roundRect(ctx, x, y, width, height, radius);
    ctx.fill();

    // Top surface trim
    const grassHeight = Math.min(10, height * 0.35);
    const grassGrad = ctx.createLinearGradient(x, y, x, y + grassHeight);
    const gCol = theme?.grassColor || '#F3E8FF';
    grassGrad.addColorStop(0, gCol);
    grassGrad.addColorStop(0.5, '#D8B4FE');
    grassGrad.addColorStop(1, '#C084FC');

    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(x, y, width, grassHeight, [radius, radius, 4, 4])
      : ctx.rect(x, y, width, grassHeight);
    ctx.fill();

    // Themed Decorative Top Surface
    if (themeType === 'garden') {
      // Prickly thorny vine trim with magenta buds
      ctx.fillStyle = '#BE185D';
      for (let gx = x + 14; gx < x + width - 14; gx += 28) {
        ctx.beginPath();
        ctx.arc(gx, y + 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (themeType === 'ruins') {
      // Ancient stone brick lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let gx = x + 35; gx < x + width - 20; gx += 45) {
        ctx.beginPath();
        ctx.moveTo(gx, y + grassHeight);
        ctx.lineTo(gx, y + height - 4);
        ctx.stroke();
      }
    } else if (themeType === 'dream') {
      // Golden star sparkles on edge
      ctx.fillStyle = '#FDE047';
      for (let gx = x + 20; gx < x + width - 16; gx += 36) {
        ctx.beginPath();
        ctx.arc(gx, y + 2.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Lavender florets
      ctx.fillStyle = '#E9D5FF';
      for (let gx = x + 16; gx < x + width - 16; gx += 32) {
        ctx.beginPath();
        ctx.arc(gx, y + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Moving platform special glowing indicators
    if (p.type === 'moving') {
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.006);
      ctx.fillStyle = `rgba(244, 114, 182, ${0.4 + pulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, 4 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // HAZARD RENDERING (Thorns for Garden, Frozen for Mountain, Crystals)
  // -------------------------------------------------------------------------
  private drawHazard(hazard: HazardSpike, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const spikeWidth = hazard.width / hazard.count;
    const hType = hazard.hazardType || 'crystal';

    for (let i = 0; i < hazard.count; i++) {
      const sx = hazard.x + i * spikeWidth;
      const sy = hazard.y + hazard.height;

      if (hType === 'thorn') {
        // 🌺 Poison Thorn Bramble (Level 7)
        const thornGrad = ctx.createLinearGradient(sx, sy, sx + spikeWidth / 2, hazard.y);
        thornGrad.addColorStop(0, '#500724');
        thornGrad.addColorStop(0.5, '#BE185D');
        thornGrad.addColorStop(1, '#F472B6'); // Sharp poisonous pink tip

        ctx.fillStyle = thornGrad;
        ctx.beginPath();
        ctx.moveTo(sx + 2, sy);
        // Slightly curved thorn claw shape
        ctx.quadraticCurveTo(sx + spikeWidth * 0.3, sy - hazard.height * 0.6, sx + spikeWidth * 0.5, hazard.y);
        ctx.quadraticCurveTo(sx + spikeWidth * 0.7, sy - hazard.height * 0.4, sx + spikeWidth - 2, sy);
        ctx.closePath();
        ctx.fill();

        // Toxic droplet shimmer at tip
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.arc(sx + spikeWidth * 0.5, hazard.y + 1, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (hType === 'frozen') {
        // ❄️ Glacial Ice Stalagmite (Level 8)
        const iceGrad = ctx.createLinearGradient(sx, sy, sx + spikeWidth / 2, hazard.y);
        iceGrad.addColorStop(0, '#0284C7');
        iceGrad.addColorStop(0.6, '#7DD3FC');
        iceGrad.addColorStop(1, '#FFFFFF');

        ctx.fillStyle = iceGrad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + spikeWidth / 2, hazard.y);
        ctx.lineTo(sx + spikeWidth, sy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + spikeWidth / 2, hazard.y);
        ctx.lineTo(sx + spikeWidth * 0.35, sy);
        ctx.stroke();
      } else {
        // 💎 Amethyst Crystal Spikes
        const crystalGrad = ctx.createLinearGradient(sx, sy, sx + spikeWidth / 2, hazard.y);
        crystalGrad.addColorStop(0, '#581C87');
        crystalGrad.addColorStop(0.6, '#C084FC');
        crystalGrad.addColorStop(1, '#F3E8FF');

        ctx.fillStyle = crystalGrad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + spikeWidth / 2, hazard.y);
        ctx.lineTo(sx + spikeWidth, sy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx + spikeWidth / 2, hazard.y);
        ctx.lineTo(sx + spikeWidth * 0.4, sy);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // COIN / GOLDEN CARROT RENDERING
  // -------------------------------------------------------------------------
  private drawCoin(coin: Coin, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const bob = Math.sin(time * 0.005 + coin.bobOffset) * 4;
    const cy = coin.y + bob;
    const cx = coin.x;

    // Glowing aura
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, coin.radius + 6, 0, Math.PI * 2);
    ctx.fill();

    // Rotating 3D Carrot shape
    ctx.save();
    ctx.translate(cx, cy);
    const squish = Math.cos(time * 0.006 + coin.rotation);
    ctx.scale(Math.max(0.25, Math.abs(squish)), 1);

    // Carrot body
    const carrotGrad = ctx.createLinearGradient(0, -coin.radius, 0, coin.radius);
    carrotGrad.addColorStop(0, '#F59E0B');
    carrotGrad.addColorStop(0.5, '#FBBF24');
    carrotGrad.addColorStop(1, '#D97706');

    ctx.fillStyle = carrotGrad;
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.quadraticCurveTo(0, -12, 10, -8);
    ctx.quadraticCurveTo(6, 4, 0, 14); // carrot tip
    ctx.quadraticCurveTo(-6, 4, -10, -8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cute carrot leaves
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.ellipse(-4, -13, 3, 6, -0.4, 0, Math.PI * 2);
    ctx.ellipse(0, -14, 3, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -13, 3, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Shine highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-3, -3, 2, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // SLIME RENDERING
  // -------------------------------------------------------------------------
  private drawSlime(slime: EnemySlime, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const isSquished = slime.squished;
    const cx = slime.x + slime.width / 2;
    const cy = slime.y + slime.height;

    ctx.translate(cx, cy);

    let scaleX = 1;
    let scaleY = 1;

    if (isSquished) {
      scaleX = 1.4;
      scaleY = 0.3;
    } else {
      const wobbleVal = Math.sin(time * 0.008 + slime.wobble);
      scaleX = 1 + wobbleVal * 0.1;
      scaleY = 1 - wobbleVal * 0.1;
    }

    ctx.scale(scaleX, scaleY);

    const w = slime.width;
    const h = slime.height;

    // Cute Purple Slime Body
    const slimeGrad = ctx.createLinearGradient(0, -h, 0, 0);
    slimeGrad.addColorStop(0, '#E879F9');
    slimeGrad.addColorStop(0.4, '#C026D3');
    slimeGrad.addColorStop(1, '#701A75');

    ctx.fillStyle = slimeGrad;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.quadraticCurveTo(-w * 0.6, -h * 0.6, -w * 0.3, -h);
    ctx.quadraticCurveTo(0, -h * 1.15, w * 0.3, -h);
    ctx.quadraticCurveTo(w * 0.6, -h * 0.6, w / 2, 0);
    ctx.closePath();
    ctx.fill();

    // Glossy jelly specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.22, -h * 0.75, 4, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Cute Eyes
    if (!isSquished) {
      const eyeDir = slime.vx > 0 ? 2 : -2;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-8 + eyeDir, -h * 0.45, 4.5, 0, Math.PI * 2);
      ctx.arc(8 + eyeDir, -h * 0.45, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3B0764';
      ctx.beginPath();
      ctx.arc(-7 + eyeDir, -h * 0.45, 2.5, 0, Math.PI * 2);
      ctx.arc(9 + eyeDir, -h * 0.45, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-8 + eyeDir, -h * 0.48, 1.2, 0, Math.PI * 2);
      ctx.arc(8 + eyeDir, -h * 0.48, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Rosy blush
      ctx.fillStyle = 'rgba(253, 164, 175, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-14, -h * 0.3, 3, 2, 0, 0, Math.PI * 2);
      ctx.ellipse(14, -h * 0.3, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#3B0764';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -h * 0.4);
      ctx.lineTo(-6, -h * 0.4);
      ctx.moveTo(6, -h * 0.4);
      ctx.lineTo(10, -h * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // FINISH GOAL RENDERING (Extra Grand on Level 10 Finale!)
  // -------------------------------------------------------------------------
  private drawFinishGoal(goal: FinishGoal, time: number, isLastLevel: boolean) {
    const ctx = this.ctx;
    ctx.save();

    const { x, y, width, height } = goal;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.005);

    if (isLastLevel) {
      // 👑 GRAND PALACE GATEWAY (Level 10 Special Finale Finish!)
      // Shimmering Magic Carpet
      const carpetGrad = ctx.createLinearGradient(x - 20, y + height - 10, x + width + 20, y + height);
      carpetGrad.addColorStop(0, '#B91C1C');
      carpetGrad.addColorStop(0.5, '#F59E0B');
      carpetGrad.addColorStop(1, '#B91C1C');
      ctx.fillStyle = carpetGrad;
      this.roundRect(ctx, x - 25, y + height - 8, width + 50, 14, 5);
      ctx.fill();

      // Royal Gold Gateway Arch
      const archGrad = ctx.createLinearGradient(x, y, x + width, y);
      archGrad.addColorStop(0, '#CA8A04');
      archGrad.addColorStop(0.5, '#FEF08A');
      archGrad.addColorStop(1, '#CA8A04');

      ctx.fillStyle = archGrad;
      this.roundRect(ctx, x - 12, y, 16, height, 4); // Left Pillar
      this.roundRect(ctx, x + width - 4, y, 16, height, 4); // Right Pillar
      ctx.fill();

      // Portal Interior Aura
      const portalGrad = ctx.createRadialGradient(x + width / 2, y + height / 2, 10, x + width / 2, y + height / 2, width);
      portalGrad.addColorStop(0, '#FFFFFF');
      portalGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.8)');
      portalGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.6)');
      portalGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2 + 5, width / 2 + 10, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Grand Golden Crown on Top
      const crownY = y - 30 + Math.sin(time * 0.004) * 4;
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 24, crownY + 12);
      ctx.lineTo(x + width / 2 - 20, crownY - 14);
      ctx.lineTo(x + width / 2 - 8, crownY);
      ctx.lineTo(x + width / 2, crownY - 20); // Center high crown point
      ctx.lineTo(x + width / 2 + 8, crownY);
      ctx.lineTo(x + width / 2 + 20, crownY - 14);
      ctx.lineTo(x + width / 2 + 24, crownY + 12);
      ctx.closePath();
      ctx.fill();

      // Crown Jewels
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(x + width / 2, crownY - 14, 3.5, 0, Math.PI * 2);
      ctx.arc(x + width / 2 - 16, crownY - 8, 2.5, 0, Math.PI * 2);
      ctx.arc(x + width / 2 + 16, crownY - 8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Banner "FINAL CASTLE"
      ctx.fillStyle = '#7C3AED';
      this.roundRect(ctx, x - 20, y + 2, width + 40, 24, 6);
      ctx.fill();
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 12px Fredoka, Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑 CASTLE FINISH 👑', x + width / 2, y + 14);

      ctx.restore();
      return;
    }

    // Standard Finish Arch (Levels 1 - 9)
    const portalGrad = ctx.createRadialGradient(x + width / 2, y + height / 2, 5, x + width / 2, y + height / 2, 45);
    portalGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    portalGrad.addColorStop(0.5, `rgba(244, 114, 182, ${0.6 + pulse * 0.3})`);
    portalGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');

    ctx.fillStyle = portalGrad;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2 + 10, width / 2 - 8, height / 2 - 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arch Pillars
    ctx.fillStyle = '#7E22CE';
    this.roundRect(ctx, x, y + 10, 10, height - 10, 4);
    this.roundRect(ctx, x + width - 10, y + 10, 10, height - 10, 4);
    ctx.fill();

    // Banner
    const bannerY = y - 10 + Math.sin(time * 0.004) * 3;
    ctx.fillStyle = '#F472B6';
    this.roundRect(ctx, x - 10, bannerY, width + 20, 24, 6);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐ FINISH ⭐', x + width / 2, bannerY + 12);

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(x + width / 2, bannerY - 10, 7 + pulse * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // BUNNY PLAYER RENDERING
  // -------------------------------------------------------------------------
  private drawBunny(bunny: BunnyPlayer, time: number) {
    const ctx = this.ctx;
    ctx.save();

    if (bunny.invulnerableTime > 0 && Math.floor(time / 80) % 2 === 0) {
      ctx.restore();
      return;
    }

    const cx = bunny.x + bunny.width / 2;
    const cy = bunny.y + bunny.height;

    ctx.translate(cx, cy);

    if (bunny.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Squash & Stretch scaling from landing/jumping
    ctx.scale(bunny.squishX, bunny.squishY);

    const w = bunny.width;
    const h = bunny.height;

    const isGrounded = bunny.isGrounded;
    const isIdle = isGrounded && Math.abs(bunny.vx) < 0.15;
    const isRunning = isGrounded && Math.abs(bunny.vx) >= 0.15;
    const isJumping = !isGrounded && bunny.vy < 0;
    const isFalling = !isGrounded && bunny.vy >= 0;

    // Idle breathing & Run bobbing
    let bounceOffset = 0;
    if (isIdle) {
      bounceOffset = Math.sin(time * 0.005) * 1.5;
    } else if (isRunning) {
      bounceOffset = Math.abs(Math.sin(bunny.walkCycle * 2)) * 3;
      // Dynamic forward tilt when sprinting
      ctx.rotate(0.06);
    }

    // Tail
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-w * 0.42, -h * 0.32 + bounceOffset, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E9D5FF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ears calculation with state-specific reactions
    let earTilt = 0;
    if (isIdle) {
      // Gentle ear twitch
      earTilt = Math.sin(time * 0.003) * 0.08 + (Math.sin(time * 0.012) > 0.88 ? 0.14 : 0);
    } else if (isRunning) {
      // Ears trailing back dynamically in the wind
      earTilt = -0.28 + Math.sin(bunny.walkCycle) * 0.16;
    } else if (isJumping) {
      // Streamlined ears folded back during jump ascent
      earTilt = -0.38;
    } else if (isFalling) {
      // Ears lifted upward by rushing wind resistance during fall descent
      earTilt = 0.28;
    }

    this.drawSingleEar(ctx, -6, -h * 0.88 + bounceOffset, earTilt - 0.12, 10, 26, '#FAF5FF', '#FBCFE8');
    this.drawSingleEar(ctx, 4, -h * 0.88 + bounceOffset, earTilt + 0.1, 10, 28, '#FFFFFF', '#F472B6');

    // Body
    const bodyGrad = ctx.createLinearGradient(0, -h + bounceOffset, 0, bounceOffset);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.7, '#FAF5FF');
    bodyGrad.addColorStop(1, '#F3E8FF');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.48 + bounceOffset, w * 0.48, h * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E9D5FF';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Belly Patch
    ctx.fillStyle = '#F5F3FF';
    ctx.beginPath();
    ctx.ellipse(w * 0.12, -h * 0.38 + bounceOffset, w * 0.26, h * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Feet animation: running leg cycle vs jump tucked vs fall extended
    let footOffsetL = 0;
    let footOffsetR = 0;
    let footY = -3;

    if (isRunning) {
      footOffsetL = Math.sin(bunny.walkCycle) * 6;
      footOffsetR = -Math.sin(bunny.walkCycle) * 6;
    } else if (isJumping) {
      footY = -6; // Feet pulled up snugly under body
    } else if (isFalling) {
      footY = 1.5; // Feet reaching downward to prepare landing
    }

    ctx.fillStyle = '#EDE9FE';
    ctx.beginPath();
    ctx.ellipse(-w * 0.22 + footOffsetL, footY, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.22 + footOffsetR, footY, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Face
    const faceX = w * 0.14;
    const faceY = -h * 0.52 + bounceOffset;

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.ellipse(faceX - 10, faceY + 5, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(faceX + 11, faceY + 5, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye blinking when idle
    const isBlinking = isIdle && (Math.floor(time) % 3200 < 130);

    if (isBlinking) {
      // Closed happy blinking eye arcs
      ctx.strokeStyle = '#3B0764';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(faceX - 4, faceY - 2, 4, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(faceX + 9, faceY - 2, 4, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
    } else {
      // Open cute glossy eyes
      ctx.fillStyle = '#3B0764';
      ctx.beginPath();
      ctx.ellipse(faceX - 4, faceY - 2, 4.2, 6, 0.05, 0, Math.PI * 2);
      ctx.ellipse(faceX + 9, faceY - 2, 4.2, 6, -0.05, 0, Math.PI * 2);
      ctx.fill();

      // Highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(faceX - 5.5, faceY - 4.5, 1.8, 0, Math.PI * 2);
      ctx.arc(faceX + 7.5, faceY - 4.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.moveTo(faceX + 2, faceY + 3);
    ctx.lineTo(faceX + 5, faceY + 5);
    ctx.lineTo(faceX - 1, faceY + 5);
    ctx.closePath();
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(faceX - 7, faceY + 5);
    ctx.lineTo(faceX - 16, faceY + 4);
    ctx.moveTo(faceX - 7, faceY + 7);
    ctx.lineTo(faceX - 15, faceY + 9);
    ctx.moveTo(faceX + 8, faceY + 5);
    ctx.lineTo(faceX + 17, faceY + 4);
    ctx.moveTo(faceX + 8, faceY + 7);
    ctx.lineTo(faceX + 16, faceY + 9);
    ctx.stroke();

    ctx.restore();
  }

  private drawSingleEar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rotation: number,
    w: number,
    h: number,
    outerColor: string,
    innerColor: string
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.fillStyle = outerColor;
    ctx.beginPath();
    ctx.ellipse(0, -h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E9D5FF';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = innerColor;
    ctx.beginPath();
    ctx.ellipse(0, -h / 2 + 2, (w / 2) * 0.55, (h / 2) * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // PARTICLES & FLOATING TEXTS
  // -------------------------------------------------------------------------
  private drawParticle(p: GameParticle) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);

    if (p.type === 'confetti') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.6);
    } else if (p.type === 'sparkle') {
      // 4-point magical diamond sparkle star
      const s = p.size;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - s * 1.5);
      ctx.quadraticCurveTo(p.x, p.y, p.x + s * 1.5, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 1.5);
      ctx.quadraticCurveTo(p.x, p.y, p.x - s * 1.5, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 1.5);
      ctx.closePath();
      ctx.fill();

      // Center bright core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, s * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft round dust / bubble puff
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawFloatingText(ft: FloatingText) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.fillStyle = ft.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.font = 'bold 15px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText(ft.text, ft.x, ft.y);
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }
}
