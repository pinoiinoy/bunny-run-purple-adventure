import React, { useEffect, useRef } from 'react';
import { sound } from '../game/audio';

export const AnimatedBunnyHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 240;
    const height = 210;
    canvas.width = width;
    canvas.height = height;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.78;

      // Soft grassy patch below feet
      ctx.save();
      const patchGrad = ctx.createLinearGradient(0, cy - 8, 0, cy + 22);
      patchGrad.addColorStop(0, '#A855F7');
      patchGrad.addColorStop(0.5, '#7C3AED');
      patchGrad.addColorStop(1, '#581C87');
      ctx.fillStyle = patchGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, 68, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Grass rim highlight
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cute little flower sprigs beside the bunny
      [-48, 48].forEach((offset) => {
        const fx = cx + offset;
        const fy = cy + 6;
        const sway = Math.sin(time * 0.003 + offset) * 3;

        // Stem
        ctx.strokeStyle = '#4ADE80';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(fx + sway * 0.5, fy - 14, fx + sway, fy - 24);
        ctx.stroke();

        // Blossoms
        ctx.fillStyle = offset > 0 ? '#F472B6' : '#C084FC';
        ctx.beginPath();
        ctx.arc(fx + sway - 3, fy - 24, 3, 0, Math.PI * 2);
        ctx.arc(fx + sway + 3, fy - 24, 3, 0, Math.PI * 2);
        ctx.arc(fx + sway, fy - 27, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(fx + sway, fy - 24, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bunny contact shadow
      ctx.fillStyle = 'rgba(49, 10, 82, 0.45)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 38, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Canonical Bunny at 2.45x scale
      ctx.save();
      ctx.translate(cx, cy);

      const scale = 2.45;
      ctx.scale(scale, scale);

      const w = 32;
      const h = 40;

      // Idle breathing bounce
      const breathingBob = Math.sin(time * 0.0035) * 1.8;

      // Tail
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-w * 0.42, -h * 0.32 + breathingBob, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ears with delicate twitches
      const earWiggle = Math.sin(time * 0.003) * 0.08 + (Math.sin(time * 0.015) > 0.88 ? 0.12 : 0);
      drawSingleEar(ctx, -6, -h * 0.88 + breathingBob, earWiggle - 0.12, 10, 26, '#FAF5FF', '#FBCFE8');
      drawSingleEar(ctx, 4, -h * 0.88 + breathingBob, earWiggle + 0.1, 10, 28, '#FFFFFF', '#F472B6');

      // Body
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

      // Bell ribbon collar
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(w * 0.04, -h * 0.28 + breathingBob, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Feet
      ctx.fillStyle = '#EDE9FE';
      ctx.beginPath();
      ctx.ellipse(-w * 0.22, 0, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.22, 0, 8, 5, 0, 0, Math.PI * 2);
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

      // Blinking Eyes
      const isBlinking = (Math.floor(time) % 3200) < 130;

      if (isBlinking) {
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

        // Eye sparkles
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

      // Pink Nose
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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleClickBunny = () => {
    sound.playJump();
  };

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none group transform transition-transform hover:scale-105 active:scale-95"
      onClick={handleClickBunny}
      title="Klik kelinci untuk mendengar suaranya!"
    >
      <canvas
        ref={canvasRef}
        className="w-36 h-32 sm:w-48 sm:h-42 md:w-56 md:h-48 block drop-shadow-[0_14px_25px_rgba(124,58,237,0.4)]"
      />
    </div>
  );
};

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
