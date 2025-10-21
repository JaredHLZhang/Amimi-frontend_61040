<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Amimi</h1>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/pairing" class="nav-link" v-if="userStore.userId">Pairing</router-link>
        <router-link to="/chat" class="nav-link" v-if="userStore.userId">Chat</router-link>
        <button @click="logout" class="logout-btn" v-if="userStore.userId">Logout</button>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.clearUser();
  router.push('/');
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.nav-brand h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.router-link-active {
  background-color: #007bff;
  color: white;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem;
}
</style>