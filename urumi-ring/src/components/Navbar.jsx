import { useEffect, useState } from "react"
import { BRAND, NAV_LINKS } from "../data/constants"

export default function Navbar({ page, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <button className="brand-button" onClick={() => onNavigate("home")}>
        <span className="brand-mark">U</span>
        <span className="brand-name">{BRAND.name}</span>
      </button>

      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <button
            className="nav-link"
            key={link}
            onClick={() => onNavigate("home")}
          >
            {link}
          </button>
        ))}
        <button
          className={page === "store" ? "primary-button" : "ghost-button"}
          onClick={() => onNavigate("store")}
        >
          Collections
        </button>
      </div>
    </nav>
  )
}
