<template>
  <div class="homePage">
    <NavigationBar class="navigationbar" :active-section="currentSection" @section-change="changeSection" />
    <!-- Seção 1: Hero com Carousel 3D -->
    <section class="hero-section">
      <!-- Primeira imagem de fundo -->
      <div class="background-image back-layer"></div>
      
      <!-- Headline -->
      <div class="hero-headline">
        <h1 :data-text="$t('headline')"><strong>{{ $t('headline') }}</strong></h1>
        <!-- <p><strong>{{ $t('subtitle') }}</strong></p> -->
      </div>
      
      <!-- Carousel 3D com contexto 3D no wrapper -->
      <div class="carousel-3d-wrapper">
        <!-- CAROUSEL STAGE - SÓ OS CARDS GIAM -->
        <div 
          ref="carouselStage"
          class="carousel-stage"
          :class="{ 'paused': isRotationPaused }"
          :style="{
            transform: `rotateX(-15deg) rotateY(${currentRotation}deg)`
          }"
        >
          <!-- Cards do carousel (O translateZ(400px) é para o espaço entre os cards, para mexer na profundidade do carousel é preciso mexer em .carousel-3d-wrapper, perspective) -->
          <div 
            v-for="(image, index) in carouselImages" 
            :key="image.id"
            :ref="el => carouselItems[index] = el"
            class="carousel-3d-item"
            :style="{
              transform: `rotateY(${getCardPosition(index)}deg) translateZ(400px)`
            }"
            @mouseenter="pauseRotation"
            @mouseleave="resumeRotation"
            @click="setActiveImage(index)"
          >
            <div class="image-3d-wrapper" :class="{ 'front-layer': isItemInFront(index) }">
              <img :src="image.url" :alt="image.alt" />
            </div>
          </div>
        </div>

        <!-- PESSOA CENTRAL - FORA DO CAROUSEL STAGE MAS NO MESMO CONTEXTO 3D -->
        <div 
          class="center-person-3d"
          v-if="showCenterPerson"
        >
        </div>
        
        <!-- Controles -->
        <button class="carousel-3d-control prev" @click="rotateManual(-72)">‹</button>
        <button class="carousel-3d-control next" @click="rotateManual(72)">›</button>
      </div>
    </section>

    <!-- 🔥 MUDANÇA RADICAL: REMOVER SISTEMA DE ALTURA FIXA -->
    <section class="main-section section-transition">
      <!-- <NavigationBar class="navigationbar" :active-section="currentSection" @section-change="changeSection" /> -->
      
      <!-- 🔥 CONTAINER SIMPLES SEM ALTURA FIXA -->
      <div class="sections-container">
        <!-- About Section -->
        <div class="section-content" :class="{ 'active': currentSection === 0 }">
          <CompassFieldFlow />
          <AboutSection />
        </div>
        
        <!-- Personal Work -->
        <div class="section-content" :class="{ 'active': currentSection === 1 }">
          <ParticleGalaxyAnimation />
          <!-- <PersonalWork /> -->
           <GamesSection />
        </div>
        
        <!-- Professional Work -->
        <div class="section-content" :class="{ 'active': currentSection === 2 }">
          <GaltonPegboards />
          <!-- <ProfessionalWork /> -->
           <ProjectsSection />
        </div>
        
        <!-- Web Section -->
        <div class="section-content" :class="{ 'active': currentSection === 3 }">
          <MatrixFallingCodeAnimation />
          <WebSection />
        </div>
        
        <!-- Mobile Section -->
        <!-- <div class="section-content" :class="{ 'active': currentSection === 4 }">
          <BlackholeBackground />
          <MobileSection />
        </div> -->
        <div v-if="currentSection === 4" class="section-content active">
          <BlackholeBackground />
          <MobileSection />
        </div>
        
        <!-- Contacts Section -->
        <!-- <div class="section-content" :class="{ 'active': currentSection === 5 }">
          <GlobeBackground />
          <ContactsSection />
        </div> -->
        <div v-if="currentSection === 5" class="section-content active">
          <GlobeBackground />
          <ContactsSection />
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
</template>

