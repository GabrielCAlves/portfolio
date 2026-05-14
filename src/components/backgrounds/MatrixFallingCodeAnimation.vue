<template>
  <canvas ref="canvasRef" class="matrix-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const canvasRef = ref(null)
let animationId = null
let ctx = null
let drops = []
let canvasWidth = 0
let canvasHeight = 0
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const lettersArray = letters.split("")
const fontSize = 18

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const parent = canvas?.parentElement
  if (!parent || !canvas) return
  
  const rect = parent.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  
  const columns = Math.floor(canvasWidth / fontSize)
  drops = Array(columns).fill(0)
}

const draw = () => {
  if (!ctx) return
  ctx.fillStyle = "rgba(0,0,0,0.05)"
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = "#0aff0a"
  ctx.font = `${fontSize}px "Courier New", monospace`
  
  for (let i = 0; i < drops.length; i++) {
    const text = lettersArray[Math.floor(Math.random() * lettersArray.length)]
    const x = i * fontSize
    const y = drops[i] * fontSize
    if (y > 0 && y < canvasHeight) {
      ctx.fillText(text, x, y)
    }
    
    if (drops[i] * fontSize > canvasHeight || Math.random() > 0.975) {
      drops[i] = 0
    }
    drops[i]++
  }
  
  animationId = requestAnimationFrame(draw)
}

const handleResize = () => {
  updateCanvasSize()
}

onMounted(() => {
  nextTick(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    updateCanvasSize()
    
    const resizeObserver = new ResizeObserver(() => updateCanvasSize())
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
    
    window.addEventListener('resize', handleResize)
    draw()
    
    onBeforeUnmount(() => {
      if (animationId) cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    })
  })
})
</script>

<style scoped>
.matrix-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
  background: #000;
}
</style>