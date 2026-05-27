export const BRAND = {
  name: "LUMIÈRE",
  tagline: "Crafted in Light",
  sub: "Bespoke Fine Jewellery · Est. 2024",
}

export const METALS = ["white", "yellow", "rose", "platinum", "palladium"]

export const METAL_META = {
  white:     { label: "White Gold",  short: "White",   color: "#E4E4E4", glow: "rgba(228,228,228,0.55)" },
  yellow:    { label: "Yellow Gold", short: "Yellow",  color: "#D4AF37", glow: "rgba(212,175,55,0.65)"  },
  rose:      { label: "Rose Gold",   short: "Rose",    color: "#D89A8D", glow: "rgba(216,154,141,0.65)" },
  platinum:  { label: "Platinum",    short: "Plat.",   color: "#C9CCD3", glow: "rgba(201,204,211,0.55)" },
  palladium: { label: "Palladium",   short: "Pallad.", color: "#BFC2C6", glow: "rgba(191,194,198,0.5)"  },
}

export const STONES = ["round", "oval", "pear", "princess"]

export const STONE_LABELS = {
  round:    "Brilliant",
  oval:     "Oval",
  pear:     "Pear",
  princess: "Princess",
}

export const PRODUCTS = [
  {
    id: "eternal-solitaire",
    name: "Eternal Solitaire",
    subtitle: "Round Brilliant · 1.2ct",
    price: "From $4,200",
    tag: "Bestseller",
    description: "A timeless round brilliant solitaire, set in hand-polished 18k gold with perfectly symmetrical prongs that let light pour through the stone.",
    metal: "rose",
    stone: "round",
    glb: "/ring_4.glb",
  },
  {
    id: "lumiere-oval",
    name: "Lumière Oval",
    subtitle: "Oval Cut · 1.5ct",
    price: "From $5,800",
    tag: "New",
    description: "An elongated oval that flatters the finger. Set low in a cathedral band for an effortlessly modern silhouette.",
    metal: "yellow",
    stone: "oval",
    glb: "/ring_4.glb",
  },
  {
    id: "arabesque-pear",
    name: "Arabesque Pear",
    subtitle: "Pear Cut · 1.0ct",
    price: "From $3,900",
    tag: "Exclusive",
    description: "Inspired by Art Nouveau motifs — a pear-shaped stone suspended in a delicate pavé halo, evoking petals in bloom.",
    metal: "white",
    stone: "pear",
    glb: "/ring_4.glb",
  },
  {
    id: "empress-princess",
    name: "Empress Princess",
    subtitle: "Princess Cut · 1.8ct",
    price: "From $6,500",
    tag: "Limited",
    description: "Sharp corners. Maximum fire. The princess cut is geometry made breathtaking, seated in a four-claw platinum throne.",
    metal: "platinum",
    stone: "princess",
    glb: "/ring_4.glb",
  },
]

export const NAV_LINKS = ["Collections", "Bespoke", "Heritage", "Atelier"]

export const TESTIMONIALS = [
  {
    quote: "The moment I saw it in the configurator, I knew it was the one. Three weeks later it arrived — even more beautiful in person.",
    author: "Priya M.",
    location: "Mumbai",
  },
  {
    quote: "Lumière created our rings with a level of care I've never seen. Every detail discussed, every wish honoured.",
    author: "James & Clara T.",
    location: "London",
  },
  {
    quote: "I designed my own engagement ring — a dream I never thought possible. The 3D preview made it so real.",
    author: "Anika R.",
    location: "Dubai",
  },
]

export const PROCESS_STEPS = [
  { num: "01", title: "Envision", body: "Explore our configurator. Choose your metal, cut, and setting style in real-time 3D." },
  { num: "02", title: "Consult", body: "A dedicated Lumière atelier specialist contacts you within 24 hours to refine every detail." },
  { num: "03", title: "Craft", body: "Master goldsmiths hand-set your stone in our Jaipur atelier over 6–8 weeks." },
  { num: "04", title: "Receive", body: "Your ring arrives in a hand-stitched leather box with a lifetime craftsmanship certificate." },
]