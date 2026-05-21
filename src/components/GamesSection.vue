<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('games') }}</h2>
    <div class="projects-container">
      <!-- 🔥 ADICIONAR DATA-ATRIBUTE PARA IDENTIFICAÇÃO -->
      <div 
        v-for="(project, idx) in projects" 
        :key="project.id" 
        :data-project-index="idx"
        class="project"
        :ref="el => { if(el) setProjectRef(el, idx) }"
      >
        <h3 class="project-title">{{ project.title }}</h3>
        <div class="project-content">
          <div class="project-info">
            <ul>
              <!-- ABOUT DO PROJETO -->
              <li :key="forceUpdate" class="about-item">
                <div class="about-header">
                  <strong>{{ $t('projectAbout') }}</strong>
                </div>
                <p class="project-description">{{ project.description }}</p>
              </li>

              <!-- PLATAFORMA DO PROJETO -->
              <!-- <li :key="forceUpdate" class="platform-item">
                <div class="platform-header">
                  <strong>{{ $t('platform') }}</strong>
                </div>
                <div class="platform-content">
                  <span class="platform-value">{{ project.platform || 'PC (Windows)' }}</span>
                </div>
              </li> -->
              <!-- PLATAFORMAS DO PROJETO -->
              <li :key="forceUpdate" class="platform-item">
                <div class="platform-header">
                  <strong>{{ $t('platform') }}</strong>
                </div>

                <div class="platform-tags">
                  <span
                    v-for="platform in getPlatformList(project.platform)"
                    :key="platform"
                    class="platform-tag"
                  >
                    {{ platform }}
                  </span>
                </div>
              </li>

              <!-- TECNOLOGIAS -->
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

              <!-- RESPONSABILIDADES (SEPARADAS EM ITENS DE LISTA) -->
              <li :key="forceUpdate" class="responsibilities-item">
                <strong>{{ $t('myResponsibilities') }}</strong>
                <ul class="responsibilities-list">
                  <li v-for="(responsibility, idx) in getResponsibilitiesList(project.responsibilities)" 
                      :key="idx" 
                      class="responsibility-list-item">
                    {{ responsibility }};
                  </li>
                </ul>
              </li>

              <!-- HIGHLIGHTS / CÓDIGO -->
              <li :key="forceUpdate" class="highlights-item">
                <strong>{{ $t('highlights') }}</strong>
                <div class="highlights-content">
                  <span>{{ project.highlights}}</span>
                  <button 
                    v-if="project.githubUrl" 
                    class="github-btn"
                    @click="openUrl(project.githubUrl)"
                  >
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" class="icon" /> {{ $t('viewOnGitHub') }}
                  </button>
                </div>
              </li>

              <!-- WANT TO TRY / LINK -->
              <li :key="forceUpdate" class="try-item">
                <strong>{{ $t('wantToTry') }}</strong>
                <button 
                  v-if="project.projectUrl"
                  class="project-link-btn" 
                  @click="openProjectLink(project)"
                >
                  <img 
                    v-if="getLinkIcon(project)" 
                    :src="getLinkIcon(project)" 
                    alt="link" 
                    class="icon" 
                  />
                  {{ getLinkLabel(project) }}
                </button>
                <span v-else class="no-link">{{ $t('link') }}</span>
              </li>
            </ul>
          </div>
          <div class="project-media">
            <!-- 🔥 VERTICAL CONTROLADO RESPONSIVAMENTE -->
            <MediaCarousel 
              :media="project.media" 
              section="games" 
              :vertical="getCarouselVertical(project)" 
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { cloudinaryUrls } from '@/services/cloudinary'
import MediaCarousel from './MediaCarousel.vue'
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate, currentLanguage } = useTranslations()

// 🔥 REF PARA CONTROLE RESPONSIVO
const isMobile = ref(window.innerWidth <= 968)

// 🔥 ADICIONAR REFS PARA OS PROJETOS
const projectRefs = ref([])

const setProjectRef = (el, index) => {
  if (el) {
    projectRefs.value[index] = el
    // Também adicionar um ID único
    if (!el.id) {
      el.id = `project-${index}`
    }
  }
}

const projects = ref([])

// 🔥 FUNÇÃO PARA DETERMINAR O VALOR DE VERTICAL BASEADO NA TELA
const getCarouselVertical = (project) => {
  // Se for tela mobile (<= 968px), queremos false
  // Se for desktop (> 968px), queremos true
  if (isMobile.value) {
    return false
  } else {
    return true
  }
}

