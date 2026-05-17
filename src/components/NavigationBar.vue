<template>
  <nav class="navbar">
    <div class="nav-background"></div>
    
    <!-- Imagem e texto do lado esquerdo -->
    <div class="nav-logo">
      <img src="/android-chrome-512x512.png" alt="Logo" class="logo-image" />
      <span class="logo-text"><strong>Gabriel Game Dev.</strong></span>
    </div>
    
    <div class="nav-links">
      <a 
        v-for="(section, index) in sections" 
        :key="`${section.id}-${forceUpdate}`"
        @click="$emit('sectionChange', index)"
        :class="{ active: activeSection === index }"
      >
        <strong>{{ getSectionTitle(section.id) }}</strong>
        <span class="nav-indicator"></span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate } = useTranslations()

const sections = [
  { id: 'about' },
  { id: 'games' },
  { id: 'projects' },
  { id: 'web' },
  { id: 'mobile' },
  { id: 'contacts' }
]

const getSectionTitle = (sectionId) => {
  const titleMap = {
    'about': 'about',
    'games': 'games', 
    'projects': 'projects',
    'web': 'web',
    'mobile': 'mobile',
    'contacts': 'contacts'
  }
  
  const translationKey = titleMap[sectionId]
  return $t(translationKey)
}

defineProps({
  activeSection: {
    type: Number,
    required: true
  }
})

defineEmits(['sectionChange'])
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  padding: 0 2rem;
  isolation: isolate;
}

/* Fundo escuro azulado */
.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #080c16;
  backdrop-filter: blur(12px);
  z-index: -1;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

/* Estilos para o logo e texto */
.nav-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  padding-left: 20px;
  z-index: 2;
}

.logo-image {
  height: 60px;
  width: auto;
  object-fit: contain;
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
  filter: brightness(1.15) sepia(0.9) saturate(1.8) hue-rotate(0deg);
}

.logo-text {
  color: white;
  font-size: 1.2rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.logo-text strong {
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #cc0000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-logo:hover .logo-text {
  transform: translateX(5px);
  transform: scale(1.05);
  filter: brightness(1.15) sepia(0.9) saturate(1.8) hue-rotate(0deg);
}

.nav-links {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  z-index: 2;
  position: relative;
  padding-left: 10px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  padding-top: 25px;
  cursor: pointer;
  position: relative;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.5px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Indicador (barra vermelha embaixo) */
.nav-indicator {
  position: relative;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff3333, #cc0000);
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

/* Hover effect - barra se estende a partir do centro */
.nav-links a:hover .nav-indicator {
  width: 100%;
}

.nav-links a:hover {
  color: #cc0000;
  text-shadow: 0 0 5px rgba(255, 50, 50, 0.5);
}

/* Active state - barra vermelha fica visível até a seção ser trocada */
.nav-links a.active {
  color: white;
  font-weight: bold;
}

.nav-links a.active .nav-indicator {
  width: 100%;
  background: linear-gradient(90deg, #ff4444, #cc0000);
  box-shadow: 0 0 8px rgba(255, 50, 50, 0.6);
}

/* Efeito de brilho no texto ativo */
.nav-links a.active {
  text-shadow: 0 0 8px rgba(255, 50, 50, 0.5);
}

/* 🔥 RESPONSIVIDADE PARA TELA ENTRE 651px E 716px */
@media (min-width: 651px) and (max-width: 763px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-logo {
    padding-left: 0;
    justify-content: center;
    gap: 10px;
  }
  
  .logo-image {
    height: 45px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .nav-links {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .nav-links a {
    padding-top: 5px;
    font-size: 0.8rem;
  }
}

/* 🔥 RESPONSIVIDADE PARA TELA ENTRE 764px E 800px */
@media (min-width: 764px) and (max-width: 800px) {
  .navbar {
    padding: 0 1rem;
  }
  
  .nav-logo {
    gap: 10px;
    padding-left: 10px;
  }
  
  .logo-image {
    height: 50px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .nav-links {
    gap: 0.8rem;
  }
  
  .nav-links a {
    font-size: 0.9rem;
    padding-top: 25px;
  }
  
  .nav-indicator {
    height: 2px;
  }
}

/* 🔥 RESPONSIVIDADE PARA TELA ENTRE 854px E 922px */
@media (min-width: 854px) and (max-width: 922px) {
  .navbar {
    padding: 0 1.5rem;
  }
  
  .nav-logo {
    gap: 12px;
  }
  
  .logo-image {
    height: 55px;
  }
  
  .logo-text {
    font-size: 1.05rem;
  }
  
  .nav-links {
    gap: 1.2rem;
  }
  
  .nav-links a {
    font-size: 0.85rem;
    padding-top: 25px;
  }
}

/* Responsividade padrão para telas médias (já coberto por cima) */
@media (min-width: 801px) and (max-width: 853px) {
  .navbar {
    padding: 0 1.2rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .nav-links a {
    font-size: 0.85rem;
  }
  
  .logo-image {
    height: 52px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
}

/* Responsividade para telas menores que 650px */
@media (max-width: 650px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-logo {
    padding-left: 0;
    justify-content: center;
    gap: 10px;
  }
  
  .logo-image {
    height: 45px;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .nav-links {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .nav-links a {
    padding-top: 5px;
    font-size: 0.8rem;
  }
}

/* Responsividade para mobile */
@media (max-width: 480px) {
  .logo-image {
    height: 35px;
  }
  
  .logo-text {
    font-size: 0.8rem;
  }
  
  .nav-links {
    gap: 0.5rem;
  }
  
  .nav-links a {
    font-size: 0.7rem;
    padding-top: 5px;
  }
  
  .nav-indicator {
    height: 2px;
  }
}
</style>