<script setup>
import { ref, /*computed,*/ onMounted, onUnmounted/*, nextTick*/ } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import AboutSection from '@/components/AboutSection.vue'
// import PersonalWork from '@/components/PersonalWork.vue'
// import ProfessionalWork from '@/components/ProfessionalWork.vue'
import GamesSection from '@/components/GamesSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import WebSection from '@/components/WebSection.vue'
import MobileSection from '@/components/MobileSection.vue'
import ContactsSection from '@/components/ContactsSection.vue'
import FooterSection from '@/components/FooterSection.vue'

import CompassFieldFlow from '@/components/backgrounds/CompassFieldFlow.vue'
import ParticleGalaxyAnimation from '@/components/backgrounds/ParticleGalaxyAnimation.vue'
import GaltonPegboards from '@/components/backgrounds/GaltonPegboards.vue'
import MatrixFallingCodeAnimation from '@/components/backgrounds/MatrixFallingCodeAnimation.vue'
import BlackholeBackground from '@/components/backgrounds/BlackholeBackground.vue'
import GlobeBackground from '@/components/backgrounds/GlobeBackground.vue'

import { cloudinaryUrls } from '@/services/cloudinary'

const currentSection = ref(0)
// 🔥 REMOVER: containerHeight não é mais necessário
const isRotationPaused = ref(false)
const rotationSpeed = ref(20)
const showCenterPerson = ref(true)

// VARIÁVEIS COM REFERENCIAL ÚNICO
const currentRotation = ref(0)
const animationId = ref(null)
const lastTimestamp = ref(0)

// Refs para elementos
const carouselStage = ref(null)
const carouselItems = ref([])

// Refs para cada seção
const aboutRef = ref(null)
// const personalRef = ref(null)
// const professionalRef = ref(null)
const gamesRef = ref(null)
const projectsRef = ref(null)
const webRef = ref(null)
const mobileRef = ref(null)
const contactsRef = ref(null)

// Imagens do carousel 3D
const carouselImages = ref([
  {
    id: 'carousel-1',
    url: cloudinaryUrls.slider[0] || '',
    alt: 'Project 1'
  },
  {
    id: 'carousel-2', 
    url: cloudinaryUrls.slider[1] || '',
    alt: 'Project 2'
  },
  {
    id: 'carousel-3',
    url: cloudinaryUrls.slider[2] || '',
    alt: 'Project 3'
  },
  {
    id: 'carousel-4',
    url: cloudinaryUrls.slider[3] || '',
    alt: 'Project 4'
  },
  {
    id: 'carousel-5',
    url: cloudinaryUrls.slider[4] || '',
    alt: 'Project 5'
  }
])

// POSIÇÃO FIXA DE CADA CARD NO CAROUSEL
const cardBasePositions = [0, 72, 144, 216, 288]

// POSIÇÃO 3D DO CARD - MANTIDO
const getCardPosition = (index) => {
  return cardBasePositions[index]
}

// ÂNGULO GLOBAL DO CARD EM RELAÇÃO AO OBSERVADOR - MANTIDO
const getGlobalAngle = (index) => {
  const globalAngle = (cardBasePositions[index] + currentRotation.value) % 360
  return globalAngle < 0 ? globalAngle + 360 : globalAngle
}

// Z-INDEX SUAVIZADO - CORRIGIDO
// const getDynamicZIndex = (index) => {
//   const globalAngle = getGlobalAngle(index)
  
//   // Ângulos mais amplos para transição suave
//   const frontThreshold = 90 // aumentado de 80
//   const backThreshold = 90  // reduzido de 100
  
//   if (globalAngle <= frontThreshold || globalAngle >= (360 - frontThreshold)) {
//     return 10000 // Frente
//   } else {
//     return 10 // Atrás
//   }
// }

// VERIFICAR SE ITEM ESTÁ NA FRENTE - CORRIGIDO
const isItemInFront = (index) => {
  const globalAngle = getGlobalAngle(index)
  const frontThreshold = 90
  return globalAngle <= frontThreshold || globalAngle >= (360 - frontThreshold)
}

// TOGGLE PESSOA CENTRAL
// const toggleCenterPerson = () => {
//   showCenterPerson.value = !showCenterPerson.value
// }

