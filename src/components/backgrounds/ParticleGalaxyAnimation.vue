<template>
  <canvas ref="canvasRef" class="galaxy-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const canvasRef = ref(null)
let animationId = null
let ctx = null
let w = 0, h = 0
let particles = []
let mouse = { x: null, y: null }
const numParticles = 700

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.radius = Math.random() * 2.5 + 1
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`
    this.speedX = (Math.random() - 0.5) * 0.8
    this.speedY = (Math.random() - 0.5) * 0.8
  }
  
  move(bounds) {
    this.x += this.speedX
    this.y += this.speedY
    if (this.x < 0) { this.x = 0; this.speedX *= -1 }
    if (this.x > bounds.w) { this.x = bounds.w; this.speedX *= -1 }
    if (this.y < 0) { this.y = 0; this.speedY *= -1 }
    if (this.y > bounds.h) { this.y = bounds.h; this.speedY *= -1 }
  }
  
  draw() {
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const parent = canvas?.parentElement
  if (!parent || !canvas) return
  
  const rect = parent.getBoundingClientRect()
  w = rect.width
  h = rect.height
  canvas.width = w
  canvas.height = h
  
  initParticles()
}

const connectParticles = () => {
  if (!ctx) return
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.strokeStyle = `rgba(255, 255, 255, 0.35)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}

const initParticles = () => {
  particles = []
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(w || 500, h || 500))
  }
}

const animate = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, w, h)
  
  ctx.fillStyle = 'rgba(13, 13, 26, 0.1)'
  ctx.fillRect(0, 0, w, h)
  
  for (let particle of particles) {
    particle.move({ w, h })
    particle.draw()
    
    if (mouse.x && mouse.y) {
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        particle.x += dx * 0.01
        particle.y += dy * 0.01
      }
    }
  }
  connectParticles()
  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const parent = canvas.parentElement
  if (parent) {
    const parentRect = parent.getBoundingClientRect()
    if (e.clientX >= parentRect.left && e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top && e.clientY <= parentRect.bottom) {
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    } else {
      mouse.x = null
      mouse.y = null
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
.galaxy-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, #0d0d1a, #000);
}
</style>