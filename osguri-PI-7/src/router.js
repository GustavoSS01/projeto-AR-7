import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/Home.vue';
import AppPage from './components/AppPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/app', component: AppPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
