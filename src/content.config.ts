import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]).optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    read_time: z.boolean().optional(),
    comments: z.boolean().optional(),
    share: z.boolean().optional(),
    related: z.boolean().optional(),
    toc: z.boolean().optional(),
    teaser: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