const getPlatformList = (platformData) => {
  if (!platformData) return ['PC (Windows)']

  // Se já for array
  if (Array.isArray(platformData)) {
    return platformData
  }

  // Se for string
  if (typeof platformData === 'string') {
    return platformData
      .split(/[;,]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }

  return ['PC (Windows)']
}

// Função para separar responsabilidades em lista
const getResponsibilitiesList = (responsibilitiesText) => {
  if (!responsibilitiesText) return []
  
  // Se já for um array, retorna o array
  if (Array.isArray(responsibilitiesText)) return responsibilitiesText
  
  // Verifica se é uma string
  if (typeof responsibilitiesText === 'string') {
    // Tenta separar por diferentes delimitadores: ponto final, ponto e vírgula, vírgula, ou quebra de linha
    // Também remove espaços extras no início/fim de cada item
    const items = responsibilitiesText
      .split(/[.;,\n]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    // Se encontrou múltiplos itens, retorna eles
    if (items.length > 1) return items
    
    // Caso contrário, retorna como um único item
    return [responsibilitiesText.trim()]
  }
  
  return [responsibilitiesText]
}

// Função para determinar o ícone do link
const getLinkIcon = (project) => {
  if (project.projectUrl) {
    if (project.projectUrl.includes('itch.io')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/itchdotio.svg'
    }
    return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/internetexplorer.svg'
  }
  if (project.downloadUrl) {
    return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg'
  }
  if (project.githubUrl) {
    return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg'
  }
  return ''
}

// Função para determinar o texto do botão
const getLinkLabel = (project) => {
  if (project.projectUrl) {
    return $t('playlink') || 'Link'
  }
  if (project.downloadUrl) {
    return $t('downloadGame') || 'Download Game'
  }
  if (project.githubUrl) {
    return $t('viewOnGitHub')
  }
  return $t('playlink')
}

// Função unificada para abrir URLs
const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// Função principal para abrir link do projeto
const openProjectLink = (project) => {
  if (project.projectUrl) {
    openUrl(project.projectUrl)
  } else if (project.downloadUrl) {
    openUrl(project.downloadUrl)
  } else if (project.githubUrl) {
    openUrl(project.githubUrl)
  }
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

// 🔥 FUNÇÃO PARA ATUALIZAR O ESTADO MOBILE
const updateMobileState = () => {
  isMobile.value = window.innerWidth <= 968
}

// 🔥 LISTENER PARA REDIMENSIONAMENTO DA TELA
const handleResize = () => {
  updateMobileState()
}

// Função para obter projetos estáticos com traduções atualizadas
const loadStaticProjects = () => {
  projects.value = [
    {
      id: 'project1',
      title: 'Astro Adventure 3D',
      platform: 'PC (Windows)',
      technologies: ['Unity', 'C#'],
      role: $t('personal.astroAdventure.role'),
      responsibilities: $t('personal.astroAdventure.responsibilities'),
      description: $t('personal.astroAdventure.description'),
      highlights: '',
      githubUrl: 'https://github.com/GabrielCAlves/Astro-Adventure-3D',
      projectUrl: 'https://gabrielcalves.itch.io/astro-adventure-3d',
      carouselVertical: true, // Mantém true, mas será sobrescrito pelo getCarouselVertical()
      media: cloudinaryUrls.personalWork.project1.media
    },
    {
      id: 'project2',
      title: 'Cook & Conquer', 
      platform: 'PC (Windows), Android',
      technologies: ['Unity', 'C#'],
      role: $t('personal.cookAndConquer.role'),
      responsibilities: $t('personal.cookAndConquer.responsibilities'),
      description: $t('personal.cookAndConquer.description'),
      highlights: '',
      githubUrl: 'https://github.com/PierrotNobre/Project_RED',
      projectUrl: 'https://squadred.itch.io/cook-and-conquer',
      carouselVertical: true,
      media: cloudinaryUrls.personalWork.project2.media
    },
    {
      id: 'project3',
      title: 'Astro Obstacle', 
      platform: 'Android',
      technologies: ['Unity', 'C#'],
      role: $t('personal.astroObstacle.role'),
      responsibilities: $t('personal.astroObstacle.responsibilities'),
      description: $t('personal.astroObstacle.description'),
      highlights: '',
      githubUrl: 'https://github.com/GabrielCAlves/Astro-Obstacle',
      projectUrl: 'https://gabrielcalves.itch.io/astro-obstacle',
      carouselVertical: true,
      media: cloudinaryUrls.personalWork.project3.media
    },
    {
      id: 'project4',
      title: 'Lost In The Stars',
      platform: 'PC (Windows)',
      technologies: ['Unity', 'C#'],
      role: $t('personal.lostInTheStars.role'),
      responsibilities: $t('personal.lostInTheStars.responsibilities'),
      description: $t('personal.lostInTheStars.description'),
      highlights: '',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1UTbGsqzTjlF9gEQr8QaFHaRVBjDmzF6U',
      githubUrl: 'https://github.com/GabrielCAlves/Lost-In-The-Stars',
      projectUrl: 'https://gabrielcalves.itch.io/lost-in-the-stars',
      carouselVertical: true,
      media: cloudinaryUrls.personalWork.project4.media
    },
    {
      id: 'project5',
      title: 'MyPong',
      platform: 'PC (Windows)',
      technologies: ['Unity', 'C#'],
      role: $t('personal.myPong.role'),
      responsibilities: $t('personal.myPong.responsibilities'),
      description: $t('personal.myPong.description'),
      highlights: '',
      githubUrl: 'https://github.com/GabrielCAlves/MyPong',
      projectUrl: 'https://gabrielcalves.itch.io/mypong',
      carouselVertical: true,
      media: cloudinaryUrls.personalWork.project5.media
    },
    {
      id: 'project6',
      title: '4Kingdoms',
      platform: 'PC (Windows)',
      technologies: ['Unity', 'C#'],
      role: $t('personal.fourKingdoms.role'),
      responsibilities: $t('personal.fourKingdoms.responsibilities'),
      description: $t('personal.fourKingdoms.description'),
      highlights: 'Lost code (Corrupted SSD)',
      githubUrl: '',
      projectUrl: 'https://gabrielcalves.itch.io/4-kingdoms',
      carouselVertical: true,
      media: cloudinaryUrls.personalWork.project6.media
    }
  ]
}

const loadProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'games'))
    
    projects.value = querySnapshot.docs.map(doc => {
      const projectData = doc.data()
      const projectId = projectData.id || `project${doc.id}`
      
      let cloudinaryMedia = []
      if (cloudinaryUrls.personalWork[projectId]) {
        cloudinaryMedia = cloudinaryUrls.personalWork[projectId].media
      }
      
      return {
        id: doc.id,
        platform: projectData.platform || 'PC (Windows)',
        projectUrl: projectData.projectUrl || '',
        carouselVertical: projectData.carouselVertical !== undefined ? projectData.carouselVertical : true,
        ...projectData,
        media: cloudinaryMedia
      }
    })
  } catch (error) {
    console.error('Error loading projects:', error)
    loadStaticProjects()
  }
}

