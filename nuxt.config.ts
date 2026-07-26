// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Forzar siempre modo claro (sin dark mode)
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  runtimeConfig: {
    public: {
      // URL base del backend (Cloud Run). Los servicios agregan la ruta (ej. /predict).
      // Se define con la variable de entorno NUXT_PUBLIC_API_BASE.
      apiBase: ''
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
