<template>
  <div ref="containerRef" class="blackhole-container">
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, nextTick } from 'vue'

const containerRef = ref(null)
let scene = null
let camera = null
let renderer = null
let controls = null
let effectComposer = null
let animationId = null
let cleanupFunctions = []

let resizeObserver = null

const initThree = () => {
  const container = containerRef.value
  if (!container) return
  
  // 🔥 NÃO usar parent - usar o próprio container
  const rect = container.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  
  if (width < 100 || height < 100) {
    setTimeout(() => initThree(), 100)
    return
  }
  
  // Importar Three.js e addons
  Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js')
  ]).then(([THREE, { OrbitControls }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }]) => {
    
    // • Configuração da cena •
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010115);
    scene.fog = new THREE.FogExp2(0x010115, 0.002);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 🔥 Garantir que o canvas recebe eventos
    renderer.domElement.style.pointerEvents = 'auto'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'

    // • Effect Composer com Bloom •
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.0, 0.4, 0.8);
    bloomPass.threshold = 0.12;
    bloomPass.strength = 1.15;
    bloomPass.radius = 0.7;
    
    effectComposer = new EffectComposer(renderer);
    effectComposer.addPass(renderScene);
    effectComposer.addPass(bloomPass);
    
    // • Controles Orbitais •
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 1.6;
    
    // • Iluminação •
    const ambientLight = new THREE.AmbientLight(0x0a0a1a);
    scene.add(ambientLight);
    
    const backLight = new THREE.PointLight(0x3355aa, 0.45);
    backLight.position.set(-1, 1, -4);
    scene.add(backLight);
    
    const fillLight = new THREE.PointLight(0xaa6644, 0.35);
    fillLight.position.set(2, -1, 3);
    scene.add(fillLight);
    
    const coreLight = new THREE.PointLight(0xff4422, 0.65);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    
    // • Horizonte de Eventos (esfera preta) •
    const coreGeometry = new THREE.SphereGeometry(0.88, 128, 128);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x220000,
        emissiveIntensity: 0.1,
        roughness: 0.3,
        metalness: 0.9
    });
    const blackHoleCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(blackHoleCore);
    
    const glowGeometry = new THREE.SphereGeometry(0.96, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
    });
    const innerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(innerGlow);
    
    // ============================================================
    // • DISCO HORIZONTAL • Dots redondos •
    // ============================================================
    
    const HORIZONTAL_COUNT = 9000;
    
    class HorizontalParticle {
        constructor(radius, angle, yOffset, color) {
            this.radius = radius;
            this.angle = angle;
            this.yOffset = yOffset;
            this.color = color;
            this.angularSpeed = 0.008 + (1.2 / (radius + 0.5)) * 0.003;
        }
    }
    
    const horizontalParticles = [];
    const horizontalPositions = new Float32Array(HORIZONTAL_COUNT * 3);
    const horizontalColors = new Float32Array(HORIZONTAL_COUNT * 3);
    
    for (let i = 0; i < HORIZONTAL_COUNT; i++) {
        let r;
        if (Math.random() < 0.55) {
            r = 1.05 + Math.random() * 0.8;
        } else {
            r = 1.85 + Math.random() * 1.45;
        }
        
        const angle = Math.random() * Math.PI * 2;
        
        let yOffset;
        if (r < 1.65) {
            yOffset = (Math.random() - 0.5) * 0.45 * (1 - (r - 1.05) / 0.8);
        } else {
            yOffset = (Math.random() - 0.5) * 0.12;
        }
        
        const t = (r - 1.05) / 2.3;
        const rCol = 1.0 - t * 0.65;
        const gCol = 0.55 + Math.sin(t * Math.PI) * 0.35;
        const bCol = 0.35 + t * 0.65;
        
        horizontalParticles.push(new HorizontalParticle(r, angle, yOffset, [rCol, gCol, bCol]));
        
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        horizontalPositions[i*3] = x;
        horizontalPositions[i*3+1] = yOffset;
        horizontalPositions[i*3+2] = z;
        
        horizontalColors[i*3] = rCol;
        horizontalColors[i*3+1] = gCol;
        horizontalColors[i*3+2] = bCol;
    }
    
    const horizontalGeo = new THREE.BufferGeometry();
    horizontalGeo.setAttribute('position', new THREE.BufferAttribute(horizontalPositions, 3));
    horizontalGeo.setAttribute('color', new THREE.BufferAttribute(horizontalColors, 3));
    
    const horizontalMat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9
    });
    const horizontalSystem = new THREE.Points(horizontalGeo, horizontalMat);
    scene.add(horizontalSystem);
    
    // ============================================================
    // • DISCO VERTICAL • Dots redondos (copiado do horizontal)
    // ============================================================

    const VERTICAL_COUNT = 6000;  // 🔥 Aumentado para igual ao horizontal

    class VerticalParticle {
        constructor(radius, angle, xOffset, color) {
            this.radius = radius;
            this.angle = angle;
            this.xOffset = xOffset;
            this.color = color;
            this.angularSpeed = 0.008 + (1.2 / (radius + 0.5)) * 0.003;  // 🔥 Mesma velocidade do horizontal
        }
    }

    const verticalParticles = [];
    const verticalPositions = new Float32Array(VERTICAL_COUNT * 3);
    const verticalColors = new Float32Array(VERTICAL_COUNT * 3);

    for (let i = 0; i < VERTICAL_COUNT; i++) {
        let r;
        // 🔥 Mesma distribuição do horizontal
        if (Math.random() < 0.55) {
            r = 0.9 + Math.random() * 0.8;
        } else {
            r = 1.5 + Math.random() * 1;
        }
        
        const angle = Math.random() * Math.PI * 2;
        
        // 🔥 Mesmo cálculo de yOffset do horizontal (convertido para xOffset)
        let xOffset;
        if (r < 1.65) {
            xOffset = (Math.random() - 0.5) * 0.45 * (1 - (r - 1.05) / 0.8);
        } else {
            xOffset = (Math.random() - 0.5) * 0.12;
        }
        
        // 🔥 Mesmas cores do horizontal
        const t = (r - 1.05) / 2.3;
        const rCol = 1.0 - t * 0.65;
        const gCol = 0.55 + Math.sin(t * Math.PI) * 0.35;
        const bCol = 0.35 + t * 0.65;
        
        verticalParticles.push(new VerticalParticle(r, angle, xOffset, [rCol, gCol, bCol]));
        
        const yPos = Math.cos(angle) * r;
        const zPos = Math.sin(angle) * r;
        
        verticalPositions[i*3] = xOffset;
        verticalPositions[i*3+1] = yPos;
        verticalPositions[i*3+2] = zPos;
        
        verticalColors[i*3] = rCol;
        verticalColors[i*3+1] = gCol;
        verticalColors[i*3+2] = bCol;
    }

    const verticalGeo = new THREE.BufferGeometry();
    verticalGeo.setAttribute('position', new THREE.BufferAttribute(verticalPositions, 3));
    verticalGeo.setAttribute('color', new THREE.BufferAttribute(verticalColors, 3));

    const verticalMat = new THREE.PointsMaterial({
        size: 0.045,  // 🔥 Mesmo tamanho do horizontal
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9  // 🔥 Mesma opacidade do horizontal
    });
    const verticalSystem = new THREE.Points(verticalGeo, verticalMat);
    scene.add(verticalSystem);
    
    // ============================================================
    // • 8 DESCIDAS ORIGINAIS • Dots redondos menores •
    // ============================================================
    
    const INTERSECTION_COUNT = 5000;
    
    class IntersectionParticle {
        constructor(x, y, z, color, flowAngle, isTop, speed) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.color = color;
            this.flowAngle = flowAngle;
            this.isTop = isTop;
            this.speed = speed;
            this.progress = Math.random();
            this.direction = Math.random() > 0.5 ? 1 : -1;
        }
        
        update() {
            this.progress += this.speed * this.direction;
            if (this.progress > 1) {
                this.progress = 0;
            } else if (this.progress < 0) {
                this.progress = 1;
            }
            
            const t = this.progress;
            const easeT = t;
            
            const radius = 0.95 + easeT * 0.95;
            
            const horX = Math.cos(this.flowAngle) * radius;
            const horZ = Math.sin(this.flowAngle) * radius;
            const horY = 0;
            
            let vertY, vertZ;
            if (this.isTop) {
                vertY = Math.cos(this.flowAngle) * radius;
                vertZ = Math.sin(this.flowAngle) * radius;
            } else {
                vertY = -Math.cos(this.flowAngle) * radius;
                vertZ = Math.sin(this.flowAngle) * radius;
            }
            const vertX = 0;
            
            if (this.direction > 0) {
                this.x = vertX * (1 - easeT) + horX * easeT;
                this.y = vertY * (1 - easeT) + horY * easeT;
                this.z = vertZ * (1 - easeT) + horZ * easeT;
            } else {
                this.x = horX * (1 - easeT) + vertX * easeT;
                this.y = horY * (1 - easeT) + vertY * easeT;
                this.z = horZ * (1 - easeT) + vertZ * easeT;
            }
            
            const curveIntensity = Math.sin(easeT * Math.PI) * 0.2;
            const toCenterX = -this.x;
            const toCenterZ = -this.z;
            const toCenterY = -this.y;
            
            this.x += toCenterX * curveIntensity * 0.5;
            this.z += toCenterZ * curveIntensity * 0.5;
            this.y += toCenterY * curveIntensity * 0.35;
        }
    }
    
    const intersectionParticles = [];
    const intersectionPositions = new Float32Array(INTERSECTION_COUNT * 3);
    const intersectionColors = new Float32Array(INTERSECTION_COUNT * 3);
    
    const angles = [
        Math.PI / 4,
        3 * Math.PI / 4,
        5 * Math.PI / 4,
        7 * Math.PI / 4
    ];
    
    for (let i = 0; i < INTERSECTION_COUNT; i++) {
        const angleIndex = Math.floor(Math.random() * 4);
        let flowAngle = angles[angleIndex];
        flowAngle += (Math.random() - 0.5) * 0.3;
        
        const isTop = Math.random() > 0.5;
        const speed = 0.003 + Math.random() * 0.0035;
        
        const rCol = 0.6 + Math.random() * 0.3;
        const gCol = 0.35 + Math.random() * 0.35;
        const bCol = 0.45 + Math.random() * 0.35;
        
        const particle = new IntersectionParticle(0, 0, 0, [rCol, gCol, bCol], flowAngle, isTop, speed);
        intersectionParticles.push(particle);
        
        intersectionPositions[i*3] = 0;
        intersectionPositions[i*3+1] = 0;
        intersectionPositions[i*3+2] = 0;
        
        intersectionColors[i*3] = rCol;
        intersectionColors[i*3+1] = gCol;
        intersectionColors[i*3+2] = bCol;
    }
    
    const intersectionGeo = new THREE.BufferGeometry();
    intersectionGeo.setAttribute('position', new THREE.BufferAttribute(intersectionPositions, 3));
    intersectionGeo.setAttribute('color', new THREE.BufferAttribute(intersectionColors, 3));
    
    const intersectionMat = new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7
    });
    const intersectionSystem = new THREE.Points(intersectionGeo, intersectionMat);
    scene.add(intersectionSystem);
    
    // ============================================================
    // • CAMADA DENSA • Dots redondos próximos ao horizonte •
    // ============================================================
    
    const DENSE_COUNT = 3000;
    
    class DenseParticle {
        constructor(radius, angle, yOffset, color) {
            this.radius = radius;
            this.angle = angle;
            this.yOffset = yOffset;
            this.color = color;
            this.angularSpeed = 0.01 + (1.5 / (radius + 0.3)) * 0.002;
        }
    }
    
    const denseParticles = [];
    const densePositions = new Float32Array(DENSE_COUNT * 3);
    const denseColors = new Float32Array(DENSE_COUNT * 3);
    
    for (let i = 0; i < DENSE_COUNT; i++) {
        const r = 1.02 + Math.random() * 0.52;
        const angle = Math.random() * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * 0.52 * (1 - (r - 1.02) / 0.52);
        
        const intensity = 1.0 - (r - 1.02) / 0.52;
        const rCol = 1.0;
        const gCol = 0.4 + intensity * 0.5;
        const bCol = 0.1 + intensity * 0.2;
        
        denseParticles.push(new DenseParticle(r, angle, yOffset, [rCol, gCol, bCol]));
        
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        densePositions[i*3] = x;
        densePositions[i*3+1] = yOffset;
        densePositions[i*3+2] = z;
        
        denseColors[i*3] = rCol;
        denseColors[i*3+1] = gCol;
        denseColors[i*3+2] = bCol;
    }
    
    const denseGeo = new THREE.BufferGeometry();
    denseGeo.setAttribute('position', new THREE.BufferAttribute(densePositions, 3));
    denseGeo.setAttribute('color', new THREE.BufferAttribute(denseColors, 3));
    
    const denseMat = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.95
    });
    const denseSystem = new THREE.Points(denseGeo, denseMat);
    scene.add(denseSystem);
    
    // ============================================================
    // • POEIRA FINA • Dots espalhados •
    // ============================================================
    
    const DUST_COUNT = 5000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
        const radius = 1.5 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        dustPos[i*3] = radius * Math.sin(phi) * Math.cos(theta);
        dustPos[i*3+1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        dustPos[i*3+2] = radius * Math.cos(phi) * 1.1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.028, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
    const dustCloud = new THREE.Points(dustGeo, dustMat);
    scene.add(dustCloud);
    
    // ============================================================
    // • ESTRELAS DE FUNDO • Dots •
    // ============================================================
    const starCount = 6000;
    const starGeoBg = new THREE.BufferGeometry();
    const starPosBg = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPosBg[i*3] = (Math.random() - 0.5) * 260;
        starPosBg[i*3+1] = (Math.random() - 0.5) * 140;
        starPosBg[i*3+2] = (Math.random() - 0.5) * 140 - 70;
    }
    starGeoBg.setAttribute('position', new THREE.BufferAttribute(starPosBg, 3));
    const starMatBg = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const starsField = new THREE.Points(starGeoBg, starMatBg);
    scene.add(starsField);
    
    const brightStarCount = 1000;
    const brightStarGeo = new THREE.BufferGeometry();
    const brightStarPos = new Float32Array(brightStarCount * 3);
    for (let i = 0; i < brightStarCount; i++) {
        brightStarPos[i*3] = (Math.random() - 0.5) * 210;
        brightStarPos[i*3+1] = (Math.random() - 0.5) * 110;
        brightStarPos[i*3+2] = (Math.random() - 0.5) * 120 - 60;
    }
    brightStarGeo.setAttribute('position', new THREE.BufferAttribute(brightStarPos, 3));
    const brightStarMat = new THREE.PointsMaterial({ color: 0xffccaa, size: 0.12, transparent: true, opacity: 0.65 });
    const brightStars = new THREE.Points(brightStarGeo, brightStarMat);
    scene.add(brightStars);
    
    // ============================================================
    // • FLARES • Dots luminosos •
    // ============================================================
    
    const flareCount = 1600;
    const flareGeo = new THREE.BufferGeometry();
    const flarePos = new Float32Array(flareCount * 3);
    for (let i = 0; i < flareCount; i++) {
        const r = 0.96 + Math.random() * 0.38;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        flarePos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        flarePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
        flarePos[i*3+2] = r * Math.cos(phi);
    }
    flareGeo.setAttribute('position', new THREE.BufferAttribute(flarePos, 3));
    const flareMat = new THREE.PointsMaterial({ color: 0xffaa77, size: 0.022, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const flares = new THREE.Points(flareGeo, flareMat);
    scene.add(flares);
    
    // • Raios de luz (linhas mantidas para contraste) •
    // const rayCount = 40;
    // const rayLines = [];
    // const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff6644, transparent: true, opacity: 0.18 });
    // for (let i = 0; i < rayCount; i++) {
    //     const angle = (i / rayCount) * Math.PI * 2;
    //     const points = [];
    //     points.push(new THREE.Vector3(0, 0, 0));
    //     const len = 1.95;
    //     points.push(new THREE.Vector3(Math.cos(angle) * len, Math.sin(angle) * 0.12, Math.sin(angle) * len));
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //     const line = new THREE.Line(geometry, rayMaterial);
    //     scene.add(line);
    //     rayLines.push(line);
    // }
    
    // ============================================================
    // • ANIMAÇÃO •
    // ============================================================
    
    let time = 0;
    
    const horizontalPosAttr = horizontalGeo.attributes.position;
    const verticalPosAttr = verticalGeo.attributes.position;
    const densePosAttr = denseGeo.attributes.position;
    const intersectionPosAttr = intersectionGeo.attributes.position;
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.016;
        
        // • Disco Horizontal •
        const hPosArray = horizontalPosAttr.array;
        for (let i = 0; i < HORIZONTAL_COUNT; i++) {
            const p = horizontalParticles[i];
            p.angle += p.angularSpeed;
            if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;
            
            const x = Math.cos(p.angle) * p.radius;
            const z = Math.sin(p.angle) * p.radius;
            
            hPosArray[i*3] = x;
            hPosArray[i*3+2] = z;
        }
        horizontalPosAttr.needsUpdate = true;
        
        // • Disco Vertical •
        const vPosArray = verticalPosAttr.array;
        for (let i = 0; i < VERTICAL_COUNT; i++) {
            const p = verticalParticles[i];
            p.angle += p.angularSpeed;
            if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;
            
            const yPos = Math.cos(p.angle) * p.radius;
            const zPos = Math.sin(p.angle) * p.radius;
            
            vPosArray[i*3+1] = yPos;
            vPosArray[i*3+2] = zPos;
        }
        verticalPosAttr.needsUpdate = true;
        
        // • Camada Densa •
        const dPosArray = densePosAttr.array;
        for (let i = 0; i < DENSE_COUNT; i++) {
            const p = denseParticles[i];
            p.angle += p.angularSpeed;
            if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;
            
            const x = Math.cos(p.angle) * p.radius;
            const z = Math.sin(p.angle) * p.radius;
            
            dPosArray[i*3] = x;
            dPosArray[i*3+2] = z;
        }
        densePosAttr.needsUpdate = true;
        
        // • Partículas de Interseção (8 descidas) •
        const iPosArray = intersectionPosAttr.array;
        for (let i = 0; i < INTERSECTION_COUNT; i++) {
            const p = intersectionParticles[i];
            p.update();
            
            iPosArray[i*3] = p.x;
            iPosArray[i*3+1] = p.y;
            iPosArray[i*3+2] = p.z;
        }
        intersectionPosAttr.needsUpdate = true;
        
        // • Efeitos visuais dinâmicos •
        const pulseIntensity = 0.6 + Math.sin(time * 2.4) * 0.14;
        coreLight.intensity = pulseIntensity;
        coreMaterial.emissiveIntensity = 0.18 + Math.sin(time * 2.1) * 0.07;
        innerGlow.material.opacity = 0.1 + Math.sin(time * 1.9) * 0.05;
        
        // rayLines.forEach((line, idx) => {
        //     line.material.opacity = 0.15 + Math.sin(time * 2.8 + idx * 0.3) * 0.06;
        // });
        
        // • Opacidade pulsante dos dots •
        horizontalMat.opacity = 0.8 + Math.sin(time * 1.5) * 0.03;
        verticalMat.opacity = 0.75 + Math.sin(time * 1.8) * 0.04;  // 🔥 Igual ao horizontal
        denseMat.opacity = 0.5 + Math.sin(time * 2.2) * 0.02;
        intersectionMat.opacity = 0.4 + Math.sin(time * 2.0) * 0.05;
        
        // • Rotação suave dos elementos de fundo •
        starsField.rotation.y += 0.0002;
        brightStars.rotation.x += 0.00015;
        dustCloud.rotation.y += 0.0003;
        flares.rotation.y += 0.0004;
        flares.rotation.x += 0.0002;
        
        if (controls) controls.update();
        if (effectComposer) effectComposer.render();
    }
    
    animate();
    
    const handleResize = () => {
      if (!container) return
      const newRect = container.getBoundingClientRect()
      const newWidth = newRect.width
      const newHeight = newRect.height
      
      if (camera) {
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
      }
      if (renderer) renderer.setSize(newWidth, newHeight)
      if (effectComposer) effectComposer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    cleanupFunctions.push(() => {
      window.removeEventListener('resize', handleResize)
    })
    
    console.log('✨ Buraco Negro Interestelar • Versão Dots • 8 descidas originais • Partículas redondas');
  }).catch(err => {
    console.error('Erro ao carregar Three.js para Blackhole:', err)
  })
}

