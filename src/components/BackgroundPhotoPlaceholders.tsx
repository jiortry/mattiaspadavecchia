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

// Fixed, deterministic layouts per breakpoint (mobile / tablet / desktop)
const FIXED_SLOTS_MOBILE: Slot[] = [
  { id: 0, top: 2,  left: 6,  vw: 72, ratio: 1.05, rotate: -4, tilt: -1.5 },
  { id: 1, top: 26, left: 12, vw: 76, ratio: 0.95, rotate: 3,  tilt: 1.2 },
  { id: 2, top: 50, left: 8,  vw: 78, ratio: 1.10, rotate: -6, tilt: -1.2 },
  { id: 3, top: 74, left: 14, vw: 74, ratio: 0.98, rotate: 5,  tilt: 0.8 },
  { id: 4, top: -10, left: 52, vw: 62, ratio: 1.12, rotate: 7, tilt: 1.0 },
  { id: 5, top: 36, left: 54, vw: 64, ratio: 0.92, rotate: -5, tilt: -0.6 },
  { id: 6, top: 88, left: 52, vw: 60, ratio: 1.08, rotate: -2, tilt: 0.5 },
];

const FIXED_SLOTS_TABLET: Slot[] = [
  { id: 0, top: -6, left: 6,  vw: 44, ratio: 1.06, rotate: -5, tilt: -1.2 },
  { id: 1, top: 16, left: 52, vw: 40, ratio: 0.94, rotate: 4,  tilt: 0.8 },
  { id: 2, top: 36, left: 10, vw: 46, ratio: 1.10, rotate: -7, tilt: -1.0 },
  { id: 3, top: 58, left: 56, vw: 42, ratio: 0.98, rotate: 6,  tilt: 0.6 },
  { id: 4, top: 74, left: 6,  vw: 40, ratio: 1.08, rotate: -3, tilt: -0.6 },
  { id: 5, top: 2,  left: 72, vw: 34, ratio: 1.02, rotate: -2, tilt: 0.4 },
  { id: 6, top: 82, left: 72, vw: 36, ratio: 0.96, rotate: 5,  tilt: 0.4 },
];

const FIXED_SLOTS_DESKTOP: Slot[] = [
  { id: 0, top: -10, left: 6,  vw: 34, ratio: 1.08, rotate: -6, tilt: -1.2 },
  { id: 1, top: 8,   left: 62, vw: 32, ratio: 0.96, rotate: 5,  tilt: 0.8 },
  { id: 2, top: 30,  left: 12, vw: 36, ratio: 1.12, rotate: -8, tilt: -0.8 },
  { id: 3, top: 50,  left: 66, vw: 34, ratio: 0.98, rotate: 7,  tilt: 0.6 },
  { id: 4, top: 68,  left: 8,  vw: 32, ratio: 1.06, rotate: -4, tilt: -0.6 },
  { id: 5, top: -6,  left: 80, vw: 28, ratio: 1.00, rotate: -3, tilt: 0.4 },
  { id: 6, top: 82,  left: 74, vw: 30, ratio: 0.94, rotate: 6,  tilt: 0.4 },
];

const chooseFixedSlots = (width: number): Slot[] => {
  if (width < 640) return FIXED_SLOTS_MOBILE;
  if (width < 1024) return FIXED_SLOTS_TABLET;
  return FIXED_SLOTS_DESKTOP;
};

const imagePaths: string[] = Array.from({ length: 7 }, (_, i) => `/panettoni${i + 1}.png`);

const BackgroundPhotoPlaceholders = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hidden, setHidden] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1280;
    setSlots(chooseFixedSlots(width));

    // Update layout only when crossing breakpoints; avoid jitter on minor resizes
    const onResize = () => {
      const w = window.innerWidth;
      const prev = slots;
      const current = chooseFixedSlots(w);
      // Determine current breakpoint label for prev and current
      const label = (x: number) => (x < 640 ? "m" : x < 1024 ? "t" : "d");
      const prevLabel = label(prev.length ? window.innerWidth : w);
      const currLabel = label(w);
      if (prevLabel !== currLabel) {
        setSlots(current);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 min-h-full"
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
                opacity: 0.9,
                WebkitMaskImage: "radial-gradient(110% 110% at 50% 50%, black 70%, transparent 100%)",
                maskImage: "radial-gradient(110% 110% at 50% 50%, black 70%, transparent 100%)",
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


