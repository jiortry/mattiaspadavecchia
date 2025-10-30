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

const imagePaths: string[] = Array.from({ length: 8 }, (_, i) => `/bg-${i + 1}.png`);

const BackgroundPhotoPlaceholders = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hidden, setHidden] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSlots(generateSlots(8));
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
              className="w-full h-full object-cover rounded-xl shadow-[0_20px_70px_-20px_rgba(0,0,0,0.45)] border border-white/10"
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


