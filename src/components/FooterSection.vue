<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="social-links">
        <a 
          v-for="contact in contacts" 
          :key="contact.platform"
          :href="contact.url" 
          target="_blank"
          class="social-link"
        >
          <img :src="contact.icon" :alt="contact.platform" class="social-icon" />
          <span class="social-text">{{ contact.platform }}</span>
        </a>
      </div>
      <p class="copyright" :key="forceUpdate">{{ $t('copyright') }}</p>
    </div>
  </footer>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations' // 🔥 USAR COMPOSABLE
import githubIcon from '@/assets/images/github-mark-white.png'
import linkedinIcon from '@/assets/images/LI-In-Bug.png'
import gmailIcon from '@/assets/images/gmail.png'
import instagramIcon from '@/assets/images/instagram.png'

const { $t, forceUpdate } = useTranslations()

const contacts = [
  { platform: 'GitHub', url: 'https://github.com/GabrielCAlves', icon: githubIcon },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/gabrielcavalcantialves', icon: linkedinIcon },
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
.footer {
  background: #080c16/*#1a1a1a*/;
  color: white;
  padding: 2rem 0;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.copyright {
  opacity: 0.7;
  font-size: 0.9rem;
  margin: 0;
}

.location {
  opacity: 0.6;
  font-size: 0.8rem;
  margin: 0;
  font-style: italic;
}

/* Responsividade */
@media (max-width: 768px) {
  .social-links {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .social-link {
    padding: 0.5rem;
  }
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