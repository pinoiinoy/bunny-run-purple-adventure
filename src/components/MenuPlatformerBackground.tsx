import React, { useEffect, useRef } from 'react';

export const MenuPlatformerBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    let width = canvas.clientWidth || 960;
    let height = canvas.clientHeight || 540;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth || 960;
      height = canvas.clientHeight || 540;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    // Drifting cartoon clouds
    const clouds = [
      { x: 30, y: 45, scale: 1.1, speed: 0.18 },
      { x: 290, y: 70, scale: 0.85, speed: 0.12 },
      { x: 560, y: 35, scale: 1.25, speed: 0.22 },
      { x: 820, y: 65, scale: 0.95, speed: 0.15 },
    ];

    // Floating petals / sparkles
    const sparkles = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2.2 + Math.random() * 3,
      speedX: 0.25 + Math.random() * 0.35,
      speedY: -0.12 - Math.random() * 0.25,
      alpha: 0.35 + Math.random() * 0.5,
      color: i % 3 === 0 ? '#FEF08A' : i % 3 === 1 ? '#F472B6' : '#C084FC',
      phase: Math.random() * Math.PI * 2,
    }));

    // Grass & flowers along the lower edge
    const flowerPositions = [
      40, 80, 130, 180, 240, 310, 380, 580, 640, 710, 770, 830, 890, 930
    ];

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. SKY: Cheerful pastel purple-pink daylight
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#FAF5FF');
      skyGrad.addColorStop(0.3, '#F3E8FF');
      skyGrad.addColorStop(0.65, '#E9D5FF');
      skyGrad.addColorStop(1, '#DDD6FE');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. SOFT SUN GLOW
      const sunGlow = ctx.createRadialGradient(width * 0.82, 85, 8, width * 0.82, 85, 180);
      sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.5)');
      sunGlow.addColorStop(0.35, 'rgba(244, 114, 182, 0.2)');
      sunGlow.addColorStop(1, 'rgba(250, 245, 255, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(width * 0.82, 85, 180, 0, Math.PI * 2);
      ctx.fill();

      // 3. DRIFTING CLOUDS
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - 120 > width) {
          c.x = -130;
        }

        ctx.save();
        ctx.translate(c.x, c.y + Math.sin(time * 0.0015 + c.x * 0.01) * 3);
        ctx.scale(c.scale, c.scale);

        // Soft cloud shadow
        ctx.fillStyle = 'rgba(216, 180, 254, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 8, 26, 0, Math.PI * 2);
        ctx.arc(24, 6, 22, 0, Math.PI * 2);
        ctx.arc(-24, 6, 20, 0, Math.PI * 2);
        ctx.fill();

        // Cloud body
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 3, 26, 0, Math.PI * 2);
        ctx.arc(24, 1, 22, 0, Math.PI * 2);
        ctx.arc(-24, 1, 20, 0, Math.PI * 2);
        ctx.arc(42, 5, 14, 0, Math.PI * 2);
        ctx.arc(-42, 5, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 4. DISTANT MOUNTAINS (Soft lilac haze)
      ctx.fillStyle = '#C4B5FD';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.62);
      ctx.quadraticCurveTo(width * 0.18, height * 0.44, width * 0.36, height * 0.6);
      ctx.quadraticCurveTo(width * 0.54, height * 0.4, width * 0.72, height * 0.62);
      ctx.quadraticCurveTo(width * 0.88, height * 0.46, width, height * 0.6);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // 5. MIDGROUND PURPLE ROLLING HILLS
      const midHillGrad = ctx.createLinearGradient(0, height * 0.52, 0, height);
      midHillGrad.addColorStop(0, '#A855F7');
      midHillGrad.addColorStop(1, '#7E22CE');
      ctx.fillStyle = midHillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.22, height * 0.56, width * 0.48, height * 0.76, width * 0.72, height * 0.62);
      ctx.bezierCurveTo(width * 0.86, height * 0.52, width * 0.94, height * 0.66, width, height * 0.68);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 6. FOREGROUND LUSH HILLS (Deep vibrant violet-lavender)
      const fgGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
      fgGrad.addColorStop(0, '#7C3AED');
      fgGrad.addColorStop(0.35, '#6D28D9');
      fgGrad.addColorStop(1, '#4C1D95');
      ctx.fillStyle = fgGrad;

      ctx.beginPath();
      ctx.moveTo(0, height * 0.82);
      ctx.bezierCurveTo(width * 0.22, height * 0.74, width * 0.42, height * 0.76, width * 0.5, height * 0.76);
      ctx.bezierCurveTo(width * 0.58, height * 0.76, width * 0.78, height * 0.74, width, height * 0.82);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Rim highlight line
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Grass tufts
      ctx.fillStyle = '#A78BFA';
      for (let gx = 25; gx < width - 20; gx += 40) {
        const moundY =
          height * 0.76 +
          Math.pow((gx - width * 0.5) / (width * 0.5), 2) * (height * 0.06);
        ctx.beginPath();
        ctx.moveTo(gx, moundY);
        ctx.lineTo(gx - 4, moundY - 5);
        ctx.lineTo(gx, moundY - 2);
        ctx.lineTo(gx + 4, moundY - 6);
        ctx.lineTo(gx + 2, moundY);
        ctx.closePath();
        ctx.fill();
      }

      // 7. SWAYING FLOWERS
      flowerPositions.forEach((fx) => {
        const moundY =
          height * 0.76 +
          Math.pow((fx - width * 0.5) / (width * 0.5), 2) * (height * 0.06);
        const sway = Math.sin(time * 0.003 + fx * 0.04) * 4;
        const stemH = 22 + Math.sin(fx * 1.9) * 5;

        // Stem
        ctx.strokeStyle = '#4ADE80';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(fx, moundY);
        ctx.quadraticCurveTo(fx + sway * 0.5, moundY - stemH * 0.5, fx + sway, moundY - stemH);
        ctx.stroke();

        // Blossoms
        if (fx % 2 === 0) {
          ctx.fillStyle = '#C084FC';
          for (let f = 0; f < 3; f++) {
            ctx.beginPath();
            ctx.arc(fx + sway - 2.5, moundY - stemH + f * 4, 2.5, 0, Math.PI * 2);
            ctx.arc(fx + sway + 2.5, moundY - stemH + f * 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(fx + sway, moundY - stemH - 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#F472B6';
          for (let petal = 0; petal < 5; petal++) {
            const angle = (petal * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(
              fx + sway + Math.cos(angle) * 3.5,
              moundY - stemH + Math.sin(angle) * 3.5,
              2.2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(fx + sway, moundY - stemH, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 8. FLOATING SPARKLES / PETALS
      sparkles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 10;

        const pulse = Math.sin(time * 0.005 + p.phase);
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * pulse);
        ctx.fillStyle = p.color;

        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - s * 1.3);
        ctx.quadraticCurveTo(p.x, p.y, p.x + s * 1.3, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 1.3);
        ctx.quadraticCurveTo(p.x, p.y, p.x - s * 1.3, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 1.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="menu-platformer-background"
      className="absolute inset-0 w-full h-full object-cover block pointer-events-none select-none z-0"
    />
  );
};
