<script setup lang="ts">
interface PredictResponse {
  probabilidad_patologica: number
  clase: string
}

const config = useRuntimeConfig()
const toast = useToast()

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const loading = ref(false)
const result = ref<{ prob: number, label: string } | null>(null)

watch(file, (f) => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = f ? URL.createObjectURL(f) : null
  result.value = null
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const pct = computed(() => (result.value ? Math.round(result.value.prob * 100) : 0))
const isPathologic = computed(() => result.value?.label?.toLowerCase().includes('pat') ?? false)

async function analyze() {
  if (!file.value) return

  const endpoint = config.public.hfEndpoint as string
  if (!endpoint) {
    toast.add({
      title: 'Falta configurar el servicio',
      description: 'Define NUXT_PUBLIC_HF_ENDPOINT con la URL de tu Space de Hugging Face.',
      color: 'warning',
      icon: 'i-lucide-triangle-alert'
    })
    return
  }

  loading.value = true
  result.value = null
  try {
    const form = new FormData()
    form.append('file', file.value)
    const res = await $fetch<PredictResponse>(endpoint, { method: 'POST', body: form })
    result.value = { prob: res.probabilidad_patologica, label: res.clase }
  } catch (e) {
    toast.add({
      title: 'No se pudo analizar la imagen',
      description: e instanceof Error ? e.message : 'Error al contactar el servicio.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 sm:py-14">
    <div class="mx-auto max-w-3xl space-y-8">
      <div class="text-center space-y-3">
        <h1 class="text-3xl sm:text-4xl font-bold text-highlighted">
          Detector de fractura patológica
        </h1>
        <p class="text-muted text-lg">
          Sube una radiografía de un hueso largo y el modelo estimará si la fractura
          es <span class="font-medium text-highlighted">patológica (tumoral)</span> o
          <span class="font-medium text-highlighted">traumática</span>.
        </p>
      </div>

      <UAlert
        icon="i-lucide-triangle-alert"
        color="warning"
        variant="subtle"
        title="Herramienta de investigación"
        description="Prueba de concepto entrenada con 80 imágenes. No es una herramienta diagnóstica ni sustituye el criterio de un profesional médico."
      />

      <div class="grid gap-6 md:grid-cols-2">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2 font-semibold">
              <UIcon name="i-lucide-upload" class="size-5 text-primary" />
              <span>1. Sube la radiografía</span>
            </div>
          </template>

          <div class="space-y-4">
            <UFileUpload
              v-model="file"
              accept="image/*"
              icon="i-lucide-image"
              label="Arrastra una imagen o haz clic para seleccionar"
              description="PNG, JPG o TIFF"
              class="min-h-44 w-full"
            />

            <div v-if="previewUrl" class="overflow-hidden rounded-lg border border-default">
              <img :src="previewUrl" alt="Vista previa de la radiografía" class="max-h-64 w-full object-contain bg-elevated">
            </div>

            <UButton
              block
              size="lg"
              icon="i-lucide-scan-search"
              :loading="loading"
              :disabled="!file"
              @click="analyze"
            >
              Analizar imagen
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2 font-semibold">
              <UIcon name="i-lucide-activity" class="size-5 text-primary" />
              <span>2. Resultado</span>
            </div>
          </template>

          <div
            v-if="!result && !loading"
            class="flex h-full min-h-52 flex-col items-center justify-center text-center text-muted"
          >
            <UIcon name="i-lucide-scan-line" class="mb-2 size-10 opacity-40" />
            <p>El resultado aparecerá aquí después de analizar una imagen.</p>
          </div>

          <div v-else-if="loading" class="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-muted">
            <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
            <p>Analizando…</p>
          </div>

          <div v-else-if="result" class="space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-muted">Clasificación</span>
              <UBadge
                :color="isPathologic ? 'error' : 'success'"
                variant="subtle"
                size="lg"
                :icon="isPathologic ? 'i-lucide-alert-circle' : 'i-lucide-check-circle'"
              >
                {{ isPathologic ? 'Patológica (tumoral)' : 'Traumática' }}
              </UBadge>
            </div>

            <div class="space-y-2">
              <div class="flex items-baseline justify-between">
                <span class="text-muted text-sm">Probabilidad de fractura patológica</span>
                <span class="text-2xl font-bold text-highlighted">{{ pct }}%</span>
              </div>
              <UProgress :model-value="pct" :color="isPathologic ? 'error' : 'success'" />
            </div>

            <p class="text-xs text-muted">
              Estimación del modelo. Interpretar siempre junto con el criterio clínico.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
