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

      // Whether the post is a draft
      isDraft: z.boolean().optional(),

      // Transform string to Date object
      pubDate: z.coerce.date(),

      // by default the title is used to produce a slug for
      // the post url, but it can be overriden with a custom slug
      slug: z.string().optional(),

      tags: z.array(z.string()).optional(),

      title: z.string(),

      updatedDate: z.coerce.date().optional()
    })
});

export const collections = { blog };
