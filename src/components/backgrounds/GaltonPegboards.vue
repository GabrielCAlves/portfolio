<template>
  <!-- Board da ESQUERDA -->
  <div ref="containerLeftRef" class="galton-container left"></div>
  
  <!-- Board da DIREITA -->
  <div ref="containerRightRef" class="galton-container right"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const containerLeftRef = ref(null)
const containerRightRef = ref(null)
let p5InstanceLeft = null
let p5InstanceRight = null

// ========== BOARD ESQUERDA ==========
const loadP5Left = () => {
  const container = containerLeftRef.value
  if (!container) return
  
  const parent = container.parentElement
  if (!parent) return
  
  if (!window.p5) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
    script.onload = () => initializeP5Left()
    document.head.appendChild(script)
  } else {
    initializeP5Left()
  }
}

const initializeP5Left = () => {
  const container = containerLeftRef.value
  const parent = container?.parentElement
  if (!container || !parent) return
  
  const sketch = (p) => {
    let numRows = 10
    let pegSpacing = 16
    let dropRate = 12
    let pegs = []
    let marbles = []
    let bins = []
    let numBins
    let binWidth
    let binStartX
    let maxBinCount = 0
    let pegSpacingY
    let canvasWidth, canvasHeight
    let isVisible = true
    
    p.setup = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width / 2, 300)
      canvasHeight = Math.max(rect.height, 350)
      const canvas = p.createCanvas(canvasWidth, canvasHeight)
      canvas.parent(container)
      canvas.elt.style.pointerEvents = 'none'
      pegSpacingY = pegSpacing * (Math.sqrt(3) / 2)
      resetSimulation()
    }
    
    const resetSimulation = () => {
      pegs = []
      marbles = []
      numBins = numRows + 1
      bins = Array(numBins).fill(0)
      maxBinCount = 0
      binWidth = pegSpacing
      binStartX = p.width / 2 - (numBins * binWidth) / 2
      let startY = 50
      for (let r = 0; r < numRows; r++) {
        for (let i = 0; i <= r; i++) {
          let x = p.width / 2 + (i - r / 2) * pegSpacing
          let y = startY + r * pegSpacingY
          pegs.push({ x: x, y: y, r: 3 })
        }
      }
    }
    
    p.draw = () => {
      if (!isVisible) return
      p.background(245, 240, 225)
      drawHistogram()
      p.noFill()
      p.stroke(100, 80, 60)
      p.strokeWeight(1.2)
      for (let peg of pegs) {
        p.ellipse(peg.x, peg.y, peg.r * 2)
      }
      
      if (p.frameCount % dropRate === 0 && marbles.length < 80) {
        marbles.push({
          x: p.width / 2 + p.random(-2, 2),
          y: 25,
          vx: 0,
          vy: 1.2,
          r: 3.5
        })
      }
      
      p.fill(40, 30, 20)
      p.noStroke()
      for (let i = marbles.length - 1; i >= 0; i--) {
        let m = marbles[i]
        m.vy += 0.18
        m.x += m.vx
        m.y += m.vy
        m.vx *= 0.98
        
        for (let peg of pegs) {
          let d = p.dist(m.x, m.y, peg.x, peg.y)
          if (d < m.r + peg.r) {
            let nx = (m.x - peg.x) / d
            let ny = (m.y - peg.y) / d
            m.x = peg.x + nx * (m.r + peg.r)
            m.y = peg.y + ny * (m.r + peg.r)
            let dot = m.vx * nx + m.vy * ny
            m.vx = (m.vx - 2 * dot * nx) * 0.4
            m.vy = (m.vy - 2 * dot * ny) * 0.4
            m.vx += p.random(-0.4, 0.4)
          }
        }
        
        let baseY = p.height - 35
        if (m.y > baseY) {
          let binIndex = Math.floor((m.x - binStartX) / binWidth)
          if (binIndex >= 0 && binIndex < numBins) {
            bins[binIndex]++
            if (bins[binIndex] > maxBinCount) maxBinCount = bins[binIndex]
          }
          marbles.splice(i, 1)
          continue
        }
        p.ellipse(m.x, m.y, m.r * 2)
      }
    }
    
    const drawHistogram = () => {
      let baseY = p.height - 35
      let wallY = baseY - 18
      p.stroke(100, 80, 60)
      p.strokeWeight(1)
      for (let i = 0; i <= numBins; i++) {
        let x = binStartX + i * binWidth
        p.line(x, wallY, x, baseY)
      }
      p.line(binStartX, baseY, binStartX + (numBins * binWidth), baseY)
      p.noStroke()
      p.fill(130, 100, 80)
      let triangleBottom = 50 + (numRows * pegSpacingY)
      let availableHeight = (p.height - 35) - triangleBottom - 25
      let scaleH = 3.5
      if (maxBinCount * scaleH > availableHeight && maxBinCount > 0) {
        scaleH = availableHeight / maxBinCount
      }
      for (let i = 0; i < numBins; i++) {
        let x = binStartX + i * binWidth
        let h = bins[i] * scaleH
        if (h > 0) {
          p.rect(x + 2, baseY - h, binWidth - 4, Math.max(h, 1))
        }
      }
    }
    
    p.mousePressed = () => {
      resetSimulation()
    }
    
    const handleResize = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width / 2, 300)
      canvasHeight = Math.max(rect.height, 350)
      p.resizeCanvas(canvasWidth, canvasHeight)
      resetSimulation()
    }
    
    const observer = new ResizeObserver(handleResize)
    observer.observe(parent)
    
    p.windowResized = handleResize
    
    return () => {
      observer.disconnect()
      isVisible = false
    }
  }
  
  p5InstanceLeft = new window.p5(sketch)
}

