<template>
  <div>
    <h1>Minimal Vue Test</h1>
    <p>If you see this, Vue is working!</p>
    <button @click="testClick">Click Me</button>
    <p v-if="clicked">Button was clicked!</p>
    <button @click="testAPI">Test API</button>
    <div v-if="apiResult">{{ apiResult }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const clicked = ref(false);
const apiResult = ref('');

function testClick() {
  clicked.value = true;
  console.log('Button clicked!');
}

async function testAPI() {
  try {
    console.log('Testing API...');
    const response = await fetch('http://localhost:8000/api/Pairing/generateCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'test-user-minimal' }),
    });
    const result = await response.json();
    apiResult.value = JSON.stringify(result);
    console.log('API result:', result);
  } catch (error) {
    apiResult.value = 'Error: ' + error.message;
    console.error('API error:', error);
  }
}
</script>
