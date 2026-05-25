<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('aboutMe') }}</h2>
    
    <div class="about-content">
      <div class="left-column project">
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

      <div class="right-column project">
        <div class="description-container">
          <div class="intro-text">
            <p class="description highlight" :key="forceUpdate">{{ $t('aboutDescription') }}</p>
            <p class="description" :key="forceUpdate">{{ $t('aboutDescription2') }}</p>
          </div>
          
          <div class="experience-highlight">
            <button 
              class="scroll-link" 
              @click="scrollToExperience"
              :title="$t('scrollToExperience')"
            >
              <span class="scroll-icon">👇</span>
              <span class="scroll-text" :key="forceUpdate">{{ $t('seeProfessionalExperience') }}</span>
            </button>
          </div>
          
          <div class="achievement-section">
            <h4 class="section-subtitle">
              <span class="icon">🎮</span>
              <span :key="forceUpdate">{{ $t('unityProjects') }}</span>
            </h4>
            <div class="tech-tags">
              <span class="tag unity-tag">Astro Adventure 3D</span>
              <span class="tag unity-tag">4Kingdoms</span>
              <span class="tag unity-tag">Lost in The Stars</span>
              <span class="tag unity-tag">Astro Obstacle</span>
              <span class="tag unity-tag">MyPong</span>
            </div>
          </div>

          <div class="achievement-section">
            <h4 class="section-subtitle">
              <span class="icon">📱</span>
              <span :key="forceUpdate">{{ $t('mobileAppsRegistered') }}</span>
            </h4>
            <div class="tech-tags">
              <span class="tag mobile-tag">ConsultasQX</span>
              <span class="tag mobile-tag">Feirão Nordeste</span>
            </div>
          </div>

          <div class="achievement-section academic-section">
            <h4 class="section-subtitle">
              <span class="icon">📚</span>
              <span :key="forceUpdate">{{ $t('academicPublication') }}</span>
            </h4>
            <div class="academic-content">
              <div class="academic-info">
                <span class="academic-icon">🎓</span>
                <span :key="forceUpdate">{{ $t('academicPaperText') }}</span>
              </div>
              <a 
                :href="academicPaperUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="academic-link"
              >
                <span>🔗</span>
                <span :key="forceUpdate">{{ $t('viewPublication') }}</span>
                <span class="scroll-arrow">→</span>
              </a>
            </div>
          </div>

          <div class="achievement-section">
            <h4 class="section-subtitle">
              <span class="icon">📜</span>
              <span :key="forceUpdate">{{ $t('certifications') }}</span>
            </h4>
            <div class="certifications-grid">
              <div class="cert-item">
                <span class="cert-icon">⚡</span>
                <span>Scrum</span>
              </div>
              <div class="cert-item">
                <span class="cert-icon">☁️</span>
                <span>AWS</span>
              </div>
              <div class="cert-item">
                <span class="cert-icon">🎮</span>
                <span>Game Design</span>
              </div>
              <div class="cert-item">
                <span class="cert-icon">🛠️</span>
                <span>Unity Development</span>
              </div>
              <div class="cert-item highlight-cert">
                <span class="cert-icon">
                  <img 
                    :src="ukFlag" 
                    alt="English" 
                    class="flag" 
                  />
                </span>
                <span>English Proficiency (B2+)</span>
              </div>
            </div>
          </div>

          <div class="certifications-section">
            <p class="description call-to-action" :key="forceUpdate">{{ $t('aboutDescription8') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="skills-grid-container">
      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('programmingLanguages') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in programmingLanguages" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('enginesAndIDEs') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in enginesAndIDEs" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('specializations') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in specializations" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('versionControl') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in versionControl" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('backEnd') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in backEnd" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('frameworks') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in frameworks" 
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
      </div>

      <div class="skill-card">
        <h3 :key="forceUpdate">{{ $t('additionalSkills') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="skill in additionalSkills" 
            :key="skill" 
            class="tech-item"
            :title="skill"
          >
            <img 
              :src="getTechLogo(skill)" 
              :alt="skill" 
              class="tech-logo"
              @error="handleImageError"
            />
            <span class="tech-name"><strong>{{ skill }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <div class="experience-section">
      <h2 class="experience-section-title" :key="forceUpdate">{{ $t('professionalExperience') }}</h2>
      <div class="timeline">
        <div 
          v-for="(exp, index) in professionalExperiences" 
          :key="index" 
          class="timeline-item"
        >
          <div class="timeline-badge">
          </div>
          <div class="timeline-content experience-card">
            <div class="experience-header">
              <h3 class="experience-role">{{ $t(exp.roleKey) }}</h3>
              <span class="experience-company">🏢 {{ $t(exp.companyKey) }}</span>
            </div>
            <div class="experience-meta">
              <span class="experience-period">
                <strong>🗓️ {{ $t('period') }}:</strong> {{ exp.period }}
              </span>
              <span class="experience-location" v-if="exp.location">
                <strong>📌 {{ $t('location') }}:</strong> {{ $t(exp.location) }}
              </span>
            </div>
            <div class="experience-description">
              <p :key="forceUpdate">{{ $t(exp.descriptionKey) }}</p>
            </div>
            <div class="experience-achievements" v-if="exp.achievementsKeys && exp.achievementsKeys.length">
              <strong>🏆 {{ $t('achievements') }}:</strong>
              <ul>
                <li v-for="(achievementKey, aIdx) in exp.achievementsKeys" :key="aIdx">{{ $t(achievementKey) }}</li>
              </ul>
            </div>
            <div class="experience-technologies" v-if="exp.technologies && exp.technologies.length">
              <strong>🛠️ {{ $t('technologiesUsed') }}:</strong>
              <div class="exp-tech-list">
                <span 
                  v-for="tech in exp.technologies" 
                  :key="tech" 
                  class="exp-tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
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

const programmingLanguages = ['C#', 'C++', 'C', 'Java', 'HTML', 'CSS', 'JavaScript', 'TypeScript']
const enginesAndIDEs = ['Unity', 'Android Studio', 'Node.js']
const specializations = ['Gameplay Programming']
const versionControl = ['Git', 'Git bash', 'GitLab']
const backEnd = ['Firebase', 'DBeaver', 'PostgreSQL', 'MySQL', 'SpringBoot', 'Strapi']
const frameworks = ['Vue.js', 'Vuetify', 'Vite', 'Bootstrap']
const additionalSkills = ['Agile Methodology', 'Scrum', 'OOP', 'Rest APIs', 'Astah', 'UI/UX', 'Figma', 'Adobe XD']

const academicPaperUrl = ref('https://sol.sbc.org.br/index.php/sbgames/article/view/37500')

const scrollToExperience = () => {
  const experienceSection = document.querySelector('.experience-section')
  if (experienceSection) {
    const elementPosition = experienceSection.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - 100
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const professionalExperiences = ref([
  {
    roleKey: 'experience.npi.role',
    companyKey: 'experience.npi.company',
    period: '2024 - 2025',
    location: 'experience.npi.location',
    descriptionKey: 'experience.npi.description',
    achievementsKeys: [
      'experience.npi.achievement1',
      'experience.npi.achievement2',
      'experience.npi.achievement3',
      'experience.npi.achievement4',
      'experience.npi.achievement5',
      'experience.npi.achievement6',
      'experience.npi.achievement7',
      'experience.npi.achievement8'
    ],
    technologies: ['Vue.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'GitLab', 'Spring Boot', 'DBeaver', 'Figma', 'Playwright']
  },
])

const getTechLogo = (techName) => {
  return cloudinaryUrls.technologyLogos[techName] || ''
}

const handleImageError = (event) => {
  const parent = event.target.parentElement
  if (parent) {
    const textElement = parent.querySelector('.tech-name')
    if (textElement) {
      textElement.style.opacity = '1'
    }
  }
}

const changeLanguage = (language) => {
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

.about-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto 3rem auto;
}

.left-column {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border: 3px solid;
  border-image: linear-gradient(135deg, red 20%, #05f 100%) 1;
}

.left-column:hover {
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  box-shadow: 0 8px 40px rgb(204, 139, 0);
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

.right-column{
  border: 3px solid;
  border-image: linear-gradient(135deg, red 20%, #05f 100%) 1;
}

.right-column:hover {
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  box-shadow: 0 8px 40px rgb(204, 139, 0);
}

.right-column h3 {
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.description-container {
  padding: 1rem;
}

.intro-text {
  margin-bottom: 1.5rem;
}

.intro-text .description:first-child {
  font-size: 1.2rem;
  font-weight: 500;
  color: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  padding-left: 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border-left: 3px solid #cc0000;
}

.experience-highlight {
  background: rgba(204, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-left: 3px solid #cc0000;
}

.experience-highlight {
  background: rgba(204, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin: 1.5rem 0;
  border-left: 4px solid #cc0000;
  transition: all 0.3s ease;
}

.experience-highlight:hover {
  background: rgba(204, 0, 0, 0.15);
  transform: translateX(5px);
}

.experience-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.scroll-link {
  background: linear-gradient(to right, var(--primary-red) 0%, var(--primary-red) 25%, var(--primary-blue) 80%, var(--primary-blue) 90%);
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(204, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.scroll-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.scroll-link:hover::before {
  width: 325px;
  height: 300px;
}

.scroll-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(204, 0, 0, 0.4);
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  gap: 0.8rem;
  color: black;
}

.scroll-link:active {
  transform: translateY(0);
}

.scroll-icon {
  font-size: 1.1rem;
  animation: bounce 1.5s infinite;
}

.scroll-text {
  font-size: 0.9rem;
  font-weight: 600;
}

.scroll-arrow {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.scroll-link:hover .scroll-arrow {
  transform: translateX(5px);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(204, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(204, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(204, 0, 0, 0);
  }
}

.scroll-link {
  animation: pulse 2s infinite;
}

.scroll-link:hover {
  animation: none;
}

@media (max-width: 768px) {
  .experience-header-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .subtitle {
    justify-content: center;
  }
  
  .scroll-link {
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .scroll-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .experience-highlight {
    padding: 1rem;
  }
  
  .scroll-link {
    width: 100%;
  }
}

.experience-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.experience-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
  line-height: 1.6;
  font-size: 1rem;
  text-align: justify;
  list-style: none;
}

.experience-list li::before {
  content: "▹";
  position: absolute;
  left: 0;
  color: #cc0000;
  font-size: 1rem;
}

.experience-list li:hover {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

.certifications-section {
  margin-top: 1.5rem;
}

.call-to-action {
  background: linear-gradient(135deg, rgba(204, 139, 0, 0.1), rgba(255, 255, 255, 0.05));
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(204, 139, 0, 0.3);
  font-weight: 500;
  text-align: center;
}

.description {
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  text-align: justify;
}

.description:last-child {
  margin-bottom: 0;
}

.highlight {
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.description-container > * {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

.description-container > *:nth-child(1) { animation-delay: 0.1s; }
.description-container > *:nth-child(2) { animation-delay: 0.2s; }
.description-container > *:nth-child(3) { animation-delay: 0.3s; }
.description-container > *:nth-child(4) { animation-delay: 0.4s; }
.description-container > *:nth-child(5) { animation-delay: 0.5s; }
.description-container > *:nth-child(6) { animation-delay: 0.6s; }

.academic-section {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(204, 0, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.academic-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.academic-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
}

.academic-icon {
  font-size: 1.3rem;
}

.academic-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(to right, var(--primary-red) 0%, var(--primary-red) 25%, var(--primary-blue) 80%, var(--primary-blue) 90%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.academic-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(204, 0, 0, 0.4);
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  color: black;
}

.academic-link:hover .scroll-arrow {
  transform: translateX(5px);
}

.academic-link:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .academic-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .academic-link {
    width: 100%;
    justify-content: center;
  }
  
  .academic-info {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .academic-info {
    font-size: 0.85rem;
  }
  
  .academic-link {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

.academic-link {
  position: relative;
}

.academic-link::before {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.4rem 0.8rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  margin-bottom: 8px;
}

.academic-link:hover::before {
  opacity: 1;
}

.achievement-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.achievement-section:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.section-subtitle {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.icon {
  font-size: 1.3rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.unity-tag, .mobile-tag {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 50, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.unity-tag:hover, .mobile-tag:hover {
  transform: translateY(-2px);
  border-color: #cc0000;
  box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);
}

.achievement-note {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.8rem;
  padding: 0.6rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ffd700;
}

.note-icon {
  font-size: 1.2rem;
}

.achievement-note span:last-child {
  font-size: 0.95rem;
  font-style: italic;
  color: #ffd700;
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.8rem;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cert-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.cert-icon {
  font-size: 1.1rem;
}

.highlight-cert {
  background: linear-gradient(135deg, rgba(204, 0, 0, 0.2), rgba(255, 215, 0, 0.1));
  border: 1px solid rgba(204, 139, 0, 0.5);
  font-weight: 600;
}

.highlight-cert .cert-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .achievement-section {
    padding: 0.8rem;
    margin: 1rem 0;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
  
  .certifications-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.6rem;
  }
  
  .cert-item {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }
  
  .achievement-note span:last-child {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .certifications-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-tags {
    gap: 0.6rem;
  }
  
  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
  }
}

@media (max-width: 768px) {
  .description-container {
    padding: 0.5rem;
  }
  
  .experience-highlight {
    padding: 0.8rem 1rem;
    margin: 1rem 0;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .experience-list li {
    font-size: 0.95rem;
    padding-left: 1.2rem;
  }
  
  .call-to-action {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  
  .intro-text .description:first-child {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .experience-highlight {
    padding: 0.6rem 0.8rem;
  }
  
  .experience-list li {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }
  
  .call-to-action {
    font-size: 0.9rem;
  }
}

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

.skills-grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto 3rem auto;
}

.skill-card {
  background: #080c16;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid;
  border-image: linear-gradient(135deg, red 20%, #05f 100%) 1;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-3px);
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  box-shadow: 0 8px 40px rgb(204, 139, 0);
}

.skill-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #cc0000;
  text-align: center;
  border-bottom: 1px solid rgba(204, 0, 0, 1.0);
  padding-bottom: 0.5rem;
}

.skill-card:hover h3 {
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  border-bottom-color: rgb(204, 139, 0);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.8rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(255, 255, 255);
  color: black;
  padding: 0.8rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 85px;
}

.tech-item:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px) scale(1.02);
}

.tech-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.tech-name {
  font-size: 0.7rem;
  font-weight: 500;
  opacity: 0.9;
  text-align: center;
  word-break: break-word;
}

.project {
  background: #080c16;
  color: white;
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  position: relative;
  height: fit-content;
}

.experience-section {
  max-width: 1000px;
  margin: 0 auto;
}

.experience-section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
  display: inline-block;
  width: auto;
  padding: 0.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.15);
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  backdrop-filter: blur(10px);
  border-radius: 5px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #cc0000, #ff6666, #cc0000);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
}

.timeline-badge {
  position: absolute;
  left: -30px;
  top: 0;
  width: 30px;
  height: 30px;
  background: #cc0000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.badge-icon {
  font-size: 1rem;
}

.timeline-content {
  flex: 1;
  margin-left: 20px;
}

.experience-card {
  background: #080c16;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.experience-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(204, 0, 0, 0.5);
  border-image: linear-gradient(135deg, red 20%, #05f 100%) 1;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.experience-role {
  font-size: 1.4rem;
  color: #cc0000;
  margin: 0;
}

.experience-company {
  font-size: 1rem;
  color: white;
  font-weight: 500;
}

.experience-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.experience-meta strong {
  color: #fff;
}

.experience-description p {
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.experience-achievements {
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.experience-achievements strong {
  color: white;
}

.experience-achievements ul {
  margin: 0.5rem 0 0 1.5rem;
  padding: 0;
}

.experience-achievements li {
  margin-bottom: 0.3rem;
  line-height: 1.5;
}

.experience-technologies {
  margin-top: 0.5rem;
}

.experience-technologies strong {
  color: white;
}

.exp-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.exp-tech-tag {
  background: rgba(204, 0, 0, 0.2);
  border: 1px solid rgba(204, 0, 0, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.exp-tech-tag:hover {
  background: rgba(204, 0, 0, 0.4);
  transform: scale(1.05);
}

@media (max-width: 968px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .left-column {
    order: 1;
  }
  
  .right-column {
    order: 2;
  }
  
  .profile-image {
    width: 150px;
    height: 150px;
  }
  
  .skills-grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .experience-section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .experience-list {
    margin-left: 1rem;
  }
  
  .experience-list li {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }
  
  .download-buttons {
    flex-direction: row;
    max-width: 100%;
    gap: 1rem;
  }
  
  .download-btn {
    flex: 1;
  }
  
  .skill-card {
    padding: 1rem;
  }
  
  .skill-card h3 {
    font-size: 1rem;
  }
  
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 0.6rem;
  }
  
  .tech-item {
    padding: 0.6rem 0.4rem;
    min-height: 75px;
  }
  
  .tech-logo {
    width: 28px;
    height: 28px;
  }
  
  .tech-name {
    font-size: 0.65rem;
  }
  
  .experience-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .experience-role {
    font-size: 1.2rem;
  }
  
  .experience-meta {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .timeline {
    padding-left: 20px;
  }
  
  .timeline::before {
    left: 5px;
  }
  
  .timeline-badge {
    left: -20px;
    width: 25px;
    height: 25px;
  }
  
  .badge-icon {
    font-size: 0.8rem;
  }
  
  .timeline-content {
    margin-left: 15px;
  }
  
  .experience-card {
    padding: 1rem;
  }
}

@media (max-width: 580px) {
  .skills-grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .experience-section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .about-content {
    gap: 1rem;
  }
  
  .download-buttons {
    flex-direction: column;
  }
  
  .skill-card {
    padding: 0.8rem;
  }
  
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.5rem;
  }
  
  .tech-item {
    padding: 0.5rem 0.3rem;
    min-height: 65px;
  }
  
  .tech-logo {
    width: 24px;
    height: 24px;
  }
  
  .tech-name {
    font-size: 0.6rem;
  }
  
  .experience-section-title {
    font-size: 1.5rem;
  }
  
  .experience-role {
    font-size: 1.1rem;
  }
  
  .exp-tech-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}

@media (max-width: 360px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
  
  .tech-item {
    min-height: 60px;
  }
  
  .tech-logo {
    width: 20px;
    height: 20px;
  }
  
  .tech-name {
    font-size: 0.55rem;
  }
}
</style>