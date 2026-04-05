<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('aboutMe') }}</h2>
    <div class="about-content">
      <div class="left-column">
        <img :src="profileImage" alt="Profile" class="profile-image" />
        <div class="flags">
          <img 
            :src="ukFlag" 
            alt="English" 
            class="flag" 
            :class="{ active: currentLanguage === 'en' }"
            @click="changeLanguage('en')"
          />
          <img 
            :src="brFlag" 
            alt="Portuguese" 
            class="flag BR" 
            :class="{ active: currentLanguage === 'pt' }"
            @click="changeLanguage('pt')"
          />
        </div>
        <p class="curriculum-text" :key="forceUpdate">{{ $t('myCurriculum') }}</p>
        <div class="download-buttons">
          <button class="download-btn" @click="downloadCV('en')">
            <span :key="forceUpdate">{{ $t('downloadEnglishCV') }}</span>
          </button>
          <button class="download-btn" @click="downloadCV('pt')">
            <span :key="forceUpdate">{{ $t('downloadPortugueseCV') }}</span>
          </button>
        </div>
      </div>

      <div class="right-column">
        <div class="description-container">
          <p class="description" :key="forceUpdate">{{ $t('aboutDescription') }}</p>
          <p class="description" :key="forceUpdate">{{ $t('aboutDescription2') }}</p>
          <p class="description" :key="forceUpdate">{{ $t('aboutDescription3') }}</p>
          <ul class="experience-list">
            <li class="description" :key="forceUpdate">{{ $t('aboutDescription4') }}</li>
            <li class="description" :key="forceUpdate">{{ $t('aboutDescription5') }}</li>
            <li class="description" :key="forceUpdate">{{ $t('aboutDescription6') }}</li>
          </ul>
          <p class="description" :key="forceUpdate">{{ $t('aboutDescription7') }}</p>
        </div>
        
        <h3 :key="forceUpdate">{{ $t('technologies') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in technologies" 
            :key="tech" 
            class="tech-item"
            :title="tech"
          >
            <img 
              :src="getTechLogo(tech)" 
              :alt="tech" 
              class="tech-logo"
              @error="handleImageError"
            />
            <span class="tech-name"><strong>{{ tech }}</strong></span>
          </div>
        </div>

        <h3 :key="forceUpdate">{{ $t('otherKnowledges') }}</h3>
        <div class="knowledge-grid">
          <div 
            v-for="knowledge in otherKnowledges" 
            :key="knowledge" 
            class="knowledge-item"
            :title="knowledge"
          >
            <img 
              :src="getTechLogo(knowledge)" 
              :alt="knowledge" 
              class="knowledge-logo"
              @error="handleImageError"
            />
            <span class="knowledge-name"><strong>{{ knowledge }}</strong></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { cloudinaryUrls } from '@/services/cloudinary'
import { translationService } from '@/services/translations'
import { useTranslations } from '@/composables/useTranslations'

const { $t, currentLanguage, forceUpdate } = useTranslations()

const profileImage = ref('')
const ukFlag = ref('')
const brFlag = ref('')

// Dados estáticos
const technologies = [
  'C#', 'C++', 'C', 'Java', 'Android Studio',  
  'Unity', 'Git', 'Git bash', 'GitLab', 'Firebase',
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Rest APIs', 
  'Vue.js', 'Vite', 'Vuetify', 'Bootstrap', 'Node.js', 
  'DBeaver', 'PostgreSQL', 'MySQL', 'SpringBoot', 'Strapi'
]

const otherKnowledges = [
  'UI/UX', 'OOP', 'Agile Methodology', 'Scrum', 'DevOps Practices', 
  'Astah', 'Figma', 'Adobe XD'
]

// Função para obter logo da tecnologia
const getTechLogo = (techName) => {
  return cloudinaryUrls.technologyLogos[techName] || ''
}

// Função para tratar erro de carregamento de imagem
const handleImageError = (event) => {
  // Fallback: mostrar o nome da tecnologia se a imagem não carregar
  const parent = event.target.parentElement
  if (parent) {
    const textElement = parent.querySelector('.tech-name, .knowledge-name')
    if (textElement) {
      textElement.style.opacity = '1'
    }
  }
}

const changeLanguage = (language) => {
  // 🔥 ATUALIZAR O SERVIÇO E DISPARAR EVENTO
  translationService.setLanguage(language)
  currentLanguage.value = language
}

const downloadCV = (language) => {
  const cvUrls = {
    en: '/cv-english.pdf',
    pt: '/cv-portuguese.pdf'
  }
  
  const cvNames = {
    en: 'CV_Gabriel_Cavalcanti_English.pdf',
    pt: 'CV_Gabriel_Cavalcanti_Portuguese.pdf'
  }
  
  const link = document.createElement('a')
  link.href = cvUrls[language]
  link.download = cvNames[language]
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const loadImages = () => {
  try {
    profileImage.value = cloudinaryUrls.profile || ''
    ukFlag.value = cloudinaryUrls.ukFlag || ''
    brFlag.value = cloudinaryUrls.brFlag || ''
  } catch (error) {
    console.error('Error loading images:', error)
    profileImage.value = ''
    ukFlag.value = ''
    brFlag.value = ''
  }
}

const handleLanguageChange = (event) => {
  currentLanguage.value = event.detail
}

onMounted(() => {
  loadImages()
  window.addEventListener('languageChanged', handleLanguageChange)
})

onUnmounted(() => {
  window.removeEventListener('languageChanged', handleLanguageChange)
})
</script>

<style scoped>
.section {
  padding: 2rem;
  color: white;
  min-height: 400px;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.left-column {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  background: #ddd;
}

.flags {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.flag {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.BR{
  width: 43px;
  height: 43px;
}

.flag.active {
  border-color: #FFFFFF;
  transform: scale(1.2);
}

.flag:hover {
  transform: scale(1.1);
}

.curriculum-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.download-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 90%;
  max-width: 150px;
}

.download-btn {
  background: white;
  color: #007aff;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.right-column h3 {
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.skills-list,
.knowledge-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  list-style: none;
}

.skills-list li,
.knowledge-list li {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-align: center;
}

.description-container {
  margin-bottom: 1.5rem;
}

.description {
  line-height: 1.5;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  text-align: justify;
}

.description:last-child {
  margin-bottom: 0;
}

/* Estilos para a lista de experiência */
.experience-list {
  margin: 0.5rem 0 1rem 1.5rem;
  padding: 0;
  list-style-type: disc;
}

.experience-list li {
  line-height: 1.5;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
  text-align: justify;
}

.experience-list li:last-child {
  margin-bottom: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .download-buttons {
    max-width: 100%;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 0.7rem;
  }
  
  .experience-list {
    margin-left: 1rem;
  }
  
  .experience-list li {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }
}

.tech-grid,
.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.tech-item,
.knowledge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(255, 255, 255);
  color: black;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 100px;
}

.tech-item:hover,
.knowledge-item:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.tech-logo,
.knowledge-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.tech-name,
.knowledge-name {
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.9;
  text-align: center;
  word-break: break-word;
}

/* Responsividade */
@media (max-width: 768px) {
  .tech-grid,
  .knowledge-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  .tech-item,
  .knowledge-item {
    padding: 0.8rem;
    min-height: 90px;
  }
  
  .tech-logo,
  .knowledge-logo {
    width: 35px;
    height: 35px;
  }
  
  .tech-name,
  .knowledge-name {
    font-size: 0.75rem;
  }
}

/* ADICIONE AO AboutSection.vue */

@media (max-width: 968px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .left-column {
    order: 1; /* 🔥 MUDAR de 2 para 1 - FICA EM CIMA */
  }
  
  .right-column {
    order: 2; /* 🔥 MUDAR de 1 para 2 - FICA EMBAIXO */
  }
  
  .profile-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .tech-grid,
  .knowledge-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  .tech-item,
  .knowledge-item {
    padding: 0.8rem;
    min-height: 85px;
  }
  
  .tech-logo,
  .knowledge-logo {
    width: 30px;
    height: 30px;
  }
  
  .download-buttons {
    flex-direction: row;
    max-width: 100%;
    gap: 1rem;
  }
  
  .download-btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .tech-grid,
  .knowledge-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.6rem;
  }
  
  .tech-item,
  .knowledge-item {
    padding: 0.6rem;
    min-height: 75px;
  }
  
  .tech-logo,
  .knowledge-logo {
    width: 25px;
    height: 25px;
  }
  
  .download-buttons {
    flex-direction: column;
  }
}
</style>