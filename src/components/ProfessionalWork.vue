<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('professional-work') }}</h2>
    <div class="empty-state">
      <div class="empty-icon">💼</div>
      <h3 class="empty-title" :key="forceUpdate">{{ $t('noProfessionalProjects') }}</h3>
      <p class="empty-description" :key="forceUpdate">
        {{ $t('professionalWorkDescription') }}
      </p>
      <div class="empty-actions">
        <p :key="forceUpdate">{{ $t('exploreOtherProjects') }}</p>
        <div class="project-links">
          <button @click="goToSection('personal-work')" class="project-link-btn">
            🎮 <strong><span :key="forceUpdate">{{ $t('personalProjects') }}</span></strong>
          </button>
          <button @click="goToSection('web')" class="project-link-btn">
            🌐 <strong><span :key="forceUpdate">{{ $t('webProjects') }}</span></strong>
          </button>
          <button @click="goToSection('mobile')" class="project-link-btn">
            📱 <strong><span :key="forceUpdate">{{ $t('mobileProjects') }}</span></strong>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations' // 🔥 USAR COMPOSABLE

const { $t, forceUpdate } = useTranslations()

const goToSection = (section) => {
  const sections = ['about', 'personal-work', 'professional-work', 'web', 'mobile', 'contacts']
  const sectionIndex = sections.indexOf(section)
  
  if (sectionIndex !== -1) {
    window.dispatchEvent(new CustomEvent('change-section', { 
      detail: { sectionIndex } 
    }))
  }
}
</script>

<style scoped>
.section {
  padding: 2rem;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  max-width: 600px;
  padding: 3rem 2rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s infinite;
}

.empty-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.empty-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 1);
}

.empty-actions {
  margin-top: 2rem;
}

.empty-actions p {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 1);
}

.project-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.project-link-btn {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: black;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.project-link-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .project-links {
    flex-direction: column;
    align-items: center;
  }
  
  .project-link-btn {
    width: 200px;
  }
}

/* ADICIONE AO ProfessionalWork.vue */
@media (max-width: 768px) {
  .project-links {
    flex-direction: column;
    align-items: center;
  }
  
  .project-link-btn {
    width: 200px;
  }
}
</style>


<!-- <template> (Para quando tiver projetos para o Professional Work)
  <section class="section">
    <h2 class="section-title">Professional Work</h2>
    <div class="projects-container">
      <div v-for="project in projects" :key="project.id" class="project">
        <h3 class="project-title">{{ project.title }}</h3>
        <div class="project-content">
          <div class="project-info">
            <ul>
              <li><strong>Technologies:</strong> {{ project.technologies.join(', ') }}</li>
              <li><strong>My role:</strong> {{ project.role }}</li>
              <li><strong>Highlights:</strong> {{ project.highlights.join(', ') }}</li>
              <li v-if="project.company"><strong>Company:</strong> {{ project.company }}</li>
              <li v-if="project.period"><strong>Period:</strong> {{ project.period }}</li>
            </ul>
          </div>
          <div class="project-media">
            <MediaCarousel :media="project.media" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { cloudinaryUrls } from '@/services/cloudinary'
import MediaCarousel from './MediaCarousel.vue'

const projects = ref([])

const loadProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'professional-projects'))
    
    projects.value = querySnapshot.docs.map(doc => {
      const projectData = doc.data()
      const projectId = projectData.id || `project${doc.id}`
      
      let cloudinaryMedia = []
      if (cloudinaryUrls.professionalWork[projectId]) {
        cloudinaryMedia = cloudinaryUrls.professionalWork[projectId].media
      }
      
      return {
        id: doc.id,
        ...projectData,
        media: cloudinaryMedia
      }
    })
    
    console.log('✅ Professional projects loaded:', projects.value)
  } catch (error) {
    console.error('Error loading projects:', error)
    
    // ✅ FALLBACK: Dados estáticos
    projects.value = [
      {
        id: 'project1',
        title: 'Projeto Profissional 1',
        technologies: ['React', 'Node.js', 'TypeScript'],
        role: 'Full-stack Developer',
        highlights: ['Arquitetura escalável', 'Performance otimizada'],
        company: 'Nome da Empresa',
        period: '2023 - Presente',
        media: cloudinaryUrls.professionalWork.project1?.media || []
      },
    ]
  }
}

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
  align-items: start;
}

.project-info ul {
  list-style: none;
}

.project-info li {
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.project-media {
  width: 100%;
}
</style> -->