'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';

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

/**
 * CyberBackgroundAnimation
 *
 * Enterprise AI Cybersecurity Network Background:
 * - Subtle, premium particle constellation (AI nodes)
 * - Proximity-linked defense mesh (network security)
 * - Slow data-flow packets traveling across links (prompt inspection)
 * - Faint digital security grid with intersection lattices
 * - Soft, breathing blue/cyan/purple ambient radiance
 * - Full WCAG 2.1/2.2 prefers-reduced-motion accessibility support (0% idle CPU on reduce)
 * - pointer-events: none, strictly background layer, zero layout disruption
 */
export function CyberBackgroundAnimation() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );

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

    // Node & Particle Configuration
    // Density tuned for enterprise elegance: not crowded, not sparse
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 22 : Math.min(48, Math.floor(window.innerWidth / 36));

    const particles = [];
    const colors = [
      { r: 245, g: 123, b: 131 }, // #f57b83 Vibrant Coral Rose
      { r: 225, g: 29, b: 72 },   // #e11d48 Cyber Crimson
      { r: 106, g: 26, b: 36 },   // #6a1a24 Deep Crimson Wine
      { r: 253, g: 198, b: 203 }, // #fdc6cb Soft Rose Blush
    ];

    for (let i = 0; i < nodeCount; i++) {
      const color = colors[i % colors.length];
      particles.push({
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.28, // Ultra-gentle drift
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.8 + 1.2,
        color,
        baseAlpha: Math.random() * 0.35 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
        isCoreDefenseNode: i % 4 === 0, // Firewall anchor node
      });
    }

    // Data-flow packet simulation: small packets traveling across links
    const packets = [];
    const maxPackets = isMobile ? 4 : 8;

    function spawnPacket(sourceIndex, targetIndex) {
      if (packets.length >= maxPackets) return;
      packets.push({
        sourceIndex,
        targetIndex,
        progress: 0,
        speed: Math.random() * 0.005 + 0.003, // Slow, elegant data transit
        color: Math.random() > 0.4 ? 'rgba(245, 123, 131, ' : 'rgba(253, 198, 203, ',
      });
    }

    /**
     * Draw Faint Digital Grid & Matrix Lattice
     */
    function drawDigitalGrid() {
      const gridSize = 72;
      ctx.strokeStyle = 'rgba(106, 26, 36, 0.14)';
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

      // Subtle matrix dots at grid intersections
      ctx.fillStyle = 'rgba(245, 123, 131, 0.07)';
      for (let x = 0; x < width; x += gridSize * 2) {
        for (let y = 0; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /**
     * Static Render for prefers-reduced-motion (0% CPU, no requestAnimationFrame loop)
     */
    function renderStaticCyberGrid() {
      if (!ctx || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      drawDigitalGrid();

      // Stationary Links
      const maxDistance = 160;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(225, 29, 72, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Stationary Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isCoreDefenseNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.08)`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.45)`;
        ctx.fill();
      }
    }

    /**
     * Active 60fps Dynamic Cybersecurity Network Animation
     */
    function animate(time) {
      if (!ctx || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Digital Grid
      drawDigitalGrid();

      // 2. Calculate and render network connection lines
      const maxDistance = 150;
      const connectedPairs = [];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            connectedPairs.push({ i, j });
            const alpha = (1 - dist / maxDistance) * 0.22;

            // Gradient link between node colors
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
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Random chance to spawn a data packet on this link
            if (Math.random() < 0.0015 && packets.length < maxPackets) {
              spawnPacket(i, j);
            }
          }
        }
      }

      // 3. Render and update data-flow packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const p1 = particles[pkt.sourceIndex];
        const p2 = particles[pkt.targetIndex];
        if (!p1 || !p2) {
          packets.splice(k, 1);
          continue;
        }

        const curX = p1.x + (p2.x - p1.x) * pkt.progress;
        const curY = p1.y + (p2.y - p1.y) * pkt.progress;
        const packetAlpha = Math.sin(pkt.progress * Math.PI) * 0.65;

        // Flow packet core
        ctx.beginPath();
        ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `${pkt.color}${packetAlpha})`;
        ctx.shadowColor = 'rgba(245, 123, 131, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // 4. Update and render particles / security nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth positional drift
        p.x += p.vx;
        p.y += p.vy;

        // Soft viewport boundaries
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Slow breathing pulse
        const pulse = Math.sin(time * 0.0015 + p.pulseOffset) * 0.25 + 0.75;
        const alpha = p.baseAlpha * pulse;

        // Core defense aura
        if (p.isCoreDefenseNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (3.8 * pulse), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${0.08 * pulse})`;
          ctx.fill();

          // Subtle concentric security ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (2.2 * pulse), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${0.2 * pulse})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Node center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha + 0.15})`;
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
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. HTML5 Canvas: Dynamic AI Cybersecurity Network */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-80"
      />

      {/* 2. Soft Ambient Deep Crimson / Rose / Burgundy Atmospheric Radiance */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#6a1a24]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-rose-600/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[650px] h-[650px] bg-[#881337]/15 rounded-full blur-[180px] pointer-events-none" />
    </div>
  );
}
