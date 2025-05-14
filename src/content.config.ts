import { glob } from 'astro/loaders';
import { defineCollection, z, type SchemaContext } from 'astro:content';

const blog = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }: SchemaContext) =>
    z.object({
      description: z.string(),

      heroImage: image().optional(),

      // Doesn't show the hero image on the page itself
      hidePageHeroImage: z.boolean().optional(),

      // Allow imports in MDX files
      imports: z.record(z.string()).optional(),

      // Transform string to Date object
      pubDate: z.coerce.date(),

      tags: z.array(z.string()).optional(),

      title: z.string(),

      updatedDate: z.coerce.date().optional()
    })
});

export const collections = { blog };
