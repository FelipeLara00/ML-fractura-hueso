<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'Detector de fractura patológica'
const description = 'Herramienta de investigación que estima, a partir de una radiografía de hueso largo, si la fractura es patológica (tumoral) o traumática.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UBanner
      color="warning"
      icon="i-lucide-triangle-alert"
      title="Versión de prueba — herramienta de investigación, no diagnóstica."
    />

    <UMain class="min-h-dvh bg-secondary/5">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
