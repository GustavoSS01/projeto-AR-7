<template>
  <div class="app-page">
    <h1 class="header">TatuAR</h1>

    <!-- mostrado apenas antes de iniciar -->
    <div v-if="!showCamera" class="center-content">
      <p class="description">
        Selecione uma tatuagem, clique no botão abaixo e aponte a câmera para o marcador para visualizar a tatuagem.
      </p>
      <!-- Adicione o TattooSelector aqui -->
      <TattooSelector @tattoo-selected="updateTattoo" />
      <button class="start-btn" @click="startCamera">Vamos lá!</button>
    </div>

    <!-- após iniciar: câmera como background de toda a tela + AR -->
    <div v-if="showCamera" class="fullscreen-ar">
      <a-scene
        v-if="aframeReady"
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        class="ar-scene"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;">
        
        <a-marker
          type="pattern"
          :url="markerPath"
          @markerFound="onMarkerFound"
          @markerLost="onMarkerLost"
          smooth="true"
          smoothCount="10"
          smoothTolerance="0.01"
          smoothThreshold="5">
          <!-- plano com a tatuagem - sempre visível quando marker for detectado -->
          <a-plane
            :src="tattooUrl"
            rotation="-90 0 0"
            position="0 0 0.1"
            :width="planeSize"
            :height="planeSize"
            material="transparent: true; alphaTest: 0.5;">
          </a-plane>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      <!-- indicador de status do marker -->
      <div class="marker-status" :class="{ active: markerVisible }">
        {{ markerVisible ? 'Marker detectado!' : 'Procurando marker...' }}
      </div>

      <!-- botão parar centralizado na parte inferior -->
      <button class="stop-btn-fixed" @click="stopCamera">Parar vídeo</button>
    </div>
  </div>
</template>

<script>
import TattooSelector from './TattooSelector.vue'

export default {
  name: 'AppPage',
  components: {
    TattooSelector
  },
  data() {
    return {
      showCamera: false,
      aframeReady: false,
      markerVisible: false,
      // corrigindo o caminho - o arquivo se chama marker.patt, não maker.patt
      markerPath: './marker/marker.patt',
      // usando caminho direto para a imagem na pasta public
      tattooUrl: './tattoos/tatuagemteste3.png',
      planeSize: 1.5, // aumentando o tamanho para melhor visualização
    };
  },
  methods: {
    loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Falha ao carregar ' + src));
        document.head.appendChild(s);
      });
    },
    async startCamera() {
      try {
        // carrega A-Frame e AR.js
        if (!window.AFRAME) {
          await this.loadScript('https://aframe.io/releases/1.3.0/aframe.min.js');
        }
        if (!window.ARJS && !document.querySelector('script[src*="aframe-ar.js"]')) {
          await this.loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
        }

        this.showCamera = true;

        this.$nextTick(() => {
          this.aframeReady = true;
          // força a detecção do marker após alguns segundos
          setTimeout(() => {
            console.log('AR.js inicializado, procurando markers...');
          }, 3000);
        });
      } catch (err) {
        console.error(err);
        alert('Erro ao iniciar AR: ' + err.message);
      }
    },
    stopCamera() {
      this.markerVisible = false;
      this.aframeReady = false;
      this.showCamera = false;

      // para streams de vídeo
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        try {
          const s = video.srcObject;
          if (s && s.getTracks) s.getTracks().forEach(t => t.stop());
          video.srcObject = null;
        } catch (e) {}
      });
    },
    onMarkerFound() {
      this.markerVisible = true;
      console.log('Marker encontrado! Mostrando tatuagem...');
    },
    onMarkerLost() {
      this.markerVisible = false;
      console.log('Marker perdido! Ocultando tatuagem...');
    },
    updateTattoo(newTattooUrl) {
      this.tattooUrl = newTattooUrl;
    }
  },
  beforeDestroy() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      try {
        const s = video.srcObject;
        if (s && s.getTracks) s.getTracks().forEach(t => t.stop());
      } catch (e) {}
    });
  },
};
</script>