// ANIMAÇÃO
const animateRotation = (timestamp) => {
  if (!lastTimestamp.value) {
    lastTimestamp.value = timestamp
  }
  
  const delta = timestamp - lastTimestamp.value
  lastTimestamp.value = timestamp
  
  if (!isRotationPaused.value) {
    const rotationIncrement = (delta / 1000) * (360 / rotationSpeed.value)
    currentRotation.value += rotationIncrement
    
    if (currentRotation.value >= 360) {
      currentRotation.value -= 360
    }
  }
  
  animationId.value = requestAnimationFrame(animateRotation)
}

// Controles de rotação
const pauseRotation = () => {
  isRotationPaused.value = true
}

const resumeRotation = () => {
  isRotationPaused.value = false
}

const rotateManual = (angleChange) => {
  currentRotation.value = (currentRotation.value + angleChange) % 360
  if (currentRotation.value < 0) currentRotation.value += 360
  pauseRotation()
  setTimeout(() => {
    resumeRotation()
  }, 2000)
}

const setActiveImage = (index) => {
  pauseRotation()
  
  // Mapear índice do carousel para seção e projeto específico
  const carouselToProjectMap = {
    0: { section: 1, projectIndex: 0 }, // Primeiro card -> Personal Work, primeiro projeto
    1: { section: 1, projectIndex: 1 }, // Segundo card -> Personal Work, segundo projeto
    2: { section: 1, projectIndex: 2 }, // Terceiro card -> Personal Work, terceiro projeto
    3: { section: 1, projectIndex: 3 }, // Quarto card -> Personal Work, quarto projeto
    4: { section: 1, projectIndex: 4 }  // Quinto card -> Personal Work, quinto projeto
  }
  
  const mapping = carouselToProjectMap[index]
  if (mapping) {
    // Mudar para a seção Personal Work
    changeSection(mapping.section)
    
    // Aguardar a transição e rolar até o projeto específico
    setTimeout(() => {
      scrollToProject(mapping.projectIndex)
    }, 500)
  }
  
  setTimeout(() => {
    resumeRotation()
  }, 2000)
}

const scrollToProject = (projectIndex) => {
  const projects = document.querySelectorAll('.project')
  if (projects[projectIndex]) {
    projects[projectIndex].scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    })
    
    // Destacar o projeto temporariamente
    projects[projectIndex].style.transition = 'all 0.5s ease'
    projects[projectIndex].style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.5)'
    setTimeout(() => {
      projects[projectIndex].style.boxShadow = ''
    }, 2000)
  }
}

// 🔥 MUDANÇA RADICAL: SIMPLES MUDANÇA DE SEÇÃO SEM CONTROLE DE ALTURA
// const changeSection = (index) => {
//   currentSection.value = index
  
//   // 🔥 ROLAR PARA O TOPO DA SEÇÃO
//   setTimeout(() => {
//     const sectionsContainer = document.querySelector('.sections-container')
//     if (sectionsContainer) {
//       sectionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     }
//   }, 50)
// }
// 🔥 MUDANÇA RADICAL: SIMPLES MUDANÇA DE SEÇÃO SEM CONTROLE DE ALTURA
const changeSection = (index) => {
  currentSection.value = index
  
  // 🔥 ROLAR PARA O TOPO DA SEÇÃO COM OFFSET PARA A NAVBAR
  setTimeout(() => {
    const sectionsContainer = document.querySelector('.sections-container')
    if (sectionsContainer) {
      const navbarHeight = 80 // Altura da navbar em pixels
      const elementPosition = sectionsContainer.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 50)
}

const nextSection = () => {
  currentSection.value = (currentSection.value + 1) % 6
}

const prevSection = () => {
  currentSection.value = (currentSection.value - 1 + 6) % 6
}

const handleKeydown = (event) => {
  if (event.key === 'ArrowLeft') {
    prevSection()
  } else if (event.key === 'ArrowRight') {
    nextSection()
  }
}

const handleSectionChange = (event) => {
  currentSection.value = event.detail.sectionIndex
}

onMounted(() => {
  animationId.value = requestAnimationFrame(animateRotation)
  
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('change-section', handleSectionChange)
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('change-section', handleSectionChange)
})
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

.hero-section {
  height: 700px;
  position: relative;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 5px solid;
  border-image: linear-gradient(90deg, red 0%, #05f 100%) 1;
}

.background-image.back-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://res.cloudinary.com/dimsi9muz/image/upload/v1762207771/dreamina-2025-11-03-1921-Place_the_person_from_the_image_in_the_c..._v5a3ia.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1 !important;
  filter: brightness(1);
}

/* WRAPPER COM CONTEXTO 3D - PAI DE TUDO */
.carousel-3d-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 10000px;
  perspective-origin: 50% 50%;
  z-index: 1000 !important;
  transform-style: preserve-3d;
}

/* ATUALIZE ESTAS REGRAS CSS */
.carousel-stage {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000 !important;
  /* REMOVA transition daqui se existir */
}

.carousel-3d-item {
  position: absolute;
  width: 180px;
  height: 320px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease; /* Reduzida e simplificada */
  cursor: pointer;
  border-radius: 10px;
  overflow: visible;
  top: 50%;
  left: 50%;
  margin-top: -160px;
  margin-left: -90px;
}

.image-3d-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.5s ease; /* Transição mais suave */
  border: 3px solid transparent;
  /* Garantir que o z-index seja aplicado corretamente */
  position: relative;
  z-index: inherit;
}

