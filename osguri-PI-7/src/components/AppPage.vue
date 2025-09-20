<template>
  <div class="app-page">
    <h1 class="header">TatuAR</h1>
    <p class="description">Clique no botão abaixo e aponte a câmera para a parte do seu corpo que deseja visualizar a tatuagem.</p>
    <div v-if="!showCamera" class="center-content">
      <button class="start-btn" @click="startCamera">Vamos lá!</button>
    </div>
    <div v-else class="center-content">
      <video ref="video" autoplay playsinline class="camera-video"></video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPage',
  data() {
    return {
      showCamera: false,
      stream: null,
    };
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.stream = stream;
        this.showCamera = true;
        this.$nextTick(() => {
          this.$refs.video.srcObject = stream;
        });
      } catch (err) {
        alert('Não foi possível acessar a câmera.');
      }
    },
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  },
};
</script>

<style scoped>
.app-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  align-self: center;
}
.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.start-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.start-btn:hover {
  background: #1565c0;
}
.camera-video {
  width: 100%;
  max-width: 700px;
  max-height: 700px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
.description {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: larger;
}
</style>
