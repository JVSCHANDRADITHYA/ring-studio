import { Component, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import * as THREE from "three"
import Ring3D from "../components/Ring3D"
import {
  BRAND,
  PROCESS_STEPS,
  TESTIMONIALS,
} from "../data/constants"

class ModelFallbackBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function smooth(value) {
  return value * value * (3 - 2 * value)
}

function HeroRing({ product }) {
  const groupRef = useRef()

  useFrame(({ camera }) => {
    const progress = smooth(clamp(window.scrollY / (window.innerHeight * 0.92), 0, 1))

    camera.position.x = THREE.MathUtils.lerp(0.12, 0, progress)
    camera.position.y = THREE.MathUtils.lerp(0.18, 0, progress)
    camera.position.z = THREE.MathUtils.lerp(4.55, 1.28, progress)
    camera.fov = THREE.MathUtils.lerp(34, 58, progress)
    camera.lookAt(0.45, 0.02, 0)
    camera.updateProjectionMatrix()

    if (!groupRef.current) return

    groupRef.current.position.x = THREE.MathUtils.lerp(1.12, 0.08, progress)
    groupRef.current.position.y = THREE.MathUtils.lerp(0.02, -0.03, progress)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0.05, 0.32, progress)
    groupRef.current.rotation.y += 0.002 + progress * 0.007
    groupRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.12, progress)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1.24, 3.35, progress))
  })

  const heroRing = (
    <group ref={groupRef}>
      <Ring3D
        src="/eternal_ring.glb"
        metal={product.metal}
        stone={product.stone}
        applyMaterials={false}
        rotation={[0.05, -0.55, 0]}
        scale={1}
      />
    </group>
  )

  const fallbackRing = (
    <group ref={groupRef}>
      <Ring3D
        metal={product.metal}
        stone={product.stone}
        autoRotate
        rotationSpeed={0.002}
        rotation={[0.05, -0.55, 0]}
        scale={1}
      />
    </group>
  )

  return (
    <ModelFallbackBoundary fallback={fallbackRing}>
      {heroRing}
    </ModelFallbackBoundary>
  )
}

function HeroStage({ product }) {
  return (
    <Canvas dpr={[1, 1.7]} camera={{ position: [0.12, 0.18, 4.55], fov: 34 }}>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.34} />
      <directionalLight position={[4, 5, 5]} intensity={5.2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color="#8ad8df" />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.18}>
        <HeroRing product={product} />
      </Float>
      <Environment preset="city" />
    </Canvas>
  )
}

function Hero({ featuredProduct, onNavigate, onConfigure }) {
  return (
    <section className="hero-section">
      <div className="hero-sticky">
        <div className="hero-canvas hero-canvas-premium">
          <HeroStage product={featuredProduct} />
        </div>
        <div className="hero-orbit" />
        <div className="noise" />

        <div className="hero-content">
          <div className="hero-copy-block">
            <p className="eyebrow">{BRAND.sub}</p>
            <h1 className="hero-title">
              Jewellery that moves like <span>light.</span>
            </h1>
            <p className="hero-copy">
              A cinematic ring studio for bespoke decisions. Scroll through the
              form, enter the piece, then configure the design with atelier-level
              precision.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => onConfigure(featuredProduct)}>
                Open Configurator
              </button>
              <button className="ghost-button" onClick={() => onNavigate("store")}>
                View Collection
              </button>
            </div>
          </div>
        </div>

        <div className="hero-scroll-panel">
          <span>Scroll to pass through</span>
          <strong>the ring</strong>
        </div>
      </div>
    </section>
  )
}

function BrandSection({ onConfigure, featuredProduct }) {
  return (
    <section className="brand-section">
      <div className="brand-statement">
        <p className="eyebrow">Urumi atelier</p>
        <h2 className="section-title">
          Not a catalogue. <span>A private design room.</span>
        </h2>
      </div>

      <div className="brand-columns">
        <p>
          The landing experience keeps focus on one object: the ring, its
          movement, and the feeling of inspecting a future heirloom before it is
          made.
        </p>
        <p>
          From here, the configurator becomes the practical studio: material,
          stone cut, and quote path without diluting the brand moment with
          product thumbnails.
        </p>
      </div>

      <button className="primary-button" onClick={() => onConfigure(featuredProduct)}>
        Begin Bespoke Studio
      </button>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <p className="eyebrow">Studio flow</p>
            <h2 className="section-title">
              From preview to <span>proposal.</span>
            </h2>
          </div>
        </div>

        <div className="process-grid">
          {PROCESS_STEPS.map((step) => (
            <article className="process-item" key={step.num}>
              <span className="process-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <p className="eyebrow">Client notes</p>
            <h2 className="section-title">
              Built for confident <span>decisions.</span>
            </h2>
          </div>
        </div>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <figure className="testimonial" key={item.author}>
              <p>"{item.quote}"</p>
              <footer>
                {item.author} / {item.location}
              </footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage({ featuredProduct, onNavigate, onConfigure }) {
  return (
    <div className="home-page">
      <Hero
        featuredProduct={featuredProduct}
        onNavigate={onNavigate}
        onConfigure={onConfigure}
      />
      <BrandSection featuredProduct={featuredProduct} onConfigure={onConfigure} />
      <ProcessSection />
      <TestimonialsSection />
    </div>
  )
}
