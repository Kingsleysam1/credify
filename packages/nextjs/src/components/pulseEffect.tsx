"use client";

import { useEffect, useRef } from "react";

interface Circle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  color: string;
}

const colors = ["#FF3CAC", "#784BA0", "#2B86C5", "#FF7EB3", "#FFB347"];

const PulseEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<Circle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const spawnCircle = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      circlesRef.current.push({ x, y, radius: 0, alpha: 1, color });
    };

    const animate = () => {
      if (!ctx) return;

      // draw semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      circlesRef.current.forEach((c, i) => {
        c.radius += 2 + Math.random() * 2; // random growth speed
        c.alpha -= 0.01 + Math.random() * 0.01; // random fade
        if (c.alpha <= 0) circlesRef.current.splice(i, 1);

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(c.color)},${c.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => spawnCircle(e.clientX, e.clientY);
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // helper: hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default PulseEffect;
