## ADDED Requirements

### Requirement: YouTube embeds shall be created via MDX component

Los videos de YouTube embebidos SHALL crearse usando un componente MDX reutilizable que acepte una URL y la transforme en un iframe de YouTube.

#### Scenario: Embed with watch URL
- **WHEN** se usa `<YouTube url="https://www.youtube.com/watch?v=abc123" />`
- **THEN** SHALL renderizar un iframe embebido con el video reproducido desde youtube-nocookie.com

#### Scenario: Embed with short URL
- **WHEN** se usa `<YouTube url="https://youtu.be/abc123" />`
- **THEN** SHALL extraer el video ID y renderizar el iframe embebido correctamente

#### Scenario: Embed with embed URL
- **WHEN** se usa `<YouTube url="https://www.youtube.com/embed/abc123" />`
- **THEN** SHALL usar directamente la URL sin modificación

### Requirement: YouTube component shall use existing embed component

El componente YouTube SHALL utilizar el componente `YouTubeEmbed.astro` existente para mantener consistencia visual.

#### Scenario: Component integration
- **WHEN** se renderiza el componente YouTube
- **THEN** SHALL delegar la renderización del iframe a `YouTubeEmbed.astro` pasando el video ID extraído

### Requirement: YouTube component shall handle invalid URLs gracefully

El componente SHALL manejar URLs inválidas o no-YouTube sin mostrar errores visibles.

#### Scenario: Non-YouTube URL
- **WHEN** se pasa una URL que no es de YouTube
- **THEN** SHALL renderizar un placeholder con mensaje informativo

#### Scenario: Malformed URL
- **WHEN** se pasa una URL malformada o sin video ID
- **THEN** SHALL renderizar un placeholder con mensaje informativo
