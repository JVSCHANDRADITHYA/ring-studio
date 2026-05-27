import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import Ring from "./Ring"

/* ─── Data ──────────────────────────────────────────────── */

const METALS = ["white", "yellow", "rose", "platinum", "palladium"]

const METAL_META = {
  white:     { label: "White Gold",  short: "White",    color: "#E4E4E4", glow: "rgba(228,228,228,0.55)" },
  yellow:    { label: "Yellow Gold", short: "Yellow",   color: "#D4AF37", glow: "rgba(212,175,55,0.65)"  },
  rose:      { label: "Rose Gold",   short: "Rose",     color: "#D89A8D", glow: "rgba(216,154,141,0.65)" },
  platinum:  { label: "Platinum",    short: "Plat.",    color: "#C9CCD3", glow: "rgba(201,204,211,0.55)" },
  palladium: { label: "Palladium",   short: "Pallad.",  color: "#BFC2C6", glow: "rgba(191,194,198,0.5)"  },
}

const STONES = ["round", "oval", "pear", "princess"]

const STONE_LABELS = {
  round:    "Brilliant",
  oval:     "Oval",
  pear:     "Pear",
  princess: "Princess",
}

/* ─── CSS ────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Stage ───────────────────────────────────────────── */
  .studio {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse 90% 75% at 50% 42%, #1d1a16 0%, #0a0908 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Jost', sans-serif;
    cursor: default;
  }

  /* Canvas fills the bg */
  .studio > div:first-child { position: absolute; inset: 0; }
  .studio canvas { display: block; width: 100% !important; height: 100% !important; }

  /* Grain texture */
  .grain {
    position: absolute; inset: 0; z-index: 5; pointer-events: none;
    opacity: 0.032; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  /* Warm radial glow at ring center */
  .center-glow {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    background: radial-gradient(ellipse 52% 44% at 50% 48%, rgba(195,155,95,0.06) 0%, transparent 68%);
  }

  /* ── Header ──────────────────────────────────────────── */
  .header {
    position: absolute; top: 0; left: 0; right: 0; z-index: 20;
    padding: 30px 38px;
    display: flex; align-items: baseline; justify-content: space-between;
    animation: hdrIn 1s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 300;
    letter-spacing: 0.38em; text-transform: uppercase;
    color: rgba(255,255,255,0.86);
    user-select: none;
  }
  .brand-accent {
    font-style: italic;
    color: rgba(212,175,80,0.78);
    letter-spacing: 0; margin: 0 2px;
  }
  .brand-dot {
    display: inline-block; width: 4px; height: 4px;
    border-radius: 50%; background: rgba(212,175,80,0.55);
    margin: 0 10px 2px; vertical-align: middle;
  }

  .header-tag {
    font-size: 9px; font-weight: 200;
    letter-spacing: 0.34em; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }

  /* ── Stone selector ──────────────────────────────────── */
  .stone-bar {
    position: absolute; top: 34px; left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex; flex-direction: column; align-items: center; gap: 9px;
    animation: topIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
  }

  .bar-label {
    font-size: 8px; font-weight: 200;
    letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }

  .stone-pills {
    display: flex;
    background: rgba(255,255,255,0.034);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px; padding: 3px; gap: 2px;
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
  }

  .stone-pill {
    padding: 8px 20px; border-radius: 999px; border: none;
    background: transparent; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.38);
    transition: color 0.28s ease, background 0.28s ease;
  }
  .stone-pill.active {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.94);
  }
  .stone-pill:hover:not(.active) {
    color: rgba(255,255,255,0.66);
    background: rgba(255,255,255,0.04);
  }

  /* ── Selection info ──────────────────────────────────── */
  .sel-info {
    position: absolute; top: 50%; right: 38px;
    transform: translateY(-50%);
    z-index: 20;
    display: flex; flex-direction: column; align-items: flex-end; gap: 0;
    animation: rightIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
  }

  .sel-group { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }

  .sel-micro {
    font-size: 8px; font-weight: 200; letter-spacing: 0.36em;
    text-transform: uppercase; color: rgba(255,255,255,0.18);
  }

  .sel-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 300;
    color: rgba(255,255,255,0.72);
    letter-spacing: 0.04em;
    text-transform: capitalize;
    white-space: nowrap;
    transition: opacity 0.3s ease;
  }

  .sel-sep {
    width: 1px; height: 30px; margin: 13px 0;
    background: linear-gradient(to bottom, transparent, rgba(210,175,100,0.28), transparent);
    align-self: flex-end;
  }

  /* ── Metal panel ─────────────────────────────────────── */
  .metal-panel {
    position: absolute; bottom: 44px; left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex; flex-direction: column; align-items: center; gap: 15px;
    animation: btmIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
  }

  .swatches {
    display: flex; gap: 12px; align-items: center;
  }

  .swatch-col {
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    cursor: pointer;
  }

  .swatch {
    width: 38px; height: 38px; border-radius: 50%; border: none;
    cursor: pointer; outline: none;
    background: var(--col);
    position: relative;
    transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.32s ease;
  }
  /* ring indicator */
  .swatch::after {
    content: ''; position: absolute; inset: -4px; border-radius: 50%;
    border: 1.5px solid transparent;
    transition: border-color 0.28s ease, opacity 0.28s ease;
  }
  .swatch.active {
    transform: scale(1.2);
    box-shadow: 0 0 26px var(--glow), 0 8px 30px rgba(0,0,0,0.55);
  }
  .swatch.active::after { border-color: rgba(255,255,255,0.5); }
  .swatch:hover:not(.active) {
    transform: scale(1.1);
    box-shadow: 0 4px 16px var(--glow);
  }

  .swatch-name {
    font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.2); font-weight: 200;
    transition: color 0.28s ease; white-space: nowrap;
    user-select: none;
  }
  .swatch-col.active .swatch-name { color: rgba(255,255,255,0.52); }

  /* ── Drag hint ───────────────────────────────────────── */
  .drag-hint {
    position: absolute; bottom: 44px; right: 38px; z-index: 20;
    display: flex; align-items: center; gap: 9px;
    color: rgba(255,255,255,0.22);
    animation: fadeIn 1.2s ease 0.9s both;
  }
  .drag-icon {
    width: 26px; height: 26px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    animation: spinDrift 5s ease-in-out infinite;
  }
  .drag-hint span {
    font-size: 9px; letter-spacing: 0.26em; text-transform: uppercase; font-weight: 200;
  }

  /* ── Decorative verticals ────────────────────────────── */
  .deco {
    position: absolute; top: 50%; width: 1px; height: 110px;
    transform: translateY(-50%);
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.055), transparent);
    z-index: 6; pointer-events: none;
    animation: fadeIn 1.8s ease 0.7s both;
  }
  .deco-l { left: 38px; }
  .deco-r { right: 38px; }

  /* Small horizontal rule under brand */
  .brand-line {
    position: absolute; top: 68px; left: 38px;
    width: 28px; height: 1px;
    background: linear-gradient(to right, rgba(212,175,80,0.38), transparent);
    z-index: 20;
    animation: hdrIn 1s ease 0.2s both;
  }

  /* ── Keyframes ───────────────────────────────────────── */
  @keyframes hdrIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes topIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes btmIn {
    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes rightIn {
    from { opacity: 0; transform: translateY(-50%) translateX(14px); }
    to   { opacity: 1; transform: translateY(-50%) translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spinDrift {
    0%, 100% { transform: rotate(0deg); }
    50%       { transform: rotate(360deg); }
  }
`

/* ─── Component ──────────────────────────────────────────── */

export default function App() {
  const [metal, setMetal] = useState("rose")
  const [stone, setStone] = useState("round")

  return (
    <>
      <style>{CSS}</style>

      <div className="studio">

        {/* 3-D Canvas */}
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 5]} intensity={4} />
          <Environment preset="city" />
          <Ring metal={metal} stone={stone} />
          <OrbitControls />
        </Canvas>

        {/* Atmospheric layers */}
        <div className="grain" />
        <div className="center-glow" />

        {/* ── Header ────────────────── */}
        <header className="header">
          <div className="brand">
            Wingman Jewelers
          </div>
          <span className="header-tag">Ring Configurator</span>
        </header>
        <div className="brand-line" />

        {/* ── Stone selector ────────── */}
        <div className="stone-bar">
          <span className="bar-label">Cut</span>
          <div className="stone-pills">
            {STONES.map(s => (
              <button
                key={s}
                className={`stone-pill${stone === s ? " active" : ""}`}
                onClick={() => setStone(s)}
              >
                {STONE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Selection info ─────────── */}
        <div className="sel-info">
          <div className="sel-group">
            <span className="sel-micro">Metal</span>
            <span className="sel-val">{METAL_META[metal].label}</span>
          </div>
          <div className="sel-sep" />
          <div className="sel-group">
            <span className="sel-micro">Stone</span>
            <span className="sel-val">{STONE_LABELS[stone]}</span>
          </div>
        </div>

        {/* ── Metal swatches ─────────── */}
        <div className="metal-panel">
          <span className="bar-label">Metal</span>
          <div className="swatches">
            {METALS.map(m => (
              <div
                key={m}
                className={`swatch-col${metal === m ? " active" : ""}`}
                onClick={() => setMetal(m)}
              >
                <button
                  className={`swatch${metal === m ? " active" : ""}`}
                  style={{ "--col": METAL_META[m].color, "--glow": METAL_META[m].glow }}
                  aria-label={METAL_META[m].label}
                />
                <span className="swatch-name">{METAL_META[m].short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Drag hint ──────────────── */}
        <div className="drag-hint">
          <div className="drag-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M6 2l4 4-4 4"
                stroke="currentColor" strokeWidth="1"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Drag to rotate</span>
        </div>

        {/* ── Decorative lines ─────── */}
        <div className="deco deco-l" />
        <div className="deco deco-r" />

      </div>
    </>
  )
}