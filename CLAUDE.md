# Guía del proyecto — ML Fractura (frontend)

App Nuxt 4 + Nuxt UI 4 que permite subir una radiografía y consultar un modelo
(alojado en Hugging Face) que estima si la fractura es patológica o traumática.

## Reglas de desarrollo (obligatorias)

### 1. Componentes: primero Nuxt UI
- **Siempre** usar el componente de Nuxt UI cuando exista uno que cubra la
  necesidad (`UButton`, `UCard`, `UAlert`, `UBadge`, `UProgress`, `UFileUpload`,
  `UInput`, `UModal`, `UForm`, `UTable`, `USelect`, etc.).
- **No** crear un componente propio que duplique uno que ya ofrece Nuxt UI.
- Solo crear componentes propios para estructura o lógica específica que Nuxt UI
  no provee, y aun así **componiéndolos con** componentes de Nuxt UI por dentro.
- Antes de escribir un componente, revisar el catálogo: https://ui.nuxt.com/components

### 2. Colores: estandarizados y centralizados
- La paleta se define en **`app/assets/css/main.css`** (ramps `@theme`) y se mapea
  a los alias en **`app/app.config.ts`**:
  - `primary` → azul (estilo Fintual)
  - `secondary` → celeste tenue
  - `neutral` → slate
- **Prohibido** hardcodear colores en componentes: nada de hex (`#3b82f6`) ni de
  clases de color crudas de Tailwind (`text-blue-500`, `bg-green-600`).
- Para cambiar la marca, se edita **solo** el ramp en `main.css` (y, si hace falta,
  el alias en `app.config.ts`). Todo lo demás se actualiza solo.

### 3. Reutilizar con props y tokens, no con wrappers
- Cambiar la apariencia mediante los **props de Nuxt UI**, no creando componentes
  compartidos. Ej.: en vez de un `AppButton`, usar directamente `<UButton>` y
  ajustar `color` y `variant`:
  ```vue
  <UButton color="primary" variant="solid">Analizar</UButton>
  <UButton color="secondary" variant="outline">Cancelar</UButton>
  ```
  - `color`: `primary` | `secondary` | `success` | `info` | `warning` | `error` | `neutral`
  - `variant`: `solid` | `outline` | `soft` | `subtle` | `ghost` | `link`
- Para texto, fondos y bordes usar los **tokens semánticos** de Nuxt UI, no colores
  fijos: `text-default`, `text-muted`, `text-dimmed`, `text-highlighted`,
  `text-primary`, `bg-default`, `bg-elevated`, `bg-primary`, `border-default`, etc.
  Estos ya responden a modo claro/oscuro.

### 4. Estilo visual (Fintual)
- **Sin sombras.** No usar `shadow-*`. Para separar superficies usar bordes/anillos
  sutiles (`ring-1 ring-default`, `border-default`) y el fondo celeste tenue.
- Diseño plano: mucho espacio en blanco y titulares grandes.
- **Bordes `rounded-lg`.** No usar esquinas completamente redondeadas (`rounded-full`)
  ni radios muy grandes (`rounded-2xl`/`rounded-3xl`) en tarjetas, botones o badges.
- **Solo modo claro.** El dark mode está desactivado (`colorMode.preference: 'light'`
  en `nuxt.config.ts`). No añadir toggles de tema ni estilos condicionados a `.dark`.

### 5. Capa de servicios (lógica fuera de los componentes)
- **Toda la lógica de negocio y llamadas al backend vive en `app/services/`.**
  Los componentes/páginas solo manejan UI (estado, loading, toasts) y llaman a un servicio.
- Las llamadas HTTP pasan **siempre por el wrapper `useApi()`** (`app/services/api.ts`),
  que centraliza la `baseURL` y el manejo de errores. Ningún componente usa `$fetch` directo.
- Cada dominio tiene su servicio (ej. `fracture.service.ts` con `useFractureService()`),
  que usa `useApi()` y expone funciones claras (ej. `predict(file)`).
- Al agregar un endpoint nuevo: crea/actualiza el servicio correspondiente, no llames al backend desde el componente.

### 6. Idioma y contexto
- La interfaz va **en español**.
- Es una **herramienta de investigación, no diagnóstica**: mantener siempre visible
  ese aviso y evitar lenguaje que sugiera un diagnóstico clínico.

## Estructura
- `app/app.vue` — layout (banner, main).
- `app/pages/index.vue` — página de subida y resultado (solo UI).
- `app/services/api.ts` — wrapper HTTP central (`useApi()`).
- `app/services/fracture.service.ts` — lógica de predicción (`useFractureService()`).
- `app/app.config.ts` — alias de color de la marca.
- `app/assets/css/main.css` — paletas primaria/secundaria.
- `nuxt.config.ts` — `runtimeConfig.public.apiBase` (variable `NUXT_PUBLIC_API_BASE`).

## Comandos
- `yarn dev` — desarrollo (requiere Node ≥ 22.19).
- `yarn build` / `yarn preview` — build de producción.
- `yarn lint` — ESLint.
