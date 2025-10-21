import { createApp } from 'vue'
import App from './App-minimal.vue'

console.log('Minimal main.ts loading...')

const app = createApp(App)

console.log('Minimal app created, mounting...')

app.mount('#app')

console.log('Minimal app mounted!')
