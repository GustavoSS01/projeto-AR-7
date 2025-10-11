<template>
  <div class="app-page">
    <h1 class="header">TatuAR</h1>

    <!-- mostrado apenas antes de iniciar -->
    <div v-if="!showCamera" class="center-content">
      <p class="description">
        Clique no botão abaixo e aponte a câmera para o marcador para visualizar a tatuagem.
      </p>
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
export default {
  name: 'AppPage',
  data() {
    return {
      showCamera: false,
      aframeReady: false,
      markerVisible: false,
      // corrigindo o caminho - o arquivo se chama marker.patt, não maker.patt
      markerPath: '/marker/marker.patt',
      // usando caminho direto para a imagem na pasta public
      tattooUrl: '/src/assets/tattoos/tatuagemteste3.png',
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* título sempre visível no topo */
.header {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  margin: 0;
  font-size: 2rem;
  z-index: 1000;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  pointer-events: none;
}

/* conteúdo inicial centralizado */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
  height: 100vh;
  text-align: center;
  padding: 0 2rem;
  box-sizing: border-box;
}

.description {
  font-size: 1.2rem;
  font-weight: 600;
  max-width: 500px;
  line-height: 1.5;
}

/* container AR que ocupa toda a tela */
.fullscreen-ar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
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
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: #d32f2f;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: background 0.2s;
}

.stop-btn-fixed:hover {
  background: #b71c1c;
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

</style>
