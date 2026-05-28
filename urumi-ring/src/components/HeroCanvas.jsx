// FULL HeroCanvas.jsx
// REPLACE ENTIRE FILE

import { useEffect, useRef } from "react"

const TOTAL_FRAMES = 240

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

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = currentFrame(i)
      images.push(img)
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      render()
    }

    function render() {
      const image = images[currentFrameIndex]

      if (!image || !image.complete) return

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      const imageWidth = image.width
      const imageHeight = image.height

      // MUCH better scaling
      const scale = Math.min(
        canvasWidth / imageWidth,
        canvasHeight / imageHeight
      ) * 0.95

      const width = imageWidth * scale
      const height = imageHeight * scale

      // centered properly
      const x = (canvasWidth - width) / 2
      const y = (canvasHeight - height) / 2 + 30

      context.drawImage(
        image,
        x,
        y,
        width,
        height
      )
    }

    images[0].onload = render

    function onScroll() {
      const intro =
        document.querySelector(".landing-intro")

      const hero =
        document.querySelector(".hero-section")

      if (!intro || !hero) return

      // animation starts AFTER intro exits
      const startScroll = intro.offsetHeight

      // total animation distance
      const endScroll =
        startScroll +
        hero.offsetHeight -
        window.innerHeight

      const currentScroll = window.scrollY

      // BEFORE animation start
      if (currentScroll < startScroll) {
        currentFrameIndex = 0
        render()
        return
      }

      // AFTER animation end
      if (currentScroll > endScroll) {
        currentFrameIndex = TOTAL_FRAMES - 1
        render()
        return
      }

      // animation progress
      const scrollFraction =
        (currentScroll - startScroll) /
        (endScroll - startScroll)

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(
          scrollFraction * TOTAL_FRAMES
        )
      )

      currentFrameIndex = frameIndex

      requestAnimationFrame(render)
    }

    resizeCanvas()

    window.addEventListener(
      "resize",
      resizeCanvas
    )

    window.addEventListener(
      "scroll",
      onScroll
    )

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      )

      window.removeEventListener(
        "scroll",
        onScroll
      )
    }
  }, [])

  return (
    <div className="hero-canvas">
      <canvas ref={canvasRef} />
    </div>
  )
}