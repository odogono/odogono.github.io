import fs from 'node:fs/promises';
import path from 'node:path';

import type { APIRoute } from 'astro';

import { getEntries } from '@/helpers/astro';
import { createLog } from '@helpers/log';

const log = createLog('pages/api/toggle-draft');

// Mark this endpoint as server-rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { collection, id, isDraft } = await request.json();

    log.info('Received request to toggle draft status', {
      collection,
      id,
      isDraft
    });

    if (!id || typeof isDraft !== 'boolean' || !collection) {
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

    // log.debug('Entry found', entry);

    // Get the file path from the entry
    const fullFilePath = path.join(process.cwd(), filePath);

    // Read the current content
    const content = await fs.readFile(fullFilePath, 'utf8');

    // Update the isDraft frontmatter
    const updatedContent = content.replace(
      /isDraft:\s*(true|false)/,
      `isDraft: ${isDraft}`
    );

    // Write the updated content back to the file
    await fs.writeFile(fullFilePath, updatedContent);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    log.error('Failed to update draft status:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update draft status' }),
      { status: 500 }
    );
  }
};
