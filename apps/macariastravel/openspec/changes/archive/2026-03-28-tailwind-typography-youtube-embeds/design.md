## Context

El proyecto usa Astro con MDX para renderizar artículos de blog y rutas. Actualmente se aplica la clase `prose prose-stone prose-lg max-w-none` pero el plugin `@tailwindcss/typography` no está instalado, por lo que los estilos de tipografía son limitados. Los videos de YouTube se embeber manualmente usando el componente `YouTubeEmbed` existente.

## Goals / Non-Goals

**Goals:**
- Instalar y configurar `@tailwindcss/typography` para formateo consistente de artículos
- Crear transformación automática de sintaxis `![](url)` a videos de YouTube embebidos
- Mejorar la legibilidad de listas, tablas, blockquotes y código

**Non-Goals:**
- No modificar el diseño visual general del sitio
- No cambiar componentes existentes no relacionados con artículos

## Decisions

### 1. Plugin de Tailwind Typography

**Decisión:** Usar `@tailwindcss/typography` v4 con configuración mediante `@plugin`

**Alternativas consideradas:**
- Estilos CSS custom: Más trabajo, menos mantenible
- Extender clases prose de Tailwind base: No ofrece el mismo nivel de tipografía

**Implementación:**
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

### 2. YouTube Embed Transformation

**Decisión:** Crear componente MDX reutilizable que acepte URL de YouTube

**Alternativas consideradas:**
- Plugin remark/rehype: Requiere configuración compleja de Astro
- JavaScript client-side: SEO pobre, carga lenta

**Implementación:**
Componente `<YouTube url="..." />` que extrae el videoId y usa `YouTubeEmbed.astro` existente.

**Formatos de URL soportados:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

## Risks / Trade-offs

- **Migración de contenido existente**: Los artículos actuales usan `YouTubeEmbed` directamente → No requiere cambios, la sintaxis `![](url)` es adicional

## Open Questions

Ninguna
