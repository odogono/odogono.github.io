import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { APIRoute } from 'astro';
import yaml from 'yaml';

import { getEntries } from '@helpers/astro';
import { toDate } from '@helpers/date';
import { createLog } from '@helpers/log';
import { slugify } from '@helpers/string';

export const prerender = false;
const log = createLog('api/save-entry');

const defaultFrontmatter = {
  isDraft: true,
  pubDate: new Date().toISOString(),
  tags: []
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { collection, content, id } = await request.json();

    log.info('Received request to save entry content', {
      collection,
      id
    });

    if (!id || !content || !collection) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const { content: contentWithoutFrontmatter, frontmatter } =
      parseFrontmatter(content);

    if (!frontmatter) {
      return new Response(
        JSON.stringify({ error: 'Invalid file format: missing frontmatter' }),
        { status: 400 }
      );
    }

    const {
      error,
      filePath,
      frontmatter: updatedFrontmatter,
      isNew
    } = await getEntryFilePath({
      collection,
      content: contentWithoutFrontmatter,
      frontmatter,
      id
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    if (!filePath) {
      return new Response(JSON.stringify({ error: 'File path not found' }), {
        status: 400
      });
    }

    // add updated frontmatter to content
    const updatedContent = `---\n${yaml.stringify(updatedFrontmatter)}---\n\n${contentWithoutFrontmatter}`;

    // Write the content to the file
    log.info('Writing content to file', { filePath });

    if (isNew) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }

    await fs.writeFile(filePath, updatedContent);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    log.error('Failed to save entry content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save entry content' }),
      { status: 500 }
    );
  }
};

interface GetEntryFilePathProps {
  collection: 'posts' | 'notes';
  content: string;
  frontmatter: Record<string, unknown>;
  id: string;
}

const getEntryFilePath = async ({
  collection,
  content,
  frontmatter,
  id
}: GetEntryFilePathProps) => {
  if (id === 'new') {
    const { filename, frontmatter: updatedFrontmatter } = createNewEntryId({
      collection,
      content,
      frontmatter,
      id
    });

    const filePath = path.join(process.cwd(), 'content', collection, filename);

    return {
      error: undefined,
      filePath,
      frontmatter: updatedFrontmatter,
      isNew: true
    };
  }

  // Get the collection to verify the entry exists
  const entry = await findEntry(collection, id);

  if (!entry) {
    return {
      error: 'Entry not found',
      filePath: undefined,
      frontmatter,
      isNew: false
    };
  }

  if (!entry.filePath) {
    return {
      error: 'Entry has no file path',
      filePath: undefined,
      frontmatter,
      isNew: false
    };
  }

  const filePath = path.join(process.cwd(), entry.filePath);

  return { error: undefined, filePath, frontmatter, isNew: false };
};

const parseFrontmatter = (content: string) => {
  // Split the content into frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\S\s]*?)\n---/);
  if (!frontmatterMatch) {
    return { content, frontmatter: undefined };
  }

  const frontmatter = frontmatterMatch[1];
  const parsedFrontmatter = yaml.parse(frontmatter) as Record<string, unknown>;

  const contentWithoutFrontmatter = content.replace(frontmatterMatch[0], '');

  return {
    content: contentWithoutFrontmatter,
    frontmatter: {
      ...defaultFrontmatter,
      ...parsedFrontmatter
    }
  };
};

const findEntry = async (collection: 'posts' | 'notes', id: string) => {
  if (id === 'new') {
    return undefined;
  }
  const entries = await getEntries(collection);
  return entries.find(e => e.id === id);
};

const createNewEntryId = ({ content, frontmatter }: GetEntryFilePathProps) => {
  const pubDate = toDate(frontmatter.pubDate as string);

  // get the first four words of the content
  const firstWords = content.split(' ').slice(0, 4);
  const slug = slugify(firstWords.join(' '));

  const updatedFrontmatter = {
    ...frontmatter,
    slug
  };

  const year = pubDate.getFullYear();
  const month = pubDate.getMonth() + 1;
  const day = pubDate.getDate();

  const fileName = `${year}/${month}/${day}/${slug}.md`;

  return { filename: fileName, frontmatter: updatedFrontmatter };
};
