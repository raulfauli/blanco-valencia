## Context

The site needs a custom 404 page to handle non-existent routes gracefully. Currently, visitors hitting invalid URLs see a generic error page.

## Goals / Non-Goals

**Goals:**
- Create `src/pages/404.astro` with branded error page
- Match existing site styling (Tailwind, stone/emerald color scheme)
- Provide navigation back to main content sections

**Non-Goals:**
- Complex redirects or URL rewriting
- Tracking/metrics for 404 errors
- Multiple error page variants (500, etc.)

## Decisions

1. **Page location**: `src/pages/404.astro` - Astro convention for automatic 404 handling
2. **Layout**: Use BaseLayout like other pages for consistent header/footer
3. **Visual design**: Hero-style section with large "404" number, friendly message, and CTA buttons
4. **Navigation options**: Links to home, blog, rutas, and videos pages

## Risks / Trade-offs

- No risks identified for this simple addition
