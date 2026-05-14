<template>
  <canvas ref="canvasRef" class="compass-field-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const canvasRef = ref(null)
let animationId = null
let ctx = null
let w = 0, h = 0
let mouse = { x: -999, y: -999 }
const spacing = 30

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const parent = canvas?.parentElement
  if (!parent || !canvas) return
  
  const rect = parent.getBoundingClientRect()
  w = rect.width
  h = rect.height
  canvas.width = w
  canvas.height = h
}

const drawArrow = (x, y, angle) => {
  if (!ctx) return
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.beginPath()
  ctx.moveTo(-8, 0)
  ctx.lineTo(8, 0)
  ctx.lineTo(3, -4)
  ctx.moveTo(8, 0)
  ctx.lineTo(3, 4)
  ctx.stroke()
  ctx.restore()
}

const animate = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(124,255,203,0.8)'
  ctx.lineWidth = 1.5
  
  for (let y = 25; y < h; y += spacing) {
    for (let x = 25; x < w; x += spacing) {
      const dx = mouse.x - x
      const dy = mouse.y - y
      const angle = Math.atan2(dy, dx)
      drawArrow(x, y, angle)
    }
  }
  
  animationId = requestAnimationFrame(animate)
}

// Usar window para capturar movimento do mouse em qualquer lugar
const handleMouseMove = (e) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  // Verificar se o mouse está sobre a seção
  const parent = canvas.parentElement
  if (parent) {
    const parentRect = parent.getBoundingClientRect()
    if (e.clientX >= parentRect.left && e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top && e.clientY <= parentRect.bottom) {
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    } else {
      mouse = { x: -999, y: -999 }
    }
  }
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
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    animate()
    
    onBeforeUnmount(() => {
      if (animationId) cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    })
  })
})
</script>

<style scoped>
.compass-field-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none; /* Deixa os cliques passarem */
  background-color: black;
}
</style>