import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'> & {
  url: string;
};
export type NoteEntry = CollectionEntry<'notes'> & {
  url: string;
};

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
  pubDate: Date;
  tags?: string[];
  title: string;
  url: string;
}

export interface DateEntry {
  date: string;
}

export type NotesPageEntry = DateEntry | Entry;

export interface TagSummary {
  count: number;
  href: string;
  tag: string;
}
