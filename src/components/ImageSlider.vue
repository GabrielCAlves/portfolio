<template>
  <div class="image-slider">
    <div class="slider-container">
      <img 
        v-for="(image, index) in images" 
        :key="index"
        :src="image" 
        :alt="`Image ${index + 1}`"
        :class="['slider-image', { active: currentIndex === index }]"
      />
    </div>
    <div class="slider-dots">
      <button 
        v-for="(_, index) in images" 
        :key="index"
        :class="['dot', { active: currentIndex === index }]"
        @click="currentIndex = index"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)

watch(currentIndex, () => {
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }, 3000)
})
</script>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  height: 200px;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.slider-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slider-image.active {
  opacity: 1;
}

.slider-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}
</style>