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
  // Alterna sinistra/destra, con step verticale ampio per evitare sovrapposizioni
  { id: 0, top: 2,   left: 6,  vw: 68, ratio: 1.05, rotate: -4, tilt: -1.2 },
  { id: 1, top: 22,  left: 56, vw: 62, ratio: 0.98, rotate: 4,  tilt: 0.8 },
  { id: 2, top: 42,  left: 8,  vw: 66, ratio: 1.08, rotate: -6, tilt: -1.0 },
  { id: 3, top: 62,  left: 54, vw: 60, ratio: 0.98, rotate: 5,  tilt: 0.6 },
  { id: 4, top: 82,  left: 10, vw: 64, ratio: 1.10, rotate: -5, tilt: -0.8 },
  { id: 5, top: 102, left: 58, vw: 58, ratio: 0.96, rotate: 6,  tilt: 0.6 },
  { id: 6, top: 122, left: 12, vw: 62, ratio: 1.06, rotate: -3, tilt: -0.6 },
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
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1280;
    setViewportWidth(width);
    setSlots(chooseFixedSlots(width));
    
    // match container to full page height so percentage tops distribute on full layer
    const computeHeight = () => {
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const isMobile = (typeof window !== "undefined" ? window.innerWidth : width) < 640;
      // layer slightly reduced for mobile
      setContainerHeight(isMobile ? Math.round(h * 0.9) : h);
    };
    computeHeight();

    // Track current breakpoint to detect changes
    let currentBreakpoint = width < 640 ? "m" : width < 1024 ? "t" : "d";
    
    // Update layout only when crossing breakpoints; avoid jitter on minor resizes
    const onResize = () => {
      const w = window.innerWidth;
      // Always update viewportWidth for accurate isMobile check
      setViewportWidth(w);
      
      // Determine current breakpoint
      const label = (x: number) => (x < 640 ? "m" : x < 1024 ? "t" : "d");
      const newBreakpoint = label(w);
      
      // Only update slots when breakpoint changes
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        setSlots(chooseFixedSlots(w));
      }
      
      // update container height on resize (orientation changes / dynamic UI)
      setTimeout(() => {
        const h = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        const isMobileNow = w < 640;
        setContainerHeight(isMobileNow ? Math.round(h * 0.9) : h);
      }, 0);
    };
    window.addEventListener("resize", onResize);
    
    // observe body size changes (content expansion)
    const ro = new ResizeObserver(() => {
      const w = typeof window !== "undefined" ? window.innerWidth : width;
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const isMobileNow = w < 640;
      setContainerHeight(isMobileNow ? Math.round(h * 0.9) : h);
    });
    try {
      ro.observe(document.body);
    } catch {}
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 1, height: containerHeight ? `${containerHeight}px` : undefined }}
      aria-hidden
    >
      {slots.map((slot) => {
        const src = imagePaths[slot.id] || "";
        const isHidden = hidden[slot.id];
        const isMobile = viewportWidth < 640;
        
        // On mobile: use uniform distribution based on slot.id, but respect the relative positioning
        // This ensures all 7 images are evenly distributed across the page height
        // On desktop/tablet: use the explicit top values from FIXED_SLOTS
        const topValue = isMobile 
          ? `${((slot.id + 0.5) / 7) * 100}%` 
          : `${slot.top}vh`;
        
        // On mobile: adjust left positioning to prevent images from going off-screen
        // More aggressive shift for left-side images (slot.left < 30vw)
        // Subtle shift for right-side images to maintain balance
        const leftOffset = isMobile ? (slot.left < 30 ? -12 : -4) : 0;
        const calculatedLeft = isMobile 
          ? Math.max(0, Math.min(100 - slot.vw, slot.left + leftOffset)) 
          : slot.left;
        
        // On mobile: shift left-side images (slot.left < 30) 30px more to the left
        const isLeftSide = slot.left < 30;
        const leftValue = isMobile && isLeftSide
          ? `calc(${calculatedLeft}vw - 30px)`
          : `${calculatedLeft}vw`;
        
        return (
          <div
            key={slot.id}
            className="absolute"
            style={{
              top: topValue,
              left: leftValue,
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


