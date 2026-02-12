import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const culturaOnline = defineCollection({
  // Load Markdown and MDX files in the `src/content/cultura-online/` directory.
  loader: glob({ base: "./src/content/cultura-online", pattern: "**/*.{md,mdx}" }),
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

export const collections = { culturaOnline };
