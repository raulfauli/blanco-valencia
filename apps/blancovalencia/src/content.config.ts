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
			image: image().optional(),
		}),
});

const fortalezas = defineCollection({
	// Load Markdown and MDX files in the `src/content/fortalezas/` directory.
	loader: glob({ base: "./src/content/fortalezas", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			image: image(),
		}),
});

const pages = defineCollection({
	loader: glob({
		base: "./src/content/pages",
		pattern: "**/*.{md,mdx}",
	}),
});

const opiniones = defineCollection({
	loader: glob({ base: "./src/content/opiniones", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			stars: z.number().min(1).max(5).default(5),
			avatar: image().optional(),
		}),
});

export const collections = { cultura, fortalezas, pages, opiniones };
