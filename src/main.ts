// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 🔥 CORREÇÃO: Usar require ou ignorar o tipo
const translationPlugin = require('./plugins/translations').default

createApp(App)
  .use(store)
  .use(router)
  .use(translationPlugin)
  .mount('#app')