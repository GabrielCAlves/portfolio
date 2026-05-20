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
import { useTranslations } from '@/composables/useTranslations'
import githubIcon from '@/assets/images/github-mark-white.png'
import linkedinIcon from '@/assets/images/LI-In-Bug.png'
import gmailIcon from '@/assets/images/gmail.png'
import instagramIcon from '@/assets/images/instagram.png'
import itchioIcon from '@/assets/images/itch.io-logo.svg'

const { $t, forceUpdate } = useTranslations()

const contacts = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/gabrielcavalcantialves', icon: linkedinIcon },
  { platform: 'GitHub', url: 'https://github.com/GabrielCAlves', icon: githubIcon },
  { platform: 'Email', url: 'mailto:gabriel0603cavalcanti@gmail.com', icon: gmailIcon },
  { platform: 'Instagram', url: 'https://instagram.com/x_GCA_x6', icon: instagramIcon },
  { platform: 'Itch.io', url: 'https://gabrielcalves.itch.io/', icon: itchioIcon }
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
  flex-direction: column;

  align-items: center;
}

.section-title {
  color: white;
  

  width: 100%;
  margin-top: 0.25rem;

  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  display: inline-block; 
  width: auto;
  height: 55px;
  justify-self: center !important;
  padding: 0.075rem 2rem; 
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  /* left: 50%; */
  position: relative;
}

.contact-item {
  pointer-events: auto;
}

.contacts-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;

  width: 100%;
  padding-right: 5%;
  flex: 1;
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

/* 3 colunas até 678px */
@media (max-width: 678px) {
  .contacts-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem !important;
    min-width: auto;
  }
  
  .contact-item {
    padding: 1.5rem !important;
  }
  
  .contact-icon {
    width: 50px !important;
    height: 50px !important;
  }
  
  .contact-platform {
    font-size: 1rem !important;
  }
}

@media (max-width: 1280px) {
  .section-title {
    font-size: 2.5rem;
    padding: 0.2rem 2rem;
  }
}

@media (min-width: 1201px) and (max-width: 1246px) {
  .section-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    padding: 0.2rem 0.5rem;
  }
}

@media (max-width: 1200px) {
  .contacts-container {
    padding-right: 4%;
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

  .section-title {
    height: 50px;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    padding: 0.2rem 2rem;
  }
}

@media (min-width: 679px) and (max-width: 1042px) {
  .section {
    align-items: center;
    min-height: 500px;
  }

  .section-title {
    font-size: 2.5rem;
  }
  
  .contacts-container {
    width: 100% !important;
    justify-content: center;
    align-items: end;
    padding-right: 0;
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

@media (min-width: 481px) and (max-width: 678px) {
  .section {
    align-items: center;
    min-height: 500px;
  }
  
  .contacts-container {
    width: 100% !important;
    justify-content: center;
    align-items: end;
    padding-right: 0;
  }
  
  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem !important;
    width: 90% !important;
    max-width: 315px !important;
    min-width: auto;
  }
  
  .contact-item {
    display: flex !important;
    flex-direction: column !important;
    padding: 1rem !important;
    width: 100px !important;
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

/* Telas até 480px - 3 colunas também */
@media (max-width: 480px) {
  .section {
    align-items: center;
    min-height: 500px;
  }

  .section-title {
    font-size: 1.75rem;
    padding: 0.25rem 2rem;
    height: 40px;
  }
  
  .contacts-container {
    width: 100% !important;
    justify-content: center;
    align-items: end;
    padding-right: 0;
  }
  
  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem !important;
    width: 90% !important;
    max-width: 280px !important;
    min-width: auto;
  }
  
  .contact-item {
    flex-direction: column !important;
    padding: 0.7rem !important;
    width: auto !important;
    justify-content: center;
    gap: 0.3rem !important;
  }
  
  .contact-icon {
    width: 32px !important;
    height: 32px !important;
    margin-bottom: 0;
  }
  
  .contact-platform {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 360px) {
  .section {
    align-items: center;
    min-height: 500px;
  }

  .section-title {
    font-size: 1.5rem;
    padding: 0.4rem 2rem;
    height: 40px;
  }
  
  .contacts-container {
    width: 100%;
    justify-content: center;
    padding-right: 0;
  }

  .contacts-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem !important;
    width: 90% !important;
    max-width: 240px !important;
    min-width: auto;
  }
  
  .contact-item {
    padding: 0.6rem 0.4rem !important;
    width: auto !important;
    gap: 0.3rem !important;
  }
  
  .contact-icon {
    width: 28px !important;
    height: 28px !important;
  }
  
  .contact-platform {
    font-size: 0.7rem !important;
  }
}
</style>