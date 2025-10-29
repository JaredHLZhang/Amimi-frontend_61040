<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <img :src="AmimiCloud" alt="Amimi" class="amimi-logo" />
        <h1>Amimi</h1>
      </div>
      <div class="nav-links">
        <button @click="currentView = 'home'" class="nav-link">Home</button>
        <button @click="currentView = 'pairing'" class="nav-link" v-if="userId">Pairing</button>
        <button @click="currentView = 'chat'" class="nav-link" v-if="userId">Chat</button>
        <button @click="logout" class="logout-btn" v-if="userId">Logout</button>
      </div>
    </nav>
    <main class="main-content">
      <!-- Home View -->
      <div v-if="currentView === 'home'" class="home-view">
        <!-- Decorative Elements -->
        <div class="decoration-cloud cloud-1">☁️</div>
        <div class="decoration-cloud cloud-2">☁️</div>
        <div class="decoration-cloud cloud-3">☁️</div>
        <div class="decoration-heart heart-1">💕</div>
        <div class="decoration-heart heart-2">💖</div>
        <div class="decoration-heart heart-3">💗</div>
        <div class="decoration-star star-1">✨</div>
        <div class="decoration-star star-2">✨</div>
        <div class="decoration-star star-3">✨</div>
        
        <!-- Main Content -->
        <div class="home-hero">
          <div class="amimi-hero-container">
            <img :src="AmimiCloud" alt="Amimi" class="amimi-hero" />
          </div>
          <h1 class="home-title">Welcome to Amimi</h1>
          <p class="home-subtitle">Your AI companion for long-distance relationships</p>
          <p class="home-description">Bringing couples closer with empathy, understanding, and love ❤️</p>
        </div>
        
        <div v-if="!userId" class="home-actions">
          <button @click="signUp" class="primary-btn home-signup-btn" :disabled="loading">
            {{ loading ? 'Creating Account...' : '✨ Start Your Journey' }}
          </button>
          <button @click="debugAPIs" class="debug-btn" :disabled="loading">
            Debug APIs
          </button>
        </div>
        
        <div v-else class="home-welcome-back">
          <div class="welcome-card">
            <h2 class="welcome-title">Welcome back! 👋</h2>
            <p class="welcome-text">You're signed in as: <strong>{{ userId }}</strong></p>
            <div class="welcome-actions">
              <button @click="currentView = 'pairing'" class="primary-btn" v-if="!isPaired">
                💑 Find Your Partner
              </button>
              <button @click="currentView = 'chat'" class="primary-btn" v-else>
                💬 Start Chatting with Amimi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pairing View -->
      <div v-if="currentView === 'pairing'">
        <h1>Partner Pairing</h1>
        <p>Connect with your partner by sharing a pairing code or entering theirs.</p>

        <!-- Generate Code Section -->
        <div class="pairing-section">
          <h2>Generate Pairing Code</h2>
          <p>Share this code with your partner so they can connect with you.</p>
          
          <div v-if="!generatedCode">
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

        <!-- Status Messages -->
        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>

        <!-- Success Section -->
        <div v-if="isPaired" class="success-section">
          <h2>🎉 Successfully Paired!</h2>
          <p>You are now connected with your partner.</p>
          <button @click="currentView = 'chat'" class="primary-btn">
            Start Chatting with Amimi
          </button>
        </div>
      </div>

      <!-- Chat View -->
      <div v-if="currentView === 'chat'">
        <h1>Chat with Amimi</h1>
        <p>Your AI companion for relationship support</p>

        <!-- Chat Mode Toggle -->
        <div class="chat-mode-toggle">
          <button 
            @click="chatMode = 'private'" 
            :class="{ active: chatMode === 'private' }"
            class="mode-btn"
          >
            Private Chat
          </button>
          <button 
            @click="chatMode = 'shared'" 
            :class="{ active: chatMode === 'shared', disabled: !isPaired }"
            class="mode-btn"
            :disabled="!isPaired"
          >
            Shared Chat
          </button>
        </div>
        <p v-if="!isPaired && chatMode === 'shared'" class="mode-help">
          💑 Pair with your partner to unlock shared chat
        </p>

        <div class="chat-container">
          <img v-if="chatMode === 'private'" :src="AmimiCloud" alt="Amimi" class="amimi-chat-corner" />
          <div class="messages-container">
            <div v-if="(chatMode === 'private' ? messages : sharedMessages).length === 0" class="empty-state">
              <p>Start a conversation with Amimi!</p>
              <p class="help-text">{{ chatMode === 'shared' ? 'Invite your partner to share thoughts and get relationship advice together!' : 'Ask about your relationship, share your thoughts, or get advice.' }}</p>
            </div>
            
            <div v-for="message in (chatMode === 'private' ? messages : sharedMessages)" :key="message.messageId" class="message" :class="getMessageClass(message)">
              <div class="message-content">
                <div class="message-header">
                  <span class="sender">{{ getSenderName(message) }}</span>
                  <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
            
            <div v-if="loading" class="amimi-typing-container">
              <img :src="AmimiCloudWrite" alt="Amimi is thinking..." class="amimi-cloud-write" />
              <div class="message agent-message">
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender">Amimi</span>
                  </div>
                  <div class="message-text typing">
                    <span class="typing-dots">...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="input-container">
            <div class="input-wrapper">
              <button 
                v-if="chatMode === 'shared'"
                @click="mentionAmimi"
                class="mention-btn"
                title="Mention Amimi"
              >
                @Amimi
              </button>
              <input 
                v-model="newMessage" 
                @keyup.enter="sendMessage"
                placeholder="Type your message..."
                class="message-input"
                :class="{ 'with-mention-btn': chatMode === 'shared' }"
                :disabled="loading"
              />
              <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!newMessage.trim() || loading"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AmimiCloud from './assets/Amimi-cloud.png';
