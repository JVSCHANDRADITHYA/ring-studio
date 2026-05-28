import { useState } from "react"
import Navbar from "./components/Navbar"
import Configurator from "./components/Configurator"
import { PRODUCTS } from "./data/constants"
import CheckoutPage from "./pages/CheckoutPage"
import HomePage from "./pages/HomePage"

export default function App() {
  const [page, setPage] = useState("home")

  const [selectedProduct, setSelectedProduct] =
    useState(PRODUCTS[0])

  const [checkoutItem, setCheckoutItem] =
    useState(null)

  function navigateTo(dest) {
    setPage(dest)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  function openConfigurator(
    product = PRODUCTS[0]
  ) {
    setSelectedProduct(product)

    setPage("configurator")

    window.scrollTo({
      top: 0,
    })
  }

  function openCheckout(item) {
    setCheckoutItem(item)

    setPage("checkout")

    window.scrollTo({
      top: 0,
    })
  }

  return (
    <main className="app-shell">
      {page !== "configurator" &&
        page !== "checkout" && (
          <Navbar
            page={page}
            onNavigate={navigateTo}
          />
        )}

      {page === "home" && (
        <HomePage
          featuredProduct={PRODUCTS[0]}
          onNavigate={navigateTo}
          onConfigure={openConfigurator}
        />
      )}

      {page === "configurator" && (
        <Configurator
          product={selectedProduct}

          // THIS IS THE IMPORTANT CHANGE
          onBack={() => navigateTo("home")}

          onCheckout={openCheckout}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          item={checkoutItem}
          onBack={() => {
            setPage("configurator")

            window.scrollTo({
              top: 0,
            })
          }}
          onHome={() =>
            navigateTo("home")
          }
        />
      )}
    </main>
  )
}