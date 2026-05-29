const API_URL = "http://store-gmu7ud.13-203-68-186.sslip.io/wp-json/wc/v3/products"

const CONSUMER_KEY = "ck_xxxxx"
const CONSUMER_SECRET = "cs_xxxxx"

export async function fetchProducts() {
  try {
    const response = await fetch(
      `${API_URL}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
    )

    const rawProducts = await response.json()

    return rawProducts.map((product) => ({
      id: product.id,

      name: product.name,

      description:
        product.short_description ||
        product.description ||
        "Luxury custom jewelry",

      price: Number(product.price || 0),

      image:
        product.images?.[0]?.src ||
        "/placeholder.jpg",

      category:
        product.categories?.[0]?.name || "Ring",

      metal:
        product.attributes?.find(
          (a) => a.name.toLowerCase() === "metal"
        )?.options || [
          "Yellow Gold",
          "White Gold",
          "Rose Gold",
          "Platinum",
        ],

      stone:
        product.attributes?.find(
          (a) => a.name.toLowerCase() === "stone"
        )?.options || [
          "Round",
          "Oval",
          "Emerald",
          "Princess",
        ],

      modelUrl:
        product.meta_data?.find(
          (m) => m.key === "model_url"
        )?.value || null,
    }))
  } catch (err) {
    console.error("WooCommerce fetch failed:", err)

    return []
  }
}