.image-3d-wrapper.front-layer {
  filter: brightness(1) !important;
  z-index: 10000 !important;
}

.image-3d-wrapper:not(.front-layer) {
  filter: brightness(0.7) !important; /* Aumentado de 0.6 para menos contraste */
  z-index: 10 !important;
}

/* MELHORAR A TRANSIÇÃO NO HOVER */
.carousel-3d-item:hover .image-3d-wrapper {
  transform: scale(1.1) translateZ(30px); /* Mais suave */
  filter: brightness(1.2);
  transition: all 0.3s ease; /* Transição mais rápida no hover */
}

.carousel-3d-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* PESSOA CENTRAL - FORA DO CAROUSEL STAGE MAS NO MESMO CONTEXTO 3D */
.center-person-3d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://res.cloudinary.com/dimsi9muz/image/upload/v1762210369/Adobe_Express_-_file_xcviof.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform-style: preserve-3d;
  pointer-events: none;
  transform: translateZ(0px);
  z-index: 500000 !important;
}

.carousel-3d-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 3rem;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100000 !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.carousel-3d-control:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.carousel-3d-control.prev {
  left: 5%;
  padding-bottom: 6px;
  padding-right: 2px;
}

.carousel-3d-control.next {
  right: 5%;
  padding-bottom: 6px;
  padding-left: 2px;
}

/* 🔥 MUDANÇA RADICAL: NOVO SISTEMA DE SEÇÕES */
.main-section {
  position: relative;
  width: 100%;
  min-height: 400px;
}

.sections-container {
  width: 100%;
  position: relative;
  min-height: 400px;
}

.section-content {
  display: none;
  width: 100%;
  min-height: 400px;
}

.section-content.active {
  display: block;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* NOVO: Estilos para dourado metálico claro e brilhante */
/* .hero-headline {
  position: absolute;
  display: inline-block;
  top: 1.5%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 1000000 !important;
  width: 75%;
  pointer-events: none;
  padding: 0 20px;
} */

.hero-section {
  height: 700px;
  position: relative; /* 🔥 JÁ DEVE TER ISSO */
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ALTERE O .hero-headline para ficar relativo à hero-section */
.hero-headline {
  position: absolute;
  display: inline-block;
  top: 1.5%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 100; /* 🔥 REDUZA o z-index (antes era 1000000) */
  width: 75%;
  pointer-events: none;
  padding: 0 20px;
}

.hero-headline h1::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    transparent 20%,
    white 50%,
    transparent 80%,
    transparent
  );
  background-size: 200% 100%;
  background-position: -100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shine 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes text-shine {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.hero-headline h1::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100px;
  width: 20px;
  height: 200%;
  background: white;
  z-index: 9997; /* Um pouco menor que o z-index do texto */
  animation: slide-shine 3s ease-in-out infinite;
  pointer-events: none;
  opacity: 0.7;
  transform: rotate(-45deg);
  transform-origin: center;
  /* Usar o texto como máscara */
  -webkit-mask: linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff);
  mask-composite: exclude;
}

