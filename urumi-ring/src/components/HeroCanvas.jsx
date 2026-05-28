import { useEffect, useRef } from "react"

const TOTAL_FRAMES = 76

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
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

      context.clearRect(0, 0, canvas.width, canvas.height)

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      const imageWidth = image.width
      const imageHeight = image.height

const scale = Math.max(
  canvasWidth / imageWidth,
  canvasHeight / imageHeight
) * 1.02

      const width = imageWidth * scale
      const height = imageHeight * scale

const x = (canvasWidth - width) / 2
const y = (canvasHeight - height) / 2 + 20

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
      const scrollTop = window.scrollY

      const heroSection = document.querySelector(".hero-section")

      const maxScroll =
        heroSection.offsetHeight - window.innerHeight

      const scrollFraction = scrollTop / maxScroll

const targetFrame = scrollFraction * (TOTAL_FRAMES - 1)

currentFrameIndex = Math.round(targetFrame)

      requestAnimationFrame(render)
    }

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="hero-canvas">
      <canvas ref={canvasRef} />
    </div>
  )
}