<template>
  <div class="embers-container">
    <div v-for="ember in embers" 
         :key="ember.id" 
         class="ember"
         :style="ember.style"
         @animationend="removeEmber(ember.id)">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const embers = ref([])
let nextId = 0
let animationFrameId = null
let isActive = true

// 🔥 AJUSTE: Remover dependência de tamanho fixo
const createEmber = () => {
  const size = Math.random() * 8 + 8  // Reduzido um pouco
  const duration = Math.random() * 30 + 5
  const delay = Math.random() * 3
  
  const ember = {
    id: nextId++,
    style: {
      left: `${Math.random() * 100}%`,  // 🔥 USAR % em vez de vw
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    }
  }
  
  embers.value.push(ember)
}

const removeEmber = (id) => {
  const index = embers.value.findIndex(e => e.id === id)
  if (index !== -1) {
    embers.value.splice(index, 1)
    if (isActive) {
      createEmber()
    }
  }
}

// 🔥 FUNÇÃO PARA MANTER NÚMERO CONSTANTE DE PARTÍCULAS
const maintainEmberCount = () => {
  if (!isActive) return
  
  const targetCount = 200  // Reduzido um pouco para performance
  const currentCount = embers.value.length
  
  if (currentCount < targetCount) {
    const toAdd = Math.min(targetCount - currentCount, 10)
    for (let i = 0; i < toAdd; i++) {
      createEmber()
    }
  }
  
  animationFrameId = requestAnimationFrame(maintainEmberCount)
}

// 🔥 OBSERVADOR PARA QUANDO A SEÇÃO FICA VISÍVEL/INVISÍVEL
const setupVisibilityObserver = () => {
  const container = document.querySelector('.embers-container')
  if (!container) return
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isActive = entry.isIntersecting
      
      if (!isActive) {
        // Pausar animações quando não visível
        container.style.opacity = '0'
      } else {
        container.style.opacity = '1'
        // Recriar partículas quando voltar a ficar visível
        if (embers.value.length < 50) {
          for (let i = 0; i < 50; i++) {
            createEmber()
          }
        }
      }
    })
  }, { threshold: 0.1 })
  
  observer.observe(container)
  return observer
}

onMounted(() => {
  // Criar partículas iniciais
  for (let i = 0; i < 120; i++) {
    createEmber()
  }
  
  // Iniciar manutenção do número de partículas
  animationFrameId = requestAnimationFrame(maintainEmberCount)
  
  // Setup visibility observer
  const observer = setupVisibilityObserver()
  
  // 🔥 FORÇAR O CONTAINER A OCUPAR TODO O ESPAÇO
  nextTick(() => {
    const container = document.querySelector('.embers-container')
    if (container) {
      const parent = container.parentElement
      if (parent) {
        const updateSize = () => {
          const rect = parent.getBoundingClientRect()
          container.style.position = 'absolute'
          container.style.top = '0'
          container.style.left = '0'
          container.style.width = `${rect.width}px`
          container.style.height = `${rect.height}px`
        }
        
        updateSize()
        
        const resizeObserver = new ResizeObserver(updateSize)
        resizeObserver.observe(parent)
        
        onBeforeUnmount(() => {
          resizeObserver.disconnect()
        })
      }
    }
  })
  
  onBeforeUnmount(() => {
    isActive = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (observer) {
      observer.disconnect()
    }
  })
})
</script>

<style scoped>
.embers-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100% !important;
  pointer-events: none;
  background: #080c16;
  z-index: 1;
}

.ember {
  position: absolute;
  bottom: -20px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(255, 140, 0, 1) 0%, rgba(255, 69, 0, 0.9) 60%, rgba(0, 0, 0, 0) 100%);
  border-radius: 50%;
  pointer-events: none;
  animation: rise linear infinite, drift ease-in-out infinite;
  opacity: 0.8;
  will-change: transform, opacity;
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(0.3);
    opacity: 0;
    bottom: -20px;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    transform: translateY(-50vh) scale(0.8);
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-110vh) scale(1.1);
    opacity: 0;
    bottom: 100%;
  }
}

@keyframes drift {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(15px);
  }
  75% {
    transform: translateX(-15px);
  }
}
</style>