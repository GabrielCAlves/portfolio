// plugins/translations.js
import { translationService } from '@/services/translations'

export default {
  install: (app) => {
    app.config.globalProperties.$t = (key) => translationService.t(key)
    
    // Fornecer o serviço de tradução via provide/inject
    app.provide('translationService', translationService)
  }
}