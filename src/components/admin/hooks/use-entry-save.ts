import { useState } from 'react';

import { createLog } from '@helpers/log';
// import { useDebounce } from './use-debounce';

import { debounce } from '@helpers/time';
import type { Entry } from '@types';

const log = createLog('admin/hooks/use-entry-save');

export const useEntrySave = (entry: Entry, collection: 'posts' | 'notes') => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveContent = async (content: string) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/save-entry', {
        body: JSON.stringify({
          collection,
          content,
          id: entry.id
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save content');
      }
    } catch (error_) {
      const message =
        error_ instanceof Error ? error_.message : 'Failed to save content';
      log.error('Failed to save content:', error_);
      setError(message);
      throw error_;
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = debounce(saveContent, 2000);

  return {
    error,
    isSaving,
    saveContent: debouncedSave
  };
};
