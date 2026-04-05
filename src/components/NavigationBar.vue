<template>
  <nav class="navbar">
    <div class="nav-background"></div>
    <div class="nav-links">
      <a 
        v-for="(section, index) in sections" 
        :key="`${section.id}-${forceUpdate}`"
        @click="$emit('sectionChange', index)"
        :class="{ active: activeSection === index }"
      >
        {{ getSectionTitle(section.id) }}
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate } = useTranslations()

const sections = [
  { id: 'about' },
  { id: 'personal-work' },
  { id: 'professional-work' },
  { id: 'web' },
  { id: 'mobile' },
  { id: 'contacts' }
]

const getSectionTitle = (sectionId) => {
  const titleMap = {
    'about': 'about',
    'personal-work': 'personal-work', 
    'professional-work': 'professional-work',
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
  position: relative;
  width: 100%;
  height: 100px; /* Altura fixa para a barra */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Alta prioridade para ficar acima de tudo */
}

/* Fundo com gradiente vertical: preto → vermelho/azul */
.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  backdrop-filter: blur(10px);
  z-index: -1;
  overflow: hidden;
}

.nav-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%; /* Metade superior */
  /* background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  ); */
}


.nav-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  z-index: 2;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-links a.active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* ADICIONE AO NavigationBar.vue */
@media (max-width: 768px) {
  .navbar {
    height: 110px;
    padding-top: 10px;
  }
  
  .nav-links {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 1rem;
  }
  
  .nav-links a {
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    font-size: 0.9rem;
    border-radius: 20px;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 110px;
    padding-top: 10px;
  }

  .nav-links {
    gap: 0.3rem;
  }
  
  .nav-links a {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>