import { apiCall } from './client';

export async function createConversation(userId: string, context?: string) {
  return apiCall<{
    conversation: {
      conversationId: string;
      userId: string;
      context: string;
      createdAt: string;
    }
  }>('/ConversationalAgent/createConversation', { userId, context });
}

export async function sendUserMessage(conversationId: string, content: string) {
  return apiCall<{
    message: {
      messageId: string;
      conversationId: string;
      isFromUser: boolean;
      content: string;
      timestamp: string;
    }
  }>('/ConversationalAgent/sendUserMessage', { conversationId, content });
}

export async function getAgentResponse(conversationId: string, userMessageContent: string) {
  return apiCall<{
    response: {
      messageId: string;
      conversationId: string;
      isFromUser: boolean;
      content: string;
      timestamp: string;
    }
  }>('/ConversationalAgent/getAgentResponse', { conversationId, userMessageContent });
}

export async function getHistory(conversationId: string) {
  return apiCall<{
    messages: Array<{
      messageId: string;
      conversationId: string;
      isFromUser: boolean;
      content: string;
      timestamp: string;
    }>
  }>('/ConversationalAgent/getHistory', { conversationId });
}

export async function updateContext(conversationId: string, newContext: string) {
  return apiCall<{
    conversation: {
      conversationId: string;
      userId: string;
      context: string;
      createdAt: string;
    }
  }>('/ConversationalAgent/updateContext', { conversationId, newContext });
}

export async function deleteConversation(conversationId: string) {
  return apiCall<{ message: string }>('/ConversationalAgent/deleteConversation', { conversationId });
}
