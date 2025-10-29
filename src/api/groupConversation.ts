import { apiCall } from './client';

export async function createGroupConversation(participants: string[], context?: string) {
  return apiCall<{
    conversation: {
      conversationId: string;
      participants: string[];
      context: string;
      createdAt: string;
    }
  }>('/GroupConversation/createGroupConversation', { participants, context });
}

export async function sendGroupMessage(conversationId: string, sender: string, content: string) {
  return apiCall<{
    message: {
      messageId: string;
      conversationId: string;
      sender: string;
      isFromAgent: boolean;
      content: string;
      timestamp: string;
    }
  }>('/GroupConversation/sendMessage', { conversationId, sender, content });
}

export async function getGroupAgentResponse(conversationId: string, contextPrompt: string) {
  return apiCall<{
    message: {
      messageId: string;
      conversationId: string;
      sender: string;
      isFromAgent: boolean;
      content: string;
      timestamp: string;
    }
  }>('/GroupConversation/getAgentResponse', { conversationId, contextPrompt });
}

export async function getGroupHistory(conversationId: string) {
  return apiCall<{
    messages: Array<{
      messageId: string;
      conversationId: string;
      sender: string;
      isFromAgent: boolean;
      content: string;
      timestamp: string;
    }>
  }>('/GroupConversation/getHistory', { conversationId });
}
