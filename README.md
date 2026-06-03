<div align="center">

# 💍 Ring Studio

**An interactive 3D jewellery configurator — built with Three.js and headless WooCommerce**

<h1>
    <center>
        <a href="https://chandradithya.dev/ringstudio/">Live Demo</a>
    </center>
</h1>
</div>

---

## What is Ring Studio?

Ring Studio lets shoppers **see exactly what they're buying before they buy it**. Instead of browsing static product photos, customers interact with a photorealistic 3D ring model directly in their browser — rotating it, swapping metals, changing stones — while live pricing and inventory data update in real time from a WooCommerce backend.

No page reloads. No laggy spinners. Just a seamless, tactile-feeling configurator on the web.

---

## Architecture

```
┌────────────────────────┐     REST API      ┌───────────────────────┐     WP REST     ┌───────────────────────────┐
│  Interactive 3D UI     │ ◄───────────────► │  API Bridge Layer     │ ◄─────────────► │  Headless WooCommerce     │
│                        │                   │                       │                 │                           │
│  Three.js / R3F        │                   │  Async fetch/debounce │                 │  Products & Variations    │
│  WebGL canvas          │                   │  Optimistic UI updates│                 │  Live pricing             │
│  Orbit controls        │                   │  Payload serialisation│                 │  Inventory levels         │
│  Material swapping     │                   │                       │                 │  Cart & checkout          │
└────────────────────────┘                   └───────────────────────┘                 └───────────────────────────┘
        Vercel (frontend)                                                                  WordPress + WooCommerce
```

### Three layers at a glance

| Layer | Tech | Responsibility |
|---|---|---|
| **Frontend** | Three.js / React Three Fiber, JavaScript, CSS | 3D scene, user interactions, UI state |
| **API Bridge** | REST / JSON | Serialises selections, talks to WooCommerce, debounces requests |
| **Backend** | WordPress + WooCommerce REST API | Source of truth for products, prices, stock, orders |

---

## Features

- 🔄 **Real-time 3D visualisation** — WebGL-rendered ring with full orbit, zoom, and pan
- 💛 **Metal & finish swapping** — Yellow gold, white gold, rose gold, platinum — one click
- 💎 **Stone customisation** — Change gem type and carat weight; model updates instantly
- 💰 **Live pricing** — WooCommerce variation prices fetched on every selection change
- 🚫 **Inventory-aware UI** — Out-of-stock combos disabled before the user reaches cart
- ⚡ **No page reloads** — Async REST calls keep the experience fluid
- 🐳 **Docker Compose** — Full local stack (frontend + backend) in one command
- 🚀 **Vercel deployment** — Automatic frontend deploys on every push to `main`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- A WooCommerce store with REST API credentials

### Quick Start (Docker)

```bash
# 1 — Clone
git clone https://github.com/JVSCHANDRADITHYA/ring-studio.git
cd ring-studio

# 2 — Configure environment
cp urumi-ring/.env.example urumi-ring/.env
# Edit .env and fill in your WooCommerce details (see Configuration below)

# 3 — Launch
cd urumi-ring
npm run dev

# 4 — Open
# Frontend → http://localhost:5173
```

### Manual Setup (frontend only)

```bash
cd urumi-ring
npm install
npm run dev
```

---

## Configuration

Create `urumi-ring/.env` from the example and set the following:

```env
# WooCommerce REST API
WOOCOMMERCE_URL=https://your-store.com
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx

# Optional
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

> **Where to find WooCommerce keys:** WP Admin → WooCommerce → Settings → Advanced → REST API → Add key

---

## Project Structure

```
ring-studio/
├── docker-compose.yml        # Orchestrates frontend + backend containers
├── .gitignore
└── urumi-ring/               # Main application
    ├── public/               # Static assets (GLTF models, textures)
    ├── src/
    │   ├── components/       # React components (configurator, canvas, UI)
    │   ├── hooks/            # Custom hooks (useConfigurator, usePricing …)
    │   ├── lib/              # WooCommerce API client, helpers
    │   └── styles/           # CSS modules
    ├── package.json
    └── .env.example
```

---

## How It Works

1. **User opens the configurator** — Three.js loads the GLTF ring model and renders it in a WebGL canvas.
2. **User picks a metal** — a React state update swaps the mesh material client-side (zero network call).
3. **User picks a stone** — same instant local swap, then a debounced REST call fires to WooCommerce.
4. **WooCommerce responds** with the variation price and stock status for that exact combination.
5. **UI updates** — price badge animates to the new value; out-of-stock options grey out.
6. **User clicks "Add to Cart"** — the WooCommerce cart endpoint is called; standard checkout follows.

---

## Tech Stack

| | Technology | Version |
|---|---|---|
| 3D Engine | Three.js / React Three Fiber | latest |
| Language | JavaScript (ES6+) | — |
| Styling | CSS Modules | — |
| Commerce | WooCommerce REST API | v3 |
| Containerisation | Docker Compose | v3.8 |
| Hosting | Vercel | — |

---

## Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd urumi-ring
vercel --prod
```

Set the same environment variables under **Project → Settings → Environment Variables** in the Vercel dashboard.

### Backend → Any WordPress host

The WooCommerce backend can be hosted on any standard WordPress host. Point `WOOCOMMERCE_URL` at your store and the frontend will connect automatically.

---

## Contributing

Contributions are welcome!

```bash
# Fork → clone → branch
git checkout -b feature/my-cool-thing

# Make changes, then
git commit -m "feat: add my cool thing"
git push origin feature/my-cool-thing
# Open a Pull Request on GitHub
```

Please keep PRs focused. For large changes, open an issue first to discuss.

---

## Roadmap

- [ ] AR preview (WebXR)
- [ ] Side-by-side comparison view
- [ ] Save & share configuration links
- [ ] GraphQL backend (replacing REST)
- [ ] Engraving text preview on 3D model

---

## License

This project is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/JVSCHANDRADITHYA">JVSCHANDRADITHYA</a>
</div>