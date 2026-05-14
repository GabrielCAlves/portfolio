<template>
  <section class="section">
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
import { useTranslations } from '@/composables/useTranslations'
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
</script>

<style scoped>
.section {
  position: relative;
  z-index: 5;
  pointer-events: none;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.contact-item {
  pointer-events: auto;
}

.contacts-container {
  display: flex;
  justify-content: center;
  align-items: center !important;
  width: auto;
  margin-right: 5%;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 600px;
  min-width: 280px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
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

@media (max-width: 1200px) {
  .contacts-container {
    margin-right: 4%;
    margin-top: 2%;
  }
  
  .contacts-grid {
    gap: 1.5rem;
    min-width: 260px;
  }
  
  .contact-item {
    padding: 1.5rem;
  }
  
  .contact-icon {
    width: 56px;
    height: 56px;
  }
  
  .contact-platform {
    font-size: 1.1rem;
  }
}

@media (min-width: 548px) and (max-width: 1042px) {
  .section {
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 10px;
    min-height: 500px;
  }
  
  .contacts-container {
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0px;
    width: 100% !important;
    justify-content: center;
  }
  
  .contacts-grid {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    gap: 1rem !important;
    min-width: auto;
    width: 100%;
    max-width: 100%;
  }
  
  .contact-item {
    display: flex !important;
    flex-direction: column !important;
    padding: 1rem !important;
    justify-self: center;
    width: 120px !important;
    height: 120px !important;
    gap: 0.5rem !important;
  }
  
  .contact-icon {
    width: 45px !important;
    height: 45px !important;
    margin-bottom: 0.3rem !important;
  }
  
  .contact-platform {
    font-size: 0.85rem !important;
  }
}

@media (min-width: 481px) and (max-width: 547px) {
  .section {
    justify-content: center; /* 🔥 CENTRALIZADO */
    align-items: flex-end;
    padding-bottom: 20px;
    min-height: 550px;
  }
  
  .contacts-container {
    margin-right: 0;
    margin-top: 0;
    width: 100% !important;
    justify-content: center;
  }
  
  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
    width: 90% !important;
    max-width: 315px !important;
    min-width: auto;
  }
  
  .contact-item {
    display: flex !important;
    flex-direction: column !important;
    padding: 1rem !important;
    width: 150px !important;
    height: auto !important;
    gap: 0.5rem !important;
  }
  
  .contact-icon {
    width: 40px !important;
    height: 40px !important;
    margin-bottom: 0.3rem !important;
  }
  
  .contact-platform {
    font-size: 0.85rem !important;
  }
}

@media (max-width: 480px) {
  .section {
    justify-content: center;
    align-items: flex-end;
    min-height: 850px;
    padding-bottom: 20px;
  }
  
  .contacts-container {
    width: 500px !important;
    margin-right: 0;
  }
  
  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
    width: 90% !important;
    max-width: 235px !important;
    min-width: auto;
  }
  
  .contact-item {
    flex-direction: column !important;
    padding: 0.9rem 1.2rem !important;
    width: 110px !important;
    justify-content: center;
    gap: 0.5rem !important;
  }
  
  .contact-icon {
    width: 40px !important;
    height: 40px !important;
    margin-bottom: 0;
  }
  
  .contact-platform {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 360px) {
  .section {
    justify-content: center;
    align-items: flex-end;
    min-height: 650px;
    padding-bottom: 20px;
  }
  
  .contacts-container {
    width: 300px;
    margin-right: 0;
  }

  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
    width: 90% !important;
    max-width: 215px !important;
    min-width: auto;
  }
  
  .contact-item {
    padding: 0.8rem 1rem !important;
    width: 100px !important;
    gap: 0.5rem !important;
  }
  
  .contact-icon {
    width: 32px !important;
    height: 32px !important;
  }
  
  .contact-platform {
    font-size: 0.8rem !important;
  }
}
</style>