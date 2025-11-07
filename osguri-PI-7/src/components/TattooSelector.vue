<template>
  <div class="tattoo-selector">
    <h3>Escolha sua Tatuagem</h3>
    <div class="tattoo-grid">
      <div 
        v-for="tattoo in tattoos" 
        :key="tattoo.id"
        class="tattoo-item"
        :class="{ active: selectedTattoo === tattoo.url }"
        @click="selectTattoo(tattoo.url)">
        <img :src="tattoo.url" :alt="tattoo.name">
        <span class="tattoo-name">{{ tattoo.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TattooSelector',
  data() {
    return {
      selectedTattoo: './tattoos/tatuagemteste3.png',
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
        
      ]
    }
  },
  methods: {
    selectTattoo(url) {
      this.selectedTattoo = url;
      this.$emit('tattoo-selected', url);
    }
  }
}
</script>

<style scoped>
.tattoo-selector {
  padding: 1rem;
  background: #696969;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-height: 50vh;
  overflow: hidden;
}

.tattoo-selector h3 {
  flex-shrink: 0;
  margin: 0 0 1rem 0;
}

.tattoo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
}

/* Customização da scrollbar */
.tattoo-grid::-webkit-scrollbar {
  width: 8px;
}

.tattoo-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.tattoo-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.tattoo-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tattoo-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.tattoo-item:hover {
  transform: scale(1.05);
  border-color: #1976d2;
}

.tattoo-item.active {
  border-color: #1976d2;
  background: rgba(25, 118, 210, 0.1);
}

.tattoo-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.tattoo-name {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

h3 {
  text-align: center;
}

/* Responsividade Mobile e Tablet */
@media (max-width: 768px) {
  .tattoo-selector {
    padding: 0.75rem;
    max-width: 100%;
    max-height: 55vh;
  }
  
  .tattoo-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
    padding-right: 0.25rem;
  }
  
  .tattoo-grid::-webkit-scrollbar {
    width: 6px;
  }
  
  h3 {
    font-size: 1.3rem;
  }
  
  .tattoo-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .tattoo-selector {
    padding: 0.5rem;
    border-radius: 8px;
    max-height: 60vh;
  }
  
  .tattoo-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
    padding-right: 0.25rem;
  }
  
  .tattoo-grid::-webkit-scrollbar {
    width: 5px;
  }
  
  .tattoo-item {
    padding: 0.3rem;
    border-width: 1.5px;
  }
  
  h3 {
    font-size: 1.1rem;
  }
  
  .tattoo-name {
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
  
  /* Desabilitar hover scale em dispositivos touch para melhor performance */
  .tattoo-item:hover {
    transform: none;
  }
}
</style>