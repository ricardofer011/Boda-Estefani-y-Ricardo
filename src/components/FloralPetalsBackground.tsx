'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  swayAngle: number;
  swaySpeed: number;
  swayRadius: number;
  opacity: number;
  type: 'petal' | 'flower' | 'pollen';
  colorType: number; // 0: deep plum/mauve, 1: dusty lilac, 2: soft orchid, 3: whisper lavender, 4: blush ivory
}

export function FloralPetalsBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isTabVisible = true;

    // Detectar si el usuario prefiere movimiento reducido
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ajustar dimensiones con soporte para pantallas Retina (alta densidad de píxeles)
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cantidad adaptativa según ancho de pantalla para máximo rendimiento
    const isMobile = window.innerWidth < 768;
    const totalPetals = isMobile ? 26 : 42;
    const totalFlowers = isMobile ? 8 : 14;
    const totalPollen = isMobile ? 18 : 28;

    const particles: Particle[] = [];

    // Paletas de color oficiales de la boda (ciruela, malva, lila, orquídea, lavanda)
    const petalPalettes = [
      { base: '#784A67', mid: '#9B709E', tip: '#DFC6E3' }, // Malva a lila a lavanda
      { base: '#5C3759', mid: '#8C5779', tip: '#E6D3E8' }, // Ciruela profundo con punta clara
      { base: '#9B709E', mid: '#AB86B1', tip: '#F5EBF7' }, // Lila clásico a orquídea
      { base: '#AB86B1', mid: '#DFC6E3', tip: '#FCF7FD' }, // Orquídea a lavanda suave
      { base: '#A0769A', mid: '#D2B3D6', tip: '#FFF5FC' }, // Rosa lila aperlado
    ];

    const flowerPalettes = [
      { petal: '#9B709E', edge: '#DFC6E3', center: '#DFC088' },
      { petal: '#AB86B1', edge: '#F3E5F5', center: '#B89355' },
      { petal: '#8A587C', edge: '#CFAFD5', center: '#EED99E' },
    ];

    // Inicializar partícula
    const createParticle = (initialY = -1): Particle => {
      const rand = Math.random();
      let type: 'petal' | 'flower' | 'pollen' = 'petal';

      if (rand < 0.22) {
        type = 'flower'; // 22% florecitas pequeñas
      } else if (rand < 0.40) {
        type = 'pollen'; // 18% motitas de polen dorado/lila brillante
      }

      // Tamaño según tipo
      let size = 12;
      let speedY = 0.8 + Math.random() * 1.2;
      let opacity = 0.65 + Math.random() * 0.35;

      if (type === 'petal') {
        size = 11 + Math.random() * 11; // 11px a 22px
        speedY = (0.7 + Math.random() * 1.1) * (isReducedMotion ? 0.3 : 1);
      } else if (type === 'flower') {
        size = 9 + Math.random() * 8; // 9px a 17px
        speedY = (0.5 + Math.random() * 0.8) * (isReducedMotion ? 0.25 : 1);
        opacity = 0.7 + Math.random() * 0.28;
      } else {
        // Pollen / destello
        size = 1.5 + Math.random() * 2.5;
        speedY = (0.3 + Math.random() * 0.5) * (isReducedMotion ? 0.2 : 1);
        opacity = 0.4 + Math.random() * 0.5;
      }

      const yPos = initialY === -1 ? Math.random() * height : -20 - Math.random() * 50;

      return {
        x: Math.random() * width,
        y: yPos,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayRadius: 0.8 + Math.random() * 1.6,
        opacity,
        type,
        colorType: Math.floor(Math.random() * petalPalettes.length),
      };
    };

    // Crear grupo inicial repartido por toda la pantalla
    const totalCount = totalPetals + totalFlowers + totalPollen;
    for (let i = 0; i < totalCount; i++) {
      particles.push(createParticle());
    }

    // Dibujar un pétalo de rosa hiperrealista con curvatura Bezier y sombreado
    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Efecto 3D de giro (flip): escala en Y según el ángulo de inclinación
      const flipScale = Math.cos(p.flip);
      ctx.scale(1, flipScale);

      const s = p.size;
      const palette = petalPalettes[p.colorType % petalPalettes.length];

      // Sombra suave proyectada para relieve tridimensional
      ctx.shadowColor = 'rgba(92, 55, 89, 0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Gradiente radial delicado del pétalo (de base a punta)
      const grad = ctx.createRadialGradient(0, s * 0.3, s * 0.1, 0, 0, s * 1.1);
      grad.addColorStop(0, palette.base);
      grad.addColorStop(0.55, palette.mid);
      grad.addColorStop(1, palette.tip);

      ctx.fillStyle = grad;
      ctx.globalAlpha = p.opacity * Math.max(0.25, Math.abs(flipScale));

      // Trazo orgánico de pétalo de rosa clásico con muesca suave en la cúspide
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.9);
      // Lóbulo derecho
      ctx.bezierCurveTo(s * 0.65, -s * 0.95, s * 0.95, -s * 0.2, s * 0.55, s * 0.7);
      // Base del pétalo (cáliz)
      ctx.bezierCurveTo(s * 0.2, s * 1.05, -s * 0.2, s * 1.05, -s * 0.55, s * 0.7);
      // Lóbulo izquierdo
      ctx.bezierCurveTo(-s * 0.95, -s * 0.2, -s * 0.65, -s * 0.95, 0, -s * 0.9);
      ctx.closePath();
      ctx.fill();

      // Vena central sutil y brillo de luz satinada
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.moveTo(0, s * 0.85);
      ctx.quadraticCurveTo(s * 0.08, 0, 0, -s * 0.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    // Dibujar una florecilla completa de 5 pétalos flotante
    const drawFlower = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      const flipScale = Math.cos(p.flip);
      ctx.scale(Math.abs(flipScale) * 0.4 + 0.6, flipScale);

      const r = p.size * 0.6;
      const palette = flowerPalettes[p.colorType % flowerPalettes.length];

      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = 'rgba(92, 55, 89, 0.16)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;

      // 5 pétalos redondeados
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const petalDist = r * 0.85;
        const px = Math.cos(angle) * petalDist;
        const py = Math.sin(angle) * petalDist;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        const pGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.8);
        pGrad.addColorStop(0, palette.petal);
        pGrad.addColorStop(0.8, palette.edge);
        pGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.65, r * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Centro dorado de la flor (pistilo y estambres)
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = palette.center;
      ctx.fill();

      // Puntos diminutos de polen central
      ctx.fillStyle = '#FFFFFF';
      for (let j = 0; j < 4; j++) {
        const dotAngle = (j * Math.PI * 2) / 4;
        const dx = Math.cos(dotAngle) * (r * 0.18);
        const dy = Math.sin(dotAngle) * (r * 0.18);
        ctx.beginPath();
        ctx.arc(dx, dy, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Dibujar motitas luminosas de polen / destellos de hadas
    const drawPollen = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // Parpadeo suave
      const pulse = 0.5 + Math.sin(p.swayAngle * 2) * 0.5;
      const alpha = p.opacity * pulse;

      ctx.globalAlpha = alpha;

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.3, 'rgba(223, 192, 136, 0.7)'); // Oro champán
      grad.addColorStop(0.7, 'rgba(223, 198, 227, 0.35)'); // Lavanda
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Bucle principal de animación a 60fps con cálculo sinusoidal
    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Movimiento físico suave
        p.swayAngle += p.swaySpeed;
        p.y += p.speedY;
        p.x += Math.sin(p.swayAngle) * p.swayRadius + p.speedX;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Renderizar según tipo
        if (p.type === 'petal') {
          drawPetal(p);
        } else if (p.type === 'flower') {
          drawFlower(p);
        } else {
          drawPollen(p);
        }

        // Si sobrepasa el borde inferior o laterales, reubicarlo suavemente arriba
        if (p.y > height + 40 || p.x < -60 || p.x > width + 60) {
          particles[i] = createParticle(0);
          particles[i].y = -20 - Math.random() * 30;
          particles[i].x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pausar render si el usuario cambia de pestaña para no consumir batería
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-1 select-none overflow-hidden ${className}`}
      style={{
        contain: 'strict',
      }}
    />
  );
}
