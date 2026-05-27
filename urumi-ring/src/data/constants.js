export const BRAND = {
  name: "URUMI",
  tagline: "Crafted in Motion",
  sub: "Bespoke fine jewellery, rendered in real time",
}

export const METALS = ["white", "yellow", "rose", "platinum", "palladium"]

export const METAL_META = {
  white: {
    label: "White Gold",
    short: "White",
    color: "#e8e5df",
    glow: "rgba(232, 229, 223, 0.5)",
    price: 0,
  },
  yellow: {
    label: "Yellow Gold",
    short: "Yellow",
    color: "#d7ad4d",
    glow: "rgba(215, 173, 77, 0.6)",
    price: 280,
  },
  rose: {
    label: "Rose Gold",
    short: "Rose",
    color: "#d99a8a",
    glow: "rgba(217, 154, 138, 0.58)",
    price: 220,
  },
  platinum: {
    label: "Platinum",
    short: "Plat.",
    color: "#ccd1d8",
    glow: "rgba(204, 209, 216, 0.5)",
    price: 720,
  },
  palladium: {
    label: "Palladium",
    short: "Pallad.",
    color: "#b7bcc3",
    glow: "rgba(183, 188, 195, 0.45)",
    price: 460,
  },
}

export const STONES = ["round", "oval", "pear", "princess"]

export const STONE_LABELS = {
  round: "Brilliant",
  oval: "Oval",
  pear: "Pear",
  princess: "Princess",
}

export const STONE_META = {
  round: { label: "Brilliant", profile: "Maximum fire", price: 0 },
  oval: { label: "Oval", profile: "Elongated glow", price: 620 },
  pear: { label: "Pear", profile: "Soft asymmetry", price: 480 },
  princess: { label: "Princess", profile: "Clean geometry", price: 760 },
}

export const PRODUCTS = [
  {
    id: "eternal-solitaire",
    name: "Eternal Solitaire",
    subtitle: "Round brilliant, 1.2 ct",
    price: "From $4,200",
    basePrice: 4200,
    tag: "Bestseller",
    description:
      "A refined solitaire with a low cathedral lift, polished prongs, and a stone-forward silhouette.",
    metal: "rose",
    stone: "round",
    glb: "/ring_4.glb",
  },
  {
    id: "lumen-oval",
    name: "Lumen Oval",
    subtitle: "Oval cut, 1.5 ct",
    price: "From $5,800",
    basePrice: 5800,
    tag: "New",
    description:
      "An elongated center stone set on a tapered band for a clean, modern proportion.",
    metal: "yellow",
    stone: "oval",
    glb: "/ring_4.glb",
  },
  {
    id: "arabesque-pear",
    name: "Arabesque Pear",
    subtitle: "Pear cut, 1.0 ct",
    price: "From $3,900",
    basePrice: 3900,
    tag: "Atelier",
    description:
      "A graceful pear profile designed for directional sparkle and a delicate hand feel.",
    metal: "white",
    stone: "pear",
    glb: "/ring_4.glb",
  },
  {
    id: "empress-princess",
    name: "Empress Princess",
    subtitle: "Princess cut, 1.8 ct",
    price: "From $6,500",
    basePrice: 6500,
    tag: "Limited",
    description:
      "Crisp geometry, high brilliance, and a platinum-forward design language.",
    metal: "platinum",
    stone: "princess",
    glb: "/ring_4.glb",
  },
]

export const NAV_LINKS = ["Studio", "Materials", "Reviews"]

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Choose",
    body: "Start from a signature design and tune the metal and stone cut in real time.",
  },
  {
    num: "02",
    title: "Inspect",
    body: "Rotate, zoom, and compare finishes before a specialist prepares the quote.",
  },
  {
    num: "03",
    title: "Craft",
    body: "Your final selection is hand-finished, stone-set, and certified by the atelier.",
  },
]

export const TESTIMONIALS = [
  {
    quote:
      "The 3D preview made the decision feel calm. I could see the metal and stone together before committing.",
    author: "Priya M.",
    location: "Mumbai",
  },
  {
    quote:
      "It felt like a studio appointment online: precise, visual, and beautifully easy to navigate.",
    author: "Clara T.",
    location: "London",
  },
  {
    quote:
      "We configured the ring together in minutes, then refined the final details with the atelier.",
    author: "Anika R.",
    location: "Dubai",
  },
]
