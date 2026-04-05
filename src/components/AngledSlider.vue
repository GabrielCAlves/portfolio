<template>
  <div class="angled-slider">
    <button class="nav-arrow left" @click="prevSlide">‹</button>
    
    <div class="slider-container">
      <div 
        v-for="(image, index) in images" 
        :key="image.id"
        :class="['slider-item', { active: currentIndex === index }]"
        @mouseenter="currentIndex = index"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          :class="{ 'grayscale': currentIndex !== index }"
        />
      </div>
    </div>

    <button class="nav-arrow right" @click="nextSlide">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cloudinaryUrls } from '@/services/cloudinary'

const images = ref([])
const currentIndex = ref(0)

const loadSliderImages = () => {
  // Agora usa as URLs diretas do Cloudinary
  images.value = cloudinaryUrls.slider.map((url, index) => ({
    id: `slider-${index + 1}`,
    url: url, // URL direta do Cloudinary
    title: `Slider ${index + 1}`,
    alt: `Slider image ${index + 1}`
  }))
  
  console.log('✅ Slider images loaded:', images.value)
}

// ⚡️ ESTAS FUNÇÕES CONTINUAM FUNCIONANDO NORMALMENTE ⚡️
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
  console.log('➡️ Next slide:', currentIndex.value)
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  console.log('⬅️ Previous slide:', currentIndex.value)
}

onMounted(() => {
  loadSliderImages()
})
</script>

<style scoped>
.angled-slider {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  width: 90%;
  height: 70%;
}

.slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px; /* Reduzi o gap para as imagens se sobreporem */
  flex: 1;
  height: 100%;
}

.slider-item {
  flex: 1;
  height: 100%;
  transform: skew(-10deg);
  transition: all 0.4s ease;
  position: relative;
  overflow: visible; /* 🔥 MUDADO: permite que a imagem vaze */
  cursor: pointer;
  /* Removi o background e border do container */
}

.slider-item.active {
  flex: 2;
  transform: skew(-10deg) scale(1.05);
  z-index: 2; /* 🔥 Ativo fica acima dos outros */
}

.slider-item:hover {
  transform: skew(-10deg) scale(1.02);
  z-index: 3; /* 🔥 Hover fica acima de tudo */
}

/* Wrapper que controla o "vazamento" */
.image-wrapper {
  width: 140%; /* 🔥 Wrapper mais largo que o container */
  height: 100%;
  transform: skew(10deg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* 🔥 Permite vazamento */
  position: relative;
  left: -20%; /* 🔥 Centraliza o wrapper expandido */
}

/* Imagem ocupa todo o wrapper expandido */
.slider-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Preenche todo o espaço */
  transition: all 0.4s ease;
  filter: grayscale(100%);
}

.slider-item.active img,
.slider-item:hover img {
  filter: grayscale(0%);
}

/* Efeito de brilho no item ativo */
.slider-item.active::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  z-index: -1;
}

.nav-arrow {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2.5rem;
  padding: 15px 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.nav-arrow.left {
  order: 1;
}

.nav-arrow.right {
  order: 3;
}

.slider-container {
  order: 2;
}
</style>