// Debug API client to test frontend-backend communication
export async function testPairingAPI() {
  try {
    console.log('Testing Pairing API...');
    const response = await fetch('http://localhost:8000/api/Pairing/generateCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'debug-test-user' }),
    });
    const result = await response.json();
    console.log('Pairing API result:', result);
    return result;
  } catch (error) {
    console.error('Pairing API error:', error);
    return { error: error.message };
  }
}

export async function testChatAPI() {
  try {
    console.log('Testing Chat API...');
    // First create a conversation
    const createResponse = await fetch('http://localhost:8000/api/ConversationalAgent/createConversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'debug-test-user', context: 'debug test' }),
    });
    const createResult = await createResponse.json();
    console.log('Create conversation result:', createResult);
    
    if (createResult.status === 'success') {
      const conversationId = createResult.conversation._id;
      
      // Send a message
      const messageResponse = await fetch('http://localhost:8000/api/ConversationalAgent/sendUserMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content: 'Hello from debug!' }),
      });
      const messageResult = await messageResponse.json();
      console.log('Send message result:', messageResult);
      
      // Get agent response
      const agentResponse = await fetch('http://localhost:8000/api/ConversationalAgent/getAgentResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userMessageContent: 'Hello from debug!' }),
      });
      const agentResult = await agentResponse.json();
      console.log('Agent response result:', agentResult);
      
      return { createResult, messageResult, agentResult };
    }
    
    return { error: 'Failed to create conversation' };
  } catch (error) {
    console.error('Chat API error:', error);
    return { error: error.message };
  }
}
