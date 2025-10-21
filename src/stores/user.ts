import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userId = ref<string | null>(localStorage.getItem('userId'));
  const isPaired = ref<boolean>(localStorage.getItem('isPaired') === 'true');
  const pairId = ref<string | null>(localStorage.getItem('pairId'));
  const conversationId = ref<string | null>(localStorage.getItem('conversationId'));

  function setUser(id: string) {
    userId.value = id;
    localStorage.setItem('userId', id);
  }

  function setPaired(paired: boolean, id?: string) {
    isPaired.value = paired;
    localStorage.setItem('isPaired', String(paired));
    if (id) {
      pairId.value = id;
      localStorage.setItem('pairId', id);
    }
  }

  function setConversation(id: string) {
    conversationId.value = id;
    localStorage.setItem('conversationId', id);
  }

  function clearUser() {
    userId.value = null;
    isPaired.value = false;
    pairId.value = null;
    conversationId.value = null;
    localStorage.clear();
  }

  return { 
    userId, 
    isPaired, 
    pairId, 
    conversationId,
    setUser, 
    setPaired, 
    setConversation,
    clearUser 
  };
});