<style scoped>
/* remove margens e paddings globais para evitar overflow */
.app-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  -webkit-overflow-scrolling: touch;
}

/* título sempre visível no topo */
.header {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  margin: 0;
  font-size: clamp(1.2rem, 5vw, 2rem);
  z-index: 1000;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  pointer-events: none;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* conteúdo inicial centralizado */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: clamp(5rem, 12vh, 7rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 5vh, 3rem) clamp(1rem, 4vw, 2rem);
  box-sizing: border-box;
  overflow-y: auto;
}

.description {
  font-size: clamp(0.9rem, 3.8vw, 1.2rem);
  font-weight: 600;
  max-width: min(600px, 95vw);
  line-height: 1.6;
  margin-top: 0;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
  padding: 0 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: block;
  width: 100%;
}

/* container AR que ocupa toda a tela */
.fullscreen-ar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

/* cena A-Frame ocupa toda a tela como background */
.ar-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
}

/* botão parar fixo na parte inferior centralizado */
.stop-btn-fixed {
  position: fixed;
  bottom: clamp(1.5rem, 5vh, 3rem);
  left: 50%;
  transform: translateX(-50%);
  padding: clamp(0.8rem, 2.5vw, 1rem) clamp(1.5rem, 5vw, 2rem);
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: #d32f2f;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: background 0.2s;
  white-space: nowrap;
}

.stop-btn-fixed:hover {
  background: #b71c1c;
}

.stop-btn-fixed:active {
  background: #b71c1c;
  transform: translateX(-50%) scale(0.98);
}

/* botão iniciar */
.start-btn {
  padding: clamp(0.9rem, 3vw, 1.2rem) clamp(1.8rem, 6vw, 2.5rem);
  font-size: clamp(1rem, 3.5vw, 1.3rem);
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  flex-shrink: 0;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.start-btn:hover { 
  background: #1565c0; 
}

.start-btn:active {
  background: #1565c0;
  transform: scale(0.98);
}

/* indicador de status do marker */
.marker-status {
  position: fixed;
  top: clamp(0.8rem, 2vh, 1rem);
  left: clamp(0.8rem, 2vw, 1rem);
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem);
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  z-index: 1000;
  transition: opacity 0.3s;
  max-width: calc(100vw - 2rem);
  word-wrap: break-word;
}

.marker-status.active {
  background: rgba(76, 175, 80, 0.9);
}

/* Media queries para responsividade */
/* Tablets em paisagem e desktops pequenos */
@media (max-width: 1024px) and (min-width: 769px) {
  .header {
    font-size: 1.8rem;
  }
  
  .center-content {
    padding: 6rem 2rem 3rem 2rem;
    justify-content: flex-start;
  }
  
  .description {
    font-size: 1.15rem;
    line-height: 1.65;
  }
}

