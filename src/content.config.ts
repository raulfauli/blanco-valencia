import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cultura = defineCollection({
  // Load Markdown and MDX files in the `src/content/cultura/` directory.
  loader: glob({ base: "./src/content/cultura", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date(),
      heroImage: image(),
    }),
});

export const collections = { cultura };
