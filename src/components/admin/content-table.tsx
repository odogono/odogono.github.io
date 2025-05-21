import type { CollectionEntry } from 'astro:content';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { toDateString } from '@helpers/date';

interface ContentTableProps {
  entries: CollectionEntry<'notes' | 'posts'>[];
  type: 'notes' | 'posts';
}

// Helper function to format date
const formatDate = (date: Date): string => toDateString(date);

// Helper function to format array
const formatArray = (arr: string[] | undefined): string =>
  arr?.join(', ') || '';

// Helper function to format boolean
const formatBoolean = (bool: boolean | undefined): string => (bool ? '✓' : '✗');

export const ContentTable = ({ entries, type }: ContentTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        {type === 'posts' && <TableHead>Description</TableHead>}
        <TableHead>Published Date</TableHead>
        <TableHead>Updated Date</TableHead>
        <TableHead>Draft</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead>Slug</TableHead>
        {type === 'posts' && <TableHead>Hide Hero</TableHead>}
      </TableRow>
    </TableHeader>
    <TableBody>
      {entries.map(entry => (
        <TableRow key={entry.id}>
          <TableCell>{entry.data.title || '-'}</TableCell>
          {type === 'posts' && (
            <TableCell>
              {'description' in entry.data
                ? entry.data.description || '-'
                : '-'}
            </TableCell>
          )}
          <TableCell>{formatDate(entry.data.pubDate)}</TableCell>
          <TableCell>
            {entry.data.updatedDate ? formatDate(entry.data.updatedDate) : '-'}
          </TableCell>
          <TableCell>{formatBoolean(entry.data.isDraft)}</TableCell>
          <TableCell>{formatArray(entry.data.tags)}</TableCell>
          <TableCell>{entry.data.slug || '-'}</TableCell>
          {type === 'posts' && (
            <TableCell>
              {'hidePageHeroImage' in entry.data
                ? formatBoolean(entry.data.hidePageHeroImage)
                : '-'}
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
