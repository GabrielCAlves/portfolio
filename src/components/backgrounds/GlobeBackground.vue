<template>
  <div ref="containerRef" class="globe-container">
    <div class="globe-controls">
      <div class="control-group">
        <div class="color-picker-wrapper">
          <label>🎨 {{ $t('contacts.globebackground.color') }}</label>
          <!-- <input type="color" id="corSeletor" value="#ff6688"> -->
          <div class="color-display" id="colorDisplay" style="background: #ff6688"></div>
          <input type="color" id="corSeletor" value="#ff6688" style="position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;">
        </div>
        <button id="btnAplicarCor">🌈 {{ $t('contacts.globebackground.usecolor') }}</button>
        <button id="btnResetarCores">🛰️ {{ $t('contacts.globebackground.satellitemap') }}</button>
      </div>
      
      <div class="control-group">
        <div class="slider-container">
          <label>🔘 {{ $t('contacts.globebackground.dots') }}:</label>
          <input type="range" id="pontoSlider" min="3000" max="45000" step="500" value="22000">
          <span id="pontoCountValue">22.0k</span>
        </div>
        <button id="btnRegenerar">🔄 {{ $t('contacts.globebackground.reload') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTranslations } from '@/composables/useTranslations'

const { $t } = useTranslations()

const containerRef = ref(null)
let scene = null
let camera = null
let renderer = null
let earthGroup = null
let animationId = null
let cleanupFunctions = []

let pontosGloboMesh = null
let coresOriginaisArray = null
let usandoCoresOriginais = true
let corSolidaAtual = null
let texturaSatelite = null
let texturaCarregada = false

let QUANTIDADE_PONTOS_ATUAL = 22000
const TAMANHO_PONTO = 0.042
const ROTACAO_AUTOMATICA_VEL = 0.0008

let targetRotationY = 0
let currentRotY = 0
let autoRotateAngle = 0
let targetRotationX = 0
let currentRotX = 0
let isDragging = false
let lastMouseX = 0, lastMouseY = 0
let autoRotate = true
const SENSIBILIDADE = 0.006

const initThree = () => {
  const container = containerRef.value
  const parent = container?.parentElement
  if (!container || !parent) return
  
  const rect = parent.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  
  if (width < 100 || height < 100) {
    setTimeout(() => initThree(), 100)
    return
  }
  
  import('three').then((THREE) => {
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030318);
    scene.fog = new THREE.FogExp2(0x030318, 0.0004);
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.1, 3.5);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroup.rotation.y = 0;
    
    const TEXTURA_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
    const TEXTURA_FALLBACK = 'https://threejs.org/examples/textures/planets/earth_day_2048x1024.jpg';
    
    function carregarTexturaSatelite() {
      return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(TEXTURA_URL, 
          (texture) => {
            texturaSatelite = texture;
            texturaSatelite.wrapS = THREE.RepeatWrapping;
            texturaSatelite.wrapT = THREE.ClampToEdgeWrapping;
            texturaSatelite.needsUpdate = true;
            texturaCarregada = true;
            resolve(texturaSatelite);
          },
          null,
          (error) => {
            console.warn('Erro ao carregar textura principal, tentando fallback...', error);
            textureLoader.load(TEXTURA_FALLBACK, 
              (textureFallback) => {
                texturaSatelite = textureFallback;
                texturaSatelite.wrapS = THREE.RepeatWrapping;
                texturaSatelite.wrapT = THREE.ClampToEdgeWrapping;
                texturaCarregada = true;
                resolve(texturaSatelite);
              },
              null,
              (err2) => {
                reject(err2);
              }
            );
          }
        );
      });
    }
    
    // 🔥 FUNÇÃO MODIFICADA - CORES MAIS ESCURAS
    function gerarGeometriaComTexturaSatelite(qtd, texture) {
      const posicoes = [];
      const cores = [];
      
      const imageCanvas = document.createElement('canvas');
      const imgWidth = texture.image ? texture.image.width : 2048;
      const imgHeight = texture.image ? texture.image.height : 1024;
      imageCanvas.width = imgWidth;
      imageCanvas.height = imgHeight;
      const ctx = imageCanvas.getContext('2d');
      
      if (texture.image) {
        ctx.drawImage(texture.image, 0, 0, imgWidth, imgHeight);
      } else {
        ctx.fillStyle = '#2a7f9f';
        ctx.fillRect(0, 0, imgWidth, imgHeight);
      }
      
      const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
      const dados = imgData.data;
      
      function obterCorPorUV(u, v) {
        let texX = Math.floor(u * (imgWidth - 1));
        let texY = Math.floor(v * (imgHeight - 1));
        texX = Math.min(Math.max(texX, 0), imgWidth - 1);
        texY = Math.min(Math.max(texY, 0), imgHeight - 1);
        const idx = (texY * imgWidth + texX) * 4;
        let r = dados[idx] / 255;
        let g = dados[idx+1] / 255;
        let b = dados[idx+2] / 255;
        
        // 🔥 AUMENTAR SATURAÇÃO - método mais simples
        // Calcular a intensidade média
        const gray = (r + g + b) / 3;
        // Fator de saturação (1.0 = original, >1.0 = mais saturado)
        const satFactor = 3; // Aumenta saturação em 60%
        
        // Aplicar saturação: puxar as cores para longe do cinza
        r = gray + (r - gray) * satFactor;
        g = gray + (g - gray) * satFactor;
        b = gray + (b - gray) * satFactor;
        
        // Limitar valores entre 0 e 1
        r = Math.min(Math.max(r, 0), 1);
        g = Math.min(Math.max(g, 0), 1);
        b = Math.min(Math.max(b, 0), 1);
        
        // Brilho moderado para manter cores vivas (0.8 a 1.05)
        const brilho = 0.8 + Math.random() * 0.25;
        
        return new THREE.Color(r * brilho, g * brilho, b * brilho);
      }
      
      let gerados = 0;
      while (gerados < qtd) {
        let x, y, z, norma;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
          norma = x*x + y*y + z*z;
        } while (norma > 1 || norma < 0.008);
        const invNorm = 1 / Math.sqrt(norma);
        x *= invNorm;
        y *= invNorm;
        z *= invNorm;
        
        const latRad = Math.asin(z);
        let lonRad = Math.atan2(y, x);
        
        const DESLOCAMENTO_LONGITUDE = -Math.PI / 2;
        lonRad += DESLOCAMENTO_LONGITUDE;
        
        if (lonRad > Math.PI) lonRad -= Math.PI * 2;
        if (lonRad < -Math.PI) lonRad += Math.PI * 2;
        
        const latitude = latRad * 180 / Math.PI;
        const longitude = lonRad * 180 / Math.PI;
        const u = (longitude + 180) / 360;
        const v = (90 - latitude) / 180;
        
        let cor = obterCorPorUV(u, v);
        
        posicoes.push(x, y, z);
        cores.push(cor.r, cor.g, cor.b);
        gerados++;
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posicoes), 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores), 3));
      return geometry;
    }
    
    function aplicarCorSolida(corHex) {
      if (!pontosGloboMesh) return;
      const cor = new THREE.Color(corHex);
      const geometry = pontosGloboMesh.geometry;
      const numVertices = geometry.attributes.position.count;
      const novasCores = new Float32Array(numVertices * 3);
      for (let i = 0; i < numVertices; i++) {
        novasCores[i*3] = cor.r;
        novasCores[i*3+1] = cor.g;
        novasCores[i*3+2] = cor.b;
      }
      geometry.setAttribute('color', new THREE.BufferAttribute(novasCores, 3));
      pontosGloboMesh.material.vertexColors = true;
      pontosGloboMesh.material.needsUpdate = true;
    }
    
    function restaurarCoresOriginais() {
      if (!pontosGloboMesh || !coresOriginaisArray) return;
      const geometry = pontosGloboMesh.geometry;
      const copiaCores = new Float32Array(coresOriginaisArray.length);
      copiaCores.set(coresOriginaisArray);
      geometry.setAttribute('color', new THREE.BufferAttribute(copiaCores, 3));
      pontosGloboMesh.material.vertexColors = true;
      pontosGloboMesh.material.needsUpdate = true;
    }
    
    async function regenerarGlobo(novaQuantidade) {
      if (!texturaCarregada || !texturaSatelite) {
        console.warn('Textura ainda não carregada, aguarde...');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 30));
      
      const novaGeometria = gerarGeometriaComTexturaSatelite(novaQuantidade, texturaSatelite);
      
      const attrCor = novaGeometria.attributes.color.array;
      coresOriginaisArray = new Float32Array(attrCor.length);
      coresOriginaisArray.set(attrCor);
      
      if (pontosGloboMesh) {
        earthGroup.remove(pontosGloboMesh);
        if (pontosGloboMesh.geometry) pontosGloboMesh.geometry.dispose();
      }
      
      const material = new THREE.PointsMaterial({
        size: TAMANHO_PONTO,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.94
      });
      
      pontosGloboMesh = new THREE.Points(novaGeometria, material);
      earthGroup.add(pontosGloboMesh);
      
      if (!usandoCoresOriginais) {
        aplicarCorSolida(corSolidaAtual.getHexString());
      }
      
      QUANTIDADE_PONTOS_ATUAL = novaQuantidade;
      const pontoCountSpan = document.getElementById('pontoCountValue');
      if (pontoCountSpan) pontoCountSpan.innerText = (novaQuantidade / 1000).toFixed(1) + 'k';
    }
    
    async function inicializarGlobo() {
      try {
        await carregarTexturaSatelite();
        
        const geometria = gerarGeometriaComTexturaSatelite(QUANTIDADE_PONTOS_ATUAL, texturaSatelite);
        const attrCor = geometria.attributes.color.array;
        coresOriginaisArray = new Float32Array(attrCor.length);
        coresOriginaisArray.set(attrCor);
        
        const material = new THREE.PointsMaterial({
          size: TAMANHO_PONTO,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.94
        });
        
        pontosGloboMesh = new THREE.Points(geometria, material);
        earthGroup.add(pontosGloboMesh);
        
        const geometriaHalo = new THREE.SphereGeometry(1.08, 96, 96);
        const materialHalo = new THREE.MeshBasicMaterial({
          color: 0x3377aa,
          transparent: true,
          opacity: 0.04,
          side: THREE.BackSide
        });
        const halo = new THREE.Mesh(geometriaHalo, materialHalo);
        earthGroup.add(halo);
        
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 4500;
        const starPositions = [];
        for (let i = 0; i < starCount; i++) {
          starPositions.push((Math.random() - 0.5) * 1000);
          starPositions.push((Math.random() - 0.5) * 800);
          starPositions.push((Math.random() - 0.5) * 600 - 200);
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
        const estrelas = new THREE.Points(starGeometry, starMaterial);
        scene.add(estrelas);
        
        const animateStars = () => {
          estrelas.rotation.y += 0.00008;
          estrelas.rotation.x += 0.00004;
          requestAnimationFrame(animateStars);
        };
        animateStars();
        
      } catch (error) {
        console.error('Erro ao inicializar globo:', error);
      }
    }
    
    corSolidaAtual = new THREE.Color(0xff6688);
    
    const corSeletorInput = document.getElementById('corSeletor');
    const btnAplicar = document.getElementById('btnAplicarCor');
    const btnReset = document.getElementById('btnResetarCores');
    const pontoSlider = document.getElementById('pontoSlider');
    const btnRegenerar = document.getElementById('btnRegenerar');
    
    if (btnAplicar) {
      btnAplicar.addEventListener('click', () => {
        if (!pontosGloboMesh) return;
        const corHex = corSeletorInput.value;
        corSolidaAtual = new THREE.Color(corHex);
        aplicarCorSolida(corHex);
        usandoCoresOriginais = false;
      });
    }
    
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (!pontosGloboMesh || !coresOriginaisArray) return;
        restaurarCoresOriginais();
        usandoCoresOriginais = true;
      });
    }
    
    if (btnRegenerar) {
      btnRegenerar.addEventListener('click', async () => {
        const novaQtd = parseInt(pontoSlider.value, 10);
        if (novaQtd === QUANTIDADE_PONTOS_ATUAL) {
          return;
        }
        await regenerarGlobo(novaQtd);
        if (!usandoCoresOriginais) {
          aplicarCorSolida(corSolidaAtual.getHexString());
        }
      });
    }
    
    if (pontoSlider) {
      pontoSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const pontoCountSpan = document.getElementById('pontoCountValue');
        if (pontoCountSpan) pontoCountSpan.innerText = (val / 1000).toFixed(1) + 'k';
      });
    }
    
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          isDragging = true;
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;
          renderer.domElement.style.cursor = 'grabbing';
          autoRotate = false;
          e.preventDefault();
        }
      });
      
      renderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          lastMouseX = e.touches[0].clientX;
          lastMouseY = e.touches[0].clientY;
          autoRotate = false;
          e.preventDefault();
        }
      });
    }
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      if (deltaX !== 0 || deltaY !== 0) {
        targetRotationY += deltaX * SENSIBILIDADE;
        targetRotationX += deltaY * SENSIBILIDADE;
        targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX));
        autoRotateAngle = targetRotationY;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length) {
        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;
        targetRotationY += deltaX * SENSIBILIDADE;
        targetRotationX += deltaY * SENSIBILIDADE;
        targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX));
        autoRotateAngle = targetRotationY;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        e.preventDefault();
      }
    });
    
    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (renderer && renderer.domElement) renderer.domElement.style.cursor = 'default';
        setTimeout(() => { if (!isDragging) autoRotate = true; }, 100);
      }
    });
    
    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => { if (!isDragging) autoRotate = true; }, 100);
      }
    });

    // Atualizar o background do seletor quando a cor mudar
    if (corSeletorInput) {
      corSeletorInput.addEventListener('input', (e) => {
        corSeletorInput.style.background = e.target.value;
      });
      // Definir a cor inicial
      corSeletorInput.style.background = corSeletorInput.value;
    }

    const colorDisplay = document.getElementById('colorDisplay');
    if (corSeletorInput && colorDisplay) {
      colorDisplay.addEventListener('click', () => {
        corSeletorInput.click();
      });
      
      corSeletorInput.addEventListener('input', (e) => {
        colorDisplay.style.background = e.target.value;
      });
      
      // Definir a cor inicial
      colorDisplay.style.background = corSeletorInput.value;
    }
    
    function animateRotation() {
      if (autoRotate && !isDragging) {
        autoRotateAngle += ROTACAO_AUTOMATICA_VEL;
        targetRotationY = autoRotateAngle;
      }
      
      currentRotY += (targetRotationY - currentRotY) * 0.12;
      currentRotX += (targetRotationX - currentRotX) * 0.12;
      
      if (earthGroup) {
        earthGroup.rotation.order = 'YXZ';
        earthGroup.rotation.x = currentRotX;
        earthGroup.rotation.y = currentRotY;
        earthGroup.rotation.z = 0;
      }
      
      requestAnimationFrame(animateRotation);
    }
    animateRotation();
    
    function renderScene() {
      if (renderer && scene && camera) renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
    }
    renderScene();
    
    const handleResize = () => {
      if (!container || !parent) return
      const newRect = parent.getBoundingClientRect()
      if (camera) {
        camera.aspect = newRect.width / newRect.height
        camera.updateProjectionMatrix()
      }
      if (renderer) renderer.setSize(newRect.width, newRect.height)
    }
    
    window.addEventListener('resize', handleResize)
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    inicializarGlobo();
    console.log('🚀 Globo com cores mais escuras!');
    
    cleanupFunctions.push(() => {
      window.removeEventListener('resize', handleResize)
    })
    
  }).catch(err => {
    console.error('Erro ao carregar Three.js para Globe:', err)
  })
}

