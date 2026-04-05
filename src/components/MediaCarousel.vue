<template>
  <div class="rotating-card-carousel">
    <div class="carousel-scene">
      <div class="carousel-track">
        <div 
          v-for="(item, index) in media" 
          :key="index"
          class="media-card"
          :class="{ 
            'active': currentIndex === index,
            'prev-1': getCardPosition(index) === -1,
            'prev-2': getCardPosition(index) === -2,
            'next-1': getCardPosition(index) === 1,
            'next-2': getCardPosition(index) === 2
          }"
          @click="openModal(index)"
        >
          <!-- IMAGEM como card -->
          <img 
            v-if="isImage(item)" 
            :src="item" 
            :alt="`Media ${index + 1}`"
            class="media-element"
          />
          
          <!-- EMBED (Vimeo/YouTube) com wrapper para proporção fixa -->
          <div v-else-if="isEmbed(item)" class="embed-wrapper">
            <iframe
              :src="getCleanEmbedUrl(item)"
              class="media-embed"
              referrerpolicy="strict-origin-when-cross-origin"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>

          <!-- Fallback para outros tipos -->
          <div v-else class="unknown-media">
            Tipo de mídia não suportado
          </div>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="carousel-controls">
      <button @click="prevMedia" class="control-btn prev-btn">‹</button>
      <button @click="nextMedia" class="control-btn next-btn">›</button>
    </div>

    <!-- Indicadores -->
    <div v-if="media.length > 1" 
         class="carousel-indicators"
         :class="[`${section}-indicators`]">
      <button
        v-for="(_, index) in media"
        :key="index"
        :class="['indicator', { 'active': currentIndex === index }]"
        @click="goToSlide(index)"
      />
    </div>

    <!-- 🔥 MODAL FIXO - FORA DO FLUXO NORMAL -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">×</button>
          
          <!-- Conteúdo do modal -->
          <div class="modal-media">
            <img 
              v-if="isImage(selectedMedia)"
              :src="selectedMedia"
              :alt="`Media ampliada`"
              class="modal-image"
            />
            
            <div v-else-if="isEmbed(selectedMedia)" class="modal-embed-wrapper">
              <iframe
                :src="getCleanEmbedUrl(selectedMedia)"
                class="modal-embed"
                referrerpolicy="strict-origin-when-cross-origin"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Controles de navegação no modal -->
          <div v-if="media.length > 1" class="modal-controls">
            <button @click="prevMediaModal" class="modal-nav-btn modal-nav-btn-prev">‹</button>
            <span class="modal-counter">{{ modalCurrentIndex + 1 }} / {{ media.length }}</span>
            <button @click="nextMediaModal" class="modal-nav-btn modal-nav-btn-next">›</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  media: {
    type: Array,
    default: () => []
  },
  section: {
    type: String,
    default: 'default'
  }
})

const currentIndex = ref(0)
const isModalOpen = ref(false)
const modalCurrentIndex = ref(0)
const selectedMedia = ref('')

// 🔥 SINGLETON - Garantir que apenas um modal esteja aberto
let globalModalOpen = false

const openModal = (index) => {
  // 🔥 IMPEDIR MÚLTIPLOS MODAIS
  if (globalModalOpen) return
  
  globalModalOpen = true
  modalCurrentIndex.value = index
  // USE A URL LIMPA:
  selectedMedia.value = getCleanEmbedUrl(props.media[index])
  isModalOpen.value = true
  
  // 🔥 BLOQUEAR SCROLL DO BODY
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  globalModalOpen = false
  isModalOpen.value = false
  
  // 🔥 RESTAURAR SCROLL DO BODY
  document.body.style.overflow = ''
}

// 🔥 NAVEGAÇÃO NO MODAL
const nextMediaModal = () => {
  modalCurrentIndex.value = (modalCurrentIndex.value + 1) % props.media.length
  selectedMedia.value = getCleanEmbedUrl(props.media[modalCurrentIndex.value])
}

const prevMediaModal = () => {
  modalCurrentIndex.value = (modalCurrentIndex.value - 1 + props.media.length) % props.media.length
  selectedMedia.value = getCleanEmbedUrl(props.media[modalCurrentIndex.value])
}

// 🔥 FECHAR MODAL COM ESC
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

// Adicionar listener para tecla ESC
window.addEventListener('keydown', handleKeydown)

// 🔥 LIMPEZA
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // Garantir que o scroll seja restaurado se o componente for destruído
  document.body.style.overflow = ''
})

// Funções existentes do carousel...
const getCardPosition = (index) => {
  const total = props.media.length
  const diff = (index - currentIndex.value + total) % total
  
  if (diff === 0) return 0
  if (diff === 1 || diff === 1 - total) return 1
  if (diff === 2 || diff === 2 - total) return 2
  if (diff === total - 1 || diff === -1) return -1
  if (diff === total - 2 || diff === -2) return -2
  
  return null
}

