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
  margin: 0 auto;
}

.tattoo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
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
  margin: 0 0 1rem 0;
  text-align: center;
}
</style>