onMounted(() => {
  setTimeout(() => {
    initThree()
  }, 100)
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  cleanupFunctions.forEach(fn => fn())
  if (renderer && renderer.domElement && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
  }
  renderer = null
  scene = null
  camera = null
  earthGroup = null
})
</script>

<style scoped>
.globe-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 0 !important;
  pointer-events: auto !important;
  overflow: hidden !important;
}

.globe-container canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}

.globe-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(10, 20, 35, 0.88);
  backdrop-filter: blur(14px);
  border-radius: 24px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 20;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  font-family: 'Segoe UI', monospace;
  min-width: 220px;
}

/* 🔥 RESPONSIVIDADE - Ajusta posição dos controles em telas menores */
@media (max-width: 1024px) {
  .globe-controls {
    top: 15px;
    left: 15px;
    padding: 10px 16px;
    min-width: 180px;
    transform: scale(0.95);
    transform-origin: top left;
  }
}

@media (max-width: 768px) {
  .globe-controls {
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    min-width: 160px;
    transform: scale(0.9);
    transform-origin: top left;
  }
  
  .control-group {
    gap: 6px;
  }
  
  button {
    padding: 4px 10px;
    font-size: 10px;
  }
  
  .slider-container {
    padding: 4px 10px;
  }
  
  .slider-container label {
    font-size: 9px;
  }
  
  #pontoCountValue {
    font-size: 9px;
    min-width: 40px;
    padding: 2px 6px;
  }
  
  .color-picker-wrapper {
    padding: 3px 10px;
  }
  
  .color-picker-wrapper label {
    font-size: 10px;
  }
  
  #corSeletor {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .globe-controls {
    top: 8px;
    left: 8px;
    padding: 6px 10px;
    min-width: 140px;
    transform: scale(0.85);
    transform-origin: top left;
    gap: 8px;
  }
  
  .control-group {
    gap: 4px;
    flex-wrap: wrap;
  }
  
  button {
    padding: 3px 8px;
    font-size: 9px;
  }
  
  .slider-container {
    padding: 3px 8px;
    gap: 6px;
  }
  
  .slider-container label {
    font-size: 8px;
  }
  
  #pontoCountValue {
    font-size: 8px;
    min-width: 35px;
    padding: 2px 4px;
  }
  
  .color-picker-wrapper {
    padding: 2px 8px;
    gap: 6px;
  }
  
  .color-picker-wrapper label {
    font-size: 9px;
  }
  
  #corSeletor {
    width: 24px;
    height: 24px;
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0,0,0,0.5);
  padding: 5px 14px;
  border-radius: 40px;
}

