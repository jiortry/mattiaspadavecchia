import { useEffect, useState } from "react";

type Slot = {
  id: number;
  top: number; // percentage of page height (0-100, can be slightly <0 or >100)
  left: number; // in vw can be negative or >100
  rotate: number; // deg
  vw: number; // preferred width in vw for responsiveness
  ratio: number; // width/height ratio
  tilt: number; // additional minor jitter for premium look
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

// Fixed, deterministic layouts per breakpoint (mobile / tablet / desktop)
// Mobile layout with 4 fixed slots
const FIXED_SLOTS_MOBILE: Slot[] = [
  { id: 0, top: -6, left: 6,  vw: 78, ratio: 1.06, rotate: -5, tilt: -1.0 },
  { id: 1, top: 26, left: 56, vw: 70, ratio: 0.96, rotate: 4,  tilt: 0.8 },
  { id: 2, top: 52, left: 8,  vw: 74, ratio: 1.10, rotate: -6, tilt: -0.8 },
  { id: 3, top: 78, left: 54, vw: 66, ratio: 0.98, rotate: 5,  tilt: 0.6 },
];

const FIXED_SLOTS_TABLET: Slot[] = [
  { id: 0, top: -6, left: 6,  vw: 46, ratio: 1.06, rotate: -5, tilt: -1.0 },
  { id: 1, top: 22, left: 58, vw: 42, ratio: 0.96, rotate: 4,  tilt: 0.8 },
  { id: 2, top: 48, left: 10, vw: 44, ratio: 1.10, rotate: -6, tilt: -0.8 },
  { id: 3, top: 72, left: 60, vw: 40, ratio: 0.98, rotate: 5,  tilt: 0.6 },
];

const FIXED_SLOTS_DESKTOP: Slot[] = [
  { id: 0, top: -8, left: 6,  vw: 36, ratio: 1.08, rotate: -6, tilt: -1.0 },
  { id: 1, top: 18, left: 66, vw: 34, ratio: 0.96, rotate: 5,  tilt: 0.8 },
];

const chooseFixedSlots = (width: number): Slot[] => {
  if (width < 640) return FIXED_SLOTS_MOBILE; // 11 slots on mobile
  if (width < 1024) return FIXED_SLOTS_TABLET;
  return FIXED_SLOTS_DESKTOP;
};

const imagePaths: string[] = Array.from({ length: 7 }, (_, i) => `/panettoni${i + 1}.png`);

const BackgroundPhotoPlaceholders = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hidden, setHidden] = useState<Record<number, boolean>>({});
  const [pageHeight, setPageHeight] = useState<number>(0);

  useEffect(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1280;
    const height = typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;
    setSlots(chooseFixedSlots(width));
    setPageHeight(height);

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
      // Update page height on resize
      setPageHeight(document.documentElement.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    
    // Observe DOM changes to keep page height in sync
    const observer = new MutationObserver(() => {
      setPageHeight(document.documentElement.scrollHeight);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute w-full"
      style={{ zIndex: 1, top: 0, height: pageHeight ? `${pageHeight}px` : undefined }}
      aria-hidden
    >
      {slots.map((slot) => {
        const src = imagePaths[slot.id % imagePaths.length] || "";
        const isHidden = hidden[slot.id];
        return (
          <div
            key={slot.id}
            className="absolute"
            style={{
              top: pageHeight ? `${(slot.top / 100) * pageHeight}px` : `${slot.top}vh`,
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