// ========== BOARD DIREITA ==========
const loadP5Right = () => {
  const container = containerRightRef.value
  if (!container) return
  
  const parent = container.parentElement
  if (!parent) return
  
  if (!window.p5) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
    script.onload = () => initializeP5Right()
    document.head.appendChild(script)
  } else {
    initializeP5Right()
  }
}

const initializeP5Right = () => {
  const container = containerRightRef.value
  const parent = container?.parentElement
  if (!container || !parent) return
  
  const sketch = (p) => {
    let numRows = 10
    let pegSpacing = 16
    let dropRate = 12
    let pegs = []
    let marbles = []
    let bins = []
    let numBins
    let binWidth
    let binStartX
    let maxBinCount = 0
    let pegSpacingY
    let canvasWidth, canvasHeight
    let isVisible = true
    
    p.setup = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width / 2, 300)
      canvasHeight = Math.max(rect.height, 350)
      const canvas = p.createCanvas(canvasWidth, canvasHeight)
      canvas.parent(container)
      canvas.elt.style.pointerEvents = 'none'
      pegSpacingY = pegSpacing * (Math.sqrt(3) / 2)
      resetSimulation()
    }
    
    const resetSimulation = () => {
      pegs = []
      marbles = []
      numBins = numRows + 1
      bins = Array(numBins).fill(0)
      maxBinCount = 0
      binWidth = pegSpacing
      binStartX = p.width / 2 - (numBins * binWidth) / 2
      let startY = 50
      for (let r = 0; r < numRows; r++) {
        for (let i = 0; i <= r; i++) {
          let x = p.width / 2 + (i - r / 2) * pegSpacing
          let y = startY + r * pegSpacingY
          pegs.push({ x: x, y: y, r: 3 })
        }
      }
    }
    
    p.draw = () => {
      if (!isVisible) return
      p.background(245, 240, 225)
      drawHistogram()
      p.noFill()
      p.stroke(100, 80, 60)
      p.strokeWeight(1.2)
      for (let peg of pegs) {
        p.ellipse(peg.x, peg.y, peg.r * 2)
      }
      
      if (p.frameCount % dropRate === 0 && marbles.length < 80) {
        marbles.push({
          x: p.width / 2 + p.random(-2, 2),
          y: 25,
          vx: 0,
          vy: 1.2,
          r: 3.5
        })
      }
      
      p.fill(40, 30, 20)
      p.noStroke()
      for (let i = marbles.length - 1; i >= 0; i--) {
        let m = marbles[i]
        m.vy += 0.18
        m.x += m.vx
        m.y += m.vy
        m.vx *= 0.98
        
        for (let peg of pegs) {
          let d = p.dist(m.x, m.y, peg.x, peg.y)
          if (d < m.r + peg.r) {
            let nx = (m.x - peg.x) / d
            let ny = (m.y - peg.y) / d
            m.x = peg.x + nx * (m.r + peg.r)
            m.y = peg.y + ny * (m.r + peg.r)
            let dot = m.vx * nx + m.vy * ny
            m.vx = (m.vx - 2 * dot * nx) * 0.4
            m.vy = (m.vy - 2 * dot * ny) * 0.4
            m.vx += p.random(-0.4, 0.4)
          }
        }
        
        let baseY = p.height - 35
        if (m.y > baseY) {
          let binIndex = Math.floor((m.x - binStartX) / binWidth)
          if (binIndex >= 0 && binIndex < numBins) {
            bins[binIndex]++
            if (bins[binIndex] > maxBinCount) maxBinCount = bins[binIndex]
          }
          marbles.splice(i, 1)
          continue
        }
        p.ellipse(m.x, m.y, m.r * 2)
      }
    }
    
    const drawHistogram = () => {
      let baseY = p.height - 35
      let wallY = baseY - 18
      p.stroke(100, 80, 60)
      p.strokeWeight(1)
      for (let i = 0; i <= numBins; i++) {
        let x = binStartX + i * binWidth
        p.line(x, wallY, x, baseY)
      }
      p.line(binStartX, baseY, binStartX + (numBins * binWidth), baseY)
      p.noStroke()
      p.fill(130, 100, 80)
      let triangleBottom = 50 + (numRows * pegSpacingY)
      let availableHeight = (p.height - 35) - triangleBottom - 25
      let scaleH = 3.5
      if (maxBinCount * scaleH > availableHeight && maxBinCount > 0) {
        scaleH = availableHeight / maxBinCount
      }
      for (let i = 0; i < numBins; i++) {
        let x = binStartX + i * binWidth
        let h = bins[i] * scaleH
        if (h > 0) {
          p.rect(x + 2, baseY - h, binWidth - 4, Math.max(h, 1))
        }
      }
    }
    
    p.mousePressed = () => {
      resetSimulation()
    }
    
    const handleResize = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width / 2, 300)
      canvasHeight = Math.max(rect.height, 350)
      p.resizeCanvas(canvasWidth, canvasHeight)
      resetSimulation()
    }
    
    const observer = new ResizeObserver(handleResize)
    observer.observe(parent)
    
    p.windowResized = handleResize
    
    return () => {
      observer.disconnect()
      isVisible = false
    }
  }
  
  p5InstanceRight = new window.p5(sketch)
}

