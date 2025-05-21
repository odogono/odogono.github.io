import { glob } from 'astro/loaders';
import { defineCollection, z, type SchemaContext } from 'astro:content';

// Base schema with shared attributes
const baseSchema = ({ image }: SchemaContext) =>
  z.object({
    imports: z.record(z.string()).optional(),

    // Whether the post is a draft
    isDraft: z.boolean().optional(),

    isNote: z.literal(true).optional(),

    isPost: z.literal(true).optional(),

    // Transform string to Date object
    pubDate: z.coerce.date(),

    // by default the title is used to produce a slug for
    // the post url, but it can be overriden with a custom slug
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),

    updatedDate: z.coerce.date().optional()
  });

// Notes schema extends base schema
const notesSchema = ({ image }: SchemaContext) =>
  baseSchema({ image }).extend({
    // Add note-specific fields here

    title: z.string().optional()
  });

// Posts schema extends base schema
const postsSchema = ({ image }: SchemaContext) =>
  baseSchema({ image }).extend({
    description: z.string().optional(),

    heroImage: image().optional(),

    // Doesn't show the hero image on the page itself
    hidePageHeroImage: z.boolean().optional(),

    title: z.string()
  });

// shorter form ephemeral notes
const notes = defineCollection({
  loader: glob({ base: './content/notes', pattern: '**/*.{md,mdx}' }),
  schema: notesSchema
});

// longer form posts about a specific topic
const posts = defineCollection({
  loader: glob({ base: './content/posts', pattern: '**/*.{md,mdx}' }),
  schema: postsSchema
});

export const collections = { notes, posts };
