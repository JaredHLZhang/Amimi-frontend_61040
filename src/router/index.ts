import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PairingView from '../views/PairingView.vue';
import PrivateChatView from '../views/PrivateChatView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/pairing', name: 'pairing', component: PairingView },
    { path: '/chat', name: 'chat', component: PrivateChatView },
  ],
});

export default router;
