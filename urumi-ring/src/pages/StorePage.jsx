import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import Ring3D from "../components/Ring3D"
import { METAL_META, PRODUCTS, STONE_LABELS } from "../data/constants"

function StoreProductCard({ product, onConfigure }) {
  return (
    <article className="product-card">
      <div className="product-visual">
        <div className="card-canvas">
          <Canvas dpr={[1, 1.45]} camera={{ position: [0, 0.1, 4], fov: 34 }}>
            <ambientLight intensity={0.38} />
            <directionalLight position={[3, 5, 4]} intensity={4.4} />
            <directionalLight position={[-3, 1, -3]} intensity={0.8} color="#8ad8df" />
            <Ring3D
              metal={product.metal}
              stone={product.stone}
              autoRotate
              rotationSpeed={0.0028}
            />
            <Environment preset="studio" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
        <span className="product-badge">{product.tag}</span>
      </div>

      <div className="product-body">
        <div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-meta">{product.subtitle}</p>
        </div>
        <p className="product-description">{product.description}</p>
        <p className="product-meta">
          {METAL_META[product.metal].label} / {STONE_LABELS[product.stone]}
        </p>
        <div className="product-footer">
          <span className="price">{product.price}</span>
          <button className="chip-button" onClick={() => onConfigure(product)}>
            Configure
          </button>
        </div>
      </div>
    </article>
  )
}

export default function StorePage({ onConfigure }) {
  return (
    <div className="store-page">
      <header className="store-hero">
        <div className="section-inner">
          <p className="eyebrow">Collections</p>
          <h1 className="section-title">
            Four starting points, <span>one configurator.</span>
          </h1>
          <p className="section-copy">
            Select a ring to open the 3D configurator with its metal and stone
            preloaded. Every choice can be changed before quote request.
          </p>
        </div>
      </header>

      <section className="store-grid">
        {PRODUCTS.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            onConfigure={onConfigure}
          />
        ))}
      </section>
    </div>
  )
}
