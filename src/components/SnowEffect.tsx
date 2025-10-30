import { useEffect, useRef, useState } from "react";

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
  const rafIdRef = useRef<number | null>(null);

  const updateAnchors = () => {
    const map = new Map<string, AnchorInfo>();
    // Limit anchors STRICTLY to the 8 background photos
    const nodes = Array.from(document.querySelectorAll('[data-snow-anchor="bgphoto"]'));
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
      const baseSpeed = layer === 0 ? 0.18 : layer === 1 ? 0.32 : 0.52; // gentler
      const size = (Math.random() * 2 + 1.5) * (layer === 0 ? 0.7 : layer === 1 ? 1 : 1.2);
      return {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        size,
        opacity: Math.random() * 0.2 + 0.55 + (layer === 2 ? 0.08 : 0),
        speed: baseSpeed + Math.random() * 0.25,
        drift: Math.random() * 1.2 - 0.6,
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

    // Gentle generation and animation with collision and settling only on bg photos
    const maxFlakes = 60;
    const maxSettledPerAnchor = 24; // keep only most recent per photo
    const maxSettledTotal = 160; // global guard

    const loop = () => {
      // spawn a new flake occasionally, capped
      setSnowflakes((prev) => {
        const now = Date.now();
        let next = prev
          .filter((f) => now - f.createdAt < 30000 && f.y < window.innerHeight + 40);
        if (next.length < maxFlakes && Math.random() < 0.35) {
          next = [...next, createSnowflake()];
        }
        // hard trim oldest if we exceed cap
        if (next.length > maxFlakes) {
          next = next
            .sort((a, b) => a.createdAt - b.createdAt)
            .slice(next.length - maxFlakes);
        }
        return next;
      });

      const anchors = anchorsRef.current;
      const anchorRects: Array<{ key: string; rect: DOMRect }> = [];
      for (const [key, info] of anchors.entries()) {
        if (info.type === 'bgphoto') {
          anchorRects.push({ key, rect: (info.el as HTMLElement).getBoundingClientRect() });
        }
      }

      setSnowflakes((prev) => {
        const now = Date.now();
        const updated: Snowflake[] = [];
        const newSettled: SettledFlake[] = [];

        for (const flake of prev) {
          // update movement
          const y = flake.y + flake.speed;
          const x = flake.x + Math.sin((flake.y + scrollYRef.current) * 0.012) * flake.drift;
          const rotation = flake.rotation + 0.35;

          let didSettle = false;
          // collision with top edge of any bgphoto rect
          for (const ar of anchorRects) {
            const left = ar.rect.left;
            const right = ar.rect.right;
            const top = ar.rect.top;
            // approximate flake within horizontal bounds and near top edge
            if (x >= left && x <= right && y >= top - 2 && y <= top + 4) {
              const localX = Math.max(0, Math.min(ar.rect.width, x - left));
              newSettled.push({
                id: Math.random(),
                anchorKey: ar.key,
                localX,
                size: Math.max(1.5, Math.min(4, flake.size + Math.random() * 1.2)),
                createdAt: now,
                lifespanMs: 16000 + Math.floor(Math.random() * 8000),
              });
              didSettle = true;
              break;
            }
          }

          if (!didSettle && y < window.innerHeight + 30) {
            updated.push({ ...flake, x, y, rotation });
          }
        }

        if (newSettled.length) {
          setSettled((prevS) => {
            const now2 = Date.now();
            // keep only alive before merging
            const alive = prevS.filter((s) => now2 - s.createdAt < s.lifespanMs);
            const merged = [...alive, ...newSettled];
            // group by anchor and keep MOST RECENT maxSettledPerAnchor
            const byAnchor = new Map<string, SettledFlake[]>();
            for (const s of merged) {
              const arr = byAnchor.get(s.anchorKey) || [];
              arr.push(s);
              byAnchor.set(s.anchorKey, arr);
            }
            const cappedPerAnchor: SettledFlake[] = [];
            for (const [_, arr] of byAnchor) {
              arr.sort((a, b) => b.createdAt - a.createdAt);
              cappedPerAnchor.push(...arr.slice(0, maxSettledPerAnchor));
            }
            // apply global cap, keeping most recent globally
            const globallyCapped = cappedPerAnchor
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, maxSettledTotal);
            return globallyCapped;
          });
        }

        return updated;
      });

      // fade out settled over time and enforce caps even when no new settles
      setSettled((prev) => {
        const now2 = Date.now();
        const alive = prev.filter((s) => now2 - s.createdAt < s.lifespanMs);
        // regroup and cap
        const byAnchor = new Map<string, SettledFlake[]>();
        for (const s of alive) {
          const arr = byAnchor.get(s.anchorKey) || [];
          arr.push(s);
          byAnchor.set(s.anchorKey, arr);
        }
        const cappedPerAnchor: SettledFlake[] = [];
        for (const [_, arr] of byAnchor) {
          arr.sort((a, b) => b.createdAt - a.createdAt);
          cappedPerAnchor.push(...arr.slice(0, maxSettledPerAnchor));
        }
        return cappedPerAnchor
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, maxSettledTotal);
      });

      rafIdRef.current = window.requestAnimationFrame(loop);
    };

    rafIdRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
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