// ========== INICIALIZAÇÃO ==========
onMounted(() => {
  nextTick(() => {
    // Board Esquerda
    const containerLeft = containerLeftRef.value
    if (containerLeft) {
      const parentLeft = containerLeft.parentElement
      if (parentLeft) {
        const rectLeft = parentLeft.getBoundingClientRect()
        if (rectLeft.width === 0 || rectLeft.height === 0) {
          setTimeout(() => loadP5Left(), 100)
        } else {
          loadP5Left()
        }
      }
    }
    
    // Board Direita
    const containerRight = containerRightRef.value
    if (containerRight) {
      const parentRight = containerRight.parentElement
      if (parentRight) {
        const rectRight = parentRight.getBoundingClientRect()
        if (rectRight.width === 0 || rectRight.height === 0) {
          setTimeout(() => loadP5Right(), 100)
        } else {
          loadP5Right()
        }
      }
    }
  })
})

onBeforeUnmount(() => {
  if (p5InstanceLeft && p5InstanceLeft.remove) {
    p5InstanceLeft.remove()
  }
  if (p5InstanceRight && p5InstanceRight.remove) {
    p5InstanceRight.remove()
  }
})
</script>

<style scoped>
.galton-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
  overflow: hidden;
}

.galton-container.left {
  left: 0;
}

.galton-container.right {
  right: 0;
}

.galton-container canvas {
  pointer-events: none !important;
  width: 100% !important;
  height: 100% !important;
}
</style>

<!-- <template>
  <div ref="containerRef" class="galton-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const containerRef = ref(null)
let p5Instance = null

onMounted(() => {
  nextTick(() => {
    // Garantir que o container tem tamanho antes de carregar
    const container = containerRef.value
    if (!container) return
    
    const parent = container.parentElement
    if (!parent) return
    
    const rect = parent.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(() => {
        if (containerRef.value) loadP5()
      }, 100)
    } else {
      loadP5()
    }
  })
})

const loadP5 = () => {
  const container = containerRef.value
  if (!container) return
  
  const parent = container.parentElement
  if (!parent) return
  
  // Carregar p5.js dinamicamente se não existir
  if (!window.p5) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
    script.onload = () => initializeP5()
    document.head.appendChild(script)
  } else {
    initializeP5()
  }
}

