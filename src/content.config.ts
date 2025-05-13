import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    description: z.string(),

    heroImage: z.string().optional(),

    // Allow imports in MDX files
    imports: z.record(z.string()).optional(),

    // Transform string to Date object
    pubDate: z.coerce.date(),

    title: z.string(),

    updatedDate: z.coerce.date().optional()
  })
});

export const collections = { blog };
