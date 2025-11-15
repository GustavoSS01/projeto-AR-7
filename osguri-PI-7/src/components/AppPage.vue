<template>
  <div class="app-page">
    <h1 class="header" :class="{ 'header-fixed': showCamera }">TatuAR</h1>

    <!-- mostrado apenas antes de iniciar -->
    <div v-if="!showCamera" class="center-content">
      <p class="description">
        Clique no botão abaixo e aponte a câmera para o marcador para visualizar a tatuagem.
      </p>
      <!-- Adicione o TattooSelector aqui -->
      <TattooSelector @tattoo-selected="updateTattoo" />
      <button class="start-btn" @click="startCamera">Vamos lá!</button>
      
      <!-- Botão de download -->
      <DownloadButton />
    </div>

    <!-- após iniciar: câmera como background de toda a tela + AR -->
    <div v-if="showCamera" class="fullscreen-ar">
      <a-scene
        v-if="aframeReady"
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; antialias: true;"
        class="ar-scene"
        loading-screen="enabled: false"
        arjs="sourceType: webcam; 
              debugUIEnabled: false; 
              detectionMode: mono_and_matrix; 
              matrixCodeType: 3x3;
              sourceWidth: 1920;
              sourceHeight: 1080;
              displayWidth: window.innerWidth;
              displayHeight: window.innerHeight;">
        
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

      <!-- indicador da tatuagem atual -->
      <div class="tattoo-indicator">
        {{ tattoos[currentTattooIndex].name }} ({{ currentTattooIndex + 1 }}/{{ tattoos.length }})
      </div>

      <!-- controles de navegação na parte inferior -->
      <div class="navigation-controls">
        <button class="nav-btn prev-btn" @click="previousTattoo" title="Tatuagem Anterior">
          <span class="arrow">‹</span>
          <span class="btn-text">Anterior</span>
        </button>
        
        <button class="nav-btn stop-btn" @click="stopCamera" title="Parar Câmera">
          <span class="btn-text">Parar câmera</span>
        </button>
        
        <button class="nav-btn next-btn" @click="nextTattoo" title="Próxima Tatuagem">
          <span class="btn-text">Próxima</span>
          <span class="arrow">›</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TattooSelector from './TattooSelector.vue'
import DownloadButton from './DownloadButton.vue'

