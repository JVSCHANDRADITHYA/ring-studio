import { useState } from "react"
import Navbar from "./components/Navbar"
import Configurator from "./components/Configurator"
import { PRODUCTS } from "./data/constants"
import HomePage from "./pages/HomePage"
import StorePage from "./pages/StorePage"

export default function App() {
  const [page, setPage] = useState("home")
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0])

  function navigateTo(dest) {
    setPage(dest)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function openConfigurator(product = PRODUCTS[0]) {
    setSelectedProduct(product)
    setPage("configurator")
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="app-shell">
      {page !== "configurator" && (
        <Navbar page={page} onNavigate={navigateTo} />
      )}

      {page === "home" && (
        <HomePage
          featuredProduct={PRODUCTS[0]}
          onNavigate={navigateTo}
          onConfigure={openConfigurator}
        />
      )}

      {page === "store" && (
        <StorePage onConfigure={openConfigurator} />
      )}

      {page === "configurator" && (
        <Configurator product={selectedProduct} onBack={() => navigateTo("store")} />
      )}
    </main>
  )
}
