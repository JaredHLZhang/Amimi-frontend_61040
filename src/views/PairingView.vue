<template>
  <div class="pairing-view">
    <h1>Partner Pairing</h1>
    <p class="description">
      Connect with your partner by sharing a pairing code or entering theirs.
    </p>

    <div class="pairing-container">
      <!-- Generate Code Section -->
      <div class="pairing-section">
        <h2>Generate Pairing Code</h2>
        <p>Share this code with your partner so they can connect with you.</p>
        
        <div v-if="!generatedCode" class="generate-section">
          <button @click="generateCode" class="primary-btn" :disabled="loading">
            {{ loading ? 'Generating...' : 'Generate Code' }}
          </button>
        </div>

        <div v-else class="code-section">
          <div class="code-display">
            <h3>Your Pairing Code:</h3>
            <div class="code-box">
              <span class="code-text">{{ generatedCode }}</span>
              <button @click="copyCode" class="copy-btn">Copy</button>
            </div>
            <p class="code-help">Share this code with your partner</p>
          </div>
        </div>
      </div>

      <!-- Accept Code Section -->
      <div class="pairing-section">
        <h2>Enter Partner's Code</h2>
        <p>Enter the code your partner shared with you.</p>
        
        <div class="accept-section">
          <input 
            v-model="partnerCode" 
            type="text" 
            placeholder="Enter pairing code"
            class="code-input"
            :disabled="loading"
          />
          <button 
            @click="acceptCode" 
            class="primary-btn" 
            :disabled="!partnerCode || loading"
          >
            {{ loading ? 'Connecting...' : 'Connect' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- Success Section -->
    <div v-if="isPaired" class="success-section">
      <h2>🎉 Successfully Paired!</h2>
      <p>You are now connected with your partner.</p>
      <router-link to="/chat" class="primary-btn">
        Start Chatting with Amimi
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { generatePairingCode, acceptPairingCode, isPaired as checkIsPaired } from '../api/pairing';

const userStore = useUserStore();
const router = useRouter();

const generatedCode = ref<string>('');
const partnerCode = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const isPaired = ref(false);

onMounted(async () => {
  if (!userStore.userId) {
    router.push('/');
    return;
  }

  // Check if already paired
  const pairedResult = await checkIsPaired(userStore.userId);
  if (pairedResult.status === 'success') {
    isPaired.value = pairedResult;
    if (isPaired.value) {
      userStore.setPaired(true);
    }
  }
});

async function generateCode() {
  if (!userStore.userId) return;
  
  loading.value = true;
  message.value = '';
  
  try {
    const result = await generatePairingCode(userStore.userId);
    if (result.status === 'success') {
      generatedCode.value = result.code;
      message.value = 'Code generated successfully!';
      messageType.value = 'success';
    } else {
      message.value = result.error || 'Failed to generate code';
      messageType.value = 'error';
    }
  } catch (error) {
    message.value = 'Error generating code. Please try again.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

async function acceptCode() {
  if (!userStore.userId || !partnerCode.value) return;
  
  loading.value = true;
  message.value = '';
  
  try {
    const result = await acceptPairingCode(userStore.userId, partnerCode.value);
    if (result.status === 'success') {
      userStore.setPaired(true, result.pair);
      isPaired.value = true;
      message.value = 'Successfully paired with your partner!';
      messageType.value = 'success';
    } else {
      message.value = result.error || 'Failed to accept pairing code';
      messageType.value = 'error';
    }
  } catch (error) {
    message.value = 'Error accepting code. Please try again.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value).then(() => {
    message.value = 'Code copied to clipboard!';
    messageType.value = 'success';
  }).catch(() => {
    message.value = 'Failed to copy code';
    messageType.value = 'error';
  });
}
</script>

<style scoped>
.pairing-view {
  max-width: 800px;
  margin: 0 auto;
}

.pairing-view h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.description {
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.pairing-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.pairing-section {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.pairing-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.pairing-section p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.generate-section {
  margin-top: 1rem;
}

.code-section {
  margin-top: 1rem;
}

.code-display h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.code-box {
  display: flex;
  align-items: center;
  background-color: white;
  border: 2px solid #007bff;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.code-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.copy-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
}

.copy-btn:hover {
  background-color: #0056b3;
}

.code-help {
  color: #6c757d;
  font-size: 0.9rem;
}

.accept-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.code-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.code-input:focus {
  outline: none;
  border-color: #007bff;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.primary-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-section {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}

.success-section h2 {
  color: #155724;
  margin-bottom: 1rem;
}

.success-section p {
  color: #155724;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .pairing-container {
    grid-template-columns: 1fr;
  }
}
</style>
