<template>
  <div>
    <!-- Botão de download -->
    <button class="download-btn" @click="requestDownload">Baixar Imagem</button>
  </div>
</template>

<script>
export default {
  methods: {
    requestDownload() {
      // Solicitar permissão ao usuário
      const userConfirmed = confirm("Deseja fazer download desta imagem?");
      if (userConfirmed) {
        this.downloadImage();
      }
    },
    downloadImage() {
      // URL da imagem a ser baixada
      const imageUrl = "./marker/marker.png"; // Substitua pela URL real da imagem
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "marker.png"; // Nome do arquivo baixado
      link.click();
    },
  },
};
</script>

<style scoped>
/* Estilo para o botão */
.download-btn {
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  background: #315d8f;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.download-btn:hover {
  background: #24456b;
  cursor: pointer; /* Estilo de cursor 'hand' */
  transform: scale(1.05); /* Leve aumento no tamanho ao passar o mouse */
}

.download-btn:active {
  transform: scale(0.98); /* Leve redução no tamanho ao clicar */
}
</style>