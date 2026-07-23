import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  type: 'paper';
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  wobble: number;
  wobbleSpeed: number;
}

export default function EffectsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const colors = [
      '#ff0055', '#ff5500', '#ffcc00', '#33ff00', '#00ffcc', '#0055ff', 
      '#ff00ff', '#e040fb', '#00e5ff', '#ffeb3b', '#ff5722', '#4caf50'
    ];

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Paper confetti: rotating, wobbling rectangle
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        
        const scaleX = Math.sin(p.wobble);

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX, 1);

        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);

    // Event handler for confetti (Paper Popper)
    const handleConfetti = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      // Spawn ~80 colorful papers
      const count = 70 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        // Shoot upwards and outwards
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 1.5);
        const speed = 6 + Math.random() * 12;
        
        particlesRef.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.008 + Math.random() * 0.012,
          size: 4 + Math.random() * 4,
          type: 'paper',
          gravity: 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          width: 6 + Math.random() * 8,
          height: 10 + Math.random() * 10,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: 0.05 + Math.random() * 0.1
        });
      }
    };

    window.addEventListener('trigger-confetti', handleConfetti);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('trigger-confetti', handleConfetti);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[9999]" 
    />
  );
}