.color-picker-wrapper label {
  color: white;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/***/
.color-display {
  width: 38px;
  height: 38px;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
  transition: transform 0.1s ease;
}

.color-display:hover {
  transform: scale(1.05);
}

#corSeletor {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* #corSeletor {
  width: 38px;
  height: 38px;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  background: #ff5588;
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
  transition: transform 0.1s ease;
} */

#corSeletor:hover {
  transform: scale(1.05);
}

button {
  background: linear-gradient(135deg, #2c3e66, #1a2a44);
  border: none;
  color: white;
  padding: 7px 18px;
  border-radius: 40px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: monospace;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255,255,255,0.25);
}

button:hover {
  background: linear-gradient(135deg, #3e5a88, #2a3f64);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0,0,0,0.5);
  padding: 6px 14px;
  border-radius: 40px;
  flex: 1;
}

.slider-container label {
  color: #ddd;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: linear-gradient(90deg, #2a7f9f, #88ccff);
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px cyan;
  border: 1px solid #88ccff;
}

#pontoCountValue {
  background: #1a2a44;
  padding: 4px 10px;
  border-radius: 30px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #88ffcc;
  min-width: 55px;
  text-align: center;
}

.globe-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 11px;
  pointer-events: none;
  z-index: 10;
  font-family: monospace;
  border-left: 3px solid #ffaa44;
}

.globe-instrucao {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: rgba(255,255,240,0.7);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 11px;
  font-family: monospace;
  pointer-events: none;
  z-index: 10;
}

.globe-status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 11px;
  font-family: monospace;
  color: #ffaa88;
  pointer-events: none;
  z-index: 10;
  border-right: 2px solid #ffaa44;
}

@media (max-width: 700px) {
  .globe-controls { padding: 10px 14px; top: 12px; left: 12px; min-width: 180px; gap: 10px; }
  .control-group { gap: 8px; }
  button { padding: 5px 12px; font-size: 10px; }
  .slider-container label { font-size: 10px; }
  #pontoCountValue { font-size: 10px; min-width: 45px; }
  .globe-info, .globe-instrucao, .globe-status-badge { font-size: 9px; }
  #corSeletor { width: 32px; height: 32px; }
}

.globe-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
}
</style>