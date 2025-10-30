import { useEffect, useState } from "react";

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
}

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflake = () => {
      const now = Date.now();
      return {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.3,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        createdAt: now,
      };
    };

    // Genera fiocchi periodicamente
    const intervalId = setInterval(() => {
      setSnowflakes((prev) => {
        // Rimuovi fiocchi vecchi (più di 15 secondi) o fuori schermo
        const now = Date.now();
        const filtered = prev.filter(
          (flake) =>
            flake.y < window.innerHeight + 100 &&
            now - flake.createdAt < 15000
        );
        
        // Aggiungi nuovi fiocchi se ce ne sono pochi
        if (filtered.length < 50) {
          return [...filtered, createSnowflake()];
        }
        return filtered;
      });
    }, 200);

    // Anima i fiocchi
    const animationId = setInterval(() => {
      setSnowflakes((prev) =>
        prev.map((flake) => ({
          ...flake,
          y: flake.y + flake.speed,
          x: flake.x + Math.sin(flake.y * 0.01) * flake.drift,
          rotation: flake.rotation + 1,
          // Riduci gradualmente l'opacità per i fiocchi vecchi
          opacity:
            Date.now() - flake.createdAt > 12000
              ? Math.max(0, flake.opacity - 0.02)
              : flake.opacity,
        }))
      );
    }, 50);

    return () => {
      clearInterval(intervalId);
      clearInterval(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute transition-opacity duration-1000"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
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
            className="text-primary/60"
            style={{
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))",
            }}
          >
            <path
              d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M2 12L22 12M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16M6 6L18 18M6 6L4 4M18 18L20 20M18 6L6 18M18 6L20 4M6 18L4 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default SnowEffect;
