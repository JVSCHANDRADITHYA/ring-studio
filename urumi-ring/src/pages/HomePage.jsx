// src/pages/HomePage.jsx

import {
  BRAND,
} from "../data/constants"

import HeroCanvas from "../components/HeroCanvas"

function Hero() {
  return (
<section className="hero-section">
  <div className="hero-sticky">

    <HeroCanvas />

    <div className="hero-story">
      <p className="hero-story-kicker">
        BESPOKE STUDIO
      </p>

      <h2 className="hero-story-title">
        Your ring.
        <br />
        Your choice.
      </h2>
      <br />
      <p className="hero-story-copy">
        Configure every detail.
        Choose precious metals,
        stone cuts, proportions,
        and finishes designed around
        your story and your style.
      </p>
    </div>

  </div>
</section>
  )
}

function LandingIntro({
  featuredProduct,
  onConfigure,
}) {
  return (
    <section className="landing-intro">
      <div className="landing-intro-inner">
        <p className="eyebrow">{BRAND.sub}</p>

        <h1 className="landing-title">
          <span className="script-accent">
          Jewellery that moves like <span>light.</span>
          </span>

        </h1>

        <p className="landing-copy">
          A cinematic ring studio for bespoke
          decisions. Designed around motion,
          craftsmanship, and precision.
        </p>

        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() =>
              onConfigure(featuredProduct)
            }
          >
            Open Configurator
          </button>
        </div>
      </div>
    </section>
  )
}

function BrandSection({
  onConfigure,
  featuredProduct,
}) {
  return (
    <section className="brand-section">
      <div className="brand-statement">
        <p className="eyebrow">Urumi atelier</p>

        <h2 className="section-title">
          <span className="script-accent-white">
          Not a catalogue.
          <span> A private design room.</span>
          </span>
        </h2>
      </div>

      <div className="brand-columns">
        <p>
          The landing experience keeps focus on
          one object: the ring, its movement, and
          the feeling of inspecting a future
          heirloom before it is made.
        </p>

        <p>
          From here, the configurator becomes the
          practical studio: material, stone cut,
          and quote path without diluting the
          brand moment with product thumbnails.
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

function ProcessSection({ onConfigure, featuredProduct }) {
  const cards = [
    {
      image: "public/studio.jpg",
      title: "Private Studio",
      text: "A quiet design space focused on one object, one decision, and one story."
    },
    {
      image: "public/ring.webp",
      title: "Your Ring",
      text: "Experiment with proportions, cuts, metals, and finishes in real time."
    },
    {
      image: "public/craft.jpg",
      title: "Craftsmanship",
      text: "Traditional bench work combined with modern precision manufacturing."
    },
    {
      image: "public/gold.jpg",
      title: "Material",
      text: "From molten gold to final polish, every stage remains visible."
    }
  ]

  return (
    <section className="studio-showcase">

      <div className="section-head center">
        <p className="eyebrow">
          Studio flow
        </p>

        <h2 className="section-title">
          Designed around
          <span> craftsmanship.</span>
        </h2>
      </div>

      <div className="marquee">
        <div className="marquee-track">

          {[...cards, ...cards].map((card, index) => (
            <article
              key={index}
              className="glass-card"
            >
              <img
                src={card.image}
                alt={card.title}
              />

              <div className="glass-card-body">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}

        </div>
      </div>

      <div className="studio-cta">
        <button
          className="primary-button"
          onClick={() =>
            onConfigure(featuredProduct)
          }
        >
          Open Configurator
        </button>
      </div>

    </section>
  )
}

function FooterSection() {
  return (
    <footer className="site-footer">

      <div className="footer-column">

        <h3>Atelier</h3>

        <a href="#">
          About Us
        </a>

        <a href="#">
          Craft Process
        </a>

        <a href="#">
          Shipping Policy
        </a>

        <a href="#">
          Privacy Policy
        </a>

        <a href="#">
          Terms
        </a>

      </div>

      <div className="footer-column">

        <h3>Contact</h3>

        <a href="#">
          @atelier.studio
        </a>

        <a href="#">
          @atelier.rings
        </a>

        <a href="#">
          hello@atelier.com
        </a>

        <a href="#">
          +91 99999 99999
        </a>

      </div>

    </footer>
  )
}

export default function HomePage({
  featuredProduct,
  onNavigate,
  onConfigure,
}) {
  return (
    <div className="home-page">
      <LandingIntro
        featuredProduct={featuredProduct}
        onNavigate={onNavigate}
        onConfigure={onConfigure}
      />

      <Hero />

      <BrandSection
        featuredProduct={featuredProduct}
        onConfigure={onConfigure}
      />

<ProcessSection
  featuredProduct={featuredProduct}
  onConfigure={onConfigure}
/>

<FooterSection />
    </div>
  )
}