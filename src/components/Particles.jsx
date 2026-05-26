import { useEffect, useRef } from "react";

export function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 14)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: Math.random() * -0.28 - 0.05,
        a: Math.random() * 0.35 + 0.08
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 198, 106, ${particle.a})`;
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80" />;
}
