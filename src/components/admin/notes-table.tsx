import { slug as slugify } from 'github-slugger';

import { DraftToggle } from '@components/admin/draft-toggle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { toDateTimeString } from '@helpers/date';
import { createLog } from '@helpers/log';
import type { NoteEntry } from '@types';

import { useEntryUpdate } from './hooks/use-entry-update';

interface NotesTableProps {
  entries: NoteEntry[];
}

const log = createLog('components/admin/notes-table');

// Helper function to format date
const formatDateTime = (date: Date): string => toDateTimeString(date);

// Helper function to format array
const formatArray = (arr: string[] | undefined): string =>
  arr?.join(', ') || '';

// Helper function to get first line of content
const getFirstLine = (content: string | undefined): string => {
  if (!content) {
    return '-';
  }
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 50 ? firstLine.slice(0, 47) + '...' : firstLine;
};

const isDraft = (entry: NoteEntry): boolean => entry.data.isDraft ?? false;

export const NotesTable = ({ entries: initialEntries }: NotesTableProps) => {
  const { entries, handleToggleDraft } = useEntryUpdate(initialEntries);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">Live</TableHead>
          <TableHead>ID</TableHead>
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
                isDraft={isDraft(entry)}
                onToggle={handleToggleDraft}
              />
            </TableCell>
            <TableCell className="text-left">
              <a className="block" href={`/admin/entry/${slugify(entry.id)}`}>
                {entry.id}
              </a>
            </TableCell>
            <TableCell className="hover:bg-muted/50 cursor-pointer">
              <a className="block" href={`/admin/entry/${slugify(entry.id)}`}>
                {getFirstLine(entry.body)}
              </a>
            </TableCell>
            <TableCell className="hover:bg-muted/50 cursor-pointer">
              <a className="block" href={`/admin/entry/${slugify(entry.id)}`}>
                {formatDateTime(entry.data.pubDate)}
              </a>
            </TableCell>
            <TableCell className="hover:bg-muted/50 cursor-pointer">
              <a className="block" href={`/admin/entry/${slugify(entry.id)}`}>
                {formatArray(entry.data.tags)}
              </a>
            </TableCell>
            <TableCell className="text-left">
              {!isDraft(entry) ? (
                <a href={entry.url} rel="noopener noreferrer" target="_blank">
                  {entry.url}
                </a>
              ) : (
                entry.url
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
