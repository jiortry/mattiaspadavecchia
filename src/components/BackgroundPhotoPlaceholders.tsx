import { useEffect, useState } from "react";

type Slot = {
  id: number;
  top: number; // in vh can be negative or >100
  left: number; // in vw can be negative or >100
  rotate: number; // deg
  vw: number; // preferred width in vw for responsiveness
  ratio: number; // width/height ratio
  tilt: number; // additional minor jitter for premium look
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const generateSlots = (count = 7): Slot[] => {
  if (typeof window === "undefined") return [];

  const viewportWidth = window.innerWidth || 1280;
  const viewportHeight = window.innerHeight || 800;

  // Responsive size ranges (in vw)
  const sizeRange = (() => {
    if (viewportWidth < 380) return { min: 22, max: 28 };
    if (viewportWidth < 640) return { min: 24, max: 30 };
    if (viewportWidth < 1024) return { min: 24, max: 34 };
    return { min: 26, max: 36 };
  })();

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Blue-noise-like anchors to spread content across the viewport
  const anchors: Array<{ ax: number; ay: number }> = [
    { ax: 0.18, ay: 0.18 },
    { ax: 0.82, ay: 0.18 },
    { ax: 0.50, ay: 0.35 },
    { ax: 0.24, ay: 0.62 },
    { ax: 0.78, ay: 0.62 },
    { ax: 0.36, ay: 0.84 },
    { ax: 0.66, ay: 0.78 },
  ];

  const toRect = (slot: Slot) => {
    const widthPx = (slot.vw / 100) * viewportWidth;
    const heightPx = widthPx / slot.ratio;
    const leftPx = (slot.left / 100) * viewportWidth;
    const topPx = (slot.top / 100) * viewportHeight;
    return { left: leftPx, top: topPx, width: widthPx, height: heightPx };
  };

  const intersectionArea = (a: { left: number; top: number; width: number; height: number }, b: { left: number; top: number; width: number; height: number }) => {
    const x1 = Math.max(a.left, b.left);
    const y1 = Math.max(a.top, b.top);
    const x2 = Math.min(a.left + a.width, b.left + b.width);
    const y2 = Math.min(a.top + a.height, b.top + b.height);
    const w = Math.max(0, x2 - x1);
    const h = Math.max(0, y2 - y1);
    return w * h;
  };

  const slots: Slot[] = [];
  const maxTriesPerSlot = 200;
  for (let i = 0; i < count; i++) {
    const anchor = anchors[i % anchors.length];
    let placed: Slot | null = null;
    for (let tries = 0; tries < maxTriesPerSlot; tries++) {
      const vw = randomBetween(sizeRange.min, sizeRange.max);
      const ratio = randomBetween(0.9, 1.2);

      // Convert vw width to vh height for clamping top
      const widthPx = (vw / 100) * viewportWidth;
      const heightPx = widthPx / ratio;
      const heightVh = (heightPx / viewportHeight) * 100;

      // Jitter around anchor, but keep fully inside viewport
      const jitterVW = randomBetween(-8, 8);
      const jitterVH = randomBetween(-8, 8);
      const left = clamp(anchor.ax * 100 + jitterVW, 0, 100 - vw);
      const top = clamp(anchor.ay * 100 + jitterVH, 0, Math.max(0, 100 - heightVh));

      const candidate: Slot = {
        id: i,
        top,
        left,
        rotate: randomBetween(-10, 10),
        vw,
        ratio,
        tilt: randomBetween(-2.5, 2.5),
      };

      const candRect = toRect(candidate);
      const candArea = candRect.width * candRect.height;

      // Overlap constraint: at most 20% of smaller area with any existing
      let ok = true;
      for (let k = 0; k < slots.length; k++) {
        const otherRect = toRect(slots[k]);
        const otherArea = otherRect.width * otherRect.height;
        const inter = intersectionArea(candRect, otherRect);
        const denom = Math.max(1, Math.min(candArea, otherArea));
        const overlapRatio = inter / denom;
        if (overlapRatio > 0.2) {
          ok = false;
          break;
        }
      }

      if (ok) {
        placed = candidate;
        break;
      }
    }
    // Fallback: if not placed respecting overlap, still place clamped at anchor (smallest size)
    if (!placed) {
      const vw = sizeRange.min;
      const ratio = 1.0;
      const widthPx = (vw / 100) * viewportWidth;
      const heightPx = widthPx / ratio;
      const heightVh = (heightPx / viewportHeight) * 100;
      const left = clamp(anchor.ax * 100, 0, 100 - vw);
      const top = clamp(anchor.ay * 100, 0, Math.max(0, 100 - heightVh));
      placed = {
        id: i,
        top,
        left,
        rotate: 0,
        vw,
        ratio,
        tilt: 0,
      };
    }
    slots.push(placed);
  }
  return slots;
};

const imagePaths: string[] = Array.from({ length: 7 }, (_, i) => `/panettoni${i + 1}.png`);

const BackgroundPhotoPlaceholders = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hidden, setHidden] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSlots(generateSlots(7));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      {slots.map((slot) => {
        const src = imagePaths[slot.id] || "";
        const isHidden = hidden[slot.id];
        return (
          <div
            key={slot.id}
            className="absolute"
            style={{
              top: `${slot.top}vh`,
              left: `${slot.left}vw`,
              width: `clamp(260px, ${slot.vw}vw, 720px)`,
              aspectRatio: `${slot.ratio}`,
              transform: `rotate(${slot.rotate}deg) skewX(${slot.tilt}deg)`,
              display: isHidden ? "none" : "block",
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{
                // Feathered edges to avoid visible borders/rectangles
                WebkitMaskImage: "radial-gradient(100% 100% at 50% 50%, black 70%, transparent 100%)",
                maskImage: "radial-gradient(100% 100% at 50% 50%, black 70%, transparent 100%)",
              }}
              onError={() => setHidden((h) => ({ ...h, [slot.id]: true }))}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundPhotoPlaceholders;