const updateSize = () => {
    if (!containerRef.value || !renderer || !camera) return

    // const width = containerRef.value.clientWidth
    // const height = containerRef.value.clientHeight

    // renderer.setSize(width, height)

    // camera.aspect = width / height
    // camera.updateProjectionMatrix() 
    window.dispatchEvent(new Event('resize'))
  
    // // Dispara múltiplas vezes para garantir
    // setTimeout(() => {
    //     window.dispatchEvent(new Event('resize'))
    // }, 50)
    // setTimeout(() => {
    //     window.dispatchEvent(new Event('resize'))
    // }, 150)
}

onMounted(async () => {
  await nextTick()

  initThree()

  // Resize imediato
  updateSize()

  // Resize após layout terminar
  requestAnimationFrame(() => {
    updateSize()
  })

  // Resize extra para transições/layouts lentos
  setTimeout(() => {
    updateSize()
  }, 100)

  setTimeout(() => {
    updateSize()
  }, 300)

  window.addEventListener('resize', updateSize)

  resizeObserver = new ResizeObserver(() => {
    updateSize()
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

// onBeforeUnmount(() => {
//   if (animationId) cancelAnimationFrame(animationId)
//   cleanupFunctions.forEach(fn => fn())
//   if (renderer && renderer.domElement && containerRef.value) {
//     containerRef.value.removeChild(renderer.domElement)
//   }
//   renderer = null
//   scene = null
//   camera = null
//   controls = null
//   effectComposer = null
// })
onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  cleanupFunctions.forEach(fn => fn())

  // 🔥 Dispose dos controles
  if (controls) {
    controls.dispose()
  }

  // 🔥 Dispose do EffectComposer
  if (effectComposer) {
    effectComposer.dispose?.()
  }

  if (renderer) {
    const canvas = renderer.domElement

    renderer.dispose()
    //renderer.forceContextLoss?.()

    if (canvas && containerRef.value?.contains(canvas)) {
        containerRef.value.removeChild(canvas)
    }
}

  renderer = null
  scene = null
  camera = null
  controls = null
  effectComposer = null
})

onUnmounted(() => {
//   if (animationId) cancelAnimationFrame(animationId)
//   cleanupFunctions.forEach(fn => fn())
//   if (renderer && renderer.domElement && containerRef.value) {
//     containerRef.value.removeChild(renderer.domElement)
//   }
//   renderer = null
//   scene = null
//   camera = null
//   controls = null
//   effectComposer = null
    window.removeEventListener('resize', updateSize)

    if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
    }
})
</script>

<style scoped>
.blackhole-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 5 !important;
  overflow: hidden !important;
  /* 🔥 IMPORTANTE: pointer-events: auto para o container */
  pointer-events: auto !important;
}

/* 🔥 Canvas DEVE receber eventos */
.blackhole-container canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: auto !important;
  cursor: grab !important;
}

.blackhole-container canvas:active {
  cursor: grabbing !important;
}

.blackhole-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background: rgba(0,0,0,0.6);
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  pointer-events: none;
  z-index: 10;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 300;
}

.blackhole-controls-note {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.5);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: none;
  font-family: monospace;
  z-index: 10;
}

@media (max-width: 600px) {
  .blackhole-info { font-size: 10px; bottom: 10px; left: 10px; }
  .blackhole-controls-note { font-size: 9px; }
}
</style>

