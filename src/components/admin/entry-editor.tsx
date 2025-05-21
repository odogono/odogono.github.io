import { useState } from 'react';

import { createLog } from '@helpers/log';
import type { Entry } from '@types';

import MarkdownEditor from './markdown-editor';

const log = createLog('admin/entry-editor');

interface EntryEditorProps {
  collection: 'posts' | 'notes';
  entry: Entry;
}

export default function EntryEditor({ collection, entry }: EntryEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine frontmatter and content into a single string
  const initialContent = `---
${Object.entries(entry.data)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
    }
    if (value && typeof value === 'object' && 'toISOString' in value) {
      return `${key}: ${(value as Date).toISOString()}`;
    }
    if (typeof value === 'boolean') {
      return `${key}: ${value}`;
    }
    return `${key}: ${value}`;
  })
  .join('\n')}
---

${entry.body ?? ''}`;

  const [content, setContent] = useState(initialContent);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      log.debug('content', content);

      // Parse frontmatter and content from the markdown
      // const [frontmatterStr, ...contentParts] = content.split('---\n');
      // const contentStr = contentParts.join('---\n').trim();

      // Parse frontmatter
      // const frontmatter: Record<string, unknown> = {};
      // const frontmatterLines = frontmatterStr.trim().split('\n');

      // for (const line of frontmatterLines) {
      //   if (line.startsWith('  - ')) {
      //     // Handle array items
      //     const lastKey = Object.keys(frontmatter).pop();
      //     if (lastKey) {
      //       const value = line.slice(4);
      //       if (!Array.isArray(frontmatter[lastKey])) {
      //         frontmatter[lastKey] = [value];
      //       } else {
      //         (frontmatter[lastKey] as string[]).push(value);
      //       }
      //     }
      //   } else {
      //     const [key, value] = line.split(': ');
      //     if (key && value) {
      //       // Try to parse the value
      //       if (value === 'true') {
      //         frontmatter[key] = true;
      //       } else if (value === 'false') {
      //         frontmatter[key] = false;
      //       } else if (!Number.isNaN(Date.parse(value))) {
      //         frontmatter[key] = new Date(value);
      //       } else {
      //         frontmatter[key] = value;
      //       }
      //     }
      //   }
      // }

      // log.debug('content', content);

      // Save content
      const contentResponse = await fetch('/api/save-entry', {
        body: JSON.stringify({
          collection,
          content,
          id: entry.id
        }),
        method: 'POST'
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to save content');
      }
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
}