export default {
  name: 'AppPage',
  components: {
    TattooSelector,
    DownloadButton
  },
  data() {
    return {
      showCamera: false,
      aframeReady: false,
      markerVisible: false,
      markerPath: './marker/marker.patt',
      tattooUrl: './tattoos/tatuagemteste3.png',
      planeSize: 1.5,
      currentTattooIndex: 2, // índice inicial (tatuagemteste3 = índice 2)
      tattoos: [
        { id: 1, name: 'Tatuagem 1', url: './tattoos/tatuagemteste1.png' },
        { id: 2, name: 'Tatuagem 2', url: './tattoos/tatuagemteste2.png' },
        { id: 3, name: 'Tatuagem 3', url: './tattoos/tatuagemteste3.png' },
        { id: 4, name: 'Tatuagem 4', url: './tattoos/tatuagemteste4.png' },
        { id: 5, name: 'Tatuagem 5', url: './tattoos/tatuagemteste5.png' },
        { id: 6, name: 'Tatuagem 6', url: './tattoos/tatuagemteste6.png' },
        { id: 7, name: 'Tatuagem 7', url: './tattoos/tatuagemteste7.png' },
        { id: 8, name: 'Tatuagem 8', url: './tattoos/tatuagemteste8.png' },
        { id: 9, name: 'Tatuagem 9', url: './tattoos/tatuagemteste9.png' },
        { id: 10, name: 'Tatuagem 10', url: './tattoos/tatuagemteste10.png' },
        { id: 11, name: 'Tatuagem 11', url: './tattoos/tatuagemteste11.png' }
      ]
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
        // Tente usar este CDN alternativo do AR.js
        if (!window.ARJS && !document.querySelector('script[src*="ar-nft.js"]')) {
          await this.loadScript('https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar-nft.js');
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
      // atualiza o índice quando uma tatuagem é selecionada
      const index = this.tattoos.findIndex(t => t.url === newTattooUrl);
      if (index !== -1) {
        this.currentTattooIndex = index;
      }
    },
    nextTattoo() {
      this.currentTattooIndex = (this.currentTattooIndex + 1) % this.tattoos.length;
      this.tattooUrl = this.tattoos[this.currentTattooIndex].url;
      console.log('Próxima tatuagem:', this.tattoos[this.currentTattooIndex].name);
    },
    previousTattoo() {
      this.currentTattooIndex = this.currentTattooIndex === 0 
        ? this.tattoos.length - 1 
        : this.currentTattooIndex - 1;
      this.tattooUrl = this.tattoos[this.currentTattooIndex].url;
      console.log('Tatuagem anterior:', this.tattoos[this.currentTattooIndex].name);
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
/* Reset global para garantir que não haja scroll */
:deep(html),
:deep(body) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* remove margens e paddings globais para evitar overflow */
.app-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

/* título que se move com o scroll - somente quando câmera não está ativa */
.header {
  position: relative;
  text-align: center;
  margin: 2rem 0 1rem 0;
  font-size: clamp(1.5rem, 5vw, 2rem);
  z-index: 1000;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* título fixo quando a câmera AR está ativa */
.header-fixed {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  pointer-events: none;
}

/* conteúdo inicial centralizado */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: center;
  padding: 1rem 2rem 2rem 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

.description {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: 600;
  max-width: 500px;
  line-height: 1.6;
  padding: 1rem;
  border-radius: 8px;
  margin: 0;
  flex-shrink: 0;
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
  box-sizing: border-box;
}

/* cena A-Frame ocupa toda a tela como background */
.ar-scene {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

/* Estilos para o canvas gerado pelo A-Frame */
:deep(.a-canvas) {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  object-fit: cover !important;
}

/* Ajuste para o vídeo da câmera */
:deep(video) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* indicador da tatuagem atual */
.tattoo-indicator {
  position: fixed;
  top: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

/* controles de navegação na parte inferior */
.navigation-controls {
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 1000;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.prev-btn {
  background: rgba(25, 118, 210, 0.9);
}

.prev-btn:hover {
  background: rgba(21, 101, 192, 1);
  transform: translateX(-3px);
}

.next-btn {
  background: rgba(25, 118, 210, 0.9);
}

.next-btn:hover {
  background: rgba(21, 101, 192, 1);
  transform: translateX(3px);
}

.stop-btn {
  background: rgba(211, 47, 47, 0.9);
  padding: 0.9rem 1.2rem;
  min-width: 60px;
}

.stop-btn:hover {
  background: rgba(183, 28, 28, 1);
  transform: scale(1.05);
}

.arrow {
  font-size: 1.8rem;
  line-height: 1;
  font-weight: bold;
}

.btn-text {
  font-size: 1rem;
  line-height: 1;
}

/* botão iniciar */
.start-btn {
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  flex-shrink: 0;
  margin-top: auto;
}

.start-btn:hover { 
  background: #1565c0; 
}

/* indicador de status do marker */
.marker-status {
  position: fixed;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  z-index: 1000;
  transition: opacity 0.3s;
}

.marker-status.active {
  background: rgba(76, 175, 80, 0.9);
}

/* Responsividade Mobile e Tablet */
@media (max-width: 768px) {
  .header {
    margin: 1.5rem 0 0.5rem 0;
  }
  
  .header-fixed {
    top: 1.5rem;
  }
  
  .center-content {
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    gap: 1rem;
  }
  
  .description {
    max-width: 100%;
    padding: 0.75rem;
  }
  
  .start-btn {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    width: 100%;
    max-width: 300px;
  }
  
  .tattoo-indicator {
    top: 4rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
  }
  
  .navigation-controls {
    bottom: 2rem;
    gap: 0.75rem;
    width: 90%;
    max-width: 100%;
  }
  
  .nav-btn {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .stop-btn {
    padding: 0.8rem 1rem;
    min-width: 50px;
  }
  
  .arrow {
    font-size: 1.5rem;
  }
  
  .marker-status {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    top: 0.75rem;
    left: 0.75rem;
  }
}

@media (max-width: 480px) {
  .header {
    margin: 1rem 0 0.25rem 0;
  }
  
  .header-fixed {
    top: 1rem;
  }
  
  .center-content {
    padding: 0.25rem 1rem 1rem 1rem;
    gap: 0.75rem;
  }
  
  .description {
    line-height: 1.5;
    padding: 0.5rem;
  }
  
  .start-btn {
    padding: 0.9rem 1.5rem;
    font-size: 1.1rem;
    width: 100%;
    max-width: 280px;
  }
  
  .tattoo-indicator {
    top: 3.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    max-width: 90%;
  }
  
  .navigation-controls {
    bottom: 1.5rem;
    gap: 0.5rem;
    flex-wrap: nowrap;
    width: 95%;
  }
  
  .nav-btn {
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
    flex: 1;
  }
  
  .stop-btn {
    padding: 0.7rem 0.8rem;
    min-width: 45px;
    flex: 0 0 auto;
  }
  
  .btn-text {
    font-size: 0.85rem;
  }
  
  .arrow {
    font-size: 1.3rem;
  }
  
  .marker-status {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    top: 0.5rem;
    left: 0.5rem;
  }
}

/* Ajuste para telas muito pequenas (320px) */
@media (max-width: 360px) {
  .header {
    margin: 0.75rem 0 0.5rem 0;
  }
  
  .header-fixed {
    top: 0.75rem;
  }
  
  .description {
    padding: 0.4rem;
  }
  
  .start-btn {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
  
  .tattoo-indicator {
    top: 3rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
  
  .navigation-controls {
    bottom: 1rem;
    gap: 0.4rem;
  }
  
  .nav-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
  }
  
  .stop-btn {
    padding: 0.6rem 0.7rem;
    min-width: 40px;
  }
  
  .btn-text {
    font-size: 0.75rem;
  }
  
  .arrow {
    font-size: 1.2rem;
  }
}

</style>
