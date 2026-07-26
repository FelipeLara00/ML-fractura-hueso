/**
 * Wrapper HTTP central. Todos los servicios lo usan para hablar con el backend.
 * Configura la baseURL desde runtimeConfig (NUXT_PUBLIC_API_BASE) y centraliza
 * el manejo de errores. Los servicios solo indican la ruta y el método.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string) || ''

  return $fetch.create({
    baseURL,
    onRequest() {
      if (!baseURL) {
        throw new Error('Falta configurar la URL del backend (NUXT_PUBLIC_API_BASE).')
      }
    }
  })
}

export type Api = ReturnType<typeof useApi>
