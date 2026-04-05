<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('contacts') }}</h2>
    <div class="contacts-container">
      <div class="contacts-grid">
        <a 
          v-for="contact in contacts" 
          :key="contact.platform"
          :href="contact.url" 
          target="_blank"
          class="contact-item"
        >
          <img :src="contact.icon" :alt="contact.platform" class="contact-icon" />
          <span class="contact-platform">{{ contact.platform }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations' // 🔥 USAR COMPOSABLE
import githubIcon from '@/assets/images/github-mark-white.png'
import linkedinIcon from '@/assets/images/LI-In-Bug.png'
import gmailIcon from '@/assets/images/gmail.png'
import instagramIcon from '@/assets/images/instagram.png'

const { $t, forceUpdate } = useTranslations()

const contacts = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/gabrielcavalcantialves', icon: linkedinIcon },
  { platform: 'GitHub', url: 'https://github.com/GabrielCAlves', icon: githubIcon },
  { platform: 'Email', url: 'mailto:gabriel0603cavalcanti@gmail.com', icon: gmailIcon },
  { platform: 'Instagram', url: 'https://instagram.com/x_GCA_x6', icon: instagramIcon }
]

// onMounted(() => {
//   window.addEventListener('languageChanged', handleLanguageChange)
// })

// onUnmounted(() => {
//   window.removeEventListener('languageChanged', handleLanguageChange)
// })
</script>

<style scoped>
.section {
  padding: 2rem;
  color: white;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-content {
  flex: 1; /* 🔥 FAZ EXPANDIR */
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
}

.contacts-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1; /* Ocupa o espaço restante para centralizar */
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 600px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.contact-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.contact-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  object-fit: contain;
}

.contact-platform {
  font-size: 1.2rem;
  font-weight: bold;
}

/* ADICIONE A AMBOS */
@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .contact-item {
    padding: 1.5rem;
  }
  
  .social-links {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .social-link {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .contact-icon {
    width: 48px;
    height: 48px;
  }
  
  .contact-platform {
    font-size: 1rem;
  }
}
</style>