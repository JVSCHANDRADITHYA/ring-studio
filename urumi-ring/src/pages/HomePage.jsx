import {
  BRAND,
  PROCESS_STEPS,
  TESTIMONIALS,
} from "../data/constants"

import HeroCanvas from "../components/HeroCanvas"

function Hero({ featuredProduct, onNavigate, onConfigure }) {
  return (
    <section className="hero-section">
      <HeroCanvas />

      <div className="hero-sticky">
        <div className="hero-orbit" />
        <div className="hero-tunnel-glow" />
        <div className="noise" />

        <div className="hero-content">
          <div className="hero-copy-block">
            <p className="eyebrow">{BRAND.sub}</p>

            <h1 className="hero-title">
              Jewellery that moves like <span>light.</span>
            </h1>

            <p className="hero-copy">
              A cinematic ring studio for bespoke decisions.
              Scroll through the form, enter the piece,
              then configure the design with atelier-level
              precision.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => onConfigure(featuredProduct)}
              >
                Open Configurator
              </button>

              <button
                className="ghost-button"
                onClick={() => onNavigate("store")}
              >
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
          The landing experience keeps focus on one object:
          the ring, its movement, and the feeling of
          inspecting a future heirloom before it is made.
        </p>

        <p>
          From here, the configurator becomes the practical
          studio: material, stone cut, and quote path
          without diluting the brand moment with product
          thumbnails.
        </p>
      </div>

      <button
        className="primary-button"
        onClick={() => onConfigure(featuredProduct)}
      >
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
            <article
              className="process-item"
              key={step.num}
            >
              <span className="process-num">
                {step.num}
              </span>

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
            <figure
              className="testimonial"
              key={item.author}
            >
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

export default function HomePage({
  featuredProduct,
  onNavigate,
  onConfigure,
}) {
  return (
    <div className="home-page">
      <Hero
        featuredProduct={featuredProduct}
        onNavigate={onNavigate}
        onConfigure={onConfigure}
      />

      <BrandSection
        featuredProduct={featuredProduct}
        onConfigure={onConfigure}
      />

      <ProcessSection />

      <TestimonialsSection />
    </div>
  )
}