<template>
  <div class="home-view">
    <div class="hero-section">
      <h1>Welcome to Amimi</h1>
      <p class="subtitle">Your AI companion for long-distance relationships</p>
      <p class="description">
        Amimi helps couples in long-distance relationships stay connected through 
        intelligent conversation support, shared experiences, and personalized guidance.
      </p>
    </div>

    <div class="action-section" v-if="!userStore.userId">
      <h2>Get Started</h2>
      <button @click="signUp" class="primary-btn" :disabled="loading">
        {{ loading ? 'Creating Account...' : 'Sign Up' }}
      </button>
      <button @click="debugAPIs" class="debug-btn" :disabled="loading">
        Debug APIs
      </button>
      <p class="help-text">
        Sign up to create your account and start your journey with Amimi
      </p>
    </div>

    <div class="welcome-section" v-else>
      <h2>Welcome back!</h2>
      <p>You're signed in as: <strong>{{ userStore.userId }}</strong></p>
      <div class="action-buttons">
        <router-link to="/pairing" class="primary-btn" v-if="!userStore.isPaired">
          Find Your Partner
        </router-link>
        <router-link to="/chat" class="primary-btn" v-else>
          Start Chatting with Amimi
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <h2>How Amimi Helps</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>🤝 Partner Pairing</h3>
          <p>Connect with your partner through secure pairing codes</p>
        </div>
        <div class="feature-card">
          <h3>💬 AI Chat Support</h3>
          <p>Get personalized relationship advice and emotional support</p>
        </div>
        <div class="feature-card">
          <h3>📱 Easy Communication</h3>
          <p>Simple, intuitive interface designed for couples</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { testPairingAPI, testChatAPI } from '../api/debug';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

async function signUp() {
  loading.value = true;
  try {
    // Generate a unique user ID
    const userId = `user-${crypto.randomUUID()}`;
    userStore.setUser(userId);
    
    // Navigate to pairing page
    router.push('/pairing');
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Failed to create account. Please try again.');
  } finally {
    loading.value = false;
  }
}

async function debugAPIs() {
  loading.value = true;
  try {
    console.log('Starting API debug...');
    
    // Test pairing API
    const pairingResult = await testPairingAPI();
    console.log('Pairing API test result:', pairingResult);
    
    // Test chat API
    const chatResult = await testChatAPI();
    console.log('Chat API test result:', chatResult);
    
    alert('Debug complete! Check console for results.');
  } catch (error) {
    console.error('Debug error:', error);
    alert('Debug failed: ' + error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-section {
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  color: #495057;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.action-section, .welcome-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.action-section h2, .welcome-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
  margin: 0.5rem;
}

.primary-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.primary-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.debug-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 1rem;
}

.debug-btn:hover:not(:disabled) {
  background-color: #218838;
}

.debug-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.help-text {
  color: #6c757d;
  margin-top: 1rem;
}

.action-buttons {
  margin-top: 1rem;
}

.features-section {
  margin-top: 3rem;
}

.features-section h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: left;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.5;
}
</style>
