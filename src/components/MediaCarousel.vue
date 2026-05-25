<template>
  <div class="rotating-card-carousel" :class="{ 'vertical-carousel': vertical }">
    <div class="carousel-scene">
      <div class="carousel-track" :class="{ 'vertical-track': vertical }">
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
          <img 
            v-if="isImage(item)" 
            :src="item" 
            :alt="`Media ${index + 1}`"
            class="media-element"
          />
          
          <div v-else-if="isEmbed(item)" class="embed-wrapper">
            <iframe
              :src="getCleanEmbedUrl(item)"
              class="media-embed"
              referrerpolicy="strict-origin-when-cross-origin"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>

          <div v-else class="unknown-media">
            Tipo de mídia não suportado
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-controls">
      <button @click="prevMedia" class="control-btn prev-btn">‹</button>
      <button @click="nextMedia" class="control-btn next-btn">›</button>
    </div>

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

    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">×</button>
          
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
  },
  vertical: {
    type: Boolean,
    default: false
  }
})

const currentIndex = ref(0)
const isModalOpen = ref(false)
const modalCurrentIndex = ref(0)
const selectedMedia = ref('')

let globalModalOpen = false

const openModal = (index) => {
  if (globalModalOpen) return
  
  globalModalOpen = true
  modalCurrentIndex.value = index
  selectedMedia.value = getCleanEmbedUrl(props.media[index])
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  globalModalOpen = false
  isModalOpen.value = false
  document.body.style.overflow = ''
}

const nextMediaModal = () => {
  modalCurrentIndex.value = (modalCurrentIndex.value + 1) % props.media.length
  selectedMedia.value = getCleanEmbedUrl(props.media[modalCurrentIndex.value])
}

const prevMediaModal = () => {
  modalCurrentIndex.value = (modalCurrentIndex.value - 1 + props.media.length) % props.media.length
  selectedMedia.value = getCleanEmbedUrl(props.media[modalCurrentIndex.value])
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

window.addEventListener('keydown', handleKeydown)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

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
  const cleanUrl = url.split('?')[0]
  return cleanUrl.includes('player.vimeo.com/video/') || 
         cleanUrl.includes('youtube.com/embed/') || 
         cleanUrl.includes('youtu.be/')
}

const getCleanEmbedUrl = (url) => {
  if (url.includes('player.vimeo.com/video/')) {
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
  height: 500px;
  position: relative;
  perspective: 1400px;
}

.rotating-card-carousel.vertical-carousel {
  height: 500px;
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

.media-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  margin: 0;
  padding: 0;
}

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

.vertical-carousel .media-card.active {
  transform: translate(-50%, -50%) translateZ(0) rotateX(0deg) scale(1);
}

.vertical-carousel .media-card.prev-1 {
  transform: translate(-50%, -50%) translateY(-180px) translateZ(-100px) rotateX(20deg) scale(0.85);
  z-index: 4;
  opacity: 0.7;
  filter: brightness(0.8);
}

.vertical-carousel .media-card.prev-2 {
  transform: translate(-50%, -50%) translateY(-320px) translateZ(-180px) rotateX(35deg) scale(0.7);
  z-index: 3;
  opacity: 0.4;
  filter: brightness(0.6);
}

.vertical-carousel .media-card.next-1 {
  transform: translate(-50%, -50%) translateY(180px) translateZ(-100px) rotateX(-20deg) scale(0.85);
  z-index: 4;
  opacity: 0.7;
  filter: brightness(0.8);
}

.vertical-carousel .media-card.next-2 {
  transform: translate(-50%, -50%) translateY(320px) translateZ(-180px) rotateX(-35deg) scale(0.7);
  z-index: 3;
  opacity: 0.4;
  filter: brightness(0.6);
}

.media-card:not(.active):not(.prev-1):not(.prev-2):not(.next-1):not(.next-2) {
  opacity: 0;
  transform: translate(-50%, -50%) translateZ(-500px) scale(0.5);
  z-index: 1;
}

.media-card:hover {
  filter: brightness(1.1);
}

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

.media-embed {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
  z-index: 10;
}

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
  line-height: 1;
  padding: 0;
  margin: 0;
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
  gap: 8px;
  z-index: 10;
}

