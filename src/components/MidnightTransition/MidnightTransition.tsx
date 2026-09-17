import React, { useState, useEffect, useRef } from 'react';
import styles from './MidnightTransition.module.css';

interface MidnightTransitionProps {
  onComplete: () => void;
  onStartPlayback: () => void;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.vy += 0.03; // gravity
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.restore();
  }
}

class Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  exploded: boolean;
  color: string;

  constructor(width: number, height: number) {
    this.x = width / 2 + (Math.random() * 400 - 200);
    this.y = height;
    this.targetY = height * 0.2 + Math.random() * (height * 0.3);
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -Math.random() * 3 - 6;
    this.exploded = false;
    const colors = ['#f0f4f8', '#8b9bb4', '#4a7ab5'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    if (!this.exploded) {
      this.vy += 0.05; // slight gravity on ascent
      this.x += this.vx;
      this.y += this.vy;
      if (this.vy >= 0 || this.y <= this.targetY) {
        this.exploded = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }
}

export const MidnightTransition: React.FC<MidnightTransitionProps> = ({ 
  onComplete, 
  onStartPlayback 
}) => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksActive = useRef(false);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Start music attempting to play immediately when phase starts
    onStartPlayback();
    
    const sequence = [
      { step: 1, delay: 500 }, // Point of light
      { step: 2, delay: 1000 }, // Atmosphere
      { step: 3, delay: 1500 }, // Happy Birthday
      { step: 4, delay: 2000 }, // Layal
      { step: 5, delay: 2500 }, // Fireworks begin
      { step: 6, delay: 6000 }  // Transition Out
    ];

    const timeouts = sequence.map(seq => 
      setTimeout(() => {
        setStep(seq.step);
        if (seq.step === 5) fireworksActive.current = true;
      }, seq.delay)
    );

    const finishTimeout = setTimeout(() => {
      fireworksActive.current = false;
      onComplete();
    }, 7000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
      fireworksActive.current = false;
    };
  }, [onComplete, onStartPlayback]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    const loop = () => {
      ctx.fillStyle = 'rgba(3, 5, 10, 0.2)'; // trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (fireworksActive.current && Math.random() < 0.05 && fireworksRef.current.length < 5) {
        fireworksRef.current.push(new Firework(canvas.width, canvas.height));
      }

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.update();
        fw.draw(ctx);
        if (fw.exploded) {
          for (let p = 0; p < 40; p++) {
            particlesRef.current.push(new Particle(fw.x, fw.y, fw.color));
          }
          fireworksRef.current.splice(i, 1);
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas 
        ref={canvasRef} 
        className={styles.canvas} 
      />
      
      <div className={`${styles.lightPoint} ${step >= 1 ? styles.active : ''} ${step >= 3 ? styles.expand : ''}`} />
      <div className={`${styles.atmosphere} ${step >= 2 ? styles.active : ''}`} />
      
      <div className={`${styles.textContainer} ${step >= 3 ? styles.active : ''} ${step >= 6 ? styles.fadeOut : ''}`}>
        <h2 className={`${styles.greeting} ${step >= 3 ? styles.active : ''}`}>HAPPY BIRTHDAY</h2>
        <h1 className={`${styles.name} ${step >= 4 ? styles.active : ''}`}>LAYAL</h1>
        <h3 className={`${styles.age} ${step >= 5 ? styles.active : ''}`}>19</h3>
      </div>
    </div>
  );
};