.hero-headline h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  background: linear-gradient(
    135deg,
    #FFD700 0%,     /* Ouro brilhante */
    #FFF8DC 25%,    /* Dourado muito claro */
    #FFEC8B 50%,    /* Dourado claro */
    #FFD700 75%,    /* Ouro */
    #F0E68C 100%    /* Dourado khaki claro */
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  text-shadow: 
    /* Contorno sutil para legibilidade */
    0 0.5px 1px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.1),
    /* Brilho dourado intenso */
    0 0 2.5px rgba(255, 215, 0, 0.4),
    0 0 5px rgba(255, 215, 0, 0.3),
    0 0 7.5px rgba(255, 215, 0, 0.2),
    0 0 10px rgba(255, 215, 0, 0.1);
  line-height: 1.1;
  letter-spacing: 0.5px;
  position: relative;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-transform: uppercase;
  -webkit-text-stroke: 0.35px #000;
  animation: gold-gradient-flow 1.5s ease-in infinite;
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.hero-headline p {
  font-size: 1.7rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    #FFD700 0%,     /* Ouro brilhante */
    #FFF8DC 25%,    /* Dourado muito claro */
    #FFEC8B 50%,    /* Dourado claro */
    #FFD700 75%,    /* Ouro */
    #F0E68C 100%    /* Dourado khaki claro */
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 0 8px rgba(255, 215, 0, 0.3),
    0 0 16px rgba(255, 215, 0, 0.2),
    0 0 24px rgba(255, 215, 0, 0.1);
  line-height: 1.4;
  max-width: 800px;
  margin: 0 auto;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 0.3px;
  -webkit-text-stroke: 0.65px #000;
}

/* Animação do gradiente dourado */
@keyframes gold-gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hero-headline p {
  animation: gold-gradient-flow 10s ease-in infinite;
}

/* Efeito de brilho intensificado no hover */
.hero-headline:hover h1 {
  animation-duration: 1.5s;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(255, 215, 0, 0.6),
    0 0 30px rgba(255, 215, 0, 0.4),
    0 0 45px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.2);
}

.hero-headline:hover h1::before {
  animation-duration: 2s;
}

@media (min-width:1025px) and (max-width: 1115px) {
  .center-person-3d{
    top: -8.35%;
    left: -5.05%;
    width: 110%;
    height: 117%;
  }
}

/* MEDIA QUERIES UNIFICADAS */
@media (max-width: 1024px) {
  .hero-headline {
    /*top: 10%;*/
    max-width: 95%;
  }
  
  .hero-headline h1 {
    font-size: 2.2rem;
    white-space: normal;
    font-weight: 700;
  }
  
  .hero-headline p {
    font-size: 1.3rem;
    white-space: normal;
    font-weight: 500;
  }
  
  .carousel-3d-item {
    width: 150px;
    height: 267px;
    margin-top: -133.5px;
    margin-left: -75px;
  }
  
  .carousel-3d-control {
    width: 60px;
    height: 60px;
    font-size: 2.5rem;
  }
  
  .carousel-3d-wrapper {
    perspective: 2000px;
  }
}

