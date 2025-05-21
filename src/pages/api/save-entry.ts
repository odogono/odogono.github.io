import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { APIRoute } from 'astro';
import yaml from 'yaml';

import { getEntries } from '@helpers/astro';
import { createLog } from '@helpers/log';

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

    // Get the collection to verify the entry exists
    const entries = await getEntries(collection);
    const entry = entries.find(e => e.id === id);

    if (!entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404
      });
    }

    const { filePath } = entry;

    if (!filePath) {
      return new Response(JSON.stringify({ error: 'Entry has no file path' }), {
        status: 404
      });
    }

    // Get the file path from the entry
    const fullFilePath = path.join(process.cwd(), filePath);

    // Read the current content
    const currentContent = await fs.readFile(fullFilePath, 'utf8');

    // Split the content into frontmatter and body
    const frontmatterMatch = content.match(/^---\n([\S\s]*?)\n---/);
    if (!frontmatterMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid file format: missing frontmatter' }),
        { status: 400 }
      );
    }

    const frontmatter = frontmatterMatch[1];

    const parsedFrontmatter = yaml.parse(frontmatter);

    // log.debug('frontmatter', parsedFrontmatter);

    const updatedFrontmatter = {
      ...defaultFrontmatter,
      ...parsedFrontmatter
    };

    // remove existing frontmatter from content
    const contentWithoutFrontmatter = content.replace(frontmatterMatch[0], '');

    // log.debug('contentWithoutFrontmatter', contentWithoutFrontmatter);

    // add updated frontmatter to content
    const updatedContent = `---\n${yaml.stringify(updatedFrontmatter)}---\n\n${contentWithoutFrontmatter}`;

    // log.debug('updatedContent', updatedContent);

    // Write the updated content back to the file
    await fs.writeFile(fullFilePath, updatedContent);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    log.error('Failed to save entry content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save entry content' }),
      { status: 500 }
    );
  }
};
