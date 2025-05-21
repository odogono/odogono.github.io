import { useState } from 'react';

import { DraftToggle } from '@components/admin/draft-toggle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { toDateString, toDateTimeString } from '@helpers/date';
import { createLog } from '@helpers/log';
import type { NoteEntry } from '@types';

interface NotesTableProps {
  entries: NoteEntry[];
}

const log = createLog('components/admin/notes-table');

// Helper function to format date
const formatDate = (date: Date): string => toDateString(date);

const formatDateTime = (date: Date): string => toDateTimeString(date);

// Helper function to format array
const formatArray = (arr: string[] | undefined): string =>
  arr?.join(', ') || '';

// Helper function to format boolean
const formatBoolean = (bool: boolean | undefined): string => (bool ? '✓' : '✗');

// Helper function to get first line of content
const getFirstLine = (content: string | undefined): string => {
  if (!content) {
    return '-';
  }
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 50 ? firstLine.slice(0, 47) + '...' : firstLine;
};

export const NotesTable = ({ entries: initialEntries }: NotesTableProps) => {
  const [entries, setEntries] = useState(initialEntries);

  const handleToggleDraft = async (id: string, newValue: boolean) => {
    try {
      const response = await fetch('/api/toggle-draft', {
        body: JSON.stringify({
          collection: 'notes',
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">Draft</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Published Date</TableHead>
          {/* <TableHead>Updated Date</TableHead> */}
          <TableHead>Tags</TableHead>
          <TableHead>url</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map(entry => (
          <TableRow key={entry.id}>
            <TableCell className="text-center">
              <DraftToggle
                id={entry.id}
                isDraft={entry.data.isDraft}
                onToggle={handleToggleDraft}
              />
            </TableCell>
            <TableCell>{getFirstLine(entry.body)}</TableCell>
            <TableCell>{formatDateTime(entry.data.pubDate)}</TableCell>
            <TableCell>{formatArray(entry.data.tags)}</TableCell>
            <TableCell className="text-left">
              <a href={entry.url} rel="noopener noreferrer" target="_blank">
                {entry.url}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
