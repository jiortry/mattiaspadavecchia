import { useEffect, useMemo, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
  opacity: number;
  bornAt: number;
  hasLanded: boolean;
}

// Background snowfall with gentle collisions on elements marked as data-snow-obstacle
const Snowfall = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const dpr = useMemo(() => (typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1), []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0"; // keep under content; content should have higher z
    canvasRef.current = canvas;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const maxFlakes = 140; // light effect
    const spawnIntervalMs = 120; // spawn cadence
    const gravity = 0.03; // gentle
    const windBase = 0.02; // subtle horizontal drift
    const fadeAfterMs = 8000; // start fading after this time when landed
    const maxAgeMs = 14000; // remove after this

    const getObstacles = (): Array<{ left: number; right: number; top: number }> => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-snow-obstacle='true']");
      const rects: Array<{ left: number; right: number; top: number }> = [];
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Slight inward shrink to avoid touching borders harshly
        rects.push({ left: r.left + 8, right: r.right - 8, top: r.top + 4 });
      });
      return rects;
    };

    const spawnFlake = (now: number) => {
      const w = canvas.width / dpr;
      const radius = Math.random() * 1.6 + 0.8; // small, elegant
      const flake: Snowflake = {
        x: Math.random() * w,
        y: -radius - 4,
        radius,
        vy: Math.random() * 0.25 + 0.08,
        vx: (Math.random() - 0.5) * 0.2,
        opacity: 0.0,
        bornAt: now,
        hasLanded: false,
      };
      flakesRef.current.push(flake);
    };

    const step = (now: number) => {
      // spawn
      if (flakesRef.current.length < maxFlakes && now - lastSpawnRef.current > spawnIntervalMs) {
        spawnFlake(now);
        lastSpawnRef.current = now;
      }

      // compute wind as slow oscillation
      const wind = Math.sin(now / 4000) * windBase;

      // update physics
      const obstacles = getObstacles();
      for (let i = flakesRef.current.length - 1; i >= 0; i--) {
        const f = flakesRef.current[i];

        if (!f.hasLanded) {
          f.vy += gravity * (0.5 + f.radius * 0.1);
          f.vx += wind * 0.02;
          // gentle horizontal meander
          f.vx += Math.sin((now + i * 123) / 1500) * 0.002;

          f.x += f.vx;
          f.y += f.vy;

          // collision check with obstacles (top edges only)
          for (let k = 0; k < obstacles.length; k++) {
            const o = obstacles[k];
            if (f.x >= o.left && f.x <= o.right) {
              if (f.y + f.radius >= o.top && f.y + f.radius <= o.top + 6) {
                f.y = o.top - f.radius;
                f.vy = 0;
                f.vx *= 0.2;
                f.hasLanded = true;
                f.bornAt = now; // reset age for fade timing when landed
                break;
              }
            }
          }
        }

        // fade in initially for elegance
        if (f.opacity < 0.9) f.opacity = Math.min(0.9, f.opacity + 0.02);

        // cleanup: if off-screen bottom and not landed, remove after old
        const h = canvas.height / dpr;
        const age = now - f.bornAt;
        if (f.hasLanded) {
          if (age > fadeAfterMs) {
            f.opacity -= 0.01;
          }
          if (age > maxAgeMs || f.opacity <= 0) {
            flakesRef.current.splice(i, 1);
            continue;
          }
        } else {
          if (f.y - f.radius > h + 10) {
            flakesRef.current.splice(i, 1);
            continue;
          }
        }
      }

      // render
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,1)";
      for (let i = 0; i < flakesRef.current.length; i++) {
        const f = flakesRef.current[i];
        ctx.globalAlpha = f.opacity;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      flakesRef.current = [];
      try {
        document.body.removeChild(canvas);
      } catch {}
    };
  }, [dpr]);

  return null;
};

export default Snowfall;


