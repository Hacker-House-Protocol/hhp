"use client"

import { useEffect, useRef } from "react"

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Matrix characters - symbols and numbers only
    const chars = "0123456789!@#$%&*<>[]{}+=?:;~"
    const charArray = chars.split("")

    // Responsive font size: bigger on desktop
    const isMobile = window.innerWidth < 768
    const fontSize = isMobile ? 22 : 28
    let columns = 0
    let drops: number[] = []

    // Set canvas size and recalculate columns
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      canvas.width = parent ? parent.offsetWidth : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
      columns = Math.floor(canvas.width / fontSize)

      // Reinitialize drops array for new column count
      const newDrops: number[] = []
      for (let i = 0; i < columns; i++) {
        newDrops[i] = drops[i] !== undefined ? drops[i] : Math.random() * -50
      }
      drops = newDrops
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = "rgba(20, 10, 50, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text style
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Vary character brightness
        const rand = Math.random()
        if (rand > 0.98) {
          ctx.fillStyle = "rgba(110, 231, 110, 0.6)"
        } else if (rand > 0.95) {
          ctx.fillStyle = "rgba(180, 150, 255, 0.5)"
        } else {
          ctx.fillStyle = "rgba(139, 120, 230, 0.35)"
        }

        ctx.fillText(char, x, y)

        // Reset drop to top randomly after passing screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += 0.5 + Math.random() * 0.3
      }
    }

    const interval = setInterval(draw, 45)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
