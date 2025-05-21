import { useState } from 'react';

import Yaml from 'yaml';

import { createLog } from '@helpers/log';
import type { Entry } from '@types';

import MarkdownEditor from './markdown-editor';

const log = createLog('admin/entry-editor');

interface EntryEditorProps {
  collection: 'posts' | 'notes';
  entry: Entry;
}

const defaultFrontmatter = {
  isDraft: true,
  pubDate: new Date().toISOString(),
  tags: []
};

const parseEntryText = (text: string) => {
  const frontMatter = Yaml.parse(text.split('---')[1]);
  const content = text.split('---')[2].trim();
  return { content, frontMatter };
};

export const EntryEditor = ({ collection, entry }: EntryEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frontMatter = Yaml.stringify(entry.data);

  // Combine frontmatter and content into a single string
  const initialContent = `---
${frontMatter}
---

${entry.body ?? ''}`;

  const [content, setContent] = useState(initialContent);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      log.debug('entry', entry);

      const { content: contentText, frontMatter } = parseEntryText(content);
      log.debug('frontMatter', frontMatter);
      log.debug('content', contentText);

      if (!contentText.length) {
        setError('no content to save');
        setIsSaving(false);
        return;
      }

      const updatedFrontmatter = {
        ...defaultFrontmatter,
        ...frontMatter
      };

      const updatedContent = `---\n${Yaml.stringify(updatedFrontmatter)}---\n\n${contentText}`;

      // Save content
      const contentResponse = await fetch('/api/save-entry', {
        body: JSON.stringify({
          collection,
          content: updatedContent,
          id: 'new'
        }),
        method: 'POST'
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to save content');
      }

      // redirect to the admin page
      window.location.href = '/admin';
    } catch (error_) {
      const message =
        error_ instanceof Error ? error_.message : 'Failed to save entry';
      log.error('Failed to save entry:', error_);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <MarkdownEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isSaving}
          onClick={handleSave}
          type="button"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
      </div>
    </div>
  );
};