.carousel-indicators button.indicator {
  width: 8px !important;
  height: 8px !important;
  min-width: 8px !important;
  min-height: 8px !important;
  max-width: 8px !important;
  max-height: 8px !important;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  margin: 0;
}

.carousel-indicators button.indicator.active {
  background: white;
  transform: scale(1.3);
}

.carousel-indicators button.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

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
  z-index: 10000;
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
  line-height: 1;
  padding: 0;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .rotating-card-carousel,
  .rotating-card-carousel.vertical-carousel {
    height: 400px;
  }

  .media-element,
  .embed-wrapper {
    max-width: 280px;
    max-height: 280px;
  }
  
  .embed-wrapper {
    height: 158px;
  }
  
  .media-card.prev-1 {
    transform: translate(-50%, -50%) translateX(-220px) translateZ(-100px) rotateY(30deg) scale(0.9);
  }
  
  .media-card.prev-2 {
    transform: translate(-50%, -50%) translateX(-380px) translateZ(-180px) rotateY(45deg) scale(0.8);
  }
  
  .media-card.next-1 {
    transform: translate(-50%, -50%) translateX(220px) translateZ(-100px) rotateY(-30deg) scale(0.9);
  }
  
  .media-card.next-2 {
    transform: translate(-50%, -50%) translateX(380px) translateZ(-180px) rotateY(-45deg) scale(0.8);
  }
  
  .vertical-carousel .media-card.prev-1 {
    transform: translate(-50%, -50%) translateY(-130px) translateZ(-70px) rotateX(20deg) scale(0.85);
  }
  
  .vertical-carousel .media-card.prev-2 {
    transform: translate(-50%, -50%) translateY(-240px) translateZ(-130px) rotateX(35deg) scale(0.7);
  }
  
  .vertical-carousel .media-card.next-1 {
    transform: translate(-50%, -50%) translateY(130px) translateZ(-70px) rotateX(-20deg) scale(0.85);
  }
  
  .vertical-carousel .media-card.next-2 {
    transform: translate(-50%, -50%) translateY(240px) translateZ(-130px) rotateX(-35deg) scale(0.7);
  }
}

@media (max-width: 480px) {
  .rotating-card-carousel,
  .rotating-card-carousel.vertical-carousel {
    height: 320px;
  }
  
  .media-element,
  .embed-wrapper {
    max-width: 220px;
    max-height: 220px;
  }
  
  .embed-wrapper {
    height: 124px;
  }
  
  .media-card.prev-1 {
    transform: translate(-50%, -50%) translateX(-160px) translateZ(-70px) rotateY(30deg) scale(0.9);
  }
  
  .media-card.prev-2 {
    transform: translate(-50%, -50%) translateX(-280px) translateZ(-130px) rotateY(45deg) scale(0.8);
  }
  
  .media-card.next-1 {
    transform: translate(-50%, -50%) translateX(160px) translateZ(-70px) rotateY(-30deg) scale(0.9);
  }
  
  .media-card.next-2 {
    transform: translate(-50%, -50%) translateX(280px) translateZ(-130px) rotateY(-45deg) scale(0.8);
  }
  
  .vertical-carousel .media-card.prev-1 {
    transform: translate(-50%, -50%) translateY(-100px) translateZ(-50px) rotateX(20deg) scale(0.85);
  }
  
  .vertical-carousel .media-card.prev-2 {
    transform: translate(-50%, -50%) translateY(-180px) translateZ(-100px) rotateX(35deg) scale(0.7);
  }
  
  .vertical-carousel .media-card.next-1 {
    transform: translate(-50%, -50%) translateY(100px) translateZ(-50px) rotateX(-20deg) scale(0.85);
  }
  
  .vertical-carousel .media-card.next-2 {
    transform: translate(-50%, -50%) translateY(180px) translateZ(-100px) rotateX(-35deg) scale(0.7);
  }
  
  .carousel-controls {
    padding: 0 10px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}
</style>