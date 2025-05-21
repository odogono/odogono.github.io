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
import type { PostEntry } from '@types';

import { useEntryUpdate } from './hooks/use-entry-update';

interface PostsTableProps {
  entries: PostEntry[];
}

const log = createLog('components/admin/posts-table');

// Helper function to format date
const formatDateTime = (date: Date): string => toDateTimeString(date);

// Helper function to format array
const formatArray = (arr: string[] | undefined): string =>
  arr?.join(', ') || '';

// Helper function to format boolean
const formatBoolean = (bool: boolean | undefined): string => (bool ? '✓' : '✗');

export const PostsTable = ({ entries: initialEntries }: PostsTableProps) => {
  const { entries, handleToggleDraft } = useEntryUpdate(initialEntries);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">Live</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Published Date</TableHead>
          {/* <TableHead>Updated Date</TableHead> */}
          <TableHead>Tags</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Hide Hero</TableHead>
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
            <TableCell>{entry.data.title || '-'}</TableCell>
            <TableCell>
              {'description' in entry.data
                ? entry.data.description || '-'
                : '-'}
            </TableCell>
            <TableCell>{formatDateTime(entry.data.pubDate)}</TableCell>
            {/* <TableCell>
              {entry.data.updatedDate
                ? formatDateTime(entry.data.updatedDate)
                : '-'}
            </TableCell> */}
            <TableCell>{formatArray(entry.data.tags)}</TableCell>
            <TableCell className="text-center">
              {entry.data.slug || '-'}
            </TableCell>
            <TableCell className="text-center">
              {'hidePageHeroImage' in entry.data
                ? formatBoolean(entry.data.hidePageHeroImage)
                : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
