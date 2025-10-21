<template>
  <div class="chat-view">
    <div class="chat-header">
      <h1>Chat with Amimi</h1>
      <p class="subtitle">Your AI companion for relationship support</p>
    </div>

    <div class="chat-container">
      <div class="messages-container" ref="messagesContainer">
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
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { 
  createConversation, 
  sendUserMessage, 
  getAgentResponse, 
  getHistory 
} from '../api/conversationalAgent';

const userStore = useUserStore();
const router = useRouter();

const messages = ref<Array<{
  messageId: string;
  conversationId: string;
  isFromUser: boolean;
  content: string;
  timestamp: string;
}>>([]);

const newMessage = ref('');
const loading = ref(false);
const messagesContainer = ref<HTMLElement>();

onMounted(async () => {
  if (!userStore.userId) {
    router.push('/');
    return;
  }

  // Load or create conversation
  await loadConversation();
});

async function loadConversation() {
  if (!userStore.userId) return;

  try {
    // If we have a conversation ID, load the history
    if (userStore.conversationId) {
      const historyResult = await getHistory(userStore.conversationId);
      if (historyResult.status === 'success') {
        messages.value = historyResult.messages;
        return;
      }
    }

    // Create new conversation
    const result = await createConversation(userStore.userId, 'User is looking for relationship support and guidance');
    if (result.status === 'success') {
      userStore.setConversation(result.conversation.conversationId);
      messages.value = [];
    } else {
      console.error('Failed to create conversation:', result.error);
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || loading.value || !userStore.conversationId) return;

  const messageText = newMessage.value.trim();
  newMessage.value = '';
  loading.value = true;

  try {
    // Add user message to UI immediately
    const userMessage = {
      messageId: `temp-${Date.now()}`,
      conversationId: userStore.conversationId,
      isFromUser: true,
      content: messageText,
      timestamp: new Date().toISOString()
    };
    messages.value.push(userMessage);
    await scrollToBottom();

    // Send message to backend
    const sendResult = await sendUserMessage(userStore.conversationId, messageText);
    if (sendResult.status === 'success') {
      // Update the message with real ID
      const messageIndex = messages.value.findIndex(m => m.messageId === userMessage.messageId);
      if (messageIndex !== -1) {
        messages.value[messageIndex] = sendResult.message;
      }
    }

    // Get agent response
    const responseResult = await getAgentResponse(userStore.conversationId, messageText);
    if (responseResult.status === 'success') {
      messages.value.push(responseResult.response);
    } else {
      // Add error message
      messages.value.push({
        messageId: `error-${Date.now()}`,
        conversationId: userStore.conversationId,
        isFromUser: false,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value.push({
      messageId: `error-${Date.now()}`,
      conversationId: userStore.conversationId || '',
      isFromUser: false,
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString()
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });
</script>

<style scoped>
.chat-view {
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.chat-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chat-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 500px;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.help-text {
  font-size: 0.9rem;
  margin-top: 0.5rem;
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

.sender {
  font-weight: bold;
}

.timestamp {
  font-size: 0.7rem;
}

.message-text {
  line-height: 1.4;
}

.typing {
  display: flex;
  align-items: center;
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

.message-input:focus {
  border-color: #007bff;
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

@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .chat-view {
    height: calc(100vh - 150px);
  }
}
</style>
