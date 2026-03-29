## Why

Los artículos de la web no tienen un formateo consistente para el contenido HTML generado de Markdown. Además, las referencias a videos de YouTube escritas como `![](url)` no se renderizan correctamente. Necesitamos mejorar la legibilidad de los artículos y permitir embeber videos de YouTube de forma automática usando sintaxis Markdown familiar.

## What Changes

- Instalar y configurar `@tailwindcss/typography` para formatear automáticamente el contenido de artículos
- Crear un componente/shortcode de Astro que transforme sintaxis `![](https://www.youtube.com/watch?v=ID)` en iframes de YouTube embebidos
- Aplicar estilos consistentes a listas, tablas, blockquotes y otros elementos Markdown en artículos

## Capabilities

### New Capabilities

- `article-content-formatting`: Formateo consistente del contenido de artículos usando Tailwind Typography plugin
- `youtube-embeds`: Transformación automática de enlaces de YouTube en formato Markdown a videos embebidos

### Modified Capabilities

- (ninguna)

## Impact

- Dependencias: `@tailwindcss/typography`
- Archivos受影响: configuración de Tailwind, componentes de artículos, layouts existentes
