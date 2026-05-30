const API_URL = import.meta.env.STORE_API


export async function fetchProducts() {
  try {
    const response = await fetch(
      `${API_URL}`
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