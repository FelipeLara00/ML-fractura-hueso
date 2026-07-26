<script setup lang="ts">
import { useFractureService } from '~/services/fracture.service'

const toast = useToast()
const fracture = useFractureService()

const items = [
  { slot: 'upload', title: 'Radiografía', description: 'Sube la imagen', icon: 'i-lucide-image-up' },
  { slot: 'result', title: 'Resultado', description: 'Estimación del modelo', icon: 'i-lucide-activity' }
]

const step = ref(0)
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const loading = ref(false)
const result = ref<{ prob: number, label: string } | null>(null)

watch(file, (f) => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = f ? URL.createObjectURL(f) : null
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const pct = computed(() => (result.value ? Math.round(result.value.prob * 100) : 0))
const isPathologic = computed(() => result.value?.label?.toLowerCase().includes('pat') ?? false)

// Confianza: qué tan lejos está la probabilidad del 50/50 (0 = indeciso, 1 = totalmente seguro)
const confidence = computed(() => (result.value ? Math.abs(result.value.prob - 0.5) * 2 : 0))
const confidenceColor = computed(() => {
  if (confidence.value >= 0.5) return 'success' // seguro -> verde
  if (confidence.value >= 0.2) return 'warning' // dudoso -> ámbar
  return 'error' // casi 50/50 -> rojo
})

async function analyze() {
  if (!file.value) return

  loading.value = true
  result.value = null
  try {
    result.value = await fracture.predict(file.value)
    step.value = 1
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

function reset() {
  file.value = null
  result.value = null
  step.value = 0
}
</script>

<template>
  <div>
    <UContainer class="py-12 sm:py-16">
      <div class="mx-auto w-full max-w-2xl">
        <div class="mb-8 space-y-3 text-center">
          <h1 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
            Detector de fractura patológica
          </h1>
          <p class="text-muted">
            Sube una radiografía de un hueso largo y el modelo estimará si la fractura
            es patológica (tumoral) o traumática.
          </p>
        </div>

        <div class="rounded-lg bg-default p-6 ring-1 ring-default sm:p-8">
          <UStepper
            v-model="step"
            :items="items"
            color="primary"
            size="sm"
            class="mb-8"
            :ui="{ trigger: 'pointer-events-none' }"
          >
            <template #upload>
              <div class="space-y-5">
                <div class="grid gap-4 sm:grid-cols-2">
                  <UFileUpload
                    v-model="file"
                    accept="image/*"
                    icon="i-lucide-image"
                    label="Arrastra una radiografía o haz clic"
                    description="PNG, JPG o TIFF"
                    :preview="false"
                    class="min-h-48 rounded-lg"
                  />

                  <div class="flex min-h-48 items-center justify-center overflow-hidden rounded-lg bg-secondary/5 ring-1 ring-default">
                    <img
                      v-if="previewUrl"
                      :src="previewUrl"
                      alt="Vista previa de la radiografía"
                      class="max-h-48 w-full object-contain"
                    >
                    <div
                      v-else
                      class="flex flex-col items-center gap-1 text-muted"
                    >
                      <UIcon
                        name="i-lucide-image"
                        class="size-6 opacity-40"
                      />
                      <span class="text-sm">Vista previa</span>
                    </div>
                  </div>
                </div>

                <UButton
                  block
                  size="xl"
                  class="rounded-lg"
                  icon="i-lucide-scan-search"
                  :loading="loading"
                  :disabled="!file"
                  @click="analyze"
                >
                  Analizar imagen
                </UButton>
              </div>
            </template>

            <template #result>
              <div
                v-if="result"
                class="space-y-6 text-center"
              >
                <div class="space-y-2">
                  <UIcon
                    :name="isPathologic ? 'i-lucide-alert-circle' : 'i-lucide-check-circle'"
                    class="size-9 text-dimmed"
                  />
                  <p class="text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl">
                    {{ isPathologic ? 'Patológica (tumoral)' : 'Traumática' }}
                  </p>
                  <p class="text-muted">
                    Probabilidad de fractura patológica:
                    <span class="font-medium text-highlighted">{{ pct }}%</span>
                  </p>
                </div>

                <UProgress
                  :model-value="pct"
                  :color="confidenceColor"
                  size="lg"
                />

                <UAlert
                  color="warning"
                  variant="subtle"
                  icon="i-lucide-info"
                  title="Esto no es un diagnóstico definitivo"
                  description="Es una estimación de una herramienta de investigación. Consulta siempre el resultado con un profesional médico."
                  class="text-left"
                />

                <UButton
                  block
                  size="lg"
                  color="primary"
                  variant="soft"
                  class="rounded-lg"
                  icon="i-lucide-rotate-ccw"
                  @click="reset"
                >
                  Analizar otra imagen
                </UButton>
              </div>
            </template>
          </UStepper>
        </div>
      </div>
    </UContainer>
  </div>
</template>
