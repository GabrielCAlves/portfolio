<template>
  <section class="section mobile-section" :class="{ 'content-hidden': !showContent, 'no-interaction': !showContent }">
    <!-- 🔥 BOTÃO NO CANTO SUPERIOR ESQUERDO -->
    <div class="toggle-button-container">
      <button @click="toggleContent" class="toggle-visibility-btn">
        {{ showContent ? $t('mobile.hidecontent') : $t('mobile.showcontent') }}
      </button>
    </div>
    
    <h2 class="section-title" :key="forceUpdate">{{ $t('mobile') }}</h2>
    
    <div class="projects-container" v-if="showContent">
      <div v-for="project in projects" :key="project.id" class="project">
        <h3 class="project-title">{{ project.title }}</h3>
        <div class="project-content">
          <div class="project-info">
            <ul>
              <li :key="forceUpdate" class="technologies-item">
                <div class="technologies-header">
                  <strong>{{ $t('technologiesLabel') }}</strong>
                </div>
                <div class="project-tech-grid">
                  <div 
                    v-for="tech in project.technologies" 
                    :key="tech" 
                    class="project-tech-item"
                    :title="tech"
                  >
                    <img 
                      :src="getTechLogo(tech)" 
                      :alt="tech" 
                      class="project-tech-logo"
                      @error="handleImageError"
                    />
                    <span class="project-tech-name"><strong>{{ tech }}</strong></span>
                  </div>
                </div>
              </li>
              <li :key="forceUpdate"><strong>{{ $t('myRole') }}</strong> {{ project.role }}</li>
              <li :key="forceUpdate">
                <strong>{{ $t('myResponsibilities') }}</strong> 
                {{ project.responsibilities }}
              </li>
              <li :key="forceUpdate" class="about-item">
                <div class="about-header">
                  <strong>{{ $t('projectAbout') }}</strong>
                </div>
                <p class="project-description">{{ project.description }}</p>
              </li>
              <li :key="forceUpdate">
                <strong>{{ $t('highlights') }}</strong> 
                {{ project.highlights }}
                <button 
                  v-if="project.githubUrl" 
                  class="github-btn"
                  @click="openGithub(project.githubUrl)"
                >
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" class="icon" /> {{ $t('viewOnGitHub') }}
                </button>
              </li>
            </ul>
          </div>
          <div class="project-media">
            <MediaCarousel :media="project.media" section="mobile-section" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { cloudinaryUrls } from '@/services/cloudinary'
import MediaCarousel from './MediaCarousel.vue'
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate, currentLanguage } = useTranslations()

const projects = ref([])
const showContent = ref(true)

// 🔥 FUNÇÃO PARA ALTERNAR CONTEÚDO
const toggleContent = async () => {
  showContent.value = !showContent.value
  
  await nextTick()
  
  // 🔥 FORÇA O REDIMENSIONAMENTO DO BACKGROUND
  window.dispatchEvent(new Event('resize'))
  
  // Dispara múltiplas vezes para garantir
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 50)
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 150)
}

// Função para obter projetos estáticos com traduções atualizadas
const loadStaticProjects = () => {
  projects.value = [
    {
      id: 'project1',
      title: 'ConsultasQX',
      technologies: ['Android Studio', 'Firebase', 'Java', 'XML'],
      role: $t('mobile.consultasqx.role'),
      responsibilities: $t('mobile.consultasqx.responsibilities'),
      description: $t('mobile.consultasqx.description'),
      highlights: '',
      downloadUrl: '',
      githubUrl: 'https://github.com/giovanavi/mobile/tree/main/ConsultasQX',
      media: cloudinaryUrls.mobileProjects.project1.media
    },
    {
      id: 'project2',
      title: 'Motora', 
      technologies: ['Android Studio', 'Firebase', 'Java', 'XML'],
      role: $t('mobile.motora.role'),
      responsibilities: $t('mobile.motora.responsibilities'),
      description: $t('mobile.motora.description'),
      highlights: '',
      downloadUrl: '',
      githubUrl: 'https://github.com/dabliu89/Motora/tree/main/Codigo',
      media: cloudinaryUrls.mobileProjects.project2.media
    },
    {
      id: 'project3',
      title: 'Feirão Nordeste',
      technologies: ['Android Studio', 'Firebase', 'ImgBB', 'Java', 'XML'],        
      role: $t('mobile.feiraonordeste.role'),
      responsibilities: $t('mobile.feiraonordeste.responsibilities'),
      description: $t('mobile.feiraonordeste.description'),
      highlights: '',
      downloadUrl: '',
      githubUrl: 'https://github.com/GabrielCAlves/trabalhos2e3/tree/main/Trabalho2',
      media: cloudinaryUrls.mobileProjects.project3.media
    },
  ]
}

// Função para obter logo da tecnologia
const getTechLogo = (techName) => {
  return cloudinaryUrls.technologyLogos[techName] || ''
}