const initializeP5 = () => {
  const container = containerRef.value
  const parent = container?.parentElement
  if (!container || !parent) return
  
  const sketch = (p) => {
    let numRows = 10
    let pegSpacing = 16
    let dropRate = 12
    let pegs = []
    let marbles = []
    let bins = []
    let numBins
    let binWidth
    let binStartX
    let maxBinCount = 0
    let pegSpacingY
    let canvasWidth, canvasHeight
    let isVisible = true
    
    p.setup = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width, 300)
      canvasHeight = Math.max(rect.height, 350)
      const canvas = p.createCanvas(canvasWidth, canvasHeight)
      canvas.parent(container)
      pegSpacingY = pegSpacing * (Math.sqrt(3) / 2)
      resetSimulation()
      // Dentro do sketch, depois de criar o canvas:
      // canvas.elt.style.pointerEvents = 'none'
    }
    
    const resetSimulation = () => {
      pegs = []
      marbles = []
      numBins = numRows + 1
      bins = Array(numBins).fill(0)
      maxBinCount = 0
      binWidth = pegSpacing
      binStartX = p.width / 2 - (numBins * binWidth) / 2
      let startY = 50
      for (let r = 0; r < numRows; r++) {
        for (let i = 0; i <= r; i++) {
          let x = p.width / 2 + (i - r / 2) * pegSpacing
          let y = startY + r * pegSpacingY
          pegs.push({ x: x, y: y, r: 3 })
        }
      }
    }
    
    p.draw = () => {
      if (!isVisible) return
      p.background(245, 240, 225)
      drawHistogram()
      p.noFill()
      p.stroke(100, 80, 60)
      p.strokeWeight(1.2)
      for (let peg of pegs) {
        p.ellipse(peg.x, peg.y, peg.r * 2)
      }
      
      if (p.frameCount % dropRate === 0 && marbles.length < 80) {
        marbles.push({
          x: p.width / 2 + p.random(-2, 2),
          y: 25,
          vx: 0,
          vy: 1.2,
          r: 3.5
        })
      }
      
      p.fill(40, 30, 20)
      p.noStroke()
      for (let i = marbles.length - 1; i >= 0; i--) {
        let m = marbles[i]
        m.vy += 0.18
        m.x += m.vx
        m.y += m.vy
        m.vx *= 0.98
        
        for (let peg of pegs) {
          let d = p.dist(m.x, m.y, peg.x, peg.y)
          if (d < m.r + peg.r) {
            let nx = (m.x - peg.x) / d
            let ny = (m.y - peg.y) / d
            m.x = peg.x + nx * (m.r + peg.r)
            m.y = peg.y + ny * (m.r + peg.r)
            let dot = m.vx * nx + m.vy * ny
            m.vx = (m.vx - 2 * dot * nx) * 0.4
            m.vy = (m.vy - 2 * dot * ny) * 0.4
            m.vx += p.random(-0.4, 0.4)
          }
        }
        
        let baseY = p.height - 35
        if (m.y > baseY) {
          let binIndex = Math.floor((m.x - binStartX) / binWidth)
          if (binIndex >= 0 && binIndex < numBins) {
            bins[binIndex]++
            if (bins[binIndex] > maxBinCount) maxBinCount = bins[binIndex]
          }
          marbles.splice(i, 1)
          continue
        }
        p.ellipse(m.x, m.y, m.r * 2)
      }
    }
    
    const drawHistogram = () => {
      let baseY = p.height - 35
      let wallY = baseY - 18
      p.stroke(100, 80, 60)
      p.strokeWeight(1)
      for (let i = 0; i <= numBins; i++) {
        let x = binStartX + i * binWidth
        p.line(x, wallY, x, baseY)
      }
      p.line(binStartX, baseY, binStartX + (numBins * binWidth), baseY)
      p.noStroke()
      p.fill(130, 100, 80)
      let triangleBottom = 50 + (numRows * pegSpacingY)
      let availableHeight = (p.height - 35) - triangleBottom - 25
      let scaleH = 3.5
      if (maxBinCount * scaleH > availableHeight && maxBinCount > 0) {
        scaleH = availableHeight / maxBinCount
      }
      for (let i = 0; i < numBins; i++) {
        let x = binStartX + i * binWidth
        let h = bins[i] * scaleH
        if (h > 0) {
          p.rect(x + 2, baseY - h, binWidth - 4, Math.max(h, 1))
        }
      }
    }
    
    p.mousePressed = () => {
      resetSimulation()
    }
    
    const handleResize = () => {
      const rect = parent.getBoundingClientRect()
      canvasWidth = Math.max(rect.width, 300)
      canvasHeight = Math.max(rect.height, 350)
      p.resizeCanvas(canvasWidth, canvasHeight)
      resetSimulation()
    }
    
    const observer = new ResizeObserver(handleResize)
    observer.observe(parent)
    
    p.windowResized = handleResize
    
    // Cleanup
    return () => {
      observer.disconnect()
      isVisible = false
    }

    // Dentro do sketch, depois de criar o canvas:
    canvas.elt.style.pointerEvents = 'none'
  }
  
  p5Instance = new window.p5(sketch)
}

onBeforeUnmount(() => {
  if (p5Instance && p5Instance.remove) {
    p5Instance.remove()
  }
})
</script>

<style scoped>
.galton-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
  overflow: hidden;
}
</style> -->