/* Tablets em retrato */
@media (max-width: 768px) and (min-width: 481px) {
  .header {
    font-size: 1.5rem;
    top: 1rem;
  }

  .center-content {
    padding: 5.5rem 1.5rem 3rem 1.5rem;
    gap: 1.5rem;
    justify-content: flex-start;
  }

  .description {
    font-size: 1.05rem;
    max-width: 90vw;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .start-btn {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  .stop-btn-fixed {
    bottom: 2.5rem;
  }
}

/* Smartphones grandes */
@media (max-width: 480px) and (min-width: 376px) {
  .header {
    font-size: 1.3rem;
    top: 0.8rem;
  }

  .center-content {
    padding: 5rem 1.2rem 2.5rem 1.2rem;
    gap: 1.3rem;
    justify-content: flex-start;
  }

  .description {
    font-size: 0.95rem;
    max-width: 94vw;
    line-height: 1.55;
    padding: 0 0.3rem;
    margin-bottom: 0.5rem;
  }

  .start-btn {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }

  .stop-btn-fixed {
    bottom: 2rem;
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
  
  .marker-status {
    font-size: 0.85rem;
  }
}

/* Smartphones pequenos */
@media (max-width: 375px) {
  .header {
    font-size: 1.2rem;
    top: 0.7rem;
  }

  .center-content {
    padding: 4.8rem 1rem 2.2rem 1rem;
    gap: 1.1rem;
    justify-content: flex-start;
  }

  .description {
    font-size: 0.9rem;
    max-width: 96vw;
    line-height: 1.5;
    padding: 0 0.2rem;
    margin-bottom: 0.4rem;
  }

  .start-btn {
    padding: 0.85rem 1.5rem;
    font-size: 0.95rem;
  }

  .stop-btn-fixed {
    bottom: 1.5rem;
    padding: 0.85rem 1.5rem;
    font-size: 0.95rem;
  }
  
  .marker-status {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Smartphones muito pequenos (320px e abaixo) */
@media (max-width: 320px) {
  .header {
    font-size: 1.1rem;
    top: 0.6rem;
  }

  .center-content {
    padding: 4.2rem 0.8rem 2rem 0.8rem;
    gap: 1rem;
    justify-content: flex-start;
  }

  .description {
    font-size: 0.85rem;
    max-width: 97vw;
    line-height: 1.45;
    padding: 0 0.1rem;
    margin-bottom: 0.3rem;
  }

  .start-btn {
    padding: 0.8rem 1.3rem;
    font-size: 0.9rem;
  }

  .stop-btn-fixed {
    bottom: 1.2rem;
    padding: 0.8rem 1.3rem;
    font-size: 0.9rem;
  }
  
  .marker-status {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}

/* Orientação paisagem em dispositivos móveis */
@media (max-height: 500px) and (orientation: landscape) {
  .header {
    font-size: 1.1rem;
    top: 0.5rem;
  }

  .center-content {
    padding: 3.8rem 1rem 1.5rem 1rem;
    gap: 0.7rem;
    justify-content: flex-start;
  }

  .description {
    font-size: 0.8rem;
    line-height: 1.35;
    margin-top: 0;
    margin-bottom: 0.3rem;
    max-width: 90vw;
  }

  .start-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .stop-btn-fixed {
    bottom: 1rem;
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Orientação paisagem específica para telas muito baixas */
@media (max-height: 400px) and (orientation: landscape) {
  .header {
    font-size: 1rem;
    top: 0.3rem;
  }

  .center-content {
    padding: 3.2rem 0.8rem 1.2rem 0.8rem;
    gap: 0.5rem;
  }

  .description {
    font-size: 0.75rem;
    line-height: 1.3;
    margin-bottom: 0.2rem;
  }

  .start-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
  }
}

/* Desktops grandes */
@media (min-width: 1200px) {
  .header {
    font-size: 2.5rem;
    top: 2rem;
  }

  .center-content {
    padding: 7rem 2rem 3rem 2rem;
  }
}

/* Ajuste para zoom do navegador */
@media (min-resolution: 1.5dppx) {
  .center-content {
    padding-top: 7rem;
    padding-bottom: 3rem;
  }
}

@media (min-resolution: 2dppx) {
  .center-content {
    padding-top: 8rem;
    padding-bottom: 3rem;
  }
}

/* Ajuste adicional para zoom muito alto */
@media (min-resolution: 2.5dppx) {
  .center-content {
    padding-top: 9rem;
    padding-bottom: 4rem;
  }
  
  .header {
    font-size: 1.8rem;
  }
}

/* Touch improvements para dispositivos móveis */
@media (hover: none) and (pointer: coarse) {
  .start-btn,
  .stop-btn-fixed {
    min-height: 44px;
    min-width: 44px;
  }
}

</style>
