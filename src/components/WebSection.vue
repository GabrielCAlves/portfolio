<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('web') }}</h2>
    <div class="projects-container">
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
              <!-- 🔥 NOVA SEÇÃO: ABOUT DO PROJETO -->
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
            <MediaCarousel :media="project.media" section="web-section" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { cloudinaryUrls } from '@/services/cloudinary'
import MediaCarousel from './MediaCarousel.vue'
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate, currentLanguage } = useTranslations()

const projects = ref([])

// Função para obter projetos estáticos com traduções atualizadas
const loadStaticProjects = () => {
  projects.value = [
    {
      id: 'project1',
      title: 'Adota Aí',
      technologies: ['Strapi', 'MySQL', 'Vue.js', 'Vuetify', 'Vite', 'Pinia', 'Bootstrap', 'JavaScript', 'CSS', 'HTML'],
      role: $t('web.adotaai.role'),
      responsibilities: $t('web.adotaai.responsibilities'),
      description: $t('web.adotaai.description'),
      highlights: '',
      downloadUrl: '',
      githubUrl: 'https://github.com/Italorodri/Projeto-Final-WEB',
      media: cloudinaryUrls.webProjects.project1.media
    },
    {
      id: 'project2',
      title: 'Casa do Ancião', 
      technologies: ['SpringBoot', 'DBeaver', 'PostgreSQL', 'Vue.js', 'Vuetify', 'Vite', 'Pinia', 'Java', 'TypeScript', 'CSS', 'HTML'],    
      role: $t('web.casadoanciao.role'),
      responsibilities: $t('web.casadoanciao.responsibilities'),
      description: $t('web.casadoanciao.description'),
      highlights: ['Private Source'],
      downloadUrl: '',
      githubUrl: '',
      media: cloudinaryUrls.webProjects.project2.media
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
    const querySnapshot = await getDocs(collection(db, 'web-projects'))
    
    projects.value = querySnapshot.docs.map(doc => {
      const projectData = doc.data()
      const projectId = projectData.id || `project${doc.id}`
      
      let cloudinaryMedia = []
      if (cloudinaryUrls.webProjects[projectId]) {
        cloudinaryMedia = cloudinaryUrls.webProjects[projectId].media
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

// 🔥 FUNÇÃO PARA ABRIR GITHUB
const openGithub = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// Watch para recarregar projetos quando o idioma mudar
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
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.project {
  background: rgba(255, 255, 255, 0.1);
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

/* 🔥 CORREÇÃO: BOTÕES GITHUB ALINHADOS */
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

/* 🔥 CORREÇÃO: ÍCONES SVG */
.icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
}

.github-btn .icon {
  filter: brightness(0) invert(1);
}

/* 🔥 CORREÇÃO: ESTRUTURA DE TECNOLOGIAS (já tem z-index) */
.technologies-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  position: relative; /* 🔥 JÁ DEVE TER */
  z-index: 10; /* 🔥 JÁ DEVE TER */
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

/* 🔥 CORREÇÃO: MEDIA CAROUSEL COM Z-INDEX MENOR */
.project-media {
  width: 100%;
  position: relative;
  z-index: 1;
}

/* 🔥 CORREÇÃO: ITENS DA LISTA COM LAYOUT CORRETO E Z-INDEX */
.project-info li {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  position: relative; /* 🔥 ADICIONE ISSO */
  z-index: 10; /* 🔥 ADICIONE ISSO */
}

/* 🔥 CORREÇÃO: LABELS FORTES */
.project-info li strong {
  white-space: nowrap;
  flex-shrink: 0;
}

/* 🔥 CORREÇÃO ESPECÍFICA PARA HIGHLIGHTS */
.project-info li:nth-child(3) {
  align-items: flex-start;
}

.project-info li:nth-child(3) strong {
  align-self: flex-start;
  margin-top: 0.2rem;
}

/* 🔥 RESPONSIVIDADE PARA TELAS MENORES */
@media (max-width: 768px) {
  .project-tech-grid {
    gap: 0.4rem;
  }
  
  .project-tech-item {
    min-width: 70px;
    min-height: 70px;
    padding: 0.6rem 0.4rem;
  }
  
  .project-tech-logo {
    width: 28px;
    height: 28px;
  }
  
  .project-tech-name {
    font-size: 0.7rem;
  }
}

/* 🔥 ADICIONE ESTES ESTILOS PARA A NOVA SEÇÃO ABOUT */
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

/* Ajuste o espaçamento dos itens da lista */
.project-info li {
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 1.6;
}

/* ADICIONE A TODAS AS SEÇÕES DE PROJETOS */
@media (max-width: 968px) {
  .project-content {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
  }
  
  .project-media {
    order: -1; /* Coloca o carousel acima nas telas menores */
  }
}

@media (max-width: 768px) {
  .project {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.5rem;
    margin-bottom: 20px !important;
  }

  .project-media {
    margin-top: -95px;
    margin-bottom: -105px;
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
  
  .github-btn,
  .download-btn {
    margin-top: 0.5rem;
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .project {
    padding: 0.5rem;
    margin-left: -0.5rem;
    width: 105%;
  }
  
  .project-title {
    font-size: 1.3rem;
    margin-top: 20px;
    margin-bottom: 20px !important;
  }

  .project-media {
    margin-top: -95px;
    margin-bottom: -105px;
  }

  .project-info li {
    padding-left: auto;
    padding-right: auto;
  }
  
  .project-tech-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 colunas fixas */
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
}
</style>