const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

const isEmbed = (url) => {
  // Verifica se é um embed do Vimeo ou YouTube
  const cleanUrl = url.split('?')[0] // Remove parâmetros da URL
  return cleanUrl.includes('player.vimeo.com/video/') || 
         cleanUrl.includes('youtube.com/embed/') || 
         cleanUrl.includes('youtu.be/')
}

// Função para limpar URL de embed
const getCleanEmbedUrl = (url) => {
  if (url.includes('player.vimeo.com/video/')) {
    // Para Vimeo, use apenas o ID do vídeo
    const videoId = url.split('/video/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}

const nextMedia = () => {
  currentIndex.value = (currentIndex.value + 1) % props.media.length
}

const prevMedia = () => {
  currentIndex.value = (currentIndex.value - 1 + props.media.length) % props.media.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}
</script>

<style scoped>
.rotating-card-carousel {
  width: 100%;
  height: 500px; /* Altura generosa */
  position: relative;
  perspective: 1400px;
}

.carousel-scene {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.carousel-track {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

/* 🔥 CARD - REMOVER fundo transparente e centralizar melhor */
.media-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  border-radius: 8px;
  overflow: visible; /* 🔥 MUDAR para visible */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent; 
  /* 🔥 REMOVER qualquer padding/margin extra */
  margin: 0;
  padding: 0;
}

/* 🔥 IMAGEM - AUMENTAR e centralizar melhor */
.media-element {
  display: block;
  max-width: 500px;  /* 🔥 AUMENTAR largura máxima */
  max-height: 500px; /* 🔥 AUMENTAR altura máxima */
  width: auto;
  height: auto;
  border-radius: 8px;
  object-fit: contain; /* Mantém proporção */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  
  /* 🔥 GARANTIR que ocupe todo o espaço disponível */
  flex-shrink: 0;
}

/* 🔥 WRAPPER PARA IFRAMES - também aumentar */
.embed-wrapper {
  width: 500px; /* 🔥 AUMENTAR */
  height: 281px; /* 🔥 AUMENTAR proporcionalmente (16:9) */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🔥 POSIÇÕES 3D - ajustar para os novos tamanhos */
.media-card.active {
  transform: translate(-50%, -50%) translateZ(0) rotateY(0deg) scale(1);
  z-index: 5;
  opacity: 1;
  filter: brightness(1);
}

.media-card.prev-1 {
  transform: translate(-50%, -50%) translateX(-320px) translateZ(-150px) rotateY(30deg) scale(0.9);
  z-index: 4;
  opacity: 0.8;
  filter: brightness(0.8);
}

.media-card.prev-2 {
  transform: translate(-50%, -50%) translateX(-550px) translateZ(-250px) rotateY(45deg) scale(0.8);
  z-index: 3;
  opacity: 0.5;
  filter: brightness(0.6);
}

.media-card.next-1 {
  transform: translate(-50%, -50%) translateX(320px) translateZ(-150px) rotateY(-30deg) scale(0.9);
  z-index: 4;
  opacity: 0.8;
  filter: brightness(0.8);
}

.media-card.next-2 {
  transform: translate(-50%, -50%) translateX(550px) translateZ(-250px) rotateY(-45deg) scale(0.8);
  z-index: 3;
  opacity: 0.5;
  filter: brightness(0.6);
}

/* Esconder cards muito distantes */
.media-card:not(.active):not(.prev-1):not(.prev-2):not(.next-1):not(.next-2) {
  opacity: 0;
  transform: translate(-50%, -50%) translateZ(-500px) scale(0.5);
  z-index: 1;
}

/* Efeito hover sutil */
.media-card:hover {
  filter: brightness(1.1);
}

/* 🔥 ELEMENTO DE MÍDIA - tamanho natural */
.media-element {
  display: block;
  max-width: 400px;
  max-height: 400px;
  width: auto;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* ✅ CONTAINER FLEXÍVEL PARA IFRAMES */
.media-embed {
  width: 400px; /* Largura base */
  height: 225px; /* Altura base 16:9 */
  border-radius: 8px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.media-embed {
  background: transparent;
}

/* 🔥 VÍDEOS LOCAIS - mantenha consistência */
video.media-element {
  width: 400px;
  height: 225px;
  max-width: 400px;
  max-height: 225px;
}

/* ✅ WRAPPER PARA FORÇAR PROPORÇÃO 16:9 */
.embed-wrapper {
  width: 400px;
  height: 225px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ IFRAME que preenche o wrapper completamente */
.media-embed {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Controles */
/* Resto do CSS permanece igual */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  pointer-events: none;
  z-index: 10;
}

/* 🔥 CORREÇÃO: BOTÕES DE CONTROLE CENTRALIZADOS */
.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #333;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  line-height: 1; /* 🔥 ADICIONE ISSO */
  padding: 0; /* 🔥 ADICIONE ISSO */
  margin: 0; /* 🔥 ADICIONE ISSO */
}

.control-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.control-btn.prev-btn {
  padding-bottom: 5px;
  padding-right: 2px;
}

.control-btn.next-btn {
  padding-bottom: 5px;
  padding-left: 2px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.carousel-indicators button.indicator {
  width: 6px !important;
  height: 6px !important;
  min-width: 6px !important;
  min-height: 6px !important;
  max-width: 6px !important;
  max-height: 6px !important;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  margin: 0;
}

.carousel-indicators button.indicator.active {
  background: white;
  transform: scale(1.2);
}

.carousel-indicators button.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.1);
}

/* 🔥 MODAL TELEPORTADO PARA O BODY - CORRIGIDO */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000; /* 🔥 Z-INDEX MUITO ALTO */
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 95vw;
  max-height: 95vh;
  background: transparent;
}

.modal-close {
  position: absolute;
  top: -60px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
}

.modal-embed-wrapper {
  width: 80vw;
  height: calc(80vw * 9 / 16);
  max-width: 1200px;
  max-height: 70vh;
}

.modal-embed {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
}

/* 🔥 CONTROLES DE NAVEGAÇÃO NO MODAL */
.modal-controls {
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10001;
}

/* 🔥 CORREÇÃO: BOTÕES DO MODAL */
.modal-nav-btn {
  background: rgba(255, 255, 255, 0.25);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  line-height: 1; /* 🔥 ADICIONE ISSO */
  padding: 0; /* 🔥 ADICIONE ISSO */
}

.modal-nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.15);
}

.modal-nav-btn.modal-nav-btn-prev {
  padding-bottom: 6px;
  padding-right: 2px;
}

.modal-nav-btn.modal-nav-btn-next {
  padding-bottom: 6px;
  padding-left: 2px;
}

.modal-counter {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
}

/* No final do arquivo MediaCarousel.vue */
.control-btn,
.modal-nav-btn {
  line-height: 1;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🔥 ANIMAÇÃO */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 🔥 RESPONSIVIDADE */
@media (max-width: 768px) {
  .modal-close {
    top: -50px;
    right: -10px;
    width: 40px;
    height: 40px;
    font-size: 2rem;
  }
  
  .modal-embed-wrapper {
    width: 95vw;
    height: calc(95vw * 9 / 16);
  }
  
  .modal-controls {
    bottom: -60px;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
  }
  
  .modal-nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .carousel-indicators {
    bottom: 12px; /* 🔥 SUBIR mais em tablet */
    gap: 4px; /* 🔥 MÍNIMO espaçamento */
  }
  
  /* 🔥 ADICIONE ESTAS REGRAS ESPECÍFICAS POR SEÇÃO */
  .carousel-indicators.personal-work-indicators {
    bottom: 70px !important;
  }

  .carousel-indicators.web-section-indicators {
    bottom: 80px !important;
  }

  .carousel-indicators.mobile-section-indicators {
    bottom: 10px !important;
  }
  
  .carousel-indicators button.indicator {
    width: 15px !important;
    height: 15px !important;
    max-width: 15px !important;
    max-height: 15px !important;
  }
  
  .indicator.active {
    transform: scale(1.1); /* 🔥 ESCALA menor */
  }
}

@media (max-width: 480px) {
  .rotating-card-carousel {
    height: 350px;
  }
  
  .media-element {
    max-width: 250px;
    max-height: 250px;
  }
  
  .embed-wrapper {
    width: 250px;
    height: 141px;
  }
  
  .media-card.prev-1 {
    transform: translate(-50%, -50%) translateX(-180px) translateZ(-80px) rotateY(30deg) scale(0.9);
  }
  
  .media-card.prev-2 {
    transform: translate(-50%, -50%) translateX(-320px) translateZ(-160px) rotateY(45deg) scale(0.8);
  }
  
  .media-card.next-1 {
    transform: translate(-50%, -50%) translateX(180px) translateZ(-80px) rotateY(-30deg) scale(0.9);
  }
  
  .media-card.next-2 {
    transform: translate(-50%, -50%) translateX(320px) translateZ(-160px) rotateY(-45deg) scale(0.8);
  }

  .carousel-indicators {
    gap: 3px; /* 🔥 MÍNIMO espaçamento */
  }
  
  /* 🔥 ADICIONE ESTAS REGRAS ESPECÍFICAS POR SEÇÃO */
  .carousel-indicators.personal-work-indicators {
    bottom: 70px !important;
  }

  .carousel-indicators.web-section-indicators {
    bottom: 70px !important;
  }

  .carousel-indicators.mobile-section-indicators {
    bottom: 10px !important;
  }

  .carousel-indicators button.indicator {
    width: 10px !important;
    height: 10px !important;
    max-width: 10px !important;
    max-height: 10px !important;
  }
  
  .indicator.active {
    transform: scale(1.1); /* 🔥 ESCALA consistente */
  }
}
</style>