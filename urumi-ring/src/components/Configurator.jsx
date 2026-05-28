import { useEffect, useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Stage } from "@react-three/drei"
import Ring3D from "./Ring3D"
import {
  METALS,
  METAL_META,
  STONES,
  STONE_LABELS,
  STONE_META,
  WOO_VARIATIONS_URL,
} from "../data/constants"

const formatUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function normalizeOption(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function getVariationAttribute(variation, name) {
  return variation.attributes?.find(
    (attribute) => normalizeOption(attribute.name) === normalizeOption(name),
  )?.option
}

function optionMatches(apiValue, candidates) {
  const normalizedApiValue = normalizeOption(apiValue)
  return candidates.some((candidate) => normalizeOption(candidate) === normalizedApiValue)
}

function formatWooPrice(price) {
  if (price === undefined || price === null || price === "") return null

  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) return price

  return formatUsd.format(numericPrice)
}

export default function Configurator({ product, onBack, onCheckout }) {
  const [metal, setMetal] = useState(product?.metal || "rose")
  const [stone, setStone] = useState(product?.stone || "round")
  const [variations, setVariations] = useState([])
  const [isLoadingVariations, setIsLoadingVariations] = useState(true)
  const [variationError, setVariationError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadVariations() {
      try {
        setIsLoadingVariations(true)
        setVariationError("")

        const response = await fetch(WOO_VARIATIONS_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`WooCommerce returned ${response.status}`)
        }

        const data = await response.json()
        setVariations(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setVariationError(error.message || "Unable to load variations")
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingVariations(false)
        }
      }
    }

    loadVariations()

    return () => controller.abort()
  }, [])

  const estimate = useMemo(() => {
    const base = product?.basePrice || 4200
    return base + METAL_META[metal].price + STONE_META[stone].price
  }, [metal, product?.basePrice, stone])

  const matchedVariation = useMemo(() => {
    const metalCandidates = [
      METAL_META[metal].wooOption,
      METAL_META[metal].short,
      METAL_META[metal].label,
    ]
    const stoneCandidates = [
      STONE_META[stone].wooOption,
      STONE_META[stone].label,
      ...STONE_META[stone].aliases,
    ]

    return variations.find((variation) => {
      const variationMetal = getVariationAttribute(variation, "Metal")
      const variationStone = getVariationAttribute(variation, "Stone")

      return (
        optionMatches(variationMetal, metalCandidates) &&
        optionMatches(variationStone, stoneCandidates)
      )
    })
  }, [metal, stone, variations])

  const wooPrice = formatWooPrice(matchedVariation?.price)
  const summaryPrice = wooPrice || formatUsd.format(estimate)
  const hasLiveMatch = Boolean(matchedVariation)

  function continueToCheckout() {
    if (!matchedVariation) return

    onCheckout({
      product,
      metal,
      stone,
      variation: matchedVariation,
      price: wooPrice || summaryPrice,
    })
  }

  return (
    <div className="config-page">
      <section className="config-viewer" aria-label="3D ring preview">
        <div className="config-toolbar">
          <button className="icon-button" onClick={onBack} aria-label="Back to collection">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="viewer-hint">Drag to inspect / scroll to zoom</span>
        </div>

        <div className="config-canvas">
          <Canvas dpr={[1, 1.7]} camera={{ position: [0, 0.12, 4.2], fov: 34 }}>
            <color attach="background" args={["#050505"]} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 5, 5]} intensity={4.5} />
            <directionalLight position={[-5, 0, -4]} intensity={1.1} color="#8ad8df" />
            <Stage intensity={0.18} adjustCamera={false} environment={null}>
              <Ring3D metal={metal} stone={stone} autoRotate rotationSpeed={0.0016} />
            </Stage>
            <Environment preset="city" />
            <OrbitControls enablePan={false} minDistance={2.7} maxDistance={6.2} />
          </Canvas>
        </div>
        <div className="noise" />
      </section>

      <aside className="config-panel">
        <p className="eyebrow">Product configurator</p>
        <h1 className="config-title">
          {product?.name || "Custom Ring"} <span>studio.</span>
        </h1>
        <p className="config-subtitle">
          {product?.subtitle || "Tune your material, cut, and estimate in real time."}
        </p>

        <section className="config-group">
          <p className="config-label">
            Metal <span>{METAL_META[metal].label}</span>
          </p>
          <div className="metal-options">
            {METALS.map((item) => (
              <button
                className={`metal-button ${metal === item ? "is-active" : ""}`}
                key={item}
                onClick={() => setMetal(item)}
                aria-label={METAL_META[item].label}
              >
                <span
                  className="swatch"
                  style={{
                    background: METAL_META[item].color,
                    boxShadow: metal === item
                      ? `0 0 24px ${METAL_META[item].glow}`
                      : undefined,
                  }}
                />
                <span>{METAL_META[item].short}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="config-group">
          <p className="config-label">
            Stone cut <span>{STONE_LABELS[stone]}</span>
          </p>
          <div className="stone-options">
            {STONES.map((item) => (
              <button
                className={`option-button ${stone === item ? "is-active" : ""}`}
                key={item}
                onClick={() => setStone(item)}
              >
                <strong>{STONE_META[item].label}</strong>
                <span>{STONE_META[item].profile}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="config-group summary">
          <div className="summary-row">
            <span>Design</span>
            <strong>{product?.name || "Custom Ring"}</strong>
          </div>
          <div className="summary-row">
            <span>Metal</span>
            <strong>{METAL_META[metal].label}</strong>
          </div>
          <div className="summary-row">
            <span>Stone cut</span>
            <strong>{STONE_LABELS[stone]}</strong>
          </div>
          <div className="summary-row summary-total">
            <span>{wooPrice ? "Quote price" : "Estimated from"}</span>
            <strong>{isLoadingVariations ? "Loading..." : summaryPrice}</strong>
          </div>
          <div className="summary-row">
            <span>Product ID</span>
            <strong>
              {isLoadingVariations
                ? "Checking"
                : matchedVariation
                  ? `Variation #${matchedVariation.id}`
                  : "Not found"}
            </strong>
          </div>
        </section>

        {variationError && (
          <p className="integration-status is-error">
            WooCommerce unavailable: {variationError}
          </p>
        )}

        <div className="panel-actions">
          <button
            className="primary-button"
            disabled={!hasLiveMatch}
            onClick={continueToCheckout}
          >
            {hasLiveMatch ? "Continue to Checkout" : "Select Available Combo"}
          </button>
          <button className="ghost-button">Book Studio Call</button>
        </div>
      </aside>
    </div>
  )
}
