import { ref, onMounted, onUnmounted } from 'vue'
import { translationService } from '@/services/translations'

export function useTranslations() {
  const currentLanguage = ref(translationService.getLanguage())
  const forceUpdate = ref(0)
  
  const $t = (key) => {
    const result = translationService.t(key)
    return result
  }

  const handleLanguageChange = (event) => {
    currentLanguage.value = event.detail
    forceUpdate.value++
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
    forceUpdate
  }
}