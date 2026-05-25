<template>
  <section class="section">
    <h2 class="section-title" :key="forceUpdate">{{ $t('projects') }}</h2>
    
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-number"><strong>60+</strong></div>
        <div class="stat-label"><strong>Public Repositories</strong></div>
      </div>
      <div class="stat-card">
        <div class="stat-number"><strong>6000+</strong></div>
        <div class="stat-label"><strong>Contributions</strong></div>
      </div>
    </div>

    <div class="projects-grid">
      <div 
        v-for="repo in repositories" 
        :key="repo.id" 
        class="project-card"
      >
        <h3 class="repo-name">{{ repo.name }}</h3>
        <p class="repo-description">{{ $t(repo.descriptionKey) }}</p>
        
        <div class="repo-topics">
          <span 
            v-for="topic in repo.topics" 
            :key="topic" 
            class="topic-tag"
          >
            {{ topic }}
          </span>
        </div>
        
        <button 
          class="github-btn"
          @click="openUrl(repo.html_url)"
        >
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" class="icon" />
          {{ $t('viewOnGitHub') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useTranslations } from '@/composables/useTranslations'

const { $t, forceUpdate } = useTranslations()

const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const repositories = ref([
  {
    id: 1,
    name: 'Solar-System Testings',
    descriptionKey: 'github.solarSystem.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/1%20-%20SolarSystem',
    topics: ['Unity', 'C#', '3D', 'Testing']
  },
  {
    id: 2,
    name: 'Movement Testings',
    descriptionKey: 'github.movement.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/2%20-%20Movements',
    topics: ['Unity', 'C#', '3D', 'Testing']
  },
  {
    id: 3,
    name: 'Vector Testings',
    descriptionKey: 'github.vector.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/2.5%20-%20Vectors',
    topics: ['Unity', 'C#', '3D', 'Testing']
  },
  {
    id: 4,
    name: 'Life Testings',
    descriptionKey: 'github.life.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/3%20-%20Life',
    topics: ['Unity', 'C#', '3D', 'UI', 'Testing']
  },
  {
    id: 5,
    name: 'Inventory-Drop-Collect-Craft-System Testings',
    descriptionKey: 'github.inventory.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/4%20-%20InventoryDropCollectSystem',
    topics: ['Unity', 'C#', '2D', 'UI', 'Testing', 'Game Development']
  },
  {
    id: 6,
    name: 'Time Testings',
    descriptionKey: 'github.time.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/5%20-%20Times',
    topics: ['Unity', 'C#', '3D', 'UI', 'Testing']
  },
  {
    id: 7,
    name: 'Drag-And-Drop Testings',
    descriptionKey: 'github.dragAndDrop.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/6%20-%20DragAndDrop',
    topics: ['Unity', 'C#', '3D', '2D', 'Testing']
  },
  {
    id: 8,
    name: '2D-Stuff Testings',
    descriptionKey: 'github.secondStuff.description',
    html_url: 'https://github.com/GabrielCAlves/Testing-Mechanics/tree/main/Assets/7%20-%202DStuff',
    topics: ['Unity', 'C#', '2D', 'UI', 'Testing']
  },
  {
    id: 9,
    name: 'Astro-Adventure-3D',
    descriptionKey: 'github.astroAdventure.description',
    html_url: 'https://github.com/GabrielCAlves/Astro-Adventure-3D',
    topics: ['Unity', 'C#', '3D', 'Adventure']
  },
  {
    id: 10,
    name: 'Cook-And-Conquer',
    descriptionKey: 'github.cookAndConquer.description',
    html_url: 'https://github.com/PierrotNobre/Project_RED',
    topics: ['Unity', 'C#', 'Roguelike', 'Survival']
  },
  {
    id: 11,
    name: 'Lost-In-The-Stars',
    descriptionKey: 'github.lostInTheStars.description',
    html_url: 'https://github.com/GabrielCAlves/Lost-In-The-Stars',
    topics: ['Unity', 'C#', '2D', 'Platformer', 'Adventure']
  },
  {
    id: 12,
    name: 'MyPong',
    descriptionKey: 'github.myPong.description',
    html_url: 'https://github.com/GabrielCAlves/MyPong',
    topics: ['Unity', 'C#', 'Local-Multiplayer', 'Pong', 'Casual']
  },
  {
    id: 13,
    name: 'Astro-Obstacle',
    descriptionKey: 'github.astroObstacle.description',
    html_url: 'https://github.com/GabrielCAlves/Astro-Obstacle',
    topics: ['Unity', 'C#', '3D', 'Obstacle Course', 'Runner']
  },
  {
    id: 14,
    name: '4Kingdoms',
    descriptionKey: 'github.fourKingdoms.description',
    html_url: 'https://github.com/GabrielCAlves/4Kingdoms',
    topics: ['Unity', 'C#', 'Local-Multiplayer', 'Brawler', '2D']
  },
  {
    id: 15,
    name: 'AdotaAI',
    descriptionKey: 'github.adotaai.description',
    html_url: 'https://github.com/GabrielCAlves/AdotaAI',
    topics: ['Web', 'Vue.js', 'Node.js', 'API', 'Full Stack', 'Strapi']
  },
  // {
  //   id: 16,
  //   name: 'CasaDoAnciao',
  //   descriptionKey: 'github.casaDoAnciao.description',
  //   html_url: 'https://github.com/GabrielCAlves/CasaDoAnciao',
  //   topics: ['Web', 'Spring Boot', 'Vue.js', 'TypeScript', 'PostgreSQL', 'Full Stack']
  // },
  {
    id: 16,
    name: 'ConsultasQX',
    descriptionKey: 'github.consultasqx.description',
    html_url: 'https://github.com/giovanavi/mobile/tree/main/ConsultasQX',
    topics: ['Mobile', 'Java', 'Firebase', 'Android Studio', 'Healthcare']
  },
  {
    id: 17,
    name: 'FeiraoNordeste',
    descriptionKey: 'github.feiraonordeste.description',
    html_url: 'https://github.com/GabrielCAlves/FeiraoNordeste',
    topics: ['Mobile', 'Java', 'Firebase', 'Android Studio', 'Shopping']
  },
  {
    id: 18,
    name: 'Motora',
    descriptionKey: 'github.motora.description',
    html_url: 'https://github.com/dabliu89/Motora/tree/main',
    topics: ['Mobile', 'Java', 'Firebase', 'Android Studio', 'Education']
  }
])
</script>

<style scoped>
.section {
  padding: 2rem;
  color: white;
  position: relative;
  z-index: 2;
  background: transparent;
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

.stats-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stat-card {
  background: #10172b;
  padding: 1.5rem 2.5rem;
  border-radius: 12px;
  text-align: center;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.project-card {
  background: #10172b;
  padding: 1.5rem;
  border-radius: 10px;
  border: 3px solid;
  border-image: linear-gradient(135deg, red 0%, blue 100%) 1;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border: 3px solid;
  border-image: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%) 1;
  transform: translateY(-5px);
}

.repo-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #fff;
  word-break: break-word;
}

.repo-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.repo-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.topic-tag {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.topic-tag {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 50, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.topic-tag:hover {
  transform: translateY(-2px);
  border-color: #cc0000;
  box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);
}

.github-btn {
  background: #333;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
}

.github-btn:hover {
  background: linear-gradient(135deg, rgb(204, 139, 0) 0%, white 50%, rgb(204, 139, 0) 100%);
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.github-btn .icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.github-btn:hover .icon {
  filter: none;
}

@media (max-width: 968px) {
  .section {
    padding: 1rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .stats-row {
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem 1.5rem;
    min-width: 150px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .project-card {
    padding: 1rem;
  }
  
  .repo-name {
    font-size: 1.1rem;
  }
  
  .repo-description {
    font-size: 0.8rem;
  }
  
  .topic-tag {
    font-size: 0.6rem;
    padding: 0.2rem 0.6rem;
  }
  
  .stat-card {
    padding: 0.75rem 1rem;
    min-width: 120px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}
</style>