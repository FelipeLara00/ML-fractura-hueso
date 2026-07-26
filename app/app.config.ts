export default defineAppConfig({
  ui: {
    // Fuente única de la marca. Los valores de cada paleta viven en
    // app/assets/css/main.css. Reutilizar siempre con color="primary" /
    // color="secondary" y los tokens semánticos (text-primary, bg-secondary, …).
    colors: {
      primary: 'blue',
      secondary: 'sky',
      warning: 'yellow',
      neutral: 'slate'
    }
  }
})
