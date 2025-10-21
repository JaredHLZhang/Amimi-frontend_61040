<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
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
      <div v-if="currentView === 'home'">
        <h1>Welcome to Amimi</h1>
        <p>Your AI companion for long-distance relationships</p>
        
        <div v-if="!userId">
          <button @click="signUp" class="primary-btn" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
          <button @click="debugAPIs" class="debug-btn" :disabled="loading">
            Debug APIs
          </button>
        </div>
        
        <div v-else>
          <h2>Welcome back!</h2>
          <p>You're signed in as: <strong>{{ userId }}</strong></p>
          <button @click="currentView = 'pairing'" class="primary-btn" v-if="!isPaired">
            Find Your Partner
          </button>
          <button @click="currentView = 'chat'" class="primary-btn" v-else>
            Start Chatting with Amimi
          </button>
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

        <div class="chat-container">
          <div class="messages-container">
            <div v-if="messages.length === 0" class="empty-state">
              <p>Start a conversation with Amimi!</p>
              <p class="help-text">Ask about your relationship, share your thoughts, or get advice.</p>
            </div>
            
            <div v-for="message in messages" :key="message.messageId" class="message" :class="message.isFromUser ? 'user-message' : 'agent-message'">
              <div class="message-content">
                <div class="message-header">
                  <span class="sender">{{ message.isFromUser ? 'You' : 'Amimi' }}</span>
                  <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
            
            <div v-if="loading" class="message agent-message">
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

          <div class="input-container">
            <div class="input-wrapper">
              <input 
                v-model="newMessage" 
                @keyup.enter="sendMessage"
                placeholder="Type your message..."
                class="message-input"
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
import { ref, onMounted } from 'vue';

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
const messages = ref([]);
const newMessage = ref('');
const conversationId = ref(localStorage.getItem('conversationId'));

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

async function sendMessage() {
  if (!newMessage.value.trim() || loading.value || !conversationId.value) {
    console.log('Cannot send message:', { 
      hasMessage: !!newMessage.value.trim(), 
      loading: loading.value, 
      hasConversationId: !!conversationId.value 
    });
    return;
  }

  const messageText = newMessage.value.trim();
  console.log('Sending message:', messageText, 'to conversation:', conversationId.value);
  newMessage.value = '';
  loading.value = true;

  try {
    // Add user message to UI immediately
    const userMessage = {
      messageId: `temp-${Date.now()}`,
      conversationId: conversationId.value,
      isFromUser: true,
      content: messageText,
      timestamp: new Date().toISOString()
    };
    messages.value.push(userMessage);

    // Send message to backend
    console.log('Calling sendUserMessage API...');
    const sendResult = await apiCall('/ConversationalAgent/sendUserMessage', { conversationId: conversationId.value, content: messageText });
    console.log('Send message result:', sendResult);
    if (sendResult.status === 'success') {
      const messageIndex = messages.value.findIndex(m => m.messageId === userMessage.messageId);
      if (messageIndex !== -1) {
        // Update with the real message from backend
        const realMessage = {
          messageId: sendResult.message._id,
          conversationId: sendResult.message.conversationId,
          isFromUser: sendResult.message.isFromUser,
          content: sendResult.message.content,
          timestamp: sendResult.message.timestamp
        };
        messages.value[messageIndex] = realMessage;
      }
    }

    // Get agent response
    console.log('Calling getAgentResponse API...');
    const responseResult = await apiCall('/ConversationalAgent/getAgentResponse', { conversationId: conversationId.value, userMessageContent: messageText });
    console.log('Agent response result:', responseResult);
    if (responseResult.status === 'success') {
      // Transform the response message to match our format
      const agentMessage = {
        messageId: responseResult.message._id,
        conversationId: responseResult.message.conversationId,
        isFromUser: responseResult.message.isFromUser,
        content: responseResult.message.content,
        timestamp: responseResult.message.timestamp
      };
      messages.value.push(agentMessage);
    } else {
      messages.value.push({
        messageId: `error-${Date.now()}`,
        conversationId: conversationId.value,
        isFromUser: false,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value.push({
      messageId: `error-${Date.now()}`,
      conversationId: conversationId.value || '',
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

onMounted(() => {
  if (userId.value) {
    loadConversation();
  }
});
</script>

<style scoped>
/* Add all the CSS from the original components here */
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

.nav-link, .logout-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: #2c3e50;
  transition: background-color 0.2s;
}

.nav-link:hover, .logout-btn:hover {
  background-color: #e9ecef;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
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

.pairing-section {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
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

.chat-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.message {
  margin-bottom: 1rem;
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.agent-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

.user-message .message-content {
  background-color: #007bff;
  color: white;
}

.agent-message .message-content {
  background-color: white;
  color: #2c3e50;
  border: 1px solid #e9ecef;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.input-container {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e9ecef;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 1rem;
  outline: none;
}

.send-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.send-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.send-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.typing-dots {
  animation: typing 1.5s infinite;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}
</style>
