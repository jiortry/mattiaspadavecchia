import { useEffect, useMemo, useState } from "react";

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

const generateSlots = (count = 8): Slot[] => {
  const slots: Slot[] = [];
  for (let i = 0; i < count; i++) {
    const vw = randomBetween(26, 40); // large, responsive footprint
    const ratio = randomBetween(0.9, 1.15);
    slots.push({
      id: i,
      // allow offscreen placement
      top: randomBetween(-15, 105),
      left: randomBetween(-12, 106),
      rotate: randomBetween(-12, 12),
      vw,
      ratio,
      tilt: randomBetween(-3, 3),
    });
  }
  return slots;
};

const BackgroundPhotoPlaceholders = () => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    setSlots(generateSlots(8));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="absolute rounded-xl border border-white/15 bg-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-[2px]"
          style={{
            top: `${slot.top}vh`,
            left: `${slot.left}vw`,
            // Large but gently responsive: min 260px, prefer vw, cap at 720px
            width: `clamp(260px, ${slot.vw}vw, 720px)`,
            aspectRatio: `${slot.ratio}`,
            transform: `rotate(${slot.rotate}deg) skewX(${slot.tilt}deg)`,
          }}
          data-snow-anchor="bgphoto"
          data-snow-id={`bg-${slot.id}`}
        >
          <div className="w-full h-full bg-gradient-to-br from-white/8 to-white/3" />
        </div>
      ))}
    </div>
  );
};

export default BackgroundPhotoPlaceholders;


