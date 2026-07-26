import { useApi } from './api'

/** Respuesta del endpoint /predict del backend. */
export interface PredictResponse {
  probabilidad_patologica: number
  clase: string
  umbral: number
  aviso: string
}

/** Resultado ya normalizado para la vista. */
export interface FractureResult {
  prob: number
  label: string
}

/**
 * Servicio de detección de fractura patológica.
 * Encapsula toda la lógica de negocio: llamada al modelo y normalización.
 */
export function useFractureService() {
  const api = useApi()

  return {
    /** Envía una radiografía y devuelve la probabilidad y la clase estimada. */
    async predict(file: File): Promise<FractureResult> {
      const form = new FormData()
      form.append('file', file)
      const res = await api<PredictResponse>('/predict', { method: 'POST', body: form })
      return { prob: res.probabilidad_patologica, label: res.clase }
    }
  }
}
