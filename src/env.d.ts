/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent</*{}, {},*/NonNullable<unknown>, NonNullable<unknown>, any>
  export default component
}

// Para as macros do Vue 3
declare const defineProps: <T = any>() => T
declare const defineEmits: <T = any>() => T
declare const defineExpose: <T = any>() => T
declare const withDefaults: <T, U = any>() => T & U