import { useEffect, useState } from "react"
import { BRAND } from "../data/constants"

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    onScroll()

    window.addEventListener("scroll", onScroll)

    return () =>
      window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`navbar ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <button
        className="brand-button"
        onClick={() => onNavigate("home")}
      >
        <span className="brand-mark">U</span>

        <span className="brand-name">
          {BRAND.name}
        </span>
      </button>

      <div className="nav-links">
        <button
          className="primary-button"
          onClick={() =>
            onNavigate("configurator")
          }
        >
          Configure Ring
        </button>
      </div>
    </nav>
  )
}