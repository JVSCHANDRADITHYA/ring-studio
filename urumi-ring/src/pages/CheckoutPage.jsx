import { useState } from "react"
import { METAL_META, STONE_LABELS } from "../data/constants"

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  country: "IN",
  note: "",
}

const WOO_ORDERS_URL = "http://store-gmu7ud.13-203-68-186.sslip.io/wp-json/wc/v3/orders"

function getVariationAttribute(variation, name) {
  return variation?.attributes?.find(
    (attribute) => attribute.name?.toLowerCase() === name.toLowerCase(),
  )?.option
}

export default function CheckoutPage({ item, onBack, onHome }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState("")

  if (!item) {
    return (
      <div className="checkout-page">
        <section className="checkout-empty">
          <p className="eyebrow">Checkout</p>
          <h1 className="section-title">
            No ring selected <span>yet.</span>
          </h1>
          <button className="primary-button" onClick={onHome}>
            Return Home
          </button>
        </section>
      </div>
    )
  }

  const metalLabel = getVariationAttribute(item.variation, "Metal") || METAL_META[item.metal].label
  const stoneLabel = getVariationAttribute(item.variation, "Stone") || STONE_LABELS[item.stone]

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitOrder(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setOrderError("")

    try {
      const response = await fetch(WOO_ORDERS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
              product_id: item.product.wooProductId || 13,
              variation_id: item.variation.id,
              quantity: 1,
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `WooCommerce returned ${response.status}`)
      }

      setOrderNumber(data.number || data.id)
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      setOrderError(error.message || "Unable to place order")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="checkout-page">
      <header className="checkout-topbar">
        <button className="icon-button" onClick={onBack} aria-label="Back to configurator">
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
        <span className="brand-name">URUMI CHECKOUT</span>
      </header>

      <main className="checkout-layout">
        <section className="checkout-form-panel">
          <p className="eyebrow">Secure enquiry checkout</p>
          <h1 className="checkout-title">
            Finalise your <span>bespoke ring.</span>
          </h1>
          <p className="checkout-copy">
            Share your contact and delivery details. We support Guest Checkout, so no account creation is necessary. The atelier will follow up to confirm your order and arrange payment and delivery.
          </p>

          {submitted ? (
            <div className="checkout-success">
              <p className="eyebrow">Request received</p>
              <h2>Order {orderNumber}</h2>
              <p>
                Your configuration has been captured. The atelier can now follow
                up with payment and production details.
              </p>
              <button className="primary-button" onClick={onHome}>
                Back to Home
              </button>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={submitOrder}>
              <div className="field-grid">
                <label>
                  First name
                  <input name="firstName" value={form.firstName} onChange={updateField} required />
                </label>
                <label>
                  Last name
                  <input name="lastName" value={form.lastName} onChange={updateField} required />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  Email
                  <input name="email" type="email" value={form.email} onChange={updateField} required />
                </label>
                <label>
                  Phone
                  <input name="phone" value={form.phone} onChange={updateField} required />
                </label>
              </div>

              <label>
                Address
                <input name="address" value={form.address} onChange={updateField} required />
              </label>

              <div className="field-grid">
                <label>
                  City
                  <input name="city" value={form.city} onChange={updateField} required />
                </label>
                <label>
                  Postcode
                  <input name="postcode" value={form.postcode} onChange={updateField} required />
                </label>
              </div>

              <label>
                Country
                <input name="country" value={form.country} onChange={updateField} required />
              </label>

              <div className="payment-method-card">
                <div>
                  <span className="payment-radio" />
                  <strong>Cash on Delivery</strong>
                </div>
                <p>
                  Your order will be created as Cash on Delivery and
                  moved to processing for atelier fulfilment.
                </p>
              </div>

              <label>
                Order note
                <textarea
                  name="note"
                  value={form.note}
                  onChange={updateField}
                  rows="4"
                  placeholder="Ring size, delivery timing, engraving, or consultation notes"
                />
              </label>

              {orderError && (
                <p className="integration-status is-error">
                  Order failed: {orderError}
                </p>
              )}

              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Placing Order..." : "Place COD Order"}
              </button>
            </form>
          )}
        </section>

        <aside className="checkout-summary-panel">
          <p className="eyebrow">Order summary</p>
          <h2>{item.product?.name || "Custom Ring"}</h2>

          <div className="checkout-ring-preview">
            <div className="checkout-swatch" style={{ background: METAL_META[item.metal].color }} />
            <div>
              <strong>{metalLabel}</strong>
              <span>{stoneLabel} stone</span>
            </div>
          </div>

          <div className="summary checkout-summary">
            <div className="summary-row">
              <span>Variation</span>
              <strong>#{item.variation.id}</strong>
            </div>
            <div className="summary-row">
              <span>Metal</span>
              <strong>{metalLabel}</strong>
            </div>
            <div className="summary-row">
              <span>Stone</span>
              <strong>{stoneLabel}</strong>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <strong>{item.price}</strong>
            </div>
          </div>

          <p className="checkout-fineprint">
            This page finalizes your order. For further assistance, please contact our team. Payment method is Cash on Delivery only.
          </p>
        </aside>
      </main>
    </div>
  )
}