// Watch para recarregar projetos quando o idioma mudar
watch(currentLanguage, () => {
  loadStaticProjects()
})

// 🔥 OBSERVER PARA MUDANÇAS NO TAMANHO DA TELA
watch(isMobile, (newValue) => {
  // Forçar atualização dos componentes MediaCarousel quando o tamanho da tela mudar
  // O Vue irá re-renderizar automaticamente pois a prop :vertical mudará
})

onMounted(() => {
  loadProjects()
  updateMobileState()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Mantenha todos os estilos iguais ao anterior */
.section {
  padding: 2rem;
  color: white;
  position: relative;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  display: inline-block; 
  width: auto; 
  padding: 0.5rem 2rem; 
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
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
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  position: relative;
  border: 3px solid;
  border-image: linear-gradient(135deg, red 0%, blue 100%) 1;
}

.project:hover {
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
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
  align-items: start;
  position: relative;
}

.project-media {
  width: 100%;
  position: relative;
  z-index: 1;
  min-height: 400px;
  display: flex;
  align-self: center;
}

.project-info {
  position: relative;
  z-index: 2;
}

.project-info ul {
  list-style: none;
}

.project-info li {
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.platform-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.platform-header strong {
  display: block;
}

.platform-content {
  width: 100%;
}

.platform-value {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 50, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.platform-tag {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 50, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.platform-tag:hover {
  transform: translateY(-2px);
  border-color: #cc0000;
  box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);
}

.responsibilities-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
}

.responsibilities-list {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
  width: 100%;
  list-style: inside !important;
}

.responsibility-list-item {
  border-bottom: none !important;
  line-height: 1.5;
}

.responsibilities-list li {
  padding-top: 0px;
  padding-bottom: 5px;
}

.highlights-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
}

.highlights-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.try-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.try-item strong {
  white-space: nowrap;
}

.project-link-btn {
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  color: black;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.project-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.no-link {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.github-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  vertical-align: middle;
  margin-left: -20px;
}

.github-btn:hover {
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.github-btn .icon {
  filter: brightness(0) invert(1);
}

.technologies-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
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

@media (max-width: 1325px){
  .project{
    backdrop-filter: blur(2px);
  }
}

@media (max-width: 968px) {
  .project-media{
    z-index: 0 !important;
  }

  .project-content {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
  }
  
  .project-media {
    order: -1;
  }

  .project-media {
    min-height: 200px !important;
  }

  .rotating-card-carousel{
    height: 310px !important;
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
    min-height: 300px;
  }

  .project-media {
    min-height: 170px !important;
  }

  .rotating-card-carousel{
    height: 250px !important;
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
    min-height: 170px !important;
  }

  .rotating-card-carousel{
    min-height: 200px !important;
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
}
</style>