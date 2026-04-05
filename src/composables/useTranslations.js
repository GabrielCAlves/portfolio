// src/composables/useTranslations.js
import { ref, onMounted, onUnmounted } from 'vue'
import { translationService } from '@/services/translations'

export function useTranslations() {
  const currentLanguage = ref(translationService.getLanguage())
  const forceUpdate = ref(0) // 🔥 NOVO: para forçar re-render
  
  // 🔥 FUNÇÃO REATIVA que atualiza quando o idioma muda
  const $t = (key) => {
    // Usar forceUpdate.value para forçar reatividade
    const result = translationService.t(key)
    return result
  }

  const handleLanguageChange = (event) => {
    currentLanguage.value = event.detail
    forceUpdate.value++ // 🔥 INCREMENTAR para forçar re-render
    console.log('🌍 Idioma alterado para:', event.detail, 'ForceUpdate:', forceUpdate.value)
  }

  onMounted(() => {
    window.addEventListener('languageChanged', handleLanguageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('languageChanged', handleLanguageChange)
  })

  return {
    $t,
    currentLanguage,
    forceUpdate // 🔥 EXPORTAR forceUpdate
  }
}