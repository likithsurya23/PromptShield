'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export function SecurityAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Parallax tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;

    setTilt({ rotateX, rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Ambient Cyber Particle & Spark Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = 540);
    let height = (canvas.height = 540);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || 540;
        height = canvas.height = canvas.parentElement.clientHeight || 540;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.3 ? '#f43f5e' : '#fb7185',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = '#e11d48';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[520px] aspect-square flex items-center justify-center select-none group cursor-pointer overflow-visible mx-auto"
      style={{ perspective: '1200px' }}
      title="PromptShield Autonomous Cyber Defense Engine"
    >
      {/* 1. Deep Atmospheric Ruby Nebula Glow */}
      <div className="absolute w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-gradient-to-tr from-[#881337]/50 via-[#e11d48]/30 to-[#4c0519]/40 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none transition-opacity duration-700 opacity-90 group-hover:opacity-100" />
      <div className="absolute w-[180px] sm:w-[260px] h-[180px] sm:h-[260px] bg-rose-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse" />

      {/* 2. Interactive Parallax 3D Layer */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating Sparks Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* 3. Base Platform: Multi-tier Stepped Glowing Pedestal */}
        <div
          className="absolute bottom-6 sm:bottom-8 w-[240px] sm:w-[340px] h-[90px] sm:h-[120px] pointer-events-none z-10 flex items-center justify-center"
          style={{ transform: 'rotateX(55deg) translateZ(-40px)' }}
        >
          {/* Ground Laser Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-600/30 via-rose-500/50 to-rose-600/30 blur-xl animate-pulse" />

          {/* Tier 1: Bottom Slabs */}
          <div className="absolute inset-x-2 inset-y-2 rounded-2xl bg-[#14050f]/90 border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.35)]" />
          
          {/* Tier 2: Elevated Middle Slab */}
          <div
            className="absolute inset-x-6 inset-y-5 rounded-xl bg-gradient-to-b from-[#25081c] to-[#0f030b] border border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
            style={{ transform: 'translateZ(14px)' }}
          />

          {/* Tier 3: Top Plinth with Concentric Laser Radar Circles */}
          <div
            className="absolute inset-x-10 inset-y-8 rounded-lg bg-gradient-to-b from-[#330b26] to-[#12030e] border border-rose-400/80 flex items-center justify-center overflow-hidden"
            style={{ transform: 'translateZ(26px)' }}
          >
            {/* Concentric Radar Rings on Platform Surface */}
            <div className="w-20 h-20 rounded-full border border-rose-500/40 absolute animate-ping opacity-30" />
            <div className="w-14 h-14 rounded-full border border-rose-400/50 absolute" />
            <div className="w-8 h-8 rounded-full border border-rose-300/70 absolute bg-rose-500/20" />
            {/* Crosshair Laser Axes */}
            <div className="w-full h-[1px] bg-rose-500/40 absolute" />
            <div className="h-full w-[1px] bg-rose-500/40 absolute" />
          </div>
        </div>

        {/* 4. Upper & Lower Holographic 3D Orbital Swirl Rings */}
        {/* Ring 1: Primary Upper Ring */}
        <div
          className="absolute w-[290px] sm:w-[410px] h-[110px] sm:h-[150px] rounded-[50%] border-2 border-rose-500/70 shadow-[0_0_25px_rgba(244,63,94,0.6)] pointer-events-none z-15 animate-[spinRing_16s_linear_infinite]"
          style={{
            transform: 'rotateX(72deg) rotateY(-22deg) rotateZ(15deg) translateY(-25px)',
            boxShadow: 'inset 0 0 15px rgba(244,63,94,0.4), 0 0 25px rgba(244,63,94,0.6)',
          }}
        >
          {/* Orbital Light Streak Node */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#ffffff,0_0_24px_#f43f5e]" />
        </div>

        {/* Ring 2: Lower Wide Defense Ring */}
        <div
          className="absolute w-[320px] sm:w-[450px] h-[120px] sm:h-[170px] rounded-[50%] border border-rose-400/50 shadow-[0_0_20px_rgba(225,29,72,0.4)] pointer-events-none z-25 animate-[spinRingRev_22s_linear_infinite]"
          style={{
            transform: 'rotateX(68deg) rotateY(-18deg) rotateZ(-20deg) translateY(35px)',
            boxShadow: 'inset 0 0 10px rgba(244,63,94,0.3), 0 0 20px rgba(244,63,94,0.4)',
          }}
        >
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#fca5a5] shadow-[0_0_10px_#fda4af,0_0_20px_#f43f5e]" />
        </div>

        {/* 5. Floating 3D Holographic Data Cubes */}
        {/* Cube 1: Left */}
        <div
          className="absolute left-3 sm:left-6 top-28 sm:top-36 w-7 sm:w-10 h-7 sm:h-10 pointer-events-none z-20 animate-[floatCube1_6s_ease-in-out_infinite]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-full h-full rounded-md bg-rose-500/15 border border-rose-400/80 shadow-[0_0_12px_rgba(244,63,94,0.5)] backdrop-blur-xs transform rotate-12 rotate-y-24" />
        </div>

        {/* Cube 2: Right */}
        <div
          className="absolute right-2 sm:right-6 top-36 sm:top-48 w-8 sm:w-11 h-8 sm:h-11 pointer-events-none z-20 animate-[floatCube2_7s_ease-in-out_infinite_1s]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-full h-full rounded-md bg-rose-500/20 border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)] backdrop-blur-xs transform -rotate-12 rotate-y-30" />
        </div>

        {/* Cube 3: Micro Top Cube */}
        <div
          className="absolute right-12 sm:right-20 top-12 sm:top-16 w-4 sm:w-6 h-4 sm:h-6 pointer-events-none z-10 animate-[floatCube1_5s_ease-in-out_infinite_2s]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-full h-full rounded-sm bg-rose-500/20 border border-rose-300/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
        </div>

        {/* 6. Centerpiece: The Animated Ruby & Obsidian Beveled Security Shield */}
        <div
          className="relative w-[190px] sm:w-[270px] lg:w-[290px] h-[230px] sm:h-[330px] lg:h-[350px] flex items-center justify-center z-20 animate-[floatShield_5s_ease-in-out_infinite]"
          style={{
            transform: 'translateZ(30px) translateY(-20px)',
            filter: 'drop-shadow(0 20px 45px rgba(225, 29, 72, 0.55))',
          }}
        >
          <svg
            viewBox="0 0 320 380"
            className="w-full h-full select-none pointer-events-none"
          >
            <defs>
              {/* Outer Beveled Chassis Ruby Gradient */}
              <linearGradient id="shieldChassis" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="25%" stopColor="#e11d48" />
                <stop offset="65%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>

              {/* Inner Glossy Obsidian Face Gradient */}
              <linearGradient id="innerObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1f0717" />
                <stop offset="40%" stopColor="#13030e" />
                <stop offset="100%" stopColor="#080106" />
              </linearGradient>

              {/* Laser Core Gradient */}
              <radialGradient id="laserCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#ff4d6d" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#e11d48" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0" />
              </radialGradient>

              {/* Specular Rim Light */}
              <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffccd5" />
                <stop offset="50%" stopColor="#ff3366" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>

            {/* Layer 1: Ambient Red Edge Halo */}
            <path
              d="M 160 22 C 190 38, 245 42, 285 58 C 285 145, 275 240, 160 365 C 45 240, 35 145, 35 58 C 75 42, 130 38, 160 22 Z"
              fill="none"
              stroke="#ff2a55"
              strokeWidth="12"
              opacity="0.35"
              filter="blur(8px)"
            />

            {/* Layer 2: Outer Beveled Armor Rim */}
            <path
              d="M 160 24 C 188 38, 242 42, 280 58 C 280 142, 270 236, 160 360 C 50 236, 40 142, 40 58 C 78 42, 132 38, 160 24 Z"
              fill="url(#shieldChassis)"
              stroke="url(#rimGlow)"
              strokeWidth="2.5"
            />

            {/* Layer 3: Inner Glass Face Inset */}
            <path
              d="M 160 40 C 184 52, 230 56, 262 70 C 262 138, 252 220, 160 332 C 68 220, 58 138, 58 70 C 90 56, 136 52, 160 40 Z"
              fill="url(#innerObsidian)"
              stroke="rgba(244, 63, 94, 0.45)"
              strokeWidth="1.5"
            />

            {/* Layer 4: Specular Reflection Facets */}
            {/* Top-Left Gloss Highlight */}
            <path
              d="M 160 40 C 184 52, 230 56, 262 70 C 262 120, 255 170, 230 210 L 160 160 Z"
              fill="rgba(255, 255, 255, 0.05)"
            />

            {/* Layer 5: Concentric AI Radar Target Reticle */}
            <g transform="translate(160, 185)">
              {/* Radar Outer Reticle Ring */}
              <circle
                r="56"
                fill="none"
                stroke="rgba(244, 63, 94, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />

              {/* Radar Middle Ring */}
              <circle
                r="40"
                fill="none"
                stroke="rgba(255, 51, 102, 0.6)"
                strokeWidth="1.6"
              />

              {/* Radar Inner Ring */}
              <circle
                r="26"
                fill="none"
                stroke="#ff2a55"
                strokeWidth="2"
                className="animate-pulse"
              />

              {/* Radar Crosshairs */}
              <line x1="-58" y1="0" x2="-40" y2="0" stroke="#ff859c" strokeWidth="1.8" />
              <line x1="40" y1="0" x2="58" y2="0" stroke="#ff859c" strokeWidth="1.8" />
              <line x1="0" y1="-58" x2="0" y2="-40" stroke="#ff859c" strokeWidth="1.8" />
              <line x1="0" y1="40" x2="0" y2="58" stroke="#ff859c" strokeWidth="1.8" />

              {/* Central Glowing Bullseye Sphere */}
              <circle r="15" fill="url(#laserCore)" />
              <circle r="9" fill="#ff2a55" className="animate-ping" opacity="0.75" />
              <circle r="7" fill="#ff4d6d" />
              <circle r="3.5" fill="#ffffff" />
            </g>

            {/* Layer 6: Vertical Scanning Laser Sweep Line */}
            <line
              x1="70"
              y1="0"
              x2="250"
              y2="0"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="drop-shadow(0 0 6px #ff2a55)"
              className="animate-[shieldScan_3.5s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            />
          </svg>
        </div>
      </div>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes floatShield {
          0%, 100% {
            transform: translateZ(30px) translateY(-20px);
          }
          50% {
            transform: translateZ(30px) translateY(-32px);
          }
        }
        @keyframes spinRing {
          0% {
            transform: rotateX(72deg) rotateY(-22deg) rotateZ(0deg) translateY(-25px);
          }
          100% {
            transform: rotateX(72deg) rotateY(-22deg) rotateZ(360deg) translateY(-25px);
          }
        }
        @keyframes spinRingRev {
          0% {
            transform: rotateX(68deg) rotateY(-18deg) rotateZ(360deg) translateY(35px);
          }
          100% {
            transform: rotateX(68deg) rotateY(-18deg) rotateZ(0deg) translateY(35px);
          }
        }
        @keyframes floatCube1 {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-14px) rotate(22deg);
          }
        }
        @keyframes floatCube2 {
          0%, 100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-16px) rotate(-24deg);
          }
        }
        @keyframes shieldScan {
          0% {
            transform: translateY(60px);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(330px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[floatShield_5s_ease-in-out_infinite\\],
          .animate-\\[spinRing_16s_linear_infinite\\],
          .animate-\\[spinRingRev_22s_linear_infinite\\],
          .animate-\\[floatCube1_6s_ease-in-out_infinite\\],
          .animate-\\[floatCube2_7s_ease-in-out_infinite_1s\\],
          .animate-\\[shieldScan_3\\.5s_cubic-bezier\\(0\\.4\\,0\\,0\\.2\\,1\\)_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}