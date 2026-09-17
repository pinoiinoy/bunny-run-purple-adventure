import React, { useEffect, useRef } from 'react';

export const MenuHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Fixed internal resolution
    const width = 960;
    const height = 540;
    canvas.width = width;
    canvas.height = height;

    // Cloud particles
    const clouds = [
      { x: 50, y: 55, scale: 1.1, speed: 0.22 },
      { x: 380, y: 35, scale: 0.85, speed: 0.14 },
      { x: 680, y: 75, scale: 1.25, speed: 0.28 },
      { x: 920, y: 45, scale: 0.95, speed: 0.18 },
    ];

    // Floating petals / sparkles
    const sparkles = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2.5 + Math.random() * 3.5,
      speedX: 0.2 + Math.random() * 0.4,
      speedY: -0.15 - Math.random() * 0.35,
      alpha: 0.3 + Math.random() * 0.6,
      color: i % 3 === 0 ? '#FDF08A' : i % 3 === 1 ? '#F472B6' : '#C084FC',
      phase: Math.random() * Math.PI * 2,
    }));

    // Grass & flowers positions on the foreground mound
    const flowerXList = [
      120, 160, 210, 260, 310, 370, 420, 540, 590, 650, 700, 750, 800, 850
    ];

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. SKY GRADIENT (Bright & cheerful pastel lavender morning)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#FAF5FF');
      skyGrad.addColorStop(0.35, '#F3E8FF');
      skyGrad.addColorStop(0.7, '#E9D5FF');
      skyGrad.addColorStop(1, '#D8B4FE');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. SOFT SUN GLOW
      const sunGlow = ctx.createRadialGradient(width * 0.82, 90, 10, width * 0.82, 90, 160);
      sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      sunGlow.addColorStop(0.4, 'rgba(244, 114, 182, 0.2)');
      sunGlow.addColorStop(1, 'rgba(250, 245, 255, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(width * 0.82, 90, 160, 0, Math.PI * 2);
      ctx.fill();

      // 3. DRIFTING CLOUDS
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - 120 > width) {
          c.x = -150;
        }

        ctx.save();
        ctx.translate(c.x, c.y + Math.sin(time * 0.0015 + c.x * 0.01) * 4);
        ctx.scale(c.scale, c.scale);

        // Soft cloud shadow
        ctx.fillStyle = 'rgba(216, 180, 254, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 10, 26, 0, Math.PI * 2);
        ctx.arc(24, 8, 22, 0, Math.PI * 2);
        ctx.arc(-24, 8, 20, 0, Math.PI * 2);
        ctx.fill();

        // Cloud body
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 4, 26, 0, Math.PI * 2);
        ctx.arc(24, 2, 22, 0, Math.PI * 2);
        ctx.arc(-24, 2, 20, 0, Math.PI * 2);
        ctx.arc(42, 6, 14, 0, Math.PI * 2);
        ctx.arc(-42, 6, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 4. DISTANT PURPLE MOUNTAINS (Soft lilac haze)
      ctx.fillStyle = '#C4B5FD';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      ctx.quadraticCurveTo(width * 0.18, height * 0.45, width * 0.35, height * 0.62);
      ctx.quadraticCurveTo(width * 0.55, height * 0.42, width * 0.72, height * 0.64);
      ctx.quadraticCurveTo(width * 0.88, height * 0.48, width, height * 0.62);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // 5. MIDGROUND ROLLING HILLS (Rich vibrant lavender)
      const midHillGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
      midHillGrad.addColorStop(0, '#A855F7');
      midHillGrad.addColorStop(1, '#7E22CE');
      ctx.fillStyle = midHillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.25, height * 0.56, width * 0.5, height * 0.78, width * 0.75, height * 0.62);
      ctx.bezierCurveTo(width * 0.88, height * 0.54, width * 0.95, height * 0.68, width, height * 0.69);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Highlight on midground hill crest
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 6. FOREGROUND LUSH PLATFORMER MOUND (Where the bunny stands)
      const fgGrad = ctx.createLinearGradient(0, height * 0.68, 0, height);
      fgGrad.addColorStop(0, '#7C3AED');
      fgGrad.addColorStop(0.3, '#6D28D9');
      fgGrad.addColorStop(1, '#4C1D95');
      ctx.fillStyle = fgGrad;

      ctx.beginPath();
      ctx.moveTo(0, height * 0.82);
      // Sweeping central hill mound
      ctx.bezierCurveTo(width * 0.25, height * 0.68, width * 0.45, height * 0.66, width * 0.5, height * 0.66);
      ctx.bezierCurveTo(width * 0.55, height * 0.66, width * 0.75, height * 0.68, width, height * 0.82);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Grass top rim highlight (bright cheerful lilac/emerald line)
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Grass fringe accents
      ctx.fillStyle = '#A78BFA';
      for (let gx = 30; gx < width - 30; gx += 45) {
        const moundY =
          height * 0.66 +
          Math.pow((gx - width * 0.5) / (width * 0.5), 2) * (height * 0.16);
        ctx.beginPath();
        ctx.moveTo(gx, moundY);
        ctx.lineTo(gx - 4, moundY - 6);
        ctx.lineTo(gx, moundY - 2);
        ctx.lineTo(gx + 4, moundY - 7);
        ctx.lineTo(gx + 2, moundY);
        ctx.closePath();
        ctx.fill();
      }

      // 7. SWAYING FLOWERS (Lavender florets & pink daisies)
      flowerXList.forEach((fx) => {
        const moundY =
          height * 0.66 +
          Math.pow((fx - width * 0.5) / (width * 0.5), 2) * (height * 0.16);
        const sway = Math.sin(time * 0.003 + fx * 0.05) * 5;
        const stemH = 26 + Math.sin(fx * 2.1) * 6;

        // Stem
        ctx.strokeStyle = '#4ADE80';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, moundY);
        ctx.quadraticCurveTo(fx + sway * 0.5, moundY - stemH * 0.5, fx + sway, moundY - stemH);
        ctx.stroke();

        // Flower florets
        if (fx % 2 === 0) {
          // Lavender spike
          ctx.fillStyle = '#C084FC';
          for (let f = 0; f < 3; f++) {
            ctx.beginPath();
            ctx.arc(fx + sway - 3, moundY - stemH + f * 5, 2.8, 0, Math.PI * 2);
            ctx.arc(fx + sway + 3, moundY - stemH + f * 5, 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(fx + sway, moundY - stemH - 2, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pink Daisy
          ctx.fillStyle = '#F472B6';
          for (let petal = 0; petal < 5; petal++) {
            const angle = (petal * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(
              fx + sway + Math.cos(angle) * 4,
              moundY - stemH + Math.sin(angle) * 4,
              2.5,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(fx + sway, moundY - stemH, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 8. FLOATING SPARKLES & PETALS
      sparkles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 10;

        const pulse = Math.sin(time * 0.005 + p.phase);
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * pulse);
        ctx.fillStyle = p.color;

        // 4-point diamond sparkle
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - s * 1.4);
        ctx.quadraticCurveTo(p.x, p.y, p.x + s * 1.4, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 1.4);
        ctx.quadraticCurveTo(p.x, p.y, p.x - s * 1.4, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 1.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 9. HERO BUNNY CHARACTER (Center of the hill, large, perfectly detailed)
      const bunnyCenterX = width * 0.5;
      const bunnyBaseY = height * 0.67;
      drawHeroBunny(ctx, bunnyCenterX, bunnyBaseY, time);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="menu-hero-canvas"
      className="absolute inset-0 w-full h-full object-cover block pointer-events-none select-none"
    />
  );
};

// -----------------------------------------------------------------------------
// HELPER: DRAW EXACT CANONICAL HERO BUNNY AT 2.4X SCALE WITH IDLE ANIMATIONS
// -----------------------------------------------------------------------------
function drawHeroBunny(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Scale up for majestic title hero presence (canonical bunny is 32x40)
  const scale = 2.45;
  ctx.scale(scale, scale);

  const w = 32;
  const h = 40;

  // Gentle idle breathing bob
  const breathingBob = Math.sin(time * 0.0035) * 1.6;

  // Soft contact shadow on the grassy hill
  ctx.save();
  ctx.fillStyle = 'rgba(49, 10, 82, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.55, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tail (Round fluffy cotton ball)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-w * 0.42, -h * 0.32 + breathingBob, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E9D5FF';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Ears calculation with adorable subtle twitches
  const earWiggle = Math.sin(time * 0.0028) * 0.08 + (Math.sin(time * 0.014) > 0.88 ? 0.12 : 0);
  drawSingleEar(ctx, -6, -h * 0.88 + breathingBob, earWiggle - 0.12, 10, 26, '#FAF5FF', '#FBCFE8');
  drawSingleEar(ctx, 4, -h * 0.88 + breathingBob, earWiggle + 0.1, 10, 28, '#FFFFFF', '#F472B6');

  // Body (Soft gradient white-lilac)
  const bodyGrad = ctx.createLinearGradient(0, -h + breathingBob, 0, breathingBob);
  bodyGrad.addColorStop(0, '#FFFFFF');
  bodyGrad.addColorStop(0.7, '#FAF5FF');
  bodyGrad.addColorStop(1, '#F3E8FF');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.48 + breathingBob, w * 0.48, h * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E9D5FF';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Belly Patch
  ctx.fillStyle = '#F5F3FF';
  ctx.beginPath();
  ctx.ellipse(w * 0.12, -h * 0.38 + breathingBob, w * 0.26, h * 0.28, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Little Golden Bell Ribbon on collar
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(w * 0.05, -h * 0.26 + breathingBob, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Feet
  ctx.fillStyle = '#EDE9FE';
  ctx.beginPath();
  ctx.ellipse(-w * 0.22, -1, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.22, -1, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face
  const faceX = w * 0.14;
  const faceY = -h * 0.52 + breathingBob;

  // Rosy Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.ellipse(faceX - 10, faceY + 5, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(faceX + 11, faceY + 5, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Natural Eye Blinking: eyes close for ~130ms every 3.2 seconds
  const isBlinking = (Math.floor(time) % 3200) < 130;

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
    ctx.beginPath();
    ctx.arc(faceX - 3.2, faceY - 0.5, 0.9, 0, Math.PI * 2);
    ctx.arc(faceX + 9.8, faceY - 0.5, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pink triangular nose
  ctx.fillStyle = '#EC4899';
  ctx.beginPath();
  ctx.moveTo(faceX + 2, faceY + 3);
  ctx.lineTo(faceX + 5, faceY + 5);
  ctx.lineTo(faceX - 1, faceY + 5);
  ctx.closePath();
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
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

function drawSingleEar(
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