import AmimiCloudWrite from './assets/Amimi-cloud-write.png';

// State
const currentView = ref('home');
const userId = ref(localStorage.getItem('userId'));
const isPaired = ref(localStorage.getItem('isPaired') === 'true');
const loading = ref(false);

// Pairing state
const generatedCode = ref('');
const partnerCode = ref('');
const message = ref('');
const messageType = ref('success');

// Chat state
const chatMode = ref('private'); // 'private' or 'shared'
const messages = ref([]);
const newMessage = ref('');
const conversationId = ref(localStorage.getItem('conversationId'));
const sharedMessages = ref([]);
const sharedConversationId = ref(localStorage.getItem('sharedConversationId'));
const partnerId = ref(localStorage.getItem('partnerId'));
const pollingInterval = ref(null); // Timer for polling
const lastMessageTimestamp = ref(null); // Track last message time

// API functions
async function apiCall(endpoint, body) {
  try {
    const response = await fetch(`http://localhost:8000/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

// User functions
function signUp() {
  loading.value = true;
  try {
    const newUserId = `user-${crypto.randomUUID()}`;
    userId.value = newUserId;
    localStorage.setItem('userId', newUserId);
    currentView.value = 'pairing';
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Failed to create account. Please try again.');
  } finally {
    loading.value = false;
  }
}

function logout() {
  stopPolling(); // Stop polling before clearing state
  userId.value = null;
  isPaired.value = false;
  conversationId.value = null;
  localStorage.clear();
  currentView.value = 'home';
}

// Debug function
async function debugAPIs() {
  loading.value = true;
  try {
    console.log('Testing Pairing API...');
    const pairingResult = await apiCall('/Pairing/generateCode', { user: 'debug-test-user' });
    console.log('Pairing API result:', pairingResult);
    
    console.log('Testing Chat API...');
    const chatResult = await apiCall('/ConversationalAgent/createConversation', { userId: 'debug-test-user', context: 'debug test' });
    console.log('Chat API result:', chatResult);
    
    alert('Debug complete! Check console for results.');
  } catch (error) {
    console.error('Debug error:', error);
    alert('Debug failed: ' + error.message);
  } finally {
    loading.value = false;
  }
}

// Pairing functions
async function generateCode() {
  if (!userId.value) return;
  
  loading.value = true;
  message.value = '';
  
  try {
    const result = await apiCall('/Pairing/generateCode', { user: userId.value });
    if (result.code) {
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
  if (!userId.value || !partnerCode.value) return;
  
  loading.value = true;
  message.value = '';
  
  try {
    const result = await apiCall('/Pairing/acceptPairing', { user: userId.value, code: partnerCode.value });
    if (result.pair) {
      isPaired.value = true;
      localStorage.setItem('isPaired', 'true');
      localStorage.setItem('pairId', result.pair);
      
      // Get pair details including shared conversation
      const pairResult = await apiCall('/Pairing/getPair', { user: userId.value });
      if (pairResult.pair) {
        if (pairResult.sharedConversationId) {
          sharedConversationId.value = pairResult.sharedConversationId;
          localStorage.setItem('sharedConversationId', pairResult.sharedConversationId);
        }
        if (pairResult.partner) {
          partnerId.value = pairResult.partner;
          localStorage.setItem('partnerId', pairResult.partner);
        }
      }
      
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

async function checkPairingStatus() {
  if (!userId.value) return;
  
  try {
    const result = await apiCall('/Pairing/getPair', { user: userId.value });
    
    if (result.pair) {
      // User is paired - update all pairing-related state
      isPaired.value = true;
      localStorage.setItem('isPaired', 'true');
      localStorage.setItem('pairId', result.pair);
      
      if (result.sharedConversationId) {
        sharedConversationId.value = result.sharedConversationId;
        localStorage.setItem('sharedConversationId', result.sharedConversationId);
      }
      
      if (result.partner) {
        partnerId.value = result.partner;
        localStorage.setItem('partnerId', result.partner);
      }
      
      // Load shared conversation if paired
      await loadSharedConversation();
    } else if (result.error) {
      // User is not paired - ensure state is cleared
      isPaired.value = false;
      localStorage.removeItem('isPaired');
      localStorage.removeItem('pairId');
      localStorage.removeItem('sharedConversationId');
      localStorage.removeItem('partnerId');
    }
  } catch (error) {
    console.error('Error checking pairing status:', error);
  }
}

// Chat functions
async function loadConversation() {
  if (!userId.value) return;

  try {
    if (conversationId.value) {
      const historyResult = await apiCall('/ConversationalAgent/getHistory', { conversationId: conversationId.value });
      if (historyResult.status === 'success') {
        messages.value = historyResult.messages;
        return;
      }
    }

    const result = await apiCall('/ConversationalAgent/createConversation', { userId: userId.value, context: 'User is looking for relationship support and guidance' });
    if (result.status === 'success') {
      conversationId.value = result.conversation._id;
      localStorage.setItem('conversationId', conversationId.value);
      messages.value = [];
    } else {
      console.error('Failed to create conversation:', result.error);
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
}

async function loadSharedConversation() {
  if (!userId.value || !isPaired.value) return;

  try {
    // Get pair info if not already loaded
    if (!sharedConversationId.value) {
      const pairResult = await apiCall('/Pairing/getPair', { user: userId.value });
      if (pairResult.pair) {
        sharedConversationId.value = pairResult.sharedConversationId;
        if (sharedConversationId.value) {
          localStorage.setItem('sharedConversationId', sharedConversationId.value);
        }
      }
    }

    // Load history if we have a shared conversation
    if (sharedConversationId.value) {
      const historyResult = await apiCall('/GroupConversation/getHistory', { conversationId: sharedConversationId.value });
      if (historyResult.status === 'success') {
        sharedMessages.value = historyResult.messages || [];
      }
      
      // Start polling after loading shared conversation
      startPolling();
    } else {
      console.log('No shared conversation found yet');
      sharedMessages.value = [];
    }
  } catch (error) {
    console.error('Error loading shared conversation:', error);
  }
}

async function pollSharedMessages() {
  // Only poll if in shared chat mode and conversation exists
  if (chatMode.value !== 'shared' || !sharedConversationId.value || !userId.value) {
    return;
  }

  try {
    const historyResult = await apiCall('/GroupConversation/getHistory', { 
      conversationId: sharedConversationId.value 
    });
    
    if (historyResult.status === 'success') {
      const newMessages = historyResult.messages || [];
      
      // Only update if we have new messages
      if (newMessages.length > sharedMessages.value.length) {
        sharedMessages.value = newMessages;
        
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
          const messagesContainer = document.querySelector('.messages-container');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      }
    }
  } catch (error) {
    console.error('Error polling shared messages:', error);
  }
}

function startPolling() {
  // Clear any existing interval
  stopPolling();
  
  // Only start polling if in shared chat mode
  if (chatMode.value === 'shared' && sharedConversationId.value) {
    console.log('Starting message polling for shared chat');
    pollingInterval.value = setInterval(pollSharedMessages, 2000); // Poll every 2 seconds
  }
}

function stopPolling() {
  if (pollingInterval.value) {
    console.log('Stopping message polling');
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
}

async function sendMessage() {
  const messageText = newMessage.value.trim();
  if (!messageText || loading.value) return;

  // Check for conversation ID based on mode
  const currentConvId = chatMode.value === 'shared' ? sharedConversationId.value : conversationId.value;
  if (!currentConvId) {
    console.log('Cannot send message: no conversation ID', { mode: chatMode.value });
    return;
  }

  newMessage.value = '';
  loading.value = true;
  const currentMessages = chatMode.value === 'shared' ? sharedMessages : messages;

  try {
    // Add user message to UI immediately
    const userMessage = {
      messageId: `temp-${Date.now()}`,
      conversationId: currentConvId,
      isFromUser: true,
      content: messageText,
      timestamp: new Date().toISOString()
    };
    currentMessages.value.push(userMessage);

    // Send message to backend - different API based on mode
    if (chatMode.value === 'shared') {
      // Shared chat
      const sendResult = await apiCall('/GroupConversation/sendMessage', { 
        conversationId: currentConvId, 
        sender: userId.value,
        content: messageText 
      });
      if (sendResult.status === 'success') {
        const messageIndex = currentMessages.value.findIndex(m => m.messageId === userMessage.messageId);
        if (messageIndex !== -1) {
          const realMessage = {
            messageId: sendResult.message._id,
            conversationId: sendResult.message.conversationId,
            sender: sendResult.message.sender,
            isFromAgent: sendResult.message.isFromAgent,
            content: sendResult.message.content,
            timestamp: sendResult.message.timestamp
          };
          currentMessages.value[messageIndex] = realMessage;
        }
      }

      // Only get agent response if message contains @Amimi
      if (messageText.includes('@Amimi')) {
        const responseResult = await apiCall('/GroupConversation/getAgentResponse', { 
          conversationId: currentConvId, 
          contextPrompt: messageText.replace('@Amimi', '').trim() // Remove @Amimi from prompt
        });
        if (responseResult.status === 'success') {
          const agentMessage = {
            messageId: responseResult.message._id,
            conversationId: responseResult.message.conversationId,
            sender: responseResult.message.sender,
            isFromAgent: responseResult.message.isFromAgent,
            content: responseResult.message.content,
            timestamp: responseResult.message.timestamp
          };
          currentMessages.value.push(agentMessage);
        }
      }
    } else {
      // Private chat
      const sendResult = await apiCall('/ConversationalAgent/sendUserMessage', { 
        conversationId: currentConvId, 
        content: messageText 
      });
      if (sendResult.status === 'success') {
        const messageIndex = currentMessages.value.findIndex(m => m.messageId === userMessage.messageId);
        if (messageIndex !== -1) {
          const realMessage = {
            messageId: sendResult.message._id,
            conversationId: sendResult.message.conversationId,
            isFromUser: sendResult.message.isFromUser,
            content: sendResult.message.content,
            timestamp: sendResult.message.timestamp
          };
          currentMessages.value[messageIndex] = realMessage;
        }
      }

      // Get agent response for private chat
      const responseResult = await apiCall('/ConversationalAgent/getAgentResponse', { 
        conversationId: currentConvId, 
        userMessageContent: messageText 
      });
      if (responseResult.status === 'success') {
        const agentMessage = {
          messageId: responseResult.message._id,
          conversationId: responseResult.message.conversationId,
          isFromUser: responseResult.message.isFromUser,
          content: responseResult.message.content,
          timestamp: responseResult.message.timestamp
        };
        currentMessages.value.push(agentMessage);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    currentMessages.value.push({
      messageId: `error-${Date.now()}`,
      conversationId: currentConvId || '',
      isFromUser: false,
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString()
    });
  } finally {
    loading.value = false;
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getSenderName(message) {
  if (chatMode.value === 'shared') {
    if (message.isFromAgent) return 'Amimi';
    if (message.sender === userId.value) return 'You';
    if (message.sender === partnerId.value) return 'Your Partner';
    return message.sender || 'Unknown';
  } else {
    return message.isFromUser ? 'You' : 'Amimi';
  }
}

function getMessageClass(message) {
  if (chatMode.value === 'shared') {
    if (message.isFromAgent) return 'agent-message';
    if (message.sender === userId.value) return 'user-message';
    return 'partner-message';
  } else {
    return message.isFromUser ? 'user-message' : 'agent-message';
  }
}

function mentionAmimi() {
  if (chatMode.value === 'shared') {
    newMessage.value = '@Amimi ' + newMessage.value;
    // Focus on input field
    const inputElement = document.querySelector('.message-input');
    if (inputElement) {
      inputElement.focus();
    }
  }
}

// Watch chat mode changes to start/stop polling
watch(chatMode, (newMode) => {
  if (newMode === 'shared') {
    startPolling();
  } else {
    stopPolling();
  }
});

onMounted(async () => {
  if (userId.value) {
    loadConversation();
    await checkPairingStatus(); // Check with backend if user is paired
  }
});

onUnmounted(() => {
  stopPolling(); // Clean up polling when component unmounts
});
</script>

<style>
/* ========================================
   SUNSET ROMANCE DESIGN SYSTEM
   ======================================== */

/* CSS Variables - Color Palette */
:root {
  /* Theme Colors */
  --color-cream: #F8EBDF;
  --color-coral: #FF7B73;
  
  /* Sky Blues */
  --color-sky-light: #89CFF0;
  --color-sky-soft: #A7C7E7;
  --color-lavender: #B4A7D6;
  
  /* Purples */
  --color-purple-light: #D8BFD8;
  --color-purple-medium: #C8A2C8;
  --color-purple-deep: #6B5B95;
  
  /* Warm Colors */
  --color-orange-light: #FFB347;
  --color-orange-medium: #FF9966;
  --color-peach: #FFE5D9;
  
  /* Pinks */
  --color-pink-light: #FFB6C1;
  --color-pink-medium: #FFC0CB;
  
  /* Yellows */
  --color-yellow-cream: #FFEAA7;
  --color-yellow-light: #FFF8DC;
  
  /* Text Colors */
  --color-text-primary: #4A4063;
  --color-text-heading: #6B5B95;
  --color-text-light: #8B7E9A;
  
  /* Gradients */
  --gradient-sunset: linear-gradient(135deg, #FFE5D9 0%, #FFB347 50%, #FFA07A 100%);
  --gradient-purple: linear-gradient(135deg, #C8A2C8 0%, #B4A7D6 100%);
  --gradient-sky: linear-gradient(180deg, #F8EBDF 0%, #F0E6FF 100%);
  --gradient-hero: linear-gradient(135deg, #F8EBDF 0%, #E6D8F0 50%, #FFE5D9 100%);
  --gradient-navbar: linear-gradient(90deg, #F8EBDF 0%, #FFE5D9 100%);
}

/* Global Styles */
* {
  box-sizing: border-box;
}

/* Global Background - applied to body */
body {
  background: var(--gradient-hero);
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  font-family: 'Inter', 'system-ui', -apple-system, sans-serif;
  color: var(--color-text-primary);
}

/* ========================================
   NAVIGATION BAR
   ======================================== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--gradient-navbar);
  border-bottom: none;
  box-shadow: 0 2px 20px rgba(255, 123, 115, 0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.amimi-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(255, 123, 115, 0.4));
  animation: float-slow 3s ease-in-out infinite;
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.nav-brand h1 {
  margin: 0;
  color: var(--color-coral);
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(255, 123, 115, 0.3);
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.nav-link {
  background: none;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text-heading);
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(255, 123, 115, 0.1);
  transform: translateY(-2px);
  color: var(--color-coral);
}

.logout-btn {
  background: var(--color-coral);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(255, 123, 115, 0.3);
}

.logout-btn:hover {
  background: #FF6A60;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 123, 115, 0.4);
}

/* ========================================
   MAIN CONTENT
   ======================================== */
.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.main-content h1 {
  color: var(--color-text-heading);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.main-content > div > p {
  text-align: center;
  color: var(--color-text-light);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* ========================================
   HOME PAGE
   ======================================== */
.home-view {
  position: relative;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  overflow: hidden;
}

.home-hero {
  text-align: center;
  margin-bottom: 3rem;
  z-index: 2;
  position: relative;
}

.amimi-hero-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.amimi-hero {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 8px 30px rgba(255, 123, 115, 0.5));
  animation: float-hero 4s ease-in-out infinite, glow-hero 3s ease-in-out infinite;
}

@keyframes float-hero {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes glow-hero {
  0%, 100% {
    filter: drop-shadow(0 8px 30px rgba(255, 123, 115, 0.5));
  }
  50% {
    filter: drop-shadow(0 12px 40px rgba(255, 123, 115, 0.8));
  }
}

.home-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-coral), var(--color-purple-medium));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: none;
  letter-spacing: -0.5px;
}

.home-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-heading);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.home-description {
  font-size: 1.15rem;
  color: var(--color-text-light);
  margin-top: 1rem;
  font-style: italic;
}

.home-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 2;
  position: relative;
}

.home-signup-btn {
  font-size: 1.2rem;
  padding: 1.25rem 3rem;
}

.home-welcome-back {
  z-index: 2;
  position: relative;
  width: 100%;
  max-width: 500px;
}

.welcome-card {
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 15px 50px rgba(200, 162, 200, 0.2);
  border: 2px solid rgba(255, 182, 193, 0.3);
  text-align: center;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-title {
  font-size: 2rem;
  color: var(--color-text-heading);
  margin-bottom: 1rem;
  font-weight: 700;
}

.welcome-text {
  color: var(--color-text-light);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.welcome-actions {
  display: flex;
  justify-content: center;
}

/* Decorative Elements */
.decoration-cloud,
.decoration-heart,
.decoration-star {
  position: absolute;
  font-size: 2rem;
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
  animation: float-decorative 6s ease-in-out infinite;
}

.decoration-cloud {
  font-size: 3rem;
  opacity: 0.4;
}

.decoration-heart {
  font-size: 2.5rem;
  opacity: 0.5;
}

.decoration-star {
  font-size: 1.8rem;
  opacity: 0.7;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes float-decorative {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -30px) rotate(5deg);
  }
  50% {
    transform: translate(-15px, -50px) rotate(-5deg);
  }
  75% {
    transform: translate(10px, -20px) rotate(3deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Positioning decorative elements */
.cloud-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.cloud-2 {
  top: 30%;
  right: 8%;
  animation-delay: 2s;
}

.cloud-3 {
  bottom: 20%;
  left: 10%;
  animation-delay: 4s;
}

.heart-1 {
  top: 15%;
  right: 15%;
  animation-delay: 1s;
}

.heart-2 {
  bottom: 30%;
  right: 10%;
  animation-delay: 3s;
}

.heart-3 {
  top: 50%;
  left: 8%;
  animation-delay: 5s;
}

.star-1 {
  top: 25%;
  left: 20%;
  animation-delay: 0.5s;
}

.star-2 {
  bottom: 25%;
  left: 25%;
  animation-delay: 2.5s;
}

.star-3 {
  top: 60%;
  right: 20%;
  animation-delay: 4.5s;
}

/* ========================================
   BUTTONS
   ======================================== */
.primary-btn {
  background: var(--color-coral);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(255, 123, 115, 0.4);
}

.primary-btn:hover:not(:disabled) {
  background: #FF6A60;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(255, 123, 115, 0.5);
}

.primary-btn:disabled {
  background: var(--color-purple-light);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.debug-btn {
  background: var(--gradient-purple);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  font-weight: 500;
}

.debug-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(200, 162, 200, 0.4);
}

.debug-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========================================
   PAIRING VIEW
   ======================================== */
.pairing-section {
  background: white;
  padding: 2.5rem;
  border-radius: 25px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 30px rgba(200, 162, 200, 0.15);
  border: 1px solid rgba(248, 235, 223, 0.5);
}

.pairing-section h2 {
  background: var(--gradient-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.code-section {
  margin-top: 1.5rem;
}

.code-display h3 {
  color: var(--color-text-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.code-help {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.code-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-sunset);
  border: none;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 25px rgba(255, 179, 71, 0.4);
  animation: glow-pulse 3s ease-in-out infinite;
}

.code-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-text-primary);
  letter-spacing: 3px;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);
}

.copy-btn {
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-coral);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 15px;
  cursor: pointer;
  margin-left: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.copy-btn:hover {
  transform: scale(1.05);
  background: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.accept-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.code-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-cream);
  border-radius: 15px;
  font-size: 1.1rem;
  text-align: center;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  background: white;
}

.code-input:focus {
  outline: none;
  border-color: var(--color-coral);
  box-shadow: 0 0 20px rgba(255, 123, 115, 0.3);
}

.message {
  padding: 1rem 1.5rem;
  border-radius: 15px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  color: #2E7D32;
  border: 2px solid #81C784;
}

.message.error {
  background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
  color: #C62828;
  border: 2px solid #EF5350;
}

.success-section {
  background: linear-gradient(135deg, var(--color-pink-light), var(--color-lavender));
  border: none;
  border-radius: 25px;
  padding: 2.5rem;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 10px 40px rgba(255, 182, 193, 0.4);
}

.success-section h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* ========================================
   CHAT VIEW
   ======================================== */
.chat-mode-toggle {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.mode-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: var(--color-text-light);
  font-size: 1rem;
}

.mode-btn.active {
  background: var(--color-coral);
  color: white;
  box-shadow: 0 4px 20px rgba(255, 123, 115, 0.4);
  transform: translateY(-2px);
}

.mode-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mode-btn:not(:disabled):not(.active):hover {
  background: rgba(255, 123, 115, 0.1);
  color: var(--color-coral);
  transform: translateY(-2px);
}

.mode-help {
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.95rem;
  font-style: italic;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.chat-container {
  background: var(--gradient-sky);
  border-radius: 25px;
  overflow: hidden;
  height: 550px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(200, 162, 200, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
}

.messages-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--color-coral);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #FF6A60;
}

/* Fixed Amimi avatar in chat corner (private mode) */
.amimi-chat-corner {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(255, 123, 115, 0.5));
  z-index: 10;
  animation: float-gentle 4s ease-in-out infinite;
  opacity: 0.9;
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.05);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-light);
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.help-text {
  font-size: 0.95rem;
  opacity: 0.8;
}

/* ========================================
   MESSAGE BUBBLES
   ======================================== */
.message {
  margin-bottom: 1.25rem;
  display: flex;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  justify-content: flex-end;
}

.agent-message, .partner-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 75%;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  position: relative;
}

/* User Messages (You) - Soft Sky Blue */
.user-message .message-content {
  background: linear-gradient(135deg, var(--color-sky-soft), var(--color-lavender));
  color: white;
  border-radius: 20px 20px 5px 20px;
  box-shadow: 0 4px 15px rgba(167, 199, 231, 0.4);
}

/* Partner Messages - Purple Gradient */
.partner-message .message-content {
  background: var(--gradient-purple);
  color: white;
  border-radius: 20px 20px 20px 5px;
  box-shadow: 0 4px 15px rgba(200, 162, 200, 0.3);
}

/* Amimi Messages - Coral (Brand Color) */
.agent-message .message-content {
  background: var(--color-coral);
  color: white;
  border-radius: 25px;
  box-shadow: 0 6px 20px rgba(255, 123, 115, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.user-message .message-header,
.partner-message .message-header,
.agent-message .message-header {
  opacity: 0.9;
}

.message-text {
  line-height: 1.5;
  font-size: 0.95rem;
}

.agent-message .message-text {
  font-family: 'Single Day', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

/* ========================================
   AMIMI CLOUD CHARACTER
   ======================================== */
.amimi-typing-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

.amimi-cloud-write {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  animation: float 2s ease-in-out infinite, glow-pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 20px rgba(255, 123, 115, 0.6));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    filter: drop-shadow(0 4px 20px rgba(255, 123, 115, 0.4));
  }
  50% {
    filter: drop-shadow(0 6px 30px rgba(255, 123, 115, 0.8));
  }
}

/* ========================================
   INPUT AREA
   ======================================== */
.input-container {
  padding: 1.25rem;
  background: white;
  border-top: none;
  box-shadow: 0 -4px 20px rgba(200, 162, 200, 0.1);
}

.input-wrapper {
  display: flex;
  gap: 0;
  align-items: center;
  width: 100%;
}

.mention-btn {
  padding: 0.9rem 1.2rem;
  background: var(--color-coral);
  color: white;
  border: none;
  border-radius: 25px 0 0 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 0;
  box-shadow: 0 4px 15px rgba(255, 123, 115, 0.3);
}

.mention-btn:hover {
  background: #FF6A60;
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 123, 115, 0.4);
}

.mention-btn:active {
  transform: scale(0.98);
}

.message-input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border: 2px solid var(--color-cream);
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  background: white;
  transition: all 0.3s ease;
}

.message-input:focus {
  border-color: var(--color-coral);
  box-shadow: 0 0 20px rgba(255, 123, 115, 0.2);
}

.message-input.with-mention-btn {
  border-radius: 0 25px 25px 0;
  border-left: none;
  margin-left: 0;
}

.send-btn {
  background: var(--color-coral);
  color: white;
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: 0.75rem;
  box-shadow: 0 4px 15px rgba(255, 123, 115, 0.3);
}

.send-btn:hover:not(:disabled) {
  background: #FF6A60;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 123, 115, 0.4);
}

.send-btn:disabled {
  background: var(--color-purple-light);
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

/* ========================================
   TYPING INDICATOR
   ======================================== */
.typing-dots {
  display: inline-block;
  animation: typing 1.5s infinite ease-in-out;
}

.typing-dots::before {
  content: '●';
  animation: dot1 1.5s infinite;
  margin-right: 4px;
}

.typing-dots::after {
  content: '● ●';
  animation: dot2 1.5s infinite;
  margin-left: 4px;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.4;
  }
  30% {
    opacity: 1;
  }
}

@keyframes dot1 {
  0%, 60%, 100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}

@keyframes dot2 {
  0%, 40% {
    opacity: 0.3;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .chat-container {
    height: 450px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .navbar {
    padding: 0.75rem 1rem;
  }
  
  .nav-brand h1 {
    font-size: 1.4rem;
  }
  
  .mention-btn {
    padding: 0.75rem 0.9rem;
    font-size: 0.85rem;
  }
}
</style>
