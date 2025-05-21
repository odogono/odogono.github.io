import { useState } from 'react';

// import { isNoteEntry, isPostEntry } from '@helpers/astro';
import { createLog } from '@helpers/log';
import type { Entry } from '@types';

const log = createLog('admin/hooks/use-entry-update');

export const useEntryUpdate = <T extends Entry>(initialEntries: T[]) => {
  const [entries, setEntries] = useState(initialEntries);

  const collection = getCollectionFromEntry(initialEntries[0]);

  const handleToggleDraft = async (id: string, newValue: boolean) => {
    try {
      const response = await fetch('/api/toggle-draft', {
        body: JSON.stringify({
          collection,
          id,
          isDraft: newValue
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to update draft status');
      }

      // Update local state
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id
            ? { ...entry, data: { ...entry.data, isDraft: newValue } }
            : entry
        )
      );
    } catch (error) {
      log.error('Failed to update draft status:', error);
      throw error;
    }
  };

  return {
    entries,
    handleToggleDraft
  };
};

const getCollectionFromEntry = (entry: Entry) => entry.collection;
