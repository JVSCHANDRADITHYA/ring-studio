const WOO_API_BASE =
  import.meta.env.VITE_WOO_API_BASE ||
  "http://store-gmu7ud.13-203-68-186.sslip.io/wp-json/wc/v3"

const WOO_PRODUCT_ID = import.meta.env.VITE_WOO_PRODUCT_ID || "13"

const WOO_CONSUMER_KEY = import.meta.env.VITE_WOO_CONSUMER_KEY || ""
const WOO_CONSUMER_SECRET = import.meta.env.VITE_WOO_CONSUMER_SECRET || ""

function encode(value) {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
}

function randomNonce() {
  const values = new Uint32Array(4)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => value.toString(16)).join("")
}

function getQueryParams(url) {
  return Array.from(new URL(url).searchParams.entries())
}

function getOAuthParams() {
  if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
    throw new Error("Missing WooCommerce OAuth keys in .env")
  }

  return {
    oauth_consumer_key: WOO_CONSUMER_KEY,
    oauth_nonce: randomNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  }
}

async function hmacSha1(baseString, signingKey) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(baseString))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function createOAuthHeader(url, method) {
  const oauthParams = getOAuthParams()
  const parsedUrl = new URL(url)
  const baseUrl = `${parsedUrl.origin}${parsedUrl.pathname}`
  const signingParams = [
    ...getQueryParams(url),
    ...Object.entries(oauthParams),
  ]
    .map(([key, value]) => [encode(key), encode(value)])
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      if (leftKey === rightKey) return leftValue.localeCompare(rightValue)
      return leftKey.localeCompare(rightKey)
    })
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const baseString = [
    method.toUpperCase(),
    encode(baseUrl),
    encode(signingParams),
  ].join("&")
  const signingKey = `${encode(WOO_CONSUMER_SECRET)}&`
  const oauth_signature = await hmacSha1(baseString, signingKey)
  const headerParams = { ...oauthParams, oauth_signature }

  return `OAuth ${Object.entries(headerParams)
    .map(([key, value]) => `${encode(key)}="${encode(value)}"`)
    .join(", ")}`
}

async function readJsonResponse(response) {
  const text = await response.text()

  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`WooCommerce returned non-JSON content from ${response.url}`)
  }
}

async function wooFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${WOO_API_BASE}${path}`
  const method = options.method || "GET"
  const authorization = await createOAuthHeader(url, method)
  const response = await fetch(url, {
    ...options,
    method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      Authorization: authorization,
    },
  })
  const data = await readJsonResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || `WooCommerce returned ${response.status}`)
  }

  return data
}

export async function fetchWooVariations({ signal } = {}) {
  const data = await wooFetch(`/products/${WOO_PRODUCT_ID}/variations?per_page=100`, { signal })
  return Array.isArray(data) ? data : []
}

export async function createWooOrder({ form, item }) {
  return wooFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      status: "processing",
      billing: {
        first_name: form.firstName,
        last_name: form.lastName,
        address_1: form.address,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
        email: form.email,
        phone: form.phone,
      },
      customer_note: form.note,
      line_items: [
        {
          product_id: item.product.wooProductId || Number(WOO_PRODUCT_ID),
          variation_id: item.variation.id,
          quantity: 1,
        },
      ],
    }),
  })
}
