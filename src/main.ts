import { createApp } from 'vue'
import App from './App-working.vue'

console.log('Main.ts is loading...')

const app = createApp(App)

console.log('App created, mounting...')

app.mount('#app')

console.log('App mounted!')
