import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type NoteEntry = CollectionEntry<'notes'>;

export type Entry = NoteEntry | PostEntry;

export interface PostImage {
  format: 'png' | 'jpg' | 'jpeg' | 'tiff' | 'webp' | 'gif' | 'svg' | 'avif';
  height: number;
  src: string;
  width: number;
}

export interface PostSummary {
  description?: string;
  heroImage: PostImage | string;
  href: string;
  pubDate: Date;
  tags?: string[];
  title: string;
}

export interface DateEntry {
  date: string;
}

export type NotesPageEntry =
  | DateEntry
  | (Entry & {
      url: string;
    });
