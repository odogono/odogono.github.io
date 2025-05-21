import type { CollectionEntry } from 'astro:content';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { toDateString, toDateTimeString } from '@helpers/date';

interface ContentTableProps {
  entries: CollectionEntry<'notes' | 'posts'>[];
  type: 'notes' | 'posts';
}

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

export const ContentTable = ({ entries, type }: ContentTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-8">Draft</TableHead>
        <TableHead>{type === 'notes' ? 'Content' : 'Title'}</TableHead>
        {type === 'posts' && <TableHead>Description</TableHead>}
        <TableHead>Published Date</TableHead>
        {/* <TableHead>Updated Date</TableHead> */}
        <TableHead>Tags</TableHead>
        <TableHead>Slug</TableHead>
        {type === 'posts' && <TableHead>Hide Hero</TableHead>}
      </TableRow>
    </TableHeader>
    <TableBody>
      {entries.map(entry => (
        <TableRow key={entry.id}>
          <TableCell className="text-center">
            {formatBoolean(entry.data.isDraft)}
          </TableCell>
          <TableCell>
            {type === 'notes'
              ? getFirstLine(entry.body)
              : entry.data.title || '-'}
          </TableCell>
          {type === 'posts' && (
            <TableCell>
              {'description' in entry.data
                ? entry.data.description || '-'
                : '-'}
            </TableCell>
          )}
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
          {type === 'posts' && (
            <TableCell className="text-center">
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
