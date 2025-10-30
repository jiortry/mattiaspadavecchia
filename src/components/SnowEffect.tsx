import { useEffect, useMemo, useRef, useState } from "react";

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  rotation: number;
  createdAt: number;
  layer: 0 | 1 | 2; // parallax layers: back, mid, front
}

interface SettledFlake {
  id: number;
  anchorKey: string;
  localX: number; // position relative within anchor width
  size: number;
  createdAt: number;
  lifespanMs: number;
}

type AnchorInfo = {
  el: Element;
  type: "panettone" | "instagram" | "bgphoto";
  id?: string;
};

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [settled, setSettled] = useState<SettledFlake[]>([]);
  const anchorsRef = useRef<Map<string, AnchorInfo>>(new Map());
  const scrollYRef = useRef(0);

  const updateAnchors = () => {
    const map = new Map<string, AnchorInfo>();
    const nodes = Array.from(
      document.querySelectorAll(
        [
          '[data-snow-anchor]',
          'h1, h2, h3, p',
          'button, a',
          '[class*="card" i]',
          'header, footer',
        ].join(', ')
      )
    );
    nodes.forEach((el) => {
      const type = el.getAttribute('data-snow-anchor') as "panettone" | "instagram" | "bgphoto" | null;
      const id = el.getAttribute('data-snow-id') || undefined;
      // derive a type if not provided
      let derived: AnchorInfo['type'] = type || 'panettone';
      if (!type) {
        if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button') derived = 'instagram';
        else derived = 'panettone';
      }
      const key = id ? `${derived}:${id}` : `${derived}:${nodes.indexOf(el)}`;
      map.set(key, { el, type: derived, id });
    });
    anchorsRef.current = map;
  };

  useEffect(() => {
    const createSnowflake = () => {
      const now = Date.now();
      const layer = Math.random() < 0.2 ? 0 : Math.random() < 0.6 ? 1 : 2; // more in front
      const baseSpeed = layer === 0 ? 0.3 : layer === 1 ? 0.6 : 1.0;
      const size = (Math.random() * 4 + 2) * (layer === 0 ? 0.7 : layer === 1 ? 1 : 1.3);
      return {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        size,
        opacity: Math.random() * 0.25 + 0.65 + (layer === 2 ? 0.1 : 0),
        speed: baseSpeed + Math.random() * 0.6,
        drift: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        createdAt: now,
        layer,
      };
    };

    // inizializza anchors
    updateAnchors();
    const anchorsObs = new MutationObserver(() => updateAnchors());
    anchorsObs.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Gestisci scroll per parallax
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Genera fiocchi decorativi periodicamente (no caduta)
    const intervalId = setInterval(() => {
      setSnowflakes((prev) => {
        // Rimuovi fiocchi vecchi (più di 20 secondi)
        const now = Date.now();
        const filtered = prev.filter(
          (flake) =>
            now - flake.createdAt < 20000
        );
        
        // Aggiungi nuovi fiocchi se ce ne sono pochi
        if (filtered.length < 80) {
          return [...filtered, createSnowflake()];
        }
        return filtered;
      });
      // Accumulo leggero: aggiungi sporadicamente sui vari anchor
      const anchors = anchorsRef.current;
      if (anchors.size > 0) {
        const now = Date.now();
        setSettled((prevSet) => {
          const updated = [...prevSet];
          for (const [key, info] of anchors.entries()) {
            const existingForAnchor = updated.filter((s) => s.anchorKey === key);
            const limit = info.type === 'instagram' ? 14 : info.type === 'bgphoto' ? 40 : 28;
            const chance = info.type === 'instagram' ? 0.08 : info.type === 'bgphoto' ? 0.12 : 0.05;
            if (existingForAnchor.length < limit && Math.random() < chance) {
              const rect = (info.el as HTMLElement).getBoundingClientRect();
              const localX = Math.max(0, Math.min(rect.width, Math.random() * rect.width));
              updated.push({
                id: Math.random(),
                anchorKey: key,
                localX,
                size: Math.max(2, Math.random() * 4 + 2),
                createdAt: now,
                lifespanMs: info.type === 'instagram' ? 12000 : info.type === 'bgphoto' ? 20000 : 22000,
              });
            }
          }
          return updated;
        });
      }
    }, 200);

    // Anima i fiocchi (solo rotazione/jitter; posizione legata allo scroll)
    const animationId = setInterval(() => {
      setSnowflakes((prev) => {
        return prev.map((flake) => ({
          ...flake,
          x: flake.x + Math.sin((flake.y + scrollYRef.current) * 0.01) * flake.drift,
          rotation: flake.rotation + 0.5,
          opacity:
            Date.now() - flake.createdAt > 16000
              ? Math.max(0, flake.opacity - 0.015)
              : flake.opacity,
        }));
      });

      // decay dei fiocchi depositati
      setSettled((prev) => prev.filter((s) => Date.now() - s.createdAt < s.lifespanMs));
    }, 50);

    return () => {
      clearInterval(intervalId);
      clearInterval(animationId);
      window.removeEventListener('scroll', onScroll);
      anchorsObs.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {snowflakes.map((flake) => {
        const parallax = flake.layer === 0 ? -scrollYRef.current * 0.05 : flake.layer === 1 ? -scrollYRef.current * 0.02 : 0;
        return (
          <div
            key={flake.id}
            className="absolute transition-opacity duration-1000"
            style={{
              left: `${flake.x}px`,
              top: `${flake.y + parallax}px`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              transform: `rotate(${flake.rotation}deg)`,
              filter: "blur(0.5px)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              style={{
                filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 6px rgba(255,255,255,0.4))",
              }}
            >
              <path
                d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M2 12L22 12M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16M6 6L18 18M6 6L4 4M18 18L20 20M18 6L6 18M18 6L20 4M6 18L4 20"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}

      {/* fiocchi depositati */}
      {Array.from(anchorsRef.current.entries()).map(([key, info]) => {
        const rect = (info.el as HTMLElement).getBoundingClientRect();
        const flakes = settled.filter((s) => s.anchorKey === key);
        return flakes.map((s) => {
          const x = rect.left + s.localX;
          const y = rect.top - s.size * 0.6; // appoggiato sul bordo alto
          const age = Date.now() - s.createdAt;
          const opacity = Math.max(0, 1 - age / s.lifespanMs);
          return (
            <div
              key={`settled-${s.id}-${age}`}
              className="absolute"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity,
                filter: "drop-shadow(0 0 2px rgba(255,255,255,0.9))",
              }}
            >
              <svg viewBox="0 0 8 4" className="text-white" fill="currentColor">
                <path d="M0 3 C2 0, 6 0, 8 3 L8 4 L0 4 Z" />
              </svg>
            </div>
          );
        });
      })}
    </div>
  );
};

export default SnowEffect;