// Função para tratar erro de carregamento de imagem
const handleImageError = (event) => {
  const parent = event.target.parentElement
  if (parent) {
    const textElement = parent.querySelector('.project-tech-name')
    if (textElement) {
      textElement.style.opacity = '1'
    }
  }
}

const loadProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'mobile-projects'))
    
    projects.value = querySnapshot.docs.map(doc => {
      const projectData = doc.data()
      const projectId = projectData.id || `project${doc.id}`
      
      let cloudinaryMedia = []
      if (cloudinaryUrls.mobileProjects[projectId]) {
        cloudinaryMedia = cloudinaryUrls.mobileProjects[projectId].media
      }
      
      return {
        id: doc.id,
        ...projectData,
        media: cloudinaryMedia
      }
    })
  } catch (error) {
    console.error('Error loading projects:', error)
    loadStaticProjects();
  }
}

const openGithub = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

watch(currentLanguage, () => {
  loadStaticProjects()
})

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.section {
  padding: 2rem;
  color: white;
  position: relative;
  transition: height 0.3s ease;
}

/* 🔥 QUANDO CONTEÚDO ESTÁ ESCONDIDO, ALTURA FIXA */
.section.content-hidden {
  height: 1000px !important;
  min-height: 1000px !important;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
}

/* 🔥 ESTILOS DO BOTÃO - CANTO SUPERIOR ESQUERDO */
.toggle-button-container {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.toggle-visibility-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-visibility-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 10;
}

.project {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.project-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.project-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  flex: 1;
}

.project-info ul {
  list-style: none;
  padding: 0;
}

.project-info li {
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 1.6;
}

.github-btn {
  background: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  vertical-align: middle;
}

.github-btn:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
}

.technologies-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  z-index: 10;
}

.technologies-header {
  width: 100%;
}

.technologies-header strong {
  display: block;
}

.project-tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  position: relative;
  z-index: 10;
}

.project-tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  color: black;
  padding: 0.8rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  min-width: 80px;
  min-height: 80px;
  flex: 0 0 auto;
  position: relative;
  z-index: 10;
}

.project-tech-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.project-tech-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.project-tech-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
}

.project-media {
  width: 100%;
  position: relative;
  z-index: 1;
}

.project-info li {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
}

.project-info li strong {
  white-space: nowrap;
  flex-shrink: 0;
}

.project-info li:nth-child(3) {
  align-items: flex-start;
}

.project-info li:nth-child(3) strong {
  align-self: flex-start;
  margin-top: 0.2rem;
}

.about-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
}

.about-header {
  width: 100%;
}

.about-header strong {
  display: block;
  color: #fff;
}

.project-description {
  line-height: 1.6;
  font-size: 1rem;
  color: rgba(255, 255, 255);
  margin: 0;
  text-align: left;
  width: 100%;
}

/* Responsividade */
@media (max-width: 968px) {
  .project-content {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
  }
  
  .project-media {
    order: -1;
  }
  
  .section.content-hidden {
    height: 800px !important;
    min-height: 800px !important;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .section.content-hidden {
    height: 700px !important;
    min-height: 700px !important;
  }
  
  .project {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.5rem;
    margin-top: 20px;
  }

  .project-media {
    margin-top: -50px;
    margin-bottom: -30px;
  }
  
  .project-tech-grid {
    gap: 0.4rem;
  }
  
  .project-tech-item {
    min-width: 70px;
    min-height: 70px;
    padding: 0.6rem 0.4rem;
  }
  
  .project-tech-logo {
    width: 25px;
    height: 25px;
  }
  
  .project-tech-name {
    font-size: 0.7rem;
  }
  
  .github-btn {
    margin-top: 0.5rem;
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
  
  .toggle-visibility-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .toggle-button-container {
    top: 10px;
    left: 10px;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section.content-hidden {
    height: 600px !important;
    min-height: 600px !important;
  }
  
  .project {
    padding: 0.5rem;
    margin-left: -0.5rem;
    width: 105%;
  }
  
  .project-title {
    font-size: 1.3rem;
    margin-top: 20px;
  }

  .project-media {
    margin-top: -50px;
    margin-bottom: -30px;
  }

  .project-info li {
    padding-left: auto;
    padding-right: auto;
  }
  
  .project-tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .project-tech-item {
    min-width: 60px;
    min-height: 60px;
    padding: 0.5rem 0.3rem;
  }
  
  .project-tech-logo {
    width: 20px;
    height: 20px;
  }
  
  .project-tech-name {
    font-size: 0.65rem;
  }
  
  .toggle-visibility-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }
  
  .toggle-button-container {
    top: 8px;
    left: 8px;
  }
}

.section,
.projects-container,
.project {
  position: relative;
  z-index: 10;
}

.section {
  pointer-events: none;
}

.project,
button,
a {
  pointer-events: auto;
}
</style>