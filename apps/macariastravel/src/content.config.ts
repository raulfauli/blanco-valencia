import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  author: z.string().optional().default('Macarias Travel'),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  sponsor: z.string().optional(),
  videoUrl: z.string().optional(),
});

const routeSchema = blogSchema.extend({
  difficulty: z.enum(['facil', 'moderado', 'dificil', 'experto']),
  distance: z.number(),
  elevation: z.number(),
  duration: z.string(),
  location: z.string(),
  wikilocUrl: z.string().url().optional(),
  stravaUrl: z.string().url().optional(),
  gpxFile: z.string().optional(),
});

const videoSchema = blogSchema.extend({
  videoUrl: z.string(),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const routes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/routes' }),
  schema: routeSchema,
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: videoSchema,
});

export const collections = { blog, routes, videos };
