'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export function SecurityAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

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

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move parallax handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;

    setTilt({ rotateX, rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Canvas Hexagonal Forcefield & Threat Deflection Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = 560);
    let height = (canvas.height = 460);

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || 560;
        height = canvas.height = canvas.parentElement.clientHeight || 460;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const centerX = width / 2;
    const centerY = height / 2;
    const forcefieldRadius = Math.min(width, height) * 0.32;

    // Generate Hexagonal Forcefield Grid Coordinates
    const hexagons = [];
    const hexRadius = 18;
    const hexHeight = hexRadius * Math.sqrt(3);

    for (let r = -forcefieldRadius - 20; r <= forcefieldRadius + 20; r += hexHeight * 0.85) {
      for (let q = -forcefieldRadius - 20; q <= forcefieldRadius + 20; q += hexRadius * 1.5) {
        const x = centerX + q;
        const y = centerY + r + (Math.abs(Math.round(q / (hexRadius * 1.5))) % 2 === 1 ? hexHeight / 2 : 0);
        const dist = Math.hypot(x - centerX, y - centerY);

        // Only keep hexagons forming the defensive perimeter barrier
        if (dist >= forcefieldRadius * 0.55 && dist <= forcefieldRadius + 25) {
          hexagons.push({
            x,
            y,
            dist,
            intensity: 0,
            baseAlpha: Math.max(0.08, 0.22 - (dist / forcefieldRadius) * 0.09),
          });
        }
      }
    }

    // Helper: draw single hexagon
    const drawHex = (c, x, y, r, strokeStyle, fillStyle, lineWidth = 1) => {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) c.moveTo(hx, hy);
        else c.lineTo(hx, hy);
      }
      c.closePath();
      if (fillStyle) {
        c.fillStyle = fillStyle;
        c.fill();
      }
      if (strokeStyle) {
        c.strokeStyle = strokeStyle;
        c.lineWidth = lineWidth;
        c.stroke();
      }
    };

    // Threat packet simulation
    const threats = [];
    const sparks = [];
    const shockwaves = [];
    const maxThreats = reduceMotion ? 2 : 6;

    class ThreatPacket {
      constructor() {
        this.reset();
      }

      reset() {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(width, height) * 0.62;
        this.x = centerX + Math.cos(angle) * dist;
        this.y = centerY + Math.sin(angle) * dist;
        this.speed = reduceMotion ? 0 : 1.3 + Math.random() * 1.5;
        this.size = 2.4 + Math.random() * 1.8;
        this.color = Math.random() > 0.3 ? '#e11d48' : '#f43f5e';
        this.tail = [];
        this.tailLength = 12;
      }

      update() {
        this.tail.push({ x: this.x, y: this.y });
        if (this.tail.length > this.tailLength) {
          this.tail.shift();
        }

        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // Collision with Hexagonal Forcefield Barrier
        if (dist <= forcefieldRadius + 8) {
          // Illuminate nearby forcefield hexagons on impact
          hexagons.forEach((hex) => {
            const hDist = Math.hypot(hex.x - this.x, hex.y - this.y);
            if (hDist < 48) {
              hex.intensity = Math.max(hex.intensity, 1 - hDist / 48);
            }
          });

          // Generate Deflection Sparks
          for (let i = 0; i < 9; i++) {
            sparks.push(new Spark(this.x, this.y, this.color));
          }

          // Expand Forcefield Shockwave
          shockwaves.push(new Shockwave(this.x, this.y));

          this.reset();
        } else {
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed;
        }
      }

      draw(c) {
        // Glowing comet tail
        for (let i = 0; i < this.tail.length; i++) {
          const pt = this.tail[i];
          const alpha = (i / this.tail.length) * (isDark ? 0.35 : 0.5);
          c.beginPath();
          c.arc(pt.x, pt.y, this.size * 0.6, 0, Math.PI * 2);
          c.fillStyle = `rgba(225, 29, 72, ${alpha})`;
          c.fill();
        }

        // Threat core
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowColor = '#e11d48';
        c.shadowBlur = isDark ? 10 : 8;
        c.fill();
        c.shadowBlur = 0;
      }
    }

    class Spark {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 3.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = 0.035 + Math.random() * 0.03;
        this.size = 1.4 + Math.random() * 1.8;
        this.color = color;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.alpha -= this.decay;
      }

      draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = isDark
          ? `rgba(254, 205, 211, ${Math.max(0, this.alpha)})`
          : `rgba(225, 29, 72, ${Math.max(0, this.alpha)})`;
        c.shadowColor = '#e11d48';
        c.shadowBlur = 8;
        c.fill();
        c.shadowBlur = 0;
      }
    }

    class Shockwave {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.alpha = 0.85;
      }

      update() {
        this.radius += 1.4;
        this.alpha -= 0.04;
      }

      draw(c) {
        if (this.alpha <= 0) return;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.strokeStyle = isDark
          ? `rgba(251, 113, 133, ${this.alpha})`
          : `rgba(225, 29, 72, ${this.alpha * 1.2})`;
        c.lineWidth = 1.4;
        c.stroke();
      }
    }

    for (let i = 0; i < maxThreats; i++) {
      threats.push(new ThreatPacket());
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Hexagonal Forcefield Grid
      const breathingPulse = Math.sin(frame * 0.02) * 0.04;

      for (let hex of hexagons) {
        // Decay impact intensity
        if (hex.intensity > 0) {
          hex.intensity = Math.max(0, hex.intensity - 0.025);
        }

        // Higher visibility multiplier in light theme
        const alphaMultiplier = isDark ? 1.0 : 1.6;
        const totalAlpha = Math.min(1, (hex.baseAlpha + breathingPulse + hex.intensity * 0.8) * alphaMultiplier);
        
        const strokeColor = isDark
          ? `rgba(244, 63, 94, ${totalAlpha})`
          : `rgba(225, 29, 72, ${totalAlpha})`;

        const fillColor = hex.intensity > 0.08
          ? isDark
            ? `rgba(244, 63, 94, ${hex.intensity * 0.35})`
            : `rgba(225, 29, 72, ${hex.intensity * 0.45})`
          : (!isDark ? `rgba(244, 63, 94, 0.03)` : null);

        drawHex(
          ctx,
          hex.x,
          hex.y,
          hexRadius - 1.5,
          strokeColor,
          fillColor,
          hex.intensity > 0.2 ? 1.8 : (isDark ? 0.8 : 1.1)
        );
      }

      // 2. Draw Subtle Concentric Defense Wave Radiance
      if (!reduceMotion) {
        const wave = (frame * 0.01) % 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, forcefieldRadius * (0.8 + wave * 0.4), 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(244, 63, 94, ${(1 - wave) * 0.2})`
          : `rgba(225, 29, 72, ${(1 - wave) * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 3. Update & render threats
      for (const t of threats) {
        t.update();
        t.draw(ctx);
      }

      // 4. Update & render sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw(ctx);
        if (sparks[i].alpha <= 0) sparks.splice(i, 1);
      }

      // 5. Update & render shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        shockwaves[i].update();
        shockwaves[i].draw(ctx);
        if (shockwaves[i].alpha <= 0) shockwaves.splice(i, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] aspect-[574/450] flex items-center justify-center select-none group cursor-pointer overflow-hidden rounded-2xl"
      style={{ perspective: '1100px' }}
      title="Interactive 3D AI Security Shield & Threat Deflection Forcefield"
    >
      {/* 1. Deep Atmospheric Cyber Nebula Glow (Adaptive Light & Dark) */}
      <div className="absolute w-[460px] h-[460px] bg-gradient-to-tr from-rose-300/40 via-pink-300/25 to-rose-200/35 dark:from-[#881337]/40 dark:via-[#e11d48]/20 dark:to-[#4c0519]/35 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 opacity-85 group-hover:opacity-100" />
      <div className="absolute w-[280px] h-[280px] bg-rose-400/20 dark:bg-rose-500/15 rounded-full blur-[70px] pointer-events-none animate-pulse" />

      {/* 2. 3D Gyroscopic Parallax Tilt Container */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3. Outer Rotating Orbital Cyber Rings */}
        <div className="absolute w-[440px] h-[440px] sm:w-[480px] sm:h-[480px] rounded-full border border-rose-400/40 dark:border-rose-500/20 pointer-events-none animate-[spin_40s_linear_infinite]">
          {/* Orbital Satellite Node 1 */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#170817]/90 border border-rose-300 dark:border-rose-500/40 text-[9px] font-mono text-rose-600 dark:text-rose-300 shadow-md shadow-rose-950/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>NEURAL GATEWAY</span>
          </div>

          {/* Orbital Satellite Node 2 */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#170817]/90 border border-rose-300 dark:border-rose-500/40 text-[9px] font-mono text-rose-600 dark:text-rose-300 shadow-md shadow-rose-950/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>RAG SENTINEL</span>
          </div>
        </div>

        {/* Counter-rotating Inner Dashed Defense Ring */}
        <div className="absolute w-[350px] h-[350px] sm:w-[390px] sm:h-[390px] rounded-full border border-dashed border-rose-400/40 dark:border-rose-500/25 pointer-events-none animate-[spin_55s_linear_infinite_reverse]" />

        {/* 4. Canvas: Hexagonal Forcefield & Particle Deflection */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* 5. Centerpiece: Multi-Layer Holographic 3D Vector Cyber Shield */}
        <div
          className="relative w-[280px] sm:w-[330px] h-[320px] sm:h-[380px] flex items-center justify-center z-20 animate-[floatShield_6s_ease-in-out_infinite]"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Pure Vector Cyber Shield SVG */}
          <svg
            viewBox="0 0 320 380"
            className="w-full h-full filter drop-shadow-[0_20px_50px_rgba(225,29,72,0.4)] group-hover:drop-shadow-[0_25px_65px_rgba(225,29,72,0.6)] transition-all duration-500 select-none pointer-events-none"
          >
            <defs>
              {/* Outer Shield Gradient */}
              <linearGradient id="shieldChassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="35%" stopColor="#be123c" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>

              {/* Inner Plate Metallic Inset Gradient */}
              <linearGradient id="innerPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#240c1b" />
                <stop offset="50%" stopColor="#180715" />
                <stop offset="100%" stopColor="#0d020b" />
              </linearGradient>

              {/* Glowing Rim Gradient */}
              <linearGradient id="glowingRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>

              {/* Laser Core Shimmer */}
              <linearGradient id="coreGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Layer 1: Outer Holographic Aura Blur */}
            <path
              d="M 160 20 L 280 65 L 260 220 C 240 290 190 335 160 360 C 130 335 80 290 60 220 L 40 65 Z"
              fill="none"
              stroke="rgba(244,63,94,0.4)"
              strokeWidth="10"
              filter="blur(6px)"
            />

            {/* Layer 2: Main Shield Chassis Outer Armor */}
            <path
              d="M 160 24 L 275 68 L 256 218 C 236 285 188 328 160 352 C 132 328 84 285 64 218 L 45 68 Z"
              fill="url(#shieldChassisGrad)"
              stroke="url(#glowingRimGrad)"
              strokeWidth="2.5"
            />

            {/* Layer 3: Inset Honeycomb Tech Bed */}
            <path
              d="M 160 42 L 255 78 L 238 206 C 220 265 178 304 160 326 C 142 304 100 265 82 206 L 65 78 Z"
              fill="url(#innerPlateGrad)"
              stroke="rgba(244,63,94,0.4)"
              strokeWidth="1.5"
            />

            {/* Layer 4: Geometric Facets */}
            {/* Left Flange */}
            <polygon
              points="160,45 80,82 95,200 160,280 160,45"
              fill="rgba(244,63,94,0.12)"
              stroke="rgba(244,63,94,0.35)"
              strokeWidth="1"
            />
            {/* Right Flange */}
            <polygon
              points="160,45 240,82 225,200 160,280 160,45"
              fill="rgba(244,63,94,0.18)"
              stroke="rgba(244,63,94,0.45)"
              strokeWidth="1"
            />

            {/* Layer 5: Centerpiece AI Crest & Crosshairs */}
            <g transform="translate(160, 160)">
              {/* Central Glowing Shield Crest */}
              <circle r="36" fill="rgba(244,63,94,0.2)" stroke="rgba(244,63,94,0.7)" strokeWidth="1.5" />
              <circle r="26" fill="rgba(20,5,18,0.9)" stroke="#f43f5e" strokeWidth="2" />
              
              {/* Radar Crosshair ticks */}
              <line x1="-36" y1="0" x2="-26" y2="0" stroke="#fda4af" strokeWidth="1.5" />
              <line x1="26" y1="0" x2="36" y2="0" stroke="#fda4af" strokeWidth="1.5" />
              <line x1="0" y1="-36" x2="0" y2="-26" stroke="#fda4af" strokeWidth="1.5" />
              <line x1="0" y1="26" x2="0" y2="36" stroke="#fda4af" strokeWidth="1.5" />

              {/* Pulsing Center AI Neural Spark */}
              <circle r="9" fill="#fda4af" className="animate-pulse" />
              <circle r="4" fill="#ffffff" />
            </g>

            {/* Layer 6: Vertical Laser Scanning Beam Overlay */}
            <g className="overflow-hidden">
              <line
                x1="70"
                y1="0"
                x2="250"
                y2="0"
                stroke="url(#coreGlowGrad)"
                strokeWidth="4"
                className="animate-[shieldLaserScan_4s_cubic-bezier(0.65,0,0.35,1)_infinite]"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Global CSS for Shield Float & Laser Scan */}
      <style jsx global>{`
        @keyframes floatShield {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shieldLaserScan {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(320px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[floatShield_6s_ease-in-out_infinite\\],
          .animate-\\[shieldLaserScan_4s_cubic-bezier\\(0\\.65\\,0\\.35\\,1\\)_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}