@media (max-width: 768px) {
  .hero-headline {
    top: 12%;
    max-width: 95%;
  }
  
  .hero-headline h1 {
    font-size: 2rem;
    margin-bottom: 0.8rem;
    white-space: normal;
    letter-spacing: 0.3px;
  }
  
  .hero-headline p {
    font-size: 1.2rem;
    max-width: 95%;
    white-space: normal;
    letter-spacing: 0.2px;
  }
  
  .carousel-3d-item {
    width: 120px;
    height: 213px;
    margin-top: -106.5px;
    margin-left: -60px;
  }
  
  .carousel-3d-control {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
  
  .carousel-3d-control.prev {
    left: 2%;
  }
  
  .carousel-3d-control.next {
    right: 2%;
  }
  
  .carousel-3d-wrapper {
    height: 100vh;
    perspective: 1500px;
  }
  
  .center-person-3d{
    top: 7.7%;
    left: 7.5%;
    width: 85%;
    height: 84.5%;

    /*top: 19.4%;
    left: 17.5%;*/
    /*width: 65%;
    height: 61.2%;*/
  }
  
  /* 🔥 CORREÇÃO PARA NOVO SISTEMA EM MOBILE */
  .sections-container {
    min-height: 300px;
  }
  
  .section-content {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .hero-headline {
    top: 6%;
    max-width: 95%;
    padding: 0 15px;
  }
  
  .hero-headline h1 {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    white-space: normal;
    letter-spacing: 0.2px;
    text-transform: none; /* Remover uppercase em mobile */
  }
  
  .hero-headline p {
    font-size: 1rem;
    white-space: normal;
    letter-spacing: 0.1px;
  }
  
  .carousel-3d-item {
    width: 100px;
    height: 178px;
    margin-top: -89px;
    margin-left: -50px;
  }
  
  .carousel-3d-wrapper {
    height: 100vh;
    perspective: 1200px;
  }
  
  .center-person-3d{
    top: 12.5%;
    left: 12.5%;
    width: 75%;
    height: 75%;
  }
  
  /* 🔥 CORREÇÃO PARA NOVO SISTEMA EM MOBILE PEQUENO */
  .sections-container {
    min-height: 250px;
  }
  
  .section-content {
    min-height: 250px;
  }
}

/* 🔥 CORREÇÕES DE RESPONSIVIDADE CRÍTICAS */
@media (max-width: 1024px) {
  .hero-section {
    height: 600px;
  }
  
  .carousel-3d-item {
    width: 150px;
    height: 267px;
    margin-top: -133.5px;
    margin-left: -75px;
  }
  
  .carousel-3d-wrapper {
    perspective: 2000px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 500px;
  }
  
  .hero-headline {
    top: 1%; /* 🔥 SUBIR ainda mais em tablet */
  }
  
  .hero-headline h1 {
    font-size: 1.8rem;
    line-height: 1.2;
  }
  
  .carousel-3d-item {
    width: 120px;
    height: 213px;
    margin-top: -106.5px;
    margin-left: -60px;
  }
  
  .carousel-3d-control {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
  
  .carousel-3d-control.prev {
    left: 2%;
  }
  
  .carousel-3d-control.next {
    right: 2%;
  }
  
  .carousel-3d-wrapper {
    perspective: 1500px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 450px;
  }
  
  .hero-headline {
    top: 0.5%; /* 🔥 SUBIR ainda mais em mobile */
    width: 90%;
  }
  
  .hero-headline h1 {
    font-size: 1.3rem !important; /* 🔥 TEXTO um pouco menor */
    -webkit-text-stroke: 0.2px #000;
    text-transform: none;
  }
  
  .carousel-3d-item {
    width: 100px;
    height: 178px;
    margin-top: -89px;
    margin-left: -50px;
  }
  
  .carousel-3d-wrapper {
    perspective: 1200px;
  }
  
  .carousel-3d-control {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}

/* Garantir que as seções tenham tamanho definido */
.section-content {
  position: relative;
  min-height: 500px;
  overflow: hidden;
}

/* Forçar os containers dos backgrounds a terem tamanho */
.blackhole-container,
.globe-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 0 !important;
  pointer-events: auto !important;
}

/* Garantir que o canvas do Three.js ocupe todo o espaço */
.blackhole-container canvas,
.globe-container canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}

/* Conteúdo das seções fica acima */
.section-content > :not(.blackhole-container):not(.globe-container):not(.compass-field-canvas):not(.galaxy-canvas):not(.galton-container):not(.matrix-canvas) {
  position: relative;
  z-index: 10;
}

/*Novo*/ 
/* Todos os backgrounds devem permitir que os cliques passem através */
.compass-field-canvas,
.galaxy-canvas,
.galton-container,
.matrix-canvas,
.blackhole-container/*,
.globe-container*/ {
  pointer-events: none !important;
}

/* MAS os elementos interativos DENTRO dos backgrounds (como botões do globo) precisam capturar eventos */
.globe-container button,
.globe-container input,
.globe-container .globe-controls {
  pointer-events: auto !important;
}

/* Para o blackhole, apenas o canvas não deve receber eventos, mas os textos informativos podem */
.blackhole-container canvas {
  pointer-events: none !important;
}

.blackhole-container .blackhole-info,
.blackhole-container .blackhole-controls-note {
  pointer-events: none !important;
}
</style>