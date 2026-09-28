'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const subscribeReducedMotion = (callback) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
  return () => {};
};

const getReducedMotionSnapshot = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getServerSnapshot = () => false;

export function CyberBackgroundAnimation() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );

  // Theme tracking for canvas contrast
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleAppearanceUpdate = (e) => {
      if (e.detail?.theme) {
        setIsDark(e.detail.theme.toLowerCase() !== 'light');
      }
    };
    window.addEventListener('promptshield:appearance_updated', handleAppearanceUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('promptshield:appearance_updated', handleAppearanceUpdate);
    };
  }, []);

  // Main Canvas Network Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = null;
    let width = 0;
    let height = 0;

    // Handle high-DPI displays & window resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      if (prefersReducedMotion) {
        renderStaticCyberGrid();
      }
    };

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 24 : Math.min(52, Math.floor(window.innerWidth / 34));

    const particles = [];
    const colors = isDark
      ? [
          { r: 245, g: 123, b: 131 }, // #f57b83 Vibrant Coral Rose
          { r: 225, g: 29, b: 72 },   // #e11d48 Cyber Crimson
          { r: 106, g: 26, b: 36 },   // #6a1a24 Deep Wine
          { r: 253, g: 198, b: 203 }, // #fdc6cb Soft Rose Blush
        ]
      : [
          { r: 225, g: 29, b: 72 },   // #e11d48 Cyber Crimson
          { r: 244, g: 63, b: 94 },   // #f43f5e Rose 500
          { r: 190, g: 18, b: 60 },   // #be123c Deep Ruby
          { r: 251, g: 113, b: 133 }, // #fb7185 Vivid Rose
        ];

    for (let i = 0; i < nodeCount; i++) {
      const color = colors[i % colors.length];
      particles.push({
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 2.0 + 1.2,
        color,
        baseAlpha: Math.random() * 0.35 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
        isCoreDefenseNode: i % 4 === 0,
      });
    }

    const packets = [];
    const maxPackets = isMobile ? 4 : 8;

    function spawnPacket(sourceIndex, targetIndex) {
      if (packets.length >= maxPackets) return;
      packets.push({
        sourceIndex,
        targetIndex,
        progress: 0,
        speed: Math.random() * 0.006 + 0.003,
        color: isDark ? 'rgba(245, 123, 131, ' : 'rgba(225, 29, 72, ',
      });
    }

    function drawDigitalGrid() {
      const gridSize = 72;
      ctx.strokeStyle = isDark ? 'rgba(106, 26, 36, 0.14)' : 'rgba(225, 29, 72, 0.1)';
      ctx.lineWidth = 0.75;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Intersect dots
      ctx.fillStyle = isDark ? 'rgba(245, 123, 131, 0.08)' : 'rgba(225, 29, 72, 0.16)';
      for (let x = 0; x < width; x += gridSize * 2) {
        for (let y = 0; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function renderStaticCyberGrid() {
      if (!ctx || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      drawDigitalGrid();

      const maxDistance = 160;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.16 : 0.25);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(225, 29, 72, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isCoreDefenseNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.12)`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.55)`;
        ctx.fill();
      }
    }

    function animate(time) {
      if (!ctx || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Digital Grid
      drawDigitalGrid();

      // 2. Network links
      const maxDistance = 150;
      const connectedPairs = [];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            connectedPairs.push({ i, j });
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.32);

            const grad = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            grad.addColorStop(
              0,
              `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${alpha})`
            );
            grad.addColorStop(
              1,
              `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${alpha * 0.7})`
            );

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = isDark ? 0.8 : 1.0;
            ctx.stroke();

            if (Math.random() < 0.0003) {
              spawnPacket(i, j);
            }
          }
        }
      }

      // 3. Data Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const src = particles[pkt.sourceIndex];
        const tgt = particles[pkt.targetIndex];
        if (!src || !tgt) {
          packets.splice(i, 1);
          continue;
        }

        const px = src.x + (tgt.x - src.x) * pkt.progress;
        const py = src.y + (tgt.y - src.y) * pkt.progress;
        const packetAlpha = Math.sin(pkt.progress * Math.PI) * (isDark ? 0.85 : 0.95);

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${pkt.color}${packetAlpha})`;
        ctx.shadowColor = '#e11d48';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Update & Draw Nodes
      const t = time * 0.001;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        const pulse = 1 + Math.sin(t * 1.5 + p.pulseOffset) * 0.18;
        const alpha = p.baseAlpha * pulse * (isDark ? 1 : 1.3);

        if (p.isCoreDefenseNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (2.8 * pulse), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${0.08 * pulse})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (2.2 * pulse), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${0.25 * pulse})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha + 0.2})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion) {
      renderStaticCyberGrid();
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion, isDark]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. HTML5 Canvas: Dynamic AI Cybersecurity Network */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 dark:opacity-80 transition-opacity"
      />

      {/* 2. Soft Ambient Atmospheric Radiance (Light vs Dark) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-rose-300/25 dark:bg-[#6a1a24]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-pink-300/20 dark:bg-rose-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[650px] h-[650px] bg-rose-200/25 dark:bg-[#881337]/15 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
