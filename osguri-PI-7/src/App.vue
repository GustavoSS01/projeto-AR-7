<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
.homepage {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.intro {
  margin-bottom: 2rem;
}
.quem-somos {
  margin-bottom: 2rem;
}
.quem-somos ul {
  list-style: none;
  padding: 0;
}
.quem-somos li {
  margin: 0.5rem 0;
}
.acesso-app button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.acesso-app button:hover {
  background: #444;
}
</style>