<template>
  <div id="app">
    <h1>Simple Test App</h1>
    <p>If you can see this, Vue is working!</p>
    <button @click="testAPI">Test API</button>
    <div v-if="result">{{ result }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const result = ref('');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:8000/api/Pairing/generateCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'test-user-simple' }),
    });
    const data = await response.json();
    result.value = JSON.stringify(data);
    console.log('API result:', data);
  } catch (error) {
    result.value = 'Error: ' + error.message;
    console.error('API error:', error);
  }
}
</script>
