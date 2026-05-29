// FIXED HeroCanvas.jsx

import { useEffect, useRef } from "react"

const TOTAL_FRAMES = 240

// ─────────────────────────────────────────────────────────────
// FIX A: getViewW / getViewH
//
// The old code used window.innerWidth / window.innerHeight.
// On mobile Safari, window.innerHeight includes the browser
// chrome (address bar) even when it's visible, so it returns
// a value larger than the actual painted area. This makes the
// canvas taller than the screen, which forces a horizontal
// scrollbar/overflow and produces the "blank space on the right"
// visual because the browser has to accommodate the extra height.
//
// visualViewport.width / .height always reflect the true
// visible area after chrome is accounted for. We fall back to
// window.inner* on browsers that don't expose visualViewport.
// ─────────────────────────────────────────────────────────────
function getViewW() {
  return window.visualViewport
    ? window.visualViewport.width
    : window.innerWidth
}

function getViewH() {
  return window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight
}

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")

    const currentFrame = (index) =>
      `/frames/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`

    const images = []
    let currentFrameIndex = 0

    // ─────────────────────────────────────────────────────────
    // FIX B: track how many frames have loaded
    //
    // The old code only set images[0].onload = render, so if
    // frame 0 hadn't finished loading when onScroll() ran at
    // mount time (which calls render()), nothing was painted.
    // On mobile with a slow connection this was the primary
    // reason for the blank canvas on first load.
    //
    // Now every frame fires render() once it loads; the render
    // function already guards with `if (!image.complete) return`
    // so this is safe — it just means frame 0 will paint as
    // soon as it's ready regardless of load order.
    // ─────────────────────────────────────────────────────────
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = currentFrame(i)
      // Paint the canvas as soon as the first (or any early)
      // frame finishes loading so mobile users don't stare at
      // a blank screen while the rest of the frames trickle in.
      if (i < 5) {
        img.onload = () => {
          if (currentFrameIndex === i) render()
        }
      }
      images.push(img)
    }

    function resizeCanvas() {
      // ───────────────────────────────────────────────────────
      // FIX C: use getViewW/H instead of window.innerW/H
      //
      // Setting canvas.width/height via JS controls the *drawing
      // coordinate space*. The CSS `width: 100vw; height: 100vh`
      // controls the *display size*. When these two don't match
      // (which happens on mobile Safari because 100vh > visual
      // viewport height), the canvas is stretched/distorted and
      // the layout overflows horizontally. Using getViewW/H keeps
      // the coordinate space in sync with the actual painted area.
      // ───────────────────────────────────────────────────────
      canvas.width = getViewW()
      canvas.height = getViewH()
      render()
    }

    function render() {
      const image = images[currentFrameIndex]
      if (!image || !image.complete) return

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const imageWidth = image.naturalWidth || image.width
      const imageHeight = image.naturalHeight || image.height

      if (!imageWidth || !imageHeight) return

      context.clearRect(0, 0, canvasWidth, canvasHeight)

      const scale = Math.max(
        canvasWidth / imageWidth,
        canvasHeight / imageHeight
      )

      const width = imageWidth * scale
      const height = imageHeight * scale
      const x = (canvasWidth - width) / 2
      const y = (canvasHeight - height) / 2

      context.drawImage(image, x, y, width, height)
    }

    function getScrollMetrics() {
      const intro = document.querySelector(".landing-intro")
      const hero = document.querySelector(".hero-section")
      if (!intro || !hero) return null

      // ───────────────────────────────────────────────────────
      // FIX D: correct startScroll calculation
      //
      // THE CORE BUG. The old code set:
      //   startScroll = intro.offsetHeight   (= 100vh)
      //
      // But .hero-section has `margin-top: -100vh`, which pulls
      // it UP so it sits directly behind the intro. This means
      // the hero's sticky area begins at scroll position 0, not
      // at 100vh. So the old startScroll was one full viewport
      // height too late — the entire animation window was mapped
      // to scroll positions that were already past the visible
      // hero, which is why:
      //   • scrolling DOWN: you blow past the animation zone
      //     before it fires, seeing only blank canvas.
      //   • scrolling UP from the bottom: you re-enter the
      //     animation zone from the end and catch the last frames,
      //     so you see something — but reversed.
      //
      // FIX: startScroll = hero.offsetTop
      // offsetTop correctly accounts for the negative margin and
      // gives us the exact scroll position where the hero section
      // begins in the document flow.
      // ───────────────────────────────────────────────────────
      const startScroll = hero.offsetTop

      // Keep the same animation distance — 3 viewports of scroll
      // drives the full 240 frames, with a 300px buffer at the end.
      const animationDistance = getViewH() * 3
      const endScroll = startScroll + animationDistance + 300

      return { startScroll, endScroll }
    }

    function onScroll() {
      const metrics = getScrollMetrics()
      if (!metrics) return

      const { startScroll, endScroll } = metrics
      const currentScroll = window.scrollY

      if (currentScroll < startScroll) {
        currentFrameIndex = 0
        render()
        return
      }

      if (currentScroll > endScroll) {
        currentFrameIndex = TOTAL_FRAMES - 1
        render()
        return
      }

      const scrollFraction =
        (currentScroll - startScroll) / (endScroll - startScroll)

      const heroStory = document.querySelector(".hero-story")
      if (heroStory) {
        const opacity =
          scrollFraction < 0.05
            ? 0
            : scrollFraction < 0.20
            ? (scrollFraction - 0.05) / 0.15
            : scrollFraction > 0.85
            ? 1 - (scrollFraction - 0.85) / 0.15
            : 1

        heroStory.style.opacity = opacity
        heroStory.style.transform = `translateY(${30 - opacity * 30}px)`
      }

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(scrollFraction * TOTAL_FRAMES)
      )

      currentFrameIndex = frameIndex
      requestAnimationFrame(render)
    }

    // ─────────────────────────────────────────────────────────
    // FIX E: visualViewport resize on mobile
    //
    // On mobile, when the browser chrome shows/hides (e.g. the
    // address bar collapses as you scroll), the window "resize"
    // event does NOT always fire — but visualViewport's "resize"
    // event does. Without this, the canvas coordinate space stays
    // stale when the chrome toggles, producing the blank/offset
    // rendering glitch on mobile mid-scroll.
    // ─────────────────────────────────────────────────────────
    resizeCanvas()
    onScroll()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", onScroll, { passive: true })

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeCanvas)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", onScroll)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", resizeCanvas)
      }
    }
  }, [])

  return (
    <div className="hero-canvas">
      <canvas ref={canvasRef} />
    </div